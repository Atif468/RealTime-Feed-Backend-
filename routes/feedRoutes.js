import express from "express";
import {
  getFeeds,
  createFeed,
} from "../controllers/feedController.js";

const router = express.Router();

// GET all feeds with caching
router.get("/", getFeeds);

// POST a new feed
router.post("/", createFeed);

export default router;
