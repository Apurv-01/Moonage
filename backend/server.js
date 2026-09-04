import { configDotenv } from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import http from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
configDotenv();

const app = express();
app.use(helmet());
app.disable("x-powered-by");
const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"].filter(
  Boolean,
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else callback(new Error("CORS Voilation Detected"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});
app.set("trust proxy", 1);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, Chill Daddy." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests, Chill Daddy." },
});
app.use("/api/user/login", authLimiter);
app.use("/api/user/register", authLimiter);

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
    secure: process.env.NODE_ENV === "prod",
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: process.env.NODE_ENV === "prod" ? "strict" : "lax",
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
app.use((err, req, res, next) => {
  console.error("SERVER ERROR LOG:", err);

  const isProduction = process.env.NODE_ENV === "prod";

  res.status(err.status || 500).json({
    success: false,
    message: isProduction
      ? "An internal server error occurred. Please try again later."
      : err.message,
  });
});
const server = app.listen(process.env.PORT || 5000, () => {
  console.log("hello world");
});
const gracefulShutdown = () => {
  console.log("Received kill signal, shutting down gracefully...");
  server.close(async () => {
    console.log("Closed remaining connections.");
    await mongoose.connection.close();
    process.exit(0);
  });
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
