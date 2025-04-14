const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = function verifyToken(req, res, next) {
  let token;
  // Try Authorization header first
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // Fallback to cookie
  if (!token && req.headers.cookie) {
    const cookies = cookie.parse(req.headers.cookie);
    token = cookies.auth_token;
  }

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
