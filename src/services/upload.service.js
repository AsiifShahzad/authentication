import ApiError from "../utils/ApiError.js";
import {
  reconcileStaleAvatar,
  deleteAvatarFile,
} from "../utils/avatar.util.js";
import { findUserById, updateUserAvatar } from "../repositories/user.repository.js";

export const avatarUpdateService = async (userId, filename) => {
  let user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user = await reconcileStaleAvatar(user);
  const previousAvatar = user.profileImage;
  const profileImage = `/uploads/${filename}`;

  const updatedUser = await updateUserAvatar(userId, profileImage);

  if (!updatedUser) {
    await deleteAvatarFile(profileImage);
    throw new ApiError(500, "Failed to update avatar");
  }

  if (previousAvatar) {
    await deleteAvatarFile(previousAvatar);
  }

  return updatedUser.profileImage;
};