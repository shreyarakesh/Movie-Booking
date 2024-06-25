import User from '../models/User.js';
import Bookings from '../models/Bookings.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }
    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(422).json({ message: "Invalid Inputs" });
    }

    const hashedPassword = bcrypt.hashSync(password);

    let user;
    try {
        user = new User({ name, email, password: hashedPassword });
        await user.save();
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }

    return res.status(201).json({ id: user._id, message: "User created successfully" });
};

export const updateUser = async (req, res, next) => {
    const id = req.params.id;
    const { name, email, password } = req.body;

    if (!name || name.trim() === "" || !email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(422).json({ message: "Invalid Inputs" });
    }

    const hashedPassword = bcrypt.hashSync(password);

    let user;
    try {
        user = await User.findByIdAndUpdate(id, {
            name,
            email,
            password: hashedPassword
        }, { new: true });
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ id: user._id, message: "Updated Successfully" });
};

export const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    let user;
    try {
        user = await User.findByIdAndRemove(id);
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Deleted Successfully" });
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || email.trim() === "" || !password || password.trim() === "") {
        return res.status(422).json({ message: "Invalid Inputs" });
    }

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }

    if (!existingUser) {
        return res.status(404).json({ message: "Unable to find user with this email" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
    }

    return res.status(200).json({ message: "Login Successfully", id: existingUser._id });
};

export const getBookingsOfUser = async (req, res, next) => {
    const id = req.params.id;

    let bookings;
    try {
        bookings = await Bookings.find({ user: id });
    } catch (err) {
        return res.status(500).json({ message: "Unexpected Error Occurred", error: err.message });
    }

    if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: "No bookings found for this user" });
    }

    return res.status(200).json({ bookings });
};
