import { configDotenv } from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import http from "http";
import { Server } from "socket.io";
const app = express();

app.set("view engine", "ejs");

configDotenv();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
// const users = new Map();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" },
// });
// io.on("connection", (socket) => {
//   console.log("user connected", socket.id);
//   socket.on("register", (userId) => {
//     users.set(userId, socket.id);
//     console.log("Users:", users);
//   });
//   socket.on("sendMessage", ({ senderId, receiverId, text }) => {
//     const receiverIdSocketId = users.get(receiverId);
//     if (receiverIdSocketId) {
//       io.to(receiverIdSocketId).emit("receiveMessage", {
//         senderId,
//         text,
//       });
//       console.log("Message emitted to receiver");
//     } else {
//       console.log("Receiver not found");
//     }
//   });
//   socket.on("disconnect", () => {
//     console.log("disconnected", socket.id);
//     for (let [userId, sockId] of users.entries()) {
//       if (sockId == socket.id) {
//         users.delete(userId);
//       }
//     }
//   });
// });

mongoose.connect(process.env.URI).then(() => console.log("DB CONNECTO"));
const sessionMiddleWare = session({
  name: "connect.sid",
  resave: false,
  secret: "superSecret",
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "lax",
  },
});
app.use(sessionMiddleWare);
// io.use((socket, next) => {
//   sessionMiddleWare(socket.request, {}, next);
// });
app.use("/api/user", userRoutes);
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(err.status || 500).json({
    error: err.name || "Error",
    message: err.message || "An unexpected error occurred",
  });
});
app.use("/api/dash", homeRoutes);

app.get("/", (req, res) => {
  res.send({ msg: "Hello we are invading you in 3 2 1... boom" });
});
app.listen(process.env.PORT || 5000, () => {
  console.log("hello world");
});
