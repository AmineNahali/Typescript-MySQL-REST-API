import { fastTimeStamp } from '../controllers/UserController';

const jwt = require('jsonwebtoken');

export const auth = (req: any, res: any, next: any) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, function (err: any, decoded: any) {
      if (err) {
        return res.status(401).json({ "success": false, "message": 'Unauthorized access.', "serverTime": fastTimeStamp() });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      "success": false,
      "message": 'No token provided.',
      "serverTime": fastTimeStamp()
    });
  }
}