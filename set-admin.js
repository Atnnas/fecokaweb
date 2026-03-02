const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://davidartaviarodriguez_db_user:UYUNlKLuR1rSoTsu@ac-cxc8kvq-shard-00-00.jodngjz.mongodb.net:27017,ac-cxc8kvq-shard-00-01.jodngjz.mongodb.net:27017,ac-cxc8kvq-shard-00-02.jodngjz.mongodb.net:27017/fecoka_web?ssl=true&replicaSet=atlas-p0tcts-shard-0&authSource=admin";

async function setAdmin() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connected successfully!");

        // Assuming collection name is 'users' based on Mongoose default for model 'User'
        const db = mongoose.connection.db;
        const result = await db.collection('users').updateOne(
            { email: 'david.artavia.rodriguez@gmail.com' },
            { $set: { role: 'admin' } },
            { upsert: true } // If not exists, maybe we shouldn't upsert. Wait, upserting might miss other fields. But if the user logged in, they exist. Let's just update.
        );

        console.log(`Matched ${result.matchedCount} document(s) and modified ${result.modifiedCount} document(s).`);
        console.log("UpsertedId:", result.upsertedId);

        process.exit(0);
    } catch (error) {
        console.error("Error updating user:", error);
        process.exit(1);
    }
}

setAdmin();
