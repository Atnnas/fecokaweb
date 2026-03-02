const mongoose = require('mongoose');
const uri = "mongodb+srv://davidartavia:Fecoka2025@cluster0.z5i68.mongodb.net/fecoka?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
    try {
        await mongoose.connect(uri);
        console.log("Connected!");
        const db = mongoose.connection.db;
        const result = await db.collection('users').updateOne(
            { email: 'david.artavia.rodriguez@gmail.com' },
            { $set: { role: 'admin', status: 'active' } }
        );
        console.log(`Matched ${result.matchedCount}, Modified ${result.modifiedCount}`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
run();
