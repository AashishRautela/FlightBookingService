class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.explaination = message;
  }
}

module.exports = AppError;
