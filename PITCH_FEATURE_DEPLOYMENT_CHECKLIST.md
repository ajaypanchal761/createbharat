# Pitch Feature Deployment Checklist

## ✅ Code Status
All code files are created and ready for deployment:

### Backend Files Created:
- ✅ `Backend/models/pitch.js` - Pitch model
- ✅ `Backend/controllers/pitchController.js` - Pitch controller
- ✅ `Backend/routes/pitchRoutes.js` - User pitch routes
- ✅ `Backend/routes/adminPitchRoutes.js` - Admin pitch routes
- ✅ `Backend/utils/multer.js` - Updated with pitch document upload support
- ✅ `Backend/server.js` - Routes registered

### Frontend Files Created:
- ✅ `frontend/src/pages/Pitch/SubmitPitchPage.jsx` - Submit pitch page
- ✅ `frontend/src/pages/Admin/AdminPitchesPage.jsx` - Admin pitches management
- ✅ `frontend/src/utils/api.js` - API functions added
- ✅ `frontend/src/App.jsx` - Routes added
- ✅ `frontend/src/pages/AppDevelopment/AppDevelopmentPage.jsx` - "Submit Your Pitch" section added
- ✅ `frontend/src/pages/Profile/ProfilePage.jsx` - "My Pitch" section added
- ✅ `frontend/src/pages/Home/HomePage.jsx` - Navigation menu updated
- ✅ `frontend/src/components/admin/AdminSidebar.jsx` - Pitches menu item added

## 🚀 Deployment Steps

### 1. Backend Deployment

**Required Steps:**
1. **Commit all changes:**
   ```bash
   git add Backend/models/pitch.js
   git add Backend/controllers/pitchController.js
   git add Backend/routes/pitchRoutes.js
   git add Backend/routes/adminPitchRoutes.js
   git add Backend/utils/multer.js
   git add Backend/server.js
   git commit -m "Add pitch submission feature - backend"
   ```

2. **Push to repository:**
   ```bash
   git push origin master
   ```

3. **Deploy to production server:**
   - SSH into your production server
   - Navigate to backend directory
   - Pull latest changes: `git pull origin master`
   - Install dependencies (if needed): `npm install`
   - **Restart the server:**
     ```bash
     # If using PM2:
     pm2 restart createbharat-api
     
     # If using systemd:
     sudo systemctl restart createbharat-api
     
     # If running directly:
     # Stop current process and restart
     npm start
     ```

4. **Verify deployment:**
   - Check server logs for any errors
   - Test the route: `curl https://api.createbharat.com/api/admin/pitches` (should return 401 if not authenticated, not 404)

### 2. Frontend Deployment

**Required Steps:**
1. **Build frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy build files:**
   - Upload `dist/` folder contents to your hosting provider
   - Or deploy via your CI/CD pipeline

3. **Verify deployment:**
   - Check if admin pitches page loads
   - Test pitch submission flow

## 🔍 Verification Checklist

After deployment, verify:

- [ ] Backend server is running without errors
- [ ] Route `/api/admin/pitches` is accessible (returns 401, not 404)
- [ ] Route `/api/pitch/submit` is accessible
- [ ] Route `/api/pitch/my-pitches` is accessible
- [ ] Admin can access Pitches page in admin panel
- [ ] Users can submit pitches from `/pitch/submit`
- [ ] "Submit Your Pitch" appears in Development section
- [ ] "My Pitch" section appears in user profile
- [ ] File uploads work correctly (pitch deck, executive summary, financials)
- [ ] Admin can view, download, and update pitch status

## 🐛 Troubleshooting

### If route returns 404:
1. **Check server logs** for any startup errors
2. **Verify routes are registered** in server.js
3. **Ensure server was restarted** after code deployment
4. **Check route order** - more specific routes should come before generic ones

### If authentication fails:
1. **Verify admin token** is stored in localStorage
2. **Check token format** - should not be 'null' or 'undefined'
3. **Re-login** as admin to get fresh token

### If file upload fails:
1. **Check Cloudinary credentials** in .env
2. **Verify file size limits** (10MB max)
3. **Check multer configuration** for pitch documents

## 📝 Environment Variables Required

Ensure these are set in production:

```env
# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret
```

## 🎯 Quick Test Commands

After deployment, test these endpoints:

```bash
# Test admin pitches route (should return 401, not 404)
curl -X GET https://api.createbharat.com/api/admin/pitches

# Test user pitches route (should return 401, not 404)
curl -X GET https://api.createbharat.com/api/pitch/my-pitches \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ⚠️ Important Notes

1. **Server Restart Required**: The backend server MUST be restarted after deploying new routes
2. **Database Migration**: The Pitch model will be created automatically on first use (no migration needed)
3. **File Storage**: Ensure Cloudinary is configured correctly for document uploads
4. **Route Order**: The route `/api/admin/pitches` is registered correctly and should work after restart

---

**Current Issue**: Production server at `https://api.createbharat.com` needs to be updated with the new code and restarted.

