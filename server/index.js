import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.listen(4000);

io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle joining a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("send-words", (data) => {
    console.log("message received: ", data);
    io.to(data.roomId).emit("update-story", data.words); // Broadcast to all clients in the room
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
