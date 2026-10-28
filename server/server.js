require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const weatherRoutes = require("./routes/weatherRoutes");
const communityRoutes = require("./routes/communityRoutes");

// ===============================
// Connect Database
// ===============================
connectDB();

// ===============================
// Initialize Express
// ===============================
const app = express();

// ===============================
// Middlewares
// ===============================
app.use(cors());
app.use(express.json());

// ===============================
// Home Route
// ===============================
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "🌾 Welcome to AgriAssist API",
    });
});

// ===============================
// Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/community", communityRoutes);

// ===============================
// Handle Invalid Routes
// ===============================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});