import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import userRoutes from "./routes/userRoutes.js";
import { Server } from "socket.io";
import User from "./models/User.js";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import Message from "./models/Message.js";

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);


// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});


app.use(cors());

app.use(express.json());


// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);


app.get("/", (req, res) => {
  res.send("API Running...");
});
app.use("/api/users", userRoutes);

// SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);


  // JOIN USER ROOM
socket.on("join_room", async (userId) => {

  socket.join(userId);

  socket.userId = userId;

  // SET ONLINE
  await User.findByIdAndUpdate(
    userId,
    {
      isOnline: true,
    }
  );

  console.log("Joined room:", userId);

});


  // SEND MESSAGE
  socket.on("send_message", async (data) => {

    try {

      // SAVE TO DB
      const newMessage = await Message.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
      });

      // SEND TO RECEIVER
      io.to(data.receiverId).emit(
        "receive_message",
        newMessage
      );

      // SEND BACK TO SENDER
      socket.emit(
        "receive_message",
        newMessage
      );

    } catch (error) {

      console.log(error);

    }

  });


  // DISCONNECT
socket.on("disconnect", async () => {

  if (socket.userId) {

    await User.findByIdAndUpdate(
      socket.userId,
      {
        isOnline: false,
        lastSeen: new Date(),
      }
    );

  }

  console.log("User Disconnected");

});

});


// SERVER START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});