# 🚀 Local Mart - Render.com Deployment Guide

## 📋 Prerequisites
- Render.com account
- GitHub repository
- MongoDB Atlas account (for database)

---

## 🔧 Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Local Mart with language toggle"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/localmart.git
git push -u origin main
```

---

## 🔧 Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist your IP (or use 0.0.0.0/0 for all IPs)

---

## 🔧 Step 3: Deploy to Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +" → "Web Service"**
3. **Connect GitHub**: Connect your repository
4. **Configure Service**:
   - **Name**: localmart-api
   - **Environment**: Node
   - **Root Directory**: server
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_here
   PORT=10000
   ```

6. **Create Database Service**:
   - **Click "New +" → "MongoDB"**
   - **Name**: localmart-db
   - **Plan**: Free

7. **Create Frontend Service**:
   - **Click "New +" → "Web Service"**
   - **Name**: localmart-client
   - **Environment**: Static Site
   - **Root Directory**: client-new
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: client-new/build
   - **Add Environment Variable**: `REACT_APP_API_URL=https://your-api-url.onrender.com`

### Option B: Using render.yaml

1. Push the `render.yaml` file to your repository root
2. In Render Dashboard, click "New +" → "Web Service"
3. Select "Connect existing repository"
4. Choose your repository
5. Render will automatically detect and use `render.yaml`

---

## 🔧 Step 4: Update Frontend API URL

After deployment, update your frontend to use the correct API URL:

In `client-new/src/App.tsx`, update any hardcoded URLs:
```typescript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';
```

---

## 🔧 Step 5: Test Your Deployment

1. **API Health Check**: Visit `https://your-api-url.onrender.com/health`
2. **Frontend**: Visit `https://your-client-url.onrender.com`
3. **Test Features**:
   - Language toggle (Hindi/English)
   - Add items to cart
   - Checkout process
   - User authentication

---

## 🔧 Step 6: Custom Domain (Optional)

1. In Render Dashboard, go to your service settings
2. Click "Custom Domains"
3. Add your domain: `yourdomain.com`
4. Update DNS records as instructed by Render

---

## 🔧 Environment Variables Reference

### Backend Service:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/localmart
JWT_SECRET=your_super_secret_random_string
PORT=10000
```

### Frontend Service:
```
REACT_APP_API_URL=https://your-api-url.onrender.com
```

---

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check `package.json` scripts
   - Verify all dependencies are in `package.json`

2. **Database Connection Fails**:
   - Verify MongoDB Atlas connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has correct permissions

3. **CORS Issues**:
   - Verify `REACT_APP_API_URL` is correct
   - Check CORS settings in server

4. **Language Toggle Not Working**:
   - Ensure `t()` function is properly defined
   - Check that all `language === 'hindi'` are replaced with `t('key')`

---

## 🔧 Monitoring

- **Render Dashboard**: Monitor logs and metrics
- **MongoDB Atlas**: Monitor database performance
- **Health Check**: `https://your-api-url.onrender.com/health`

---

## 🎉 Success!

Your Local Mart application should now be live on Render.com with:
- ✅ Language toggle (Hindi/English)
- ✅ Full e-commerce functionality
- ✅ MongoDB database
- ✅ User authentication
- ✅ Cart and checkout system

For support, check Render logs and MongoDB Atlas monitoring.
