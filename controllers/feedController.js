import Feed from "../models/Feed.js";
import { redisClient } from "../index.js";

const CACHE_KEY = "all_feeds";
const CACHE_TTL = 300; // 5 minutes

export const getFeeds = async (req, res) => {
  try {
    const isRedisReady = redisClient && redisClient.isOpen;

    if (isRedisReady) {
      try {
        // Try to get from Redis cache first
        const cachedFeeds = await redisClient.get(CACHE_KEY);
        if (cachedFeeds) {
          console.log("📦 Returning feeds from cache");
          return res.status(200).json({
            success: true,
            message: "Feeds retrieved from cache",
            data: JSON.parse(cachedFeeds),
          });
        }
      } catch (redisErr) {
        console.error("⚠️ Redis GET error, falling back to DB:", redisErr.message);
      }
    }

    // If not in cache or Redis is down, fetch from MongoDB
    console.log("📡 Fetching feeds from database");
    const feeds = await Feed.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    if (isRedisReady) {
      try {
        // Store in Redis cache
        await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(feeds));
      } catch (redisErr) {
        console.error("⚠️ Redis SET error:", redisErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Feeds retrieved from database",
      data: feeds,
    });
  } catch (error) {
    console.error("Error fetching feeds:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching feeds",
      error: error.message,
    });
  }
};

export const createFeed = async (req, res) => {
  try {
    const { title, description, author, category } = req.body;

    // Validation
    if (!title || !description || !author) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and author are required",
      });
    }

    // Create new feed
    const newFeed = new Feed({
      title,
      description,
      author,
      category: category || "coaching",
    });

    const savedFeed = await newFeed.save();

    // Clear the cache safely
    if (redisClient && redisClient.isOpen) {
      try {
        await redisClient.del(CACHE_KEY);
        console.log("🗑️ Cache cleared");
      } catch (redisErr) {
        console.error("⚠️ Redis DEL error:", redisErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Feed created successfully",
      data: savedFeed,
    });
  } catch (error) {
    console.error("Error creating feed:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating feed",
      error: error.message,
    });
  }
};


