const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {

    static async register(req, res, next) {
        try {
            const { username, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                password: hashedPassword
            });

            res.status(201).json({
                message: 'User registered',
                user
            });

        } catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                throw { name: 'InvalidLogin' };
            }

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw { name: 'InvalidLogin' };
            }

            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET || 'SECRET_KEY'
            );

            res.json({ access_token: token });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;