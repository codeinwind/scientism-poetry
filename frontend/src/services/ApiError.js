class ApiError extends Error {
  constructor(message, error = null, success = false) {
    super(message);
    this.name = 'ApiError';
    this.success = success;
    this.originalError = error;
  }
}

export default ApiError;
