class AppError extends Error {
  constructor(message, statusCode) {
    console.log(message);
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    this.Operational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
