import jwt from 'jsonwebtoken';

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403); // token invalid
      }
      req.user = user; // chứa { id, email }
      next();
    });
  } else {
    res.sendStatus(401); // không có token
  }
}