import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    task:{
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ['active', 'completed'],
        default: 'active',
    },
    completed: {
        type: Boolean,
        default: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,   // Automatically manage createdAt and updatedAt fields
})

export  const Todo = mongoose.model('Todo', todoSchema);