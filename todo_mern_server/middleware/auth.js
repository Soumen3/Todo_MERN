import jwt from 'jsonwebtoken';
import { User } from '../models/Users.js';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({ 
                message: 'Access token is required' 
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user
        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid token - user not found' 
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired' 
            });
        }
        
        return res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

// Middleware to optionally authenticate (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id).select('-password');
            if (user) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication for optional auth
        next();
    }
};
