import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB');

        // Admin user details
        const adminData = {
            name: 'Parthiv Kalikota',
            email: 'parthivkalikota@gmail.com',
            password: 'P@rthiv@2005',
            isAdmin: true,
            subscription: 'premium'
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Create admin user
        const admin = await User.create({
            ...adminData,
            password: hashedPassword
        });

        console.log('Admin user created successfully:', admin.email);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdminUser();
