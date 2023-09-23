import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import chatRoute from "./routes/chatRoute.js";
import path from "path";
import { fileURLToPath } from "url"; // Import the required function

const __filename = fileURLToPath(import.meta.url); // Get the current module's filename
const __dirname = path.dirname(__filename); // Derive the directory name

const app = express();
const server = http.createServer(app);

dotenv.config();
connectDB();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/user", authRoute);
app.use("/api/v1/chat", chatRoute);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Update with your frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room when the user logs in (you might need to modify this based on your authentication flow)
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  // Handle sending messages
  socket.on("send-message", (data) => {
    console.log("Message sent:", data);
    socket.broadcast.to(data.receiver).emit("receive-message", data);
  });

  // Handle disconnecting
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server, io };
