# 🚀 Hackgen - Production Deployment Guide

This guide explains how to build and deploy your full-stack AI Career Advisor application as a single unified build.

## 📦 Building for Production

### Option 1: Full Production Build (Recommended)

```bash
# Install dependencies
npm install

# Build the complete application (frontend + backend)
npm run build:full

# The ./dist/ folder now contains your complete deployable application
```

### Option 2: Step-by-step Build

```bash
# 1. Build frontend
npm run build

# 2. Prepare production server
npm run build:server

# 3. Install production dependencies in dist/
cd dist
npm install
```

## 🌐 Deployment Options

### 1. **Vercel (Serverless)**
```bash
# Deploy using Vercel CLI
vercel --prod

# Or push to GitHub and connect to Vercel dashboard
```

**Required Environment Variables:**
- `GEMINI_API_KEY` - Your Google Gemini AI API key
- `MONGO_URI` - MongoDB connection string (use MongoDB Atlas)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV=production`

### 2. **Railway**
```bash
# Deploy to Railway
railway up

# Or connect GitHub repository to Railway dashboard
```

### 3. **Render**
- Connect your GitHub repository
- Set build command: `npm run build:full`
- Set start command: `cd dist && npm install && npm start`

### 4. **Docker Deployment**
```bash
# Build the application
npm run build:full

# Build Docker image
docker build -t hackgen-app .

# Run container
docker run -p 5001:5001 \
  -e GEMINI_API_KEY=your_key \
  -e MONGO_URI=your_mongodb_uri \
  -e JWT_SECRET=your_secret \
  hackgen-app
```

### 5. **VPS/Cloud Server**
```bash
# Build the application
npm run build:full

# Upload ./dist/ folder to your server
scp -r dist/ user@your-server:/path/to/app/

# On server:
cd /path/to/app/dist/
npm install --only=production
npm start
```

## 🔧 Production Configuration

### Environment Variables Required:
```env
# AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hackgen

# Security
JWT_SECRET=your_super_secret_jwt_key_here

# Server
PORT=5001
NODE_ENV=production
```

### Database Setup (MongoDB Atlas):
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string and add to `MONGO_URI`

## 🏃‍♂️ Running Production Build Locally

```bash
# After building
cd dist
npm install
npm start

# Visit http://localhost:5001
```

## 📁 What's in the dist/ folder?

```
dist/
├── server.js          # Production server (serves API + frontend)
├── package.json       # Production dependencies only
├── server/            # Backend code (routes, schemas, etc.)
│   ├── routes/
│   ├── schema/
│   └── config/
└── client/            # Built React frontend
    ├── index.html
    ├── assets/
    └── locales/
```

## 🎯 Key Benefits

✅ **Single Deployment** - One build contains everything  
✅ **No CORS Issues** - Frontend and backend served from same origin  
✅ **Simplified Hosting** - Deploy anywhere that supports Node.js  
✅ **Production Optimized** - Only runtime dependencies included  
✅ **Docker Ready** - Container-ready for cloud deployment  

## 🚨 Troubleshooting

### Build Issues:
```bash
# Clear node_modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build:full
```

### Server Issues:
- Check environment variables are set
- Verify MongoDB connection string
- Ensure port 5001 is available
- Check server logs for detailed errors

### Frontend Issues:
- Verify API calls point to correct endpoints
- Check browser console for errors
- Ensure static files are served correctly

---

**Need help?** Check the deployment logs and ensure all environment variables are properly configured.