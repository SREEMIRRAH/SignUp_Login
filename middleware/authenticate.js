const {login} = require('../dbservices/dbservice');
const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token1 = req.header('Authorization');
    console.log(token1)
    if (!token1) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }
    try {
        // Verify the token is valid
      const decoded = jwt.verify(token1, 'your-secret-key');
      req.user = decoded.user;
      next();
    } catch (error) {
      console.error('Authentication Error:', error.message);
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

module.exports = {authenticateUser};