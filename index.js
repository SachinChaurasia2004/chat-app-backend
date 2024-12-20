import express from "express";
import { connectDB } from "./config/db.js";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";

const app = express();

config({
    path: ".env"
})
connectDB();

app.use(express.json());

app.use('/auth', authRoutes);
app.use((error, req, res, next) => {
    res.status(500).json({ 
        success: false,
        message: error.message
    });
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})