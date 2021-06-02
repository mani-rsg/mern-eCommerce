import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc Authenticate user & get token
// @route POST /api/users/login
// @access Public
export const authUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await user.matchPassword(password)) {
            const { _id, name, email, isAdmin } = user;
            res.json({ _id, name, email, isAdmin, token: generateToken(_id) });
        }
        else {
            res.status(401);
            next(new Error('Invalid email or password'));
        }
    }
    catch (error) {
        console.error(error, 'DB Error, unable to get products');
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = async (req, res, next) => {
   
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            const { _id, name, email, isAdmin } = user;
            res.json({ _id, name, email, isAdmin});
        }
        else {
            res.status(404);
            next(new Error('User not found'));
        }
    }
    catch (error) {
        console.error(error, 'DB Error, unable to get products');
        res.status(500).json({ message: "Internal Server Error" });
    }
}