import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();



function isAuthenticated(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      console.error('No token provided.');
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }

    const [, token] = authorization.split(' ');

    if (!token) {
      console.error('Token format is invalid.');
      return res.status(401).send({ auth: false, message: 'Token format is invalid.' });
    }

    const { id: userId } = jwt.verify(token, process.env.SECRET);
    console.log('Token verificado, userId:', userId);

    req.userId = userId;

    next();
  } catch (error) {
    /*console.error('Token verification error:', error);*/
    res.status(401).send({ auth: false, message: 'Token invalid.' });
  }
}

export { isAuthenticated };