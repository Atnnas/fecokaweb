const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://davidartaviarodriguez_db_user:UYUNlKLuR1rSoTsu@ac-cxc8kvq-shard-00-00.jodngjz.mongodb.net:27017,ac-cxc8kvq-shard-00-01.jodngjz.mongodb.net:27017,ac-cxc8kvq-shard-00-02.jodngjz.mongodb.net:27017/fecoka_web?ssl=true&replicaSet=atlas-p0tcts-shard-0&authSource=admin";

async function testConnection() {
    try {
        console.log("Connecting directly to MongoDB Atlas cluster...");
        await mongoose.connect(MONGODB_URI);
        console.log("Connection SUCCESSFUL!");
        process.exit(0);
    } catch (error) {
        console.error("Connection FAILED:", error);
        process.exit(1);
    }
}

testConnection();
