const jwt = require('jsonwebtoken');

const generateToken = async (payload, key = "123",  expiresIn = '1d') => {
  try {
    console.log('Key provided', key); // Log the key for debugging
    const token = await jwt.sign(payload, key, { expiresIn });
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

module.exports = generateToken;
