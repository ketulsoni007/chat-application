import { Server } from "socket.io"; // Import the Server class
import express from "express";
import cors from "cors"

const app = express();
app.use(cors())
let io; // Declare the io variable outside the function scope

export const socketConnect = (server) => {
  io = new Server(server); // Create a new instance of Server

  io.on("connection", (socket) => {

    socket.on("send-message", (message) => {
      // Broadcast the message to all connected clients
      io.emit("receive-message", message);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
    });
  });

  return io; // Return the io instance
};

export { io }; // Export the io instance
