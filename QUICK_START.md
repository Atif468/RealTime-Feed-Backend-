# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites
- ✅ Node.js installed (`node --version`)
- ✅ MongoDB running (`mongosh`)
- ✅ Redis running (`redis-cli PING`)
- ✅ Dependencies installed (`npm install`)

### Step 2: Configure Environment
Update `.env` in the backend folder:
```
PORT = 8080
MONGODB_URI = mongodb://localhost:27017/realtime-feed
REDIS_URL = redis://localhost:6379
NODE_ENV = development
FRONTEND_URL = http://localhost:3000
```

### Step 3: Start Backend Server
```bash
npm start
```

Expected output:
```
✅ MongoDB connected successfully
✅ Redis connected successfully
🚀 Server running on port 8080
```

### Step 4: Test the API
Use any REST client (Postman, cURL, VS Code REST Client):

```bash
# Test GET /feed (should be empty)
curl http://localhost:8080/api/feed

# Test POST /feed (create a new feed)
curl -X POST http://localhost:8080/api/feed \
  -H "Content-Type: application/json" \
  -d '{
    "title": "First Feed",
    "description": "This is my first feed",
    "author": "Admin",
    "category": "coaching"
  }'

# Test GET /feed again (should show your feed now)
curl http://localhost:8080/api/feed

# Test LIKE /feed/{id}/like
curl -X PUT http://localhost:8080/api/feed/{INSERT_ID_HERE}/like

# Test VIEW /feed/{id}/view
curl http://localhost:8080/api/feed/{INSERT_ID_HERE}/view
```

### Step 5: Frontend Setup
In the `frontend` folder:
```bash
npm install socket.io-client

# Add this to your component
import io from "socket.io-client";
const socket = io("http://localhost:8080");

socket.on("feed:created", (newFeed) => {
  console.log("New feed:", newFeed);
});
```

---

## 📊 API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/feed` | Get all feeds (cached) |
| POST | `/api/feed` | Create new feed |
| PUT | `/api/feed/:id/like` | Like a feed |
| GET | `/api/feed/:id/view` | Record view |
| GET | `/api/health` | Health check |

---

## 🔌 Socket.IO Events

**Server → Client** (Listen for these):
- `feed:created` - New feed created
- `feed:updated` - Feed updated (likes/views)
- `users:online` - User count changed

**Client → Server** (Emit these):
- `feed:new` - Create new feed
- `feed:update` - Update feed

---

## 📁 Project Structure

```
backend/
├── controllers/feedController.js  # Business logic
├── models/Feed.js                 # MongoDB schema
├── routes/feedRoutes.js          # API endpoints
├── index.js                       # Server setup
├── config.js                      # Constants
├── utils.js                       # Helper functions
├── .env                          # Configuration
├── package.json                  # Dependencies
├── README.md                     # Full documentation
├── SETUP.md                      # MongoDB/Redis setup
├── QUICK_START.md               # This file
└── FRONTEND_INTEGRATION.md       # Frontend guide
```

---

## 🧪 Common Tasks

### Create Multiple Test Feeds
```bash
for i in {1..5}; do
  curl -X POST http://localhost:8080/api/feed \
    -H "Content-Type: application/json" \
    -d "{\"title\":\"Feed $i\",\"description\":\"Description $i\",\"author\":\"Admin\",\"category\":\"coaching\"}"
done
```

### Monitor Redis Cache
```bash
redis-cli
KEYS *
GET all_feeds
```

### Monitor MongoDB
```bash
mongosh
use realtime-feed
db.feeds.find().pretty()
```

### View Server Logs
```bash
npm start
# Watch for ✅ and ❌ indicators
```

---

## ✅ Verification Checklist

- [ ] MongoDB is running and accessible
- [ ] Redis is running and accessible
- [ ] Backend server starts without errors
- [ ] `GET /api/health` returns 200 OK
- [ ] Can create a feed with POST
- [ ] Can fetch feeds with GET (from cache on 2nd request)
- [ ] Can like/view feeds
- [ ] Socket.IO connection shows in server logs

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Change PORT in .env or kill process
lsof -i :8080
kill -9 <PID>
```

### MongoDB connection error
```bash
# Start MongoDB
mongod
# Or check service status
sudo systemctl status mongodb
```

### Redis connection error
```bash
# Start Redis
redis-server
# Or check service status
sudo systemctl status redis-server
```

### Dependencies not installed
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Next Steps

1. ✅ Backend running
2. ➡️ Set up frontend
3. ➡️ Connect Socket.IO
4. ➡️ Build UI components
5. ➡️ Test real-time updates
6. ➡️ Deploy!

---

## 💡 Tips

- Use `nodemon` for auto-reload (already installed)
- Check `.env` before each test
- Monitor console logs for errors
- Test in browser DevTools Network tab
- Use Postman for complex requests

---

**Questions?** Check the detailed docs:
- Full API → `README.md`
- Setup guide → `SETUP.md`
- Frontend integration → `FRONTEND_INTEGRATION.md`

🎉 You're all set!
