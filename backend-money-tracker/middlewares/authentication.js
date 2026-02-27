const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) throw { name: 'Unauthorized' };

        const token = authorization.split(' ')[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY');

        const user = await User.findById(payload.id);
        if (!user) throw { name: 'Unauthorized' };

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};