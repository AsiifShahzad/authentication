const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const fieldErrors = result.error.issues.reduce((accumulator, issue) => {
      const field = issue.path[0] || "request";
      accumulator[field] = issue.message;
      return accumulator;
    }, {});

    return res.status(400).json({
      success: false,
      code: "VALIDATION_ERROR",
      message: "Validation Error",
      fieldErrors,
    });
  }

  req.validatedData = result.data;
  next();
};

export default validate;