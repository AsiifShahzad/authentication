class ApiError extends Error {
  constructor(statusCode, message, details = {}) {
    super(message);

    this.statusCode = statusCode;
    this.code = details.code;
    this.fieldErrors = details.fieldErrors;
    this.existingUser = details.existingUser;
    this.expectedRole = details.expectedRole;
    this.details = details.details;
  }
}

export default ApiError;