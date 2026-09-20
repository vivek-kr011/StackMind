import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from './routes/auth.js';
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
// const PORT = 8080;
const PORT = process.env.PORT || 8080;

/* PARSE incoming Request */
app.use(express.json());
app.use(cors());

// API Routes register  
app.use('/api/auth', authRoutes);

app.use("/api", authMiddleware, chatRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Running on ${PORT}`);
  connectDB();
});

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected with Database!");
    console.log("Database Name:", conn.connection.name);
    console.log("Host:", conn.connection.host);

  } catch(err) {
    console.log("Failed to connect with DataBase",err);
  }
}