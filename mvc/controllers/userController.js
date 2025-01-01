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

        const token = jwt.sign({ id: user._id }, process.env.JWT_TOKEN, { expiresIn: "7d" });

        res.cookie("token", token, {
            path: '/',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production', // Only secure in production

        });

        res.status(200).json({ message: "Login successful", token, success: true });
    } else {
        res.status(401).json({ message: "Invalid credentials", success: false });
    }
}
export const LogoutUser = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
            path: "/", // Ensure it clears across all paths
            domain: process.env.COOKIE_DOMAIN || undefined, // Set this if using a specific domain
        });

        res.status(200).json({ message: "Logout successful", success: true });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Logout failed", success: false });
    }
};



export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({
                message: "User ID is missing in request",
                success: false,
            });
        }

        const user = await User.findOne({ _id: id }).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "User details fetched successfully",
            result: user,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({
            message: "An error occurred while fetching user details",
            success: false,
        });
    }
};
