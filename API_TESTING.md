# API Testing Guide

## 🧪 Test All Endpoints

This guide shows how to test each API endpoint using different tools.

---

## 1️⃣ Using cURL (Command Line)

### GET All Feeds
```bash
curl -X GET http://localhost:8080/api/feed \
  -H "Accept: application/json"
```

### POST Create Feed
```bash
curl -X POST http://localhost:8080/api/feed \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Coaching Techniques",
    "description": "Learn the latest coaching methodologies and best practices",
    "author": "Coach Sarah",
    "category": "coaching"
  }'
```

### PUT Like Feed
```bash
curl -X PUT http://localhost:8080/api/feed/[FEED_ID]/like \
  -H "Accept: application/json"
```

### GET Record View
```bash
curl -X GET http://localhost:8080/api/feed/[FEED_ID]/view \
  -H "Accept: application/json"
```

### GET Health Check
```bash
curl -X GET http://localhost:8080/api/health
```

---

## 2️⃣ Using Postman

### Import Collection

1. Open Postman
2. Click `Import` → `Import Raw Text`
3. Copy the collection JSON below
4. Click Import

**Postman Collection JSON:**
```json
{
  "info": {
    "name": "Realtime Feed API",
    "description": "Complete API collection for testing",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Feeds",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/feed",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "feed"]
        }
      }
    },
    {
      "name": "Create Feed",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"title\": \"Coaching Tips for Beginners\",\n  \"description\": \"Learn the fundamentals of effective coaching\",\n  \"author\": \"Coach Mike\",\n  \"category\": \"coaching\"\n}"
        },
        "url": {
          "raw": "http://localhost:8080/api/feed",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "feed"]
        }
      }
    },
    {
      "name": "Like Feed",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/feed/{{feedId}}/like",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "feed", "{{feedId}}", "like"]
        }
      }
    },
    {
      "name": "Record View",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:8080/api/feed/{{feedId}}/view",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "feed", "{{feedId}}", "view"]
        }
      }
    },
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:8080/api/health",
          "protocol": "http",
          "host": ["localhost"],
          "port": "8080",
          "path": ["api", "health"]
        }
      }
    }
  ]
}
```

### Setup Variables in Postman

1. Click `Environment` → `Create New Environment`
2. Set variables:
   - `baseUrl`: `http://localhost:8080`
   - `feedId`: (leave empty initially)

3. After creating a feed, copy the `_id` and set as `{{feedId}}`

---

## 3️⃣ Using VS Code REST Client Extension

Create a file named `test.http`:

```http
### Health Check
GET http://localhost:8080/api/health

### Get All Feeds
GET http://localhost:8080/api/feed

### Create Feed
POST http://localhost:8080/api/feed
Content-Type: application/json

{
  "title": "New Coaching Technique",
  "description": "Revolutionary approach to team coaching",
  "author": "Expert Coach",
  "category": "coaching"
}

### Like Feed (Replace with actual feed ID)
PUT http://localhost:8080/api/feed/6668a1b2c3d4e5f6g7h8i9j0/like

### Record View (Replace with actual feed ID)
GET http://localhost:8080/api/feed/6668a1b2c3d4e5f6g7h8i9j0/view
```

**How to use:**
1. Install "REST Client" extension in VS Code
2. Open `test.http`
3. Click "Send Request" above each request
4. Response appears in right panel

---

## 4️⃣ Using JavaScript Fetch API

```javascript
// Test in browser console or Node.js

// Get All Feeds
fetch("http://localhost:8080/api/feed")
  .then(res => res.json())
  .then(data => console.log(data));

// Create Feed
fetch("http://localhost:8080/api/feed", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "Feed from JavaScript",
    description: "Testing with fetch API",
    author: "Dev",
    category: "coaching"
  })
})
  .then(res => res.json())
  .then(data => {
    console.log(data);
    // Save feedId for other requests
    const feedId = data.data._id;
    console.log("Feed ID:", feedId);
  });

// Like Feed
const feedId = "paste-feed-id-here";
fetch(`http://localhost:8080/api/feed/${feedId}/like`, {
  method: "PUT"
})
  .then(res => res.json())
  .then(data => console.log(data));

// Record View
fetch(`http://localhost:8080/api/feed/${feedId}/view`)
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 5️⃣ Using Thunder Client (VSCode)

1. Install "Thunder Client" extension
2. Click Thunder Client icon
3. Create new request
4. Paste URL: `http://localhost:8080/api/feed`
5. Select method and test

---

## 6️⃣ Using HTTPie

```bash
# Get All Feeds
http GET http://localhost:8080/api/feed

# Create Feed
http POST http://localhost:8080/api/feed \
  title="New Feed" \
  description="Testing HTTPie" \
  author="Admin" \
  category="coaching"

# Like Feed
http PUT http://localhost:8080/api/feed/FEED_ID/like

# Record View
http GET http://localhost:8080/api/feed/FEED_ID/view
```

---

## 📝 Test Scenarios

### Scenario 1: Basic CRUD
1. ✅ GET /feed (should be empty or cached)
2. ✅ POST /feed (create first feed)
3. ✅ GET /feed (should show new feed)
4. ✅ PUT /feed/:id/like (increment likes)
5. ✅ GET /feed/:id/view (increment views)

### Scenario 2: Caching Test
1. POST /feed (create feed)
2. GET /feed (takes ~500ms from DB)
3. GET /feed again (takes ~10ms from cache)
4. PUT /feed/:id/like (clears cache)
5. GET /feed (takes ~500ms from DB again)

### Scenario 3: Multiple Feeds
1. Create 5 different feeds
2. GET /feed (should show all in reverse order)
3. Like multiple feeds
4. View multiple feeds

### Scenario 4: Error Handling
1. POST /feed without title → 400 Bad Request
2. PUT /feed/invalid-id/like → 404 Not Found
3. GET /feed/invalid-id/view → 404 Not Found

---

## 🔄 WebSocket Testing

### Using Socket.IO Client

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:8080");

socket.on("connect", () => {
  console.log("✅ Connected");
  
  // Send new feed
  socket.emit("feed:new", {
    title: "WebSocket Test",
    description: "Testing real-time updates",
    author: "Tester",
    category: "coaching"
  });
});

socket.on("feed:created", (feed) => {
  console.log("📢 New feed received:", feed);
});

socket.on("feed:updated", (feed) => {
  console.log("🔄 Feed updated:", feed);
});

socket.on("users:online", (data) => {
  console.log(`👥 ${data.count} users online`);
});
```

---

## 🧹 Test Data Cleanup

### Clear MongoDB
```bash
mongosh
use realtime-feed
db.feeds.deleteMany({})
```

### Clear Redis
```bash
redis-cli
FLUSHDB
```

### Reset Everything
```bash
# MongoDB
mongosh realtime-feed --eval 'db.feeds.deleteMany({})'

# Redis
redis-cli FLUSHDB
```

---

## 📊 Performance Testing

### Load Testing with Apache Bench
```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:8080/api/feed
```

### Load Testing with wrk
```bash
# Test with 4 threads, 100 connections, 10 seconds
wrk -t4 -c100 -d10s http://localhost:8080/api/feed
```

---

## ✅ Success Indicators

### API Response Format
✅ All successful requests return:
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

### Status Codes
- ✅ 200 OK - Success
- ✅ 201 Created - Resource created
- ❌ 400 Bad Request - Validation error
- ❌ 404 Not Found - Resource not found
- ❌ 500 Internal Error - Server error

### Cache Indicators
- 1st GET: `"message": "Feeds retrieved from database"`
- 2nd GET: `"message": "Feeds retrieved from cache"`
- After POST/PUT: Cache cleared, back to database

---

## 🐛 Debugging Tips

1. **Monitor Server Logs**:
   - Watch for ✅, ❌, 📦, 📡, 🗑️ indicators
   - Check MongoDB/Redis connection status

2. **Check Response Headers**:
   ```bash
   curl -i http://localhost:8080/api/feed
   ```

3. **Use Chrome DevTools**:
   - Network tab → Monitor XHR/Fetch requests
   - Console → Test with fetch API

4. **Database State**:
   ```bash
   mongosh
   db.feeds.countDocuments()
   ```

---

## 🚀 Automated Testing Script

```bash
#!/bin/bash
echo "🧪 Starting API Tests..."

BASE_URL="http://localhost:8080"

# Test 1: Health Check
echo "1️⃣ Testing health check..."
curl $BASE_URL/api/health

# Test 2: Get Feeds (empty)
echo -e "\n2️⃣ Testing GET feeds..."
curl $BASE_URL/api/feed

# Test 3: Create Feed
echo -e "\n3️⃣ Testing POST feed..."
RESPONSE=$(curl -X POST $BASE_URL/api/feed \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","author":"Test","category":"coaching"}')
echo $RESPONSE

# Extract Feed ID
FEED_ID=$(echo $RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "✅ Feed ID: $FEED_ID"

# Test 4: Like Feed
echo -e "\n4️⃣ Testing PUT like..."
curl -X PUT $BASE_URL/api/feed/$FEED_ID/like

# Test 5: View Feed
echo -e "\n5️⃣ Testing GET view..."
curl $BASE_URL/api/feed/$FEED_ID/view

echo -e "\n✅ All tests completed!"
```

Save as `test.sh` and run:
```bash
bash test.sh
```

---

Ready to test! 🎉
