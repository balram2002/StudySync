import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/Routes.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Define dbHOST before using it
const dbHOST = process.env.MONGO_DB_URL;

// Improved MongoDB connection with error handling
mongoose
    .connect(dbHOST)
    .then(() => {
        console.log("DB Connection Successful");
    })
    .catch((err) => {
        console.error("DB Connection Error:", err.message);
        process.exit(1); // Exit process with failure
    });

// Enhanced CORS configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5000",
        // Add your Vercel frontend URL here when deployed
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Basic route
app.get('/', (req, res) => {
    res.send('Products API running');
});

// API routes
app.use("/api", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Server configuration for Vercel
const port = process.env.PORT || 5000;

// For Vercel deployment, export the app
if (process.env.VERCEL) {
    module.exports = app;
} else {
    // Local development
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}