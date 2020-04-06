const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

 // middleware to only allow access to routes if user logged in
function expressVerifyToken(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        // verify token
        jwt.verify(token, process.env.JWT_ENCRYPTION, (err, decoded) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        // no token passed
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
}

function graphqlVerifyToken(context) {
  if (context) {
    var token = context.headers['x-access-token'] || context.rawHeaders['x-access-token'] || context.req.headers['x-access-token'] || context.req.query.token;
    if (token) {
      // verify token
      return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_ENCRYPTION, (err, decoded) => {
          if (err) reject('401: User is not authenticated');

          resolve(decoded);
        })
      })
    }
    else {
      return new Promise((resolve, reject) => {
        reject('No token provided.');
      })
    }
  }
  else {
    return new Promise((resolve, reject) => {
      reject('Context (headers) missing from request.');
    })
  }
}


module.exports = {
  expressVerifyToken,
  graphqlVerifyToken,
};
