import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js'; // Import authentication routes
import todoRouter from './routes/todo.js'; // Import todo routes

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the Todo MERN Server!');
});

app.use("/api/auth", authRouter); // Use the authentication routes
app.use("/api/todo", todoRouter); // Use the todo routes

export default app;