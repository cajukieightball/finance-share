// server/middleware/auth.js
import jwt from 'jsonwebtoken';

/**
 * Named export `auth`
 * Checks for a JWT in the `token` cookie, verifies it,
 * and sets req.userId. Otherwise sends 401.
 */
export function auth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}





