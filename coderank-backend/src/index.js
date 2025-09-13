import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// routes importing
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.use("/api/v1/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.send("Welcome to coderank");
});