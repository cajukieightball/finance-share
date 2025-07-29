// server/middleware/auth.js
import jwt from 'jsonwebtoken';


export function auth(req, res, next) {
   console.log('Incoming token header:', req.headers.authorization);
  console.log('Incoming token cookie:', req.cookies?.token);
  let token = req.cookies?.token;


  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = userId;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}