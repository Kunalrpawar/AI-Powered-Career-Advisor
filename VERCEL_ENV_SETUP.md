# 🚨 CRITICAL: Vercel Environment Variables Setup

## Required Environment Variables for career-manzil.vercel.app

### 1. MongoDB Connection
```
Variable Name: MONGO_URI
Value: mongodb+srv://username:password@cluster.mongodb.net/hackgen
Environment: Production, Preview, Development
```

### 2. Google Gemini AI
```
Variable Name: GEMINI_API_KEY  
Value: AIza... (your Google AI Studio API key)
Environment: Production, Preview, Development
```

### 3. JWT Secret
```
Variable Name: JWT_SECRET
Value: hackgen_super_secret_jwt_key_2024_production_deployment_minimum_32_chars
Environment: Production, Preview, Development
```

### 4. Node Environment
```
Variable Name: NODE_ENV
Value: production
Environment: Production only
```

## How to Set in Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project: `career-manzil`
3. Go to Settings → Environment Variables
4. Add each variable above
5. **IMPORTANT**: Select all environments (Production, Preview, Development)
6. Click "Save"
7. **Redeploy** your project

## MongoDB Atlas Setup (if not done):

1. Go to https://cloud.mongodb.com/
2. Create free cluster
3. Database Access → Add user (username/password)
4. Network Access → Add IP: `0.0.0.0/0` (allow all)
5. Connect → Get connection string
6. Replace `<password>` with your actual password
7. Add `/hackgen` at the end for database name

Example final URI:
```
mongodb+srv://kunal:mypassword123@cluster0.abc123.mongodb.net/hackgen
```

## Gemini API Key Setup:

1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Copy the key (starts with `AIza...`)
4. Add to Vercel environment variables

## Test After Setup:

1. Visit: https://career-manzil.vercel.app/api/health
2. Should show: `{"status":"healthy","mongodb":true,"geminiConfigured":true}`
3. Try login/registration on your app

## Troubleshooting:

- **500 errors**: Check MongoDB connection string
- **Login fails**: Verify JWT_SECRET is set
- **AI features broken**: Check GEMINI_API_KEY
- **CORS errors**: Should be fixed with new API setup

---

**After setting all 4 environment variables, redeploy your project!**