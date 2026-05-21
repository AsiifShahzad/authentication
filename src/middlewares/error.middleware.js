const errorMiddleware = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    code: err.code,
    message: err.message || "Internal Server Error",
    fieldErrors: err.fieldErrors,
    existingUser: err.existingUser,
    expectedRole: err.expectedRole,
    details: err.details,
  });
};

export default errorMiddleware;