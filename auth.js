const jwt = require('jsonwebtoken')

module.exports = {
    Token: (req, res, next) => {
        var token = req.body.token || req.query.token || req.headers['authorization'];
        if (token) {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length).trimLeft();
            }
            jwt.verify(token,'my-secret', (err, decoded) => {
                if (err) {
                    if (err.name == 'TokenExpiredError') {        // if the token has expired, token have a particular time of life
                        return res.status(401).send({ success: false, message: 'JWT (token) expired ' });
                    }
                    else if (err.name == 'JsonWebTokenError') {      // if user put wrong token then this will come
                        return res.status(401).send({ success: false, message: 'Invalid Signature Error' });
                    } else {
                        return res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
                    }
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
}
