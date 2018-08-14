const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

 // middleware to only allow access to routes if user logged in
function verifyToken(req, res, next) {
    console.log('verifying');
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
module.exports = verifyToken;