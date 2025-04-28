import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        });

        if (user) {
            // Generate token
            const token = generateToken(user._id);

            res.status(201).json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    subscription: user.subscription,
                },
            });
        } else {
            res.status(400).json({ message: "Failed to create user" });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "Registration failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            message: "Login failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const createFirstAdmin = async (req, res) => {
    try {
        // Check if any admin exists
        const adminExists = await User.findOne({ isAdmin: true });
        if (adminExists) {
            return res.status(400).json({ message: "Admin user already exists" });
        }

        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            isAdmin: true,
            subscription: 'premium'
        });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    subscription: user.subscription,
                },
            });
        } else {
            res.status(400).json({ message: "Failed to create admin user" });
        }
    } catch (error) {
        console.error("Admin creation error:", error);
        res.status(500).json({ message: "Failed to create admin user" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({ message: "Failed to get user data" });
    }
};
