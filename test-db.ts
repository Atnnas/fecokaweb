import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connection SUCCESSFUL!");
        process.exit(0);
    } catch (error) {
        console.error("Connection FAILED:", error);
        process.exit(1);
    }
}

testConnection();
