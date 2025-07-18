// Validation middleware for authentication routes

export const validateRegistration = (req, res, next) => {
    const { name, email, password, tc } = req.body;
    const errors = [];

    // Check required fields
    if (!name || !name.trim()) {
        errors.push('Name is required');
    } else if (name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!email || !email.trim()) {
        errors.push('Email is required');
    } else {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
    }

    if (!password) {
        errors.push('Password is required');
    } else if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (tc === undefined || tc === null) {
        errors.push('Terms and conditions acceptance is required');
    } else if (!tc) {
        errors.push('You must accept the terms and conditions');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !email.trim()) {
        errors.push('Email is required');
    } else {
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors
        });
    }

    next();
};

// Rate limiting helper (basic implementation)
const loginAttempts = new Map();

export const rateLimitLogin = (req, res, next) => {
    const email = req.body.email;
    if (!email) return next();

    const now = Date.now();
    const userAttempts = loginAttempts.get(email) || { count: 0, resetTime: now + 15 * 60 * 1000 }; // 15 minutes

    // Reset attempts if time has passed
    if (now > userAttempts.resetTime) {
        userAttempts.count = 0;
        userAttempts.resetTime = now + 15 * 60 * 1000;
    }

    // Check if user has exceeded limit
    if (userAttempts.count >= 5) {
        return res.status(429).json({
            message: 'Too many login attempts. Please try again later.',
            retryAfter: Math.ceil((userAttempts.resetTime - now) / 1000 / 60) // minutes
        });
    }

    // Increment attempts on failed login (will be called in controller)
    req.incrementLoginAttempts = () => {
        userAttempts.count++;
        loginAttempts.set(email, userAttempts);
    };

    // Clear attempts on successful login
    req.clearLoginAttempts = () => {
        loginAttempts.delete(email);
    };

    next();
};
