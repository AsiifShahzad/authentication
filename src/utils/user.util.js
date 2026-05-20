export const formatUserResponse = (user) => {
  if (!user) return null;
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    isVerified: user.isVerified,
    dateOfBirth: user.dateOfBirth,
    country: user.country,
    gender: user.gender,
    profileCompletionStatus: user.profileCompletionStatus,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};