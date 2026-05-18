# Setup Guide - MongoDB & Redis

## Option 1: Local Installation (Recommended for Development)

### MongoDB Local Setup

#### Windows
1. **Download MongoDB Community Server**:
   - Visit: https://www.mongodb.com/try/download/community
   - Select Windows and latest version
   - Run the installer

2. **Start MongoDB**:
   ```bash
   # If installed as service, it starts automatically
   # Otherwise, run:
   mongod
   ```

3. **Verify Connection**:
   ```bash
   mongosh
   ```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongosh
```

#### Linux (Ubuntu/Debian)
```bash
# Install
sudo apt-get install -y mongodb

# Start
sudo systemctl start mongodb

# Verify
mongosh
```

---

### Redis Local Setup

#### Windows
1. **Using WSL2 (Windows Subsystem for Linux)**:
   ```bash
   # In WSL terminal
   sudo apt-get update
   sudo apt-get install redis-server
   redis-server
   ```

2. **Or use Windows Native Build**:
   - Download: https://github.com/microsoftarchive/redis/releases
   - Extract and run `redis-server.exe`

#### macOS
```bash
# Using Homebrew
brew install redis

# Start Redis
brew services start redis

# Verify
redis-cli ping
# Should return: PONG
```

#### Linux (Ubuntu/Debian)
```bash
# Install
sudo apt-get install redis-server

# Start
sudo systemctl start redis-server

# Verify
redis-cli ping
# Should return: PONG
```

---

## Option 2: Using Docker (Production-like)

### Prerequisites
- Install Docker: https://www.docker.com/products/docker-desktop

### Run MongoDB + Redis

```bash
# Create docker-compose.yml in backend folder
docker-compose up -d
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: realtime-feed
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7.0-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongodb_data:
  redis_data:
```

### Verify Docker Containers

```bash
# Check running containers
docker ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Option 3: Cloud Services (Production)

### MongoDB Atlas

1. **Sign up**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: Free tier available
3. **Get Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/realtime-feed
   ```

4. **Update `.env`**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realtime-feed
   ```

### Redis Cloud

1. **Sign up**: https://redis.com/try-free/
2. **Create Database**: Free tier available
3. **Get Connection URL**:
   ```
   redis://default:password@host:port
   ```

4. **Update `.env`**:
   ```
   REDIS_URL=redis://default:password@host:port
   ```

---

## Verify Setup

### MongoDB Connection Test
```bash
# Open mongosh
mongosh

# Commands
show dbs                          # List databases
use realtime-feed                 # Switch to your DB
db.feeds.find()                   # See feeds (should be empty initially)
db.feeds.insertOne({title: "Test"}) # Insert test document
```

### Redis Connection Test
```bash
# Open redis-cli
redis-cli

# Commands
PING                   # Should return PONG
SET test "hello"       # Set a key
GET test               # Should return hello
FLUSHDB                # Clear database (for testing)
```

---

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# Check if running
mongosh

# Or start it
mongod
```

### Redis Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution**: Make sure Redis is running
```bash
# Check if running
redis-cli PING

# Or start it
redis-server
```

### Windows: MongoDB not found
- Add to PATH: `C:\Program Files\MongoDB\Server\7.0\bin`
- Restart terminal

### Windows: Redis not available
- Use WSL2 instead of native Windows
- Or download official Windows build from GitHub

---

## Performance Tips

1. **Enable MongoDB Compression**:
   ```
   MONGODB_URI=mongodb://...?compressors=snappy
   ```

2. **Redis Memory Optimization**:
   ```
   # In redis.conf
   maxmemory 256mb
   maxmemory-policy allkeys-lru
   ```

3. **Connection Pooling**:
   - Already configured in code
   - Default: 10 connections

4. **Monitoring** (Optional):
   - MongoDB Compass: GUI for MongoDB
   - RedisInsight: GUI for Redis
   - Both available for free

---

## Next Steps

After setup:
1. Start MongoDB
2. Start Redis
3. Update `.env` with connection strings
4. Run `npm start` in backend folder
5. Check logs for ✅ success indicators

You're ready to go! 🚀
