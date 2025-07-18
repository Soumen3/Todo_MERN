import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/Users.js";
import { Todo } from "../models/Todos.js"; // Import the Todo model
import { authenticateToken } from "../middleware/auth.js";

// Load environment variables
dotenv.config();


export const register = async (req, res) => {
    const { name, email, password, tc } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Create a new user (password will be automatically hashed by the pre-save middleware)
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase(),
            password, // Don't hash here - the model will do it automatically
            tc
        });
        
        // Save the user to the database
        await newUser.save();
        
        // Generate a token using the model method
        const token = newUser.generateAuthToken();
        
        // Respond with the user data and token
        res.status(201).json({
            message: "User registered successfully",
            user: newUser.toJSON(), // This will exclude the password
            token
        });
    } catch (error) {
        console.error("Registration error:", error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Email already exists" 
            });
        }
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: messages.join(', ') 
            });
        }
        
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email (use findOne instead of find)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Increment login attempts for failed login
            if (req.incrementLoginAttempts) {
                req.incrementLoginAttempts();
            }
            return res.status(400).json({ message: "User not found" });
        }
        
        // Compare the password using the model method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // Increment login attempts for failed login
            if (req.incrementLoginAttempts) {
                req.incrementLoginAttempts();
            }
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Clear login attempts on successful login
        if (req.clearLoginAttempts) {
            req.clearLoginAttempts();
        }
        
        // Generate a token using the model method
        const token = user.generateAuthToken();
        
        // Respond with the user data and token
        res.status(200).json({
            message: "Login successful",
            user: user.toJSON(), // This will exclude the password
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        
        // Increment login attempts for server errors
        if (req.incrementLoginAttempts) {
            req.incrementLoginAttempts();
        }
        
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    try {
        // In a stateless JWT implementation, logout is handled client-side
        // by removing the token from localStorage. However, we can still
        // provide a logout endpoint for consistency and future enhancements
        
        res.status(200).json({ 
            message: "Logout successful",
            success: true 
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}



export const createTodo = async (req, res) => {
    const { todo } = req.body;
    
    // Check if user is authenticated (this will be set by authenticateToken middleware)
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    
    console.log("Authenticated user:", req.user);
    
    if (!todo || !todo.task) {
        return res.status(400).json({ message: "Todo task is required" });
    }
    
    try {
        // Create a new Todo item
        const newTodo = new Todo({
            task: todo.task.trim(),
            status: todo.status || 'active', // Default to 'active' if not provided
            completed: todo.completed || false, // Default to false if not provided
            user: req.user._id // User ID from authentication middleware
        });
        
        // Save the Todo item to the database
        await newTodo.save();
        
        res.status(201).json({
            message: "Todo created successfully",
            todo: newTodo
        });
    } catch (error) {
        console.error("Create Todo error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Get all todos for the authenticated user
export const getTodos = async (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
        const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Todos retrieved successfully",
            todos
        });
    } catch (error) {
        console.error("Get Todos error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update a specific todo
export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
        // Find the todo and ensure it belongs to the authenticated user
        const todo = await Todo.findOne({ _id: id, user: req.user._id });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        // Update the todo with allowed fields
        const allowedUpdates = ['task', 'status', 'completed'];
        const updateData = {};
        
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                updateData[field] = updates[field];
            }
        });
        
        const updatedTodo = await Todo.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        
        res.status(200).json({
            message: "Todo updated successfully",
            todo: updatedTodo
        });
    } catch (error) {
        console.error("Update Todo error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete a specific todo
export const deleteTodo = async (req, res) => {
    const { id } = req.params;
    
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
        // Find and delete the todo, ensuring it belongs to the authenticated user
        const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        
        res.status(200).json({
            message: "Todo deleted successfully",
            todo
        });
    } catch (error) {
        console.error("Delete Todo error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Bulk delete multiple todos
export const bulkDeleteTodos = async (req, res) => {
    const { todoIds } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    
    // Validate input
    if (!todoIds || !Array.isArray(todoIds) || todoIds.length === 0) {
        return res.status(400).json({ message: "Todo IDs array is required" });
    }
    
    try {
        // First, verify that all todos belong to the authenticated user
        const userTodos = await Todo.find({ 
            _id: { $in: todoIds }, 
            user: req.user._id 
        });
        
        // Check if all requested todos belong to the user
        if (userTodos.length !== todoIds.length) {
            const foundIds = userTodos.map(todo => todo._id.toString());
            const unauthorizedIds = todoIds.filter(id => !foundIds.includes(id));
            
            return res.status(403).json({ 
                message: "Access denied: Some todos don't belong to you",
                unauthorizedIds: unauthorizedIds
            });
        }
        
        // If all todos belong to the user, proceed with deletion
        const result = await Todo.deleteMany({ 
            _id: { $in: todoIds }, 
            user: req.user._id 
        });
        
        res.status(200).json({
            message: `${result.deletedCount} todos deleted successfully`,
            deletedCount: result.deletedCount,
            requestedCount: todoIds.length
        });
    } catch (error) {
        console.error("Bulk Delete Todos error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Bulk update multiple todos
export const bulkUpdateTodos = async (req, res) => {
    const { todoIds, updates } = req.body;
    
    // Check if user is authenticated
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    
    // Validate input
    if (!todoIds || !Array.isArray(todoIds) || todoIds.length === 0) {
        return res.status(400).json({ message: "Todo IDs array is required" });
    }
    
    if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ message: "Updates object is required" });
    }
    
    try {
        // First, verify that all todos belong to the authenticated user
        const userTodos = await Todo.find({ 
            _id: { $in: todoIds }, 
            user: req.user._id 
        });
        
        // Check if all requested todos belong to the user
        if (userTodos.length !== todoIds.length) {
            const foundIds = userTodos.map(todo => todo._id.toString());
            const unauthorizedIds = todoIds.filter(id => !foundIds.includes(id));
            
            return res.status(403).json({ 
                message: "Access denied: Some todos don't belong to you",
                unauthorizedIds: unauthorizedIds
            });
        }
        
        // Only allow certain fields to be updated
        const allowedUpdates = ['task', 'status', 'completed'];
        const updateData = {};
        
        allowedUpdates.forEach(field => {
            if (updates[field] !== undefined) {
                updateData[field] = updates[field];
            }
        });
        
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }
        
        // Update todos that belong to the authenticated user
        const result = await Todo.updateMany(
            { 
                _id: { $in: todoIds }, 
                user: req.user._id 
            },
            updateData
        );
        
        res.status(200).json({
            message: `${result.modifiedCount} todos updated successfully`,
            modifiedCount: result.modifiedCount,
            matchedCount: result.matchedCount,
            requestedCount: todoIds.length
        });
    } catch (error) {
        console.error("Bulk Update Todos error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Export the authentication middleware for use in routes
export { authenticateToken };