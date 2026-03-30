const userModel = require('../schemas/users');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel
            .find({ isDeleted: false })
            .populate('role', 'name');
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userModel
            .findOne({ _id: req.params.id, isDeleted: false })
            .populate('role', 'name');
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        res.status(404).send({ message: "ID not found" });
    }
};

const createUser = async (req, res, next) => {
    try {
        const { username, password, email, role, fullName, avatarUrl, status, loginCount } = req.body;
        const newUser = new userModel({
            username,
            password, // The pre-save hook will hash this
            email,
            role,
            fullName,
            avatarUrl,
            status,
            loginCount
        });
        const savedUser = await newUser.save();
        const populatedUser = await userModel.findById(savedUser._id).populate('role', 'name');
        res.status(201).send(populatedUser);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Don't allow password to be updated this way
        const { password, ...updateData } = req.body;

        const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        const populatedUser = await userModel.findById(updatedUser._id).populate('role', 'name');
        res.send(populatedUser);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await userModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!deletedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send({ message: "User deleted successfully", user: deletedUser });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

const enableUser = async (req, res, next) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).send({ message: "Email and username are required" });
        }
        const user = await userModel.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ message: "User with the given email and username not found" });
        }
        res.send({ message: "User enabled successfully", user });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

const disableUser = async (req, res, next) => {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).send({ message: "Email and username are required" });
        }
        const user = await userModel.findOneAndUpdate(
            { email, username, isDeleted: false },
            { status: false },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ message: "User with the given email and username not found" });
        }
        res.send({ message: "User disabled successfully", user });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    enableUser,
    disableUser
};
