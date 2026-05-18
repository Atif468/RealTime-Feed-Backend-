import { redisClient } from "./index.js";

// ==================== Cache Utilities ====================

export const setCacheData = async (key, data, ttl = 300) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    console.log(`✅ Cache set: ${key}`);
  } catch (error) {
    console.error(`❌ Error setting cache for ${key}:`, error);
  }
};

export const getCacheData = async (key) => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      console.log(`✅ Cache hit: ${key}`);
      return JSON.parse(data);
    }
    console.log(`⚠️ Cache miss: ${key}`);
    return null;
  } catch (error) {
    console.error(`❌ Error getting cache for ${key}:`, error);
    return null;
  }
};

export const clearCacheData = async (key) => {
  try {
    await redisClient.del(key);
    console.log(`🗑️ Cache cleared: ${key}`);
  } catch (error) {
    console.error(`❌ Error clearing cache for ${key}:`, error);
  }
};

export const clearAllCache = async () => {
  try {
    await redisClient.flushDb();
    console.log("🗑️ All cache cleared");
  } catch (error) {
    console.error("❌ Error clearing all cache:", error);
  }
};

// ==================== Validation Utilities ====================

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateString = (str, minLength = 1, maxLength = 500) => {
  return typeof str === "string" && str.length >= minLength && str.length <= maxLength;
};

export const validateFeedData = (feedData) => {
  const errors = [];

  if (!feedData.title || !validateString(feedData.title, 1, 200)) {
    errors.push("Title must be between 1 and 200 characters");
  }

  if (!feedData.description || !validateString(feedData.description, 1, 5000)) {
    errors.push("Description must be between 1 and 5000 characters");
  }

  if (!feedData.author || !validateString(feedData.author, 1, 100)) {
    errors.push("Author must be between 1 and 100 characters");
  }

  if (feedData.category && !["coaching", "sports", "wellness", "other"].includes(feedData.category)) {
    errors.push("Invalid category");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ==================== Error Utilities ====================

export const sendErrorResponse = (res, status, message, error = null) => {
  console.error(`❌ Error [${status}]: ${message}`, error);
  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error?.message : undefined,
  });
};

export const sendSuccessResponse = (res, status, message, data = null) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

// ==================== Logger Utilities ====================

export const logger = {
  info: (message) => console.log(`ℹ️ ${message}`),
  success: (message) => console.log(`✅ ${message}`),
  warning: (message) => console.warn(`⚠️ ${message}`),
  error: (message) => console.error(`❌ ${message}`),
  debug: (message) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🐛 ${message}`);
    }
  },
};

// ==================== Pagination Utilities ====================

export const getPaginationParams = (req) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const createPaginationMetadata = (page, limit, total) => {
  return {
    currentPage: page,
    pageSize: limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPreviousPage: page > 1,
  };
};

// ==================== Async Utilities ====================

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== Date Utilities ====================

export const formatDate = (date) => {
  return new Date(date).toISOString();
};

export const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
};

// ==================== ID Utilities ====================

export const generateEventId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// ==================== Performance Utilities ====================

export const measureTime = async (fn, label = "Operation") => {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  console.log(`⏱️ ${label} took ${duration.toFixed(2)}ms`);
  return result;
};

// ==================== Rate Limiting Utilities ====================

export const createRateLimiter = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();

  return (key) => {
    const now = Date.now();
    const userRequests = requests.get(key) || [];
    
    // Remove old requests outside window
    const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < windowMs
    );

    if (recentRequests.length >= maxRequests) {
      return {
        allowed: false,
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
      };
    }

    recentRequests.push(now);
    requests.set(key, recentRequests);

    return { allowed: true };
  };
};

// ==================== Sanitization Utilities ====================

export const sanitizeInput = (input) => {
  if (typeof input === "string") {
    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }
  return input;
};

export const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeInput(value);
  }
  return sanitized;
};
