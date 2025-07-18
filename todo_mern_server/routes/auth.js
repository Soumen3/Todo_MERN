import express from "express";
import jwt from 'jsonwebtoken'; // Import jwt for token handling
import dotenv from 'dotenv';
import { register, login, logout } from './controller.js'; // Import the register function
import { validateRegistration, validateLogin, rateLimitLogin } from '../middleware/validation.js';

// Load environment variables
dotenv.config();

const router = express.Router();

router.post('/register', validateRegistration, register); // Use validation middleware for registration
router.post('/login', validateLogin, rateLimitLogin, login); // Use validation and rate limiting for login
router.post('/logout', logout); // Use the logout function for the /logout route

export default router;