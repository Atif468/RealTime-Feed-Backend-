# Frontend Socket.IO Integration Guide

## Installation

```bash
cd frontend
npm install socket.io-client
```

---

## Basic Setup

### Connect to Server

```javascript
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:8080";

export const socket = io(SOCKET_URL, {
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 30000,
  reconnectionAttempts: 5,
});

// Connection established
socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
});

// Disconnected
socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

// Error
socket.on("error", (error) => {
  console.error("⚠️ Socket error:", error);
});
```

---

## Real-time Event Listeners

### Listen for New Feed

```javascript
socket.on("feed:created", (newFeed) => {
  console.log("📢 New feed:", newFeed);
  
  // Use unique eventId to prevent duplicate rendering
  const eventId = newFeed.eventId;
  
  // Check if already processed
  if (!processedEvents.has(eventId)) {
    processedEvents.add(eventId);
    // Update UI with new feed
  }
});
```

### Listen for Feed Updates

```javascript
socket.on("feed:updated", (updatedFeed) => {
  console.log("🔄 Feed updated:", updatedFeed);
  
  // Update UI with new likes/views count
  updateFeedUI(updatedFeed);
});
```

### Listen for Online Users

```javascript
socket.on("users:online", (data) => {
  console.log(`👥 ${data.count} users online`);
  updateOnlineCount(data.count);
});
```

---

## Emit Events to Server

### Broadcast New Feed

```javascript
const createNewFeed = (feedData) => {
  socket.emit("feed:new", {
    title: feedData.title,
    description: feedData.description,
    author: feedData.author,
    category: feedData.category,
  });
  
  console.log("📤 New feed emitted");
};
```

### Broadcast Feed Update

```javascript
const updateFeed = (feedData) => {
  socket.emit("feed:update", {
    _id: feedData._id,
    likes: feedData.likes,
    views: feedData.views,
  });
  
  console.log("📤 Feed update emitted");
};
```

---

## React Component Example

```javascript
import { useEffect, useState } from "react";
import { socket } from "./socket";

export function FeedPage() {
  const [feeds, setFeeds] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [processedEvents] = useState(new Set());

  useEffect(() => {
    // Listen for new feeds
    socket.on("feed:created", (newFeed) => {
      // Prevent duplicates
      if (!processedEvents.has(newFeed.eventId)) {
        processedEvents.add(newFeed.eventId);
        setFeeds((prev) => [newFeed, ...prev]);
      }
    });

    // Listen for feed updates
    socket.on("feed:updated", (updatedFeed) => {
      setFeeds((prev) =>
        prev.map((feed) =>
          feed._id === updatedFeed._id ? updatedFeed : feed
        )
      );
    });

    // Listen for online users
    socket.on("users:online", (data) => {
      setOnlineUsers(data.count);
    });

    return () => {
      socket.off("feed:created");
      socket.off("feed:updated");
      socket.off("users:online");
    };
  }, []);

  const handleNewFeed = async (formData) => {
    try {
      // First, make API call to save
      const response = await fetch("http://localhost:8080/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Then emit via socket
        socket.emit("feed:new", data.data);
      }
    } catch (error) {
      console.error("Error creating feed:", error);
    }
  };

  return (
    <div>
      <h1>Live Feed</h1>
      <p>Online Users: {onlineUsers}</p>
      
      <div className="feeds">
        {feeds.map((feed) => (
          <div key={feed._id} className="feed-card">
            <h2>{feed.title}</h2>
            <p>{feed.description}</p>
            <p>By {feed.author}</p>
            <p>❤️ {feed.likes} | 👁️ {feed.views}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Duplicate Event Prevention

### Best Practice

```javascript
// Track processed events to prevent duplicates
const processedEvents = new Set();

socket.on("feed:created", (newFeed) => {
  const eventId = newFeed.eventId; // Unique ID from server
  
  if (!processedEvents.has(eventId)) {
    processedEvents.add(eventId);
    // Now safe to update UI
    addFeedToUI(newFeed);
  }
});

// Clear old events periodically
setInterval(() => {
  if (processedEvents.size > 1000) {
    processedEvents.clear(); // Reset to prevent memory leak
  }
}, 60000);
```

---

## Connection Handling

### Automatic Reconnection

```javascript
// Already configured in socket setup:
// {
//   reconnection: true,
//   reconnectionDelay: 5000,
//   reconnectionDelayMax: 30000,
//   reconnectionAttempts: 5
// }

// But you can add custom logic:
socket.on("reconnect", () => {
  console.log("🔄 Reconnected to server");
  // Re-fetch data
  fetchFeeds();
});

socket.on("reconnect_error", (error) => {
  console.error("⚠️ Reconnection error:", error);
});

socket.on("reconnect_failed", () => {
  console.error("❌ Failed to reconnect");
  // Show error UI
});
```

---

## Error Handling

```javascript
socket.on("error", (error) => {
  console.error("Socket error:", error);
  showErrorNotification("Connection error. Trying to reconnect...");
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error);
});

// Global error handler
socket.on("exception", (error) => {
  console.error("Server exception:", error);
});
```

---

## Performance Tips

1. **Debounce Emissions**:
   ```javascript
   import { debounce } from "lodash";
   
   const debouncedUpdate = debounce((feedData) => {
     socket.emit("feed:update", feedData);
   }, 1000);
   ```

2. **Use Namespaces** (if scaling):
   ```javascript
   const feedSocket = io(SOCKET_URL + "/feeds");
   const adminSocket = io(SOCKET_URL + "/admin");
   ```

3. **Clean Up Listeners**:
   ```javascript
   useEffect(() => {
     socket.on("event", handler);
     return () => socket.off("event", handler);
   }, []);
   ```

4. **Memory Optimization**:
   ```javascript
   // Limit feed array size
   const MAX_FEEDS = 100;
   setFeeds((prev) => prev.slice(0, MAX_FEEDS));
   ```

---

## Testing Socket Connection

```javascript
// In browser console
socket.emit("feed:new", {
  title: "Test Feed",
  description: "Testing socket connection",
  author: "Tester",
  category: "coaching"
});

// Should see response in socket listener
socket.on("feed:created", (data) => {
  console.log("Received:", data);
});
```

---

## Troubleshooting

### Connection fails
- Check if backend server is running
- Verify CORS settings in backend
- Check firewall/proxy settings

### Events not received
- Check Socket.IO connection status: `socket.connected`
- Verify event name matches exactly
- Check browser console for errors

### Duplicate events
- Make sure to use `eventId` for deduplication
- Check if event is being emitted multiple times

### Disconnects frequently
- Check network stability
- Increase `reconnectionAttempts`
- Check server logs for errors

---

## Next Steps

1. Install Socket.IO client: `npm install socket.io-client`
2. Create socket instance in your project
3. Add listeners in your components
4. Emit events when creating/updating feeds
5. Test with browser DevTools Network tab

🎉 You're ready for real-time updates!
