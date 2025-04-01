class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);               // Call built-in Error constructor
    this.statusCode = statusCode; // Add our custom HTTP status code
  }
}

module.exports = ErrorResponse;
