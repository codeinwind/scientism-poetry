const jwt = require('jsonwebtoken');

// Generate JWT Tokens
const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Shorter expiry for access token
  });
  
  const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',  // Longer expiry for refresh token
  });

  return { accessToken, refreshToken };
};

module.exports = {
  generateTokens
};
