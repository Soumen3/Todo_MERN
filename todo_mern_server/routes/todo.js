import express from 'express';
import dotenv from 'dotenv';
import { 
    createTodo, 
    getTodos, 
    updateTodo, 
    deleteTodo, 
    bulkDeleteTodos, 
    bulkUpdateTodos, 
    authenticateToken 
} from './controller.js';

dotenv.config();

const router = express.Router();

// Apply authentication middleware to all todo routes
router.use(authenticateToken);

// Todo routes (all require authentication)
router.post('/create-todo', createTodo); // Route to create a new todo
router.get('/todos', getTodos); // Route to get all todos for user
router.patch('/todos/:id', updateTodo); // Route to update a specific todo
router.delete('/todos/:id', deleteTodo); // Route to delete a specific todo

// Bulk operations
router.post('/todos/bulk-delete', bulkDeleteTodos); // Route to delete multiple todos
router.post('/todos/bulk-update', bulkUpdateTodos); // Route to update multiple todos

export default router;