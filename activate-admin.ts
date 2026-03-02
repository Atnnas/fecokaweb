import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function activateAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: String,
            role: String,
            status: String
        }));

        const result = await User.updateOne(
            { email: 'david.artavia.rodriguez@gmail.com' },
            { $set: { role: 'admin', status: 'active' } }
        );

        console.log(`Matched ${result.matchedCount}, modified ${result.modifiedCount}`);
        process.exit(0);
    } catch (error) {
        console.error("Error activating admin:", error);
        process.exit(1);
    }
}

activateAdmin();
