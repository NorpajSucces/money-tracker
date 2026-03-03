const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('../helpers/createError');

class AuthController {

    static async register(req, res, next) {
        try {
            const { username, password } = req.body;

            // Validasi input
            if (!username || !password) {
                throw createError('Username and password are required', 400);
            }
            if (password.length < 6) {
                throw createError('Password must be at least 6 characters', 400);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({ username, password: hashedPassword });

            // Jangan kirim password hash ke client
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                user: {
                    _id: user._id,
                    username: user.username,
                    createdAt: user.createdAt
                }
            });

        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                throw createError('Username and password are required', 400);
            }

            const user = await User.findOne({ username });
            if (!user) throw { name: 'InvalidLogin' };

            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) throw { name: 'InvalidLogin' };

            // Token dengan expiry 7 hari
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
                success: true,
                access_token: token
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;