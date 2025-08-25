const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');


dotenv.config();

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
//  console.log("Headers: ", req.headers);  
//  console.log("Authorization header: ", req.headers.authorization);
    
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.isDeleted) {
            return res.status(401).json({ message: 'User not found or deleted' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token invalid or expired' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Forbidden - Only ${roles.join("/")} can access this route` });
        }
        next();
    }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Admin access denied" });
  }
};
