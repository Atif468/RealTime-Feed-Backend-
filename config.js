# Constants & Configuration

export const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080";
export const SOCKET_URL = process.env.SOCKET_URL || "http://localhost:8080";

export const FEED_CATEGORIES = {
  COACHING: "coaching",
  SPORTS: "sports",
  WELLNESS: "wellness",
  OTHER: "other",
};

export const CACHE_TTL = 300; // 5 minutes
export const SOCKET_RECONNECT_DELAY = 5000; // 5 seconds
export const SOCKET_RECONNECT_DELAY_MAX = 30000; // 30 seconds

export const API_ENDPOINTS = {
  GET_FEEDS: "/api/feed",
  CREATE_FEED: "/api/feed",
  LIKE_FEED: (id) => `/api/feed/${id}/like`,
  VIEW_FEED: (id) => `/api/feed/${id}/view`,
  HEALTH: "/api/health",
};

export const SOCKET_EVENTS = {
  // Client -> Server
  FEED_NEW: "feed:new",
  FEED_UPDATE: "feed:update",

  // Server -> Client
  FEED_CREATED: "feed:created",
  FEED_UPDATED: "feed:updated",
  USERS_ONLINE: "users:online",
  ERROR: "error",
  DISCONNECT: "disconnect",
  RECONNECT: "reconnect",
};
