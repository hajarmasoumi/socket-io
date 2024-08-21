const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // Update this to your frontend's origin
    methods: ["GET", "POST"],
  },
});
const mySocket = io.of("/");
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.send("Hello, world!");
});
mySocket.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("message", (msg, sender) => {
    console.log("Message received:", msg, sender);
    mySocket.emit("message-received", {
      msg: msg,
      sender: sender,
      id: Math.random() * 7,
    });
  });
  socket.on("delete-message", (id) => {
    mySocket.emit("delete-message", id);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
