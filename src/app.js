const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const businessRoutes = require("./routes/business.routes");
const reviewRoutes = require("./routes/review.routes");
const aiRoutes=require("./routes/ai.routes");
const insightsRoutes = require("./routes/insights.routes");
const notificationRoutes = require(
  "./routes/notification.routes"
);

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/ai",aiRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/notifications", notificationRoutes);


// Test Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🚀 LocalBiz Reviewer API is Running"
    });
});

module.exports = app;