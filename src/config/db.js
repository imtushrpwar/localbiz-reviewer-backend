const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use reliable public DNS servers
dns.setServers(["1.1.1.1", "8.8.8.8"]);


const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("❌ MongoDB Connection Failed");
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;