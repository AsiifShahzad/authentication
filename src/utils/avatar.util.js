import path from "path";
import fs from "fs";
import { updateUserAvatar } from "../repositories/user.repository.js";

const UPLOADS_DIR = path.join(process.cwd(), "uploads");

/** Resolve on-disk path from a stored profileImage (full URL or filename). */
export const getAvatarDiskPath = (profileImage) => {
  if (!profileImage) return null;
  const filename = path.basename(profileImage);
  if (!filename || filename === "." || filename === "..") return null;
  return path.join(UPLOADS_DIR, filename);
};

export const avatarFileExists = (profileImage) => {
  const filePath = getAvatarDiskPath(profileImage);
  return filePath ? fs.existsSync(filePath) : false;
};

/** Remove avatar file from disk; ignores missing file errors. */
export const deleteAvatarFile = async (profileImage) => {
  const filePath = getAvatarDiskPath(profileImage);
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
};

/**
 * If DB references a missing file, clear profileImage in DB.
 * Returns the user document to use downstream (updated or original).
 */
export const reconcileStaleAvatar = async (user) => {
  if (!user?.profileImage || avatarFileExists(user.profileImage)) {
    return user;
  }
  const updated = await updateUserAvatar(user._id, null);
  return updated ?? user;
};
