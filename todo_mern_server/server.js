import app from './app.js';
import dotenv from 'dotenv';
import {connectDb} from './config/db.js'; // Import the database connection


dotenv.config();


const PORT = process.env.PORT || 5000;

// Connect to the database
await connectDb().then(() => {
    console.log('Database connected successfully');
}).catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process if the database connection fails
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});