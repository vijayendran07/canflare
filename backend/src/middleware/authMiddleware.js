import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'canflare_lueur_secret_key_2026';

export const protect = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired',
      });
    }
  }

  // Also support demo/mock authentication fallback if token is 'demo-token' or header absent in dev
  return res.status(401).json({
    success: false,
    message: 'Not authorized, no token provided',
  });
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Admin access required',
  });
};

