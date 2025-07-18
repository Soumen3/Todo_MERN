import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/todo_mern"

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };


export const connectDb = async () => {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

// Don't automatically call connectDb here - let server.js handle it
// connectDb().catch(console.dir);
