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
        console.error(error, 'DB Error, unable to authenticate user');
        next(new Error(error));
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
            res.json({ _id, name, email, isAdmin });
        }
        else {
            res.status(404);
            next(new Error('User not found'));
        }
    }
    catch (error) {
        console.error(error, 'DB Error, unable to get user profile');
        next(new Error(error));
    }
}

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = async (req, res, next) => {

    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }
            const updatedUser = await user.save();
            const { _id, name, email, isAdmin } = updatedUser;
            res.json({ _id, name, email, isAdmin, token: generateToken(_id) });
        }
        else {
            res.status(404);
            next(new Error('User not found'));
        }
    }
    catch (error) {
        console.error(error, 'DB Error, unable to update user');
        next(new Error(error));
    }
}

// @desc Register user
// @route POST /api/users
// @access Public
export const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            next(new Error('User already exists'));
        }

        const user = await User.create({
            name, email, password
        });

        if (user) {
            const { _id, name, email, isAdmin } = user;
            res.status(201).json({
                _id, name, email, isAdmin, token: generateToken(_id)
            })
        }
        else {
            console.log('no data');
            res.status(400);
            next(new Error('Invalid user data'));
        }
    }
    catch (error) {
        console.error(error, 'DB Error, unable to get / create user');
        next(new Error(error));
    }
}
// @desc Get all users
// @route GET /api/users
// @access Private/Admin
export const getUsers = async (req, res, next) => {

    try {
        const users = await User.find({});
        res.json(users);
    }
    catch (error) {
        console.error(error, 'DB Error, unable to get user profile');
        next(new Error(error));
    }
}

// @desc Delete user
// @route DELETE /api/user/:id
// @access Private/Admin
export const deleteUser = async (req, res, next) => {

    try {
        const user = await User.findById(req.params.id);
        if(user){
            await user.remove();
            res.json({message: 'User removed'})
        }else{
            res.status(404);
            next(new Error('User not found'));
        }
    }
    catch (error) {
        console.error(error, 'DB Error, unable to get user profile');
        next(new Error(error));
    }
}