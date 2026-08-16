const { verifyAccessToken } = require('../services/tokenService');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    next();
  } catch (err) {
    // Expired vs invalid gets the same response — the frontend's response
    // interceptor decides whether to try /auth/refresh based on this 401
    res.status(401).json({ message: 'Invalid or expired access token' });
  }
}

module.exports = requireAuth;