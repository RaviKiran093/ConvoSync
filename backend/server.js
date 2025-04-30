const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// Create an Express application
const app = express();
// Create an HTTP server
const server = http.createServer(app);
// Attach Socket.IO to the HTTP server
const io = socketIo(server);

const PORT = 4000;

// WebSocket (Socket.IO) logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    console.log(`User ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", socket.id);

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected`);
      socket.to(roomId).emit("user-disconnected", socket.id);
    });

    socket.on("signal", (data) => {
      io.to(data.to).emit("signal", { signal: data.signal, from: socket.id });
    });
  });
});

// Middleware to log HTTP requests
app.use((req, res, next) => {
  console.log(`HTTP ${req.method} Request: ${req.url}`);
  next();
});

// Define a route for "/"
app.get("/", (req, res) => {
  res.send("Welcome to the WebSocket and HTTP server!");
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
