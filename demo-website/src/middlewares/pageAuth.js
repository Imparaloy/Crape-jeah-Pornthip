import jwt from 'jsonwebtoken';

const parseCookie = (cookieHeader = '') => {
  return cookieHeader.split(';').reduce((acc, part) => {
    const [k, v] = part.split('=');
    if (!k) return acc;
    acc[decodeURIComponent(k.trim())] = decodeURIComponent((v || '').trim());
    return acc;
  }, {});
};

// Server-side auth for SSR pages using token from cookies
// Usage: pageAuth(['seller','admin'])
const pageAuth = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      const cookies = parseCookie(req.headers.cookie || '');
      const token = cookies.token;
      if (!token) return res.redirect('/login');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded || !decoded.userId) return res.redirect('/login');

      const role = decoded.role || 'customer';
      if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        return res.redirect('/');
      }

      req.user = { id: decoded.userId, name: decoded.name, role };
      next();
    } catch (err) {
      return res.redirect('/login');
    }
  };
};

export default pageAuth;
