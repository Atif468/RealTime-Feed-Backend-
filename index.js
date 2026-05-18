import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import feedRoutes from "./routes/feedRoutes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Redis client with robust error & protocol safety parsing
const getSafeRedisClient = () => {
  let redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    redisUrl = redisUrl.trim();
    // Safely verify and prepends protocol if missing (a common Render configuration mistake)
    if (!redisUrl.startsWith("redis://") && !redisUrl.startsWith("rediss://")) {
      console.warn("⚠️ REDIS_URL is missing protocol prefix. Prepending 'redis://'.");
      redisUrl = `redis://${redisUrl}`;
    }
  } else {
    redisUrl = "redis://localhost:6379";
  }

  try {
    console.log("📡 Initializing Redis client connection URL:", redisUrl.replace(/:[^:]*@/, ":****@")); // Safe masking of password
    return createClient({ url: redisUrl });
  } catch (err) {
    console.error("❌ Failed to parse REDIS_URL configuration, falling back to local default:", err.message);
    return createClient({ url: "redis://localhost:6379" });
  }
};

export const redisClient = getSafeRedisClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/realtime-feed");
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Redis Connection (Resilient connection - does not crash Express server if cache is offline)
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
  } catch (error) {
    console.error("⚠️ Redis connection failed. Backend will run transparently without caching:", error.message);
    // Do not call process.exit(1) so that the Express server continues running online!
  }
};

// Routes
app.use("/api/feed", feedRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Socket.IO for Real-time Updates
const connectedUsers = new Set();

io.on("connection", (socket) => {
  console.log("🔌 New user connected:", socket.id);
  connectedUsers.add(socket.id);

  // Broadcast online users count
  io.emit("users:online", { count: connectedUsers.size });

  // Listen for new feed events
  socket.on("feed:new", (newFeed) => {
    console.log("📢 New feed received:", newFeed);

    // Broadcast to all connected clients (prevent duplicates using eventId)
    io.emit("feed:created", {
      ...newFeed,
      eventId: `${Date.now()}-${Math.random()}`, // Unique event ID to prevent duplicates
      timestamp: new Date(),
    });
  });



  // Handle reconnection
  socket.on("reconnect", () => {
    console.log("🔄 User reconnected:", socket.id);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    connectedUsers.delete(socket.id);
    io.emit("users:online", { count: connectedUsers.size });
  });

  // Handle errors
  socket.on("error", (error) => {
    console.error("⚠️ Socket error:", error);
  });
});

// Start Server
const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Export io for use in other modules if needed
export { io };