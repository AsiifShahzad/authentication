import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { avatarUpdateService } from "../services/upload.service.js";

export const avatarController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Avatar file is required");
  }

  const profileImage = await avatarUpdateService(req.user.id, req.file.filename);

  return res.status(200).json(
    new ApiResponse(200, "Avatar updated successfully", { profileImage })
  );
});