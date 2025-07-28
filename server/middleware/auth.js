// server/middleware/auth.js
import jwt from 'jsonwebtoken';

// Protect routes by verifying JWT from Authorization header
export function auth(req, res, next) {
  // Expect header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}