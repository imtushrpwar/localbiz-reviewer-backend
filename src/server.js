require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

const startServer = async () => {
    await connectDB();

    app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
};

startServer();