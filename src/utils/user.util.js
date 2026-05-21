export const formatUserResponse = (user) => {
  if (!user) return null;
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    role: user.role || "patient",
    dateOfBirth: user.dateOfBirth,
    country: user.country,
    gender: user.gender,
    profileImage: user.profileImage,
    profileCompletionStatus: user.profileCompletionStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};