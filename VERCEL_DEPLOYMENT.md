# 🚀 Vercel Deployment Guide for Hackgen

## 🔧 Quick Deployment Steps

### 1. **Prepare Your Repository**
```bash
# Make sure all files are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. **Deploy to Vercel**

#### Option A: Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect settings
6. Add environment variables (see below)
7. Click "Deploy"

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

### 3. **Environment Variables** ⚠️ **CRITICAL**

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
GEMINI_API_KEY=your_google_gemini_api_key_here
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hackgen
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
NODE_ENV=production
```

### 4. **Database Setup (MongoDB Atlas)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster (free tier)
3. Create database user
4. Whitelist all IPs: `0.0.0.0/0`
5. Get connection string
6. Add to `MONGO_URI` in Vercel

## 🏗️ How It Works

### File Structure:
```
your-project/
├── api/
│   └── index.js           # Vercel serverless function (handles all /api/* routes)
├── dist/                  # Built React app (served as static files)
├── server/                # Your original Express routes
├── src/                   # React source (built to dist/)
└── vercel.json           # Vercel configuration
```

### Routing:
- `https://your-app.vercel.app/` → React app
- `https://your-app.vercel.app/api/*` → Serverless function
- `https://your-app.vercel.app/api/auth/login` → Your auth routes

## 🔍 Troubleshooting

### 404 Errors:
✅ **Check**: Environment variables are set in Vercel dashboard  
✅ **Check**: MongoDB connection string is correct  
✅ **Check**: API routes start with `/api/`  
✅ **Check**: Frontend calls use `/api/` prefix  

### Build Errors:
```bash
# Test build locally first
npm run build

# Check Vercel build logs in dashboard
```

### Database Connection Issues:
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string format
- Test connection string locally

### Environment Variable Issues:
- Variables must be set in Vercel dashboard, not in code
- Redeploy after adding new variables
- Check spelling and formatting

## 🎯 Testing Deployment

After deployment, test these URLs:

```
https://your-app.vercel.app/              # Frontend should load
https://your-app.vercel.app/api/health    # Should return health status
https://your-app.vercel.app/api/test      # Should return test message
```

## 🚨 Common Issues & Fixes

### Issue: "Module not found" errors
**Fix**: Make sure all dependencies are in `dependencies`, not `devDependencies`

### Issue: MongoDB connection timeout
**Fix**: 
- Check Atlas IP whitelist
- Verify connection string
- Check if cluster is paused

### Issue: CORS errors
**Fix**: Should not happen with this setup since API and frontend are same domain

### Issue: Login/Register still failing
**Fix**: 
- Check browser network tab for actual error
- Verify `/api/auth/login` endpoint responds
- Check Vercel function logs

## 📝 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] `/api/health` returns success
- [ ] Registration works
- [ ] Login works  
- [ ] Database operations work
- [ ] AI features work (check Gemini API key)

---

**🎉 Success!** Your app should now be live on Vercel with working authentication!