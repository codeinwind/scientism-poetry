const morgan = require('morgan');
const logger = require('../config/logger');

// Create custom Morgan token for request body
morgan.token('body', (req) => {
  const body = {...req.body};
  // Remove sensitive data
  if (body.password) body.password = '[FILTERED]';
  if (body.confirmPassword) body.confirmPassword = '[FILTERED]';
  return JSON.stringify(body);
});

// Create request logging middleware
const requestLogger = morgan(
  // Custom format
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :body',
  // Stream to Winston
  { stream: logger.stream }
);

module.exports = requestLogger;
