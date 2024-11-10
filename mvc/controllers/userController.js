import mongoose from "mongoose";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const RegisterUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {

        const existingUser = await User.findOne({ email, phone });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { name, email, password: hashedPassword, phone };
        const result = await User.create(user);
        res.status(201).json({ message: "User created successfully", success: true, result });

    } catch (error) {

        res.json({ message: error.message, success: false });

    }
}

export const LoginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    if (user && isPasswordCorrect) {

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_TOKEN, { expiresIn: "1h" });

        res.cookie("token", token, {
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
        });

        res.status(200).json({ message: "Login successful", result: user, token, success: true });
    } else {
        res.status(401).json({ message: "Invalid credentials", success: false });
    }
}
export const LogoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    });
    res.status(200).json({ message: "Logout successful", success: true });
};

export const getUserDetails = (req, res) => {
    const { email } = req.user;
    User.findOne({ email })
        .then((data) => res.json({ message: "User details fetched successfully", result: data, success: true }))
        .catch((error) => res.json({ message: error, success: false }));
};
