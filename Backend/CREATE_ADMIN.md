# Create Admin User

This guide will help you create an initial admin user for the CreateBharat backend.

## Default Admin Credentials

- **Email**: admin@createbharat.com
- **Password**: admin123
- **Username**: admin
- **Role**: super_admin

## Methods to Create Admin

### Method 1: Using Node.js Script (Recommended)

Run the following command from the Backend directory:

```bash
node create-admin.js
```

### Method 2: Using PowerShell (Windows)

From the Backend directory, run:

```powershell
node create-admin.js
```

### Method 3: Using cURL

**On Windows PowerShell:**
```powershell
curl -X POST http://localhost:5000/api/admin/login -H "Content-Type: application/json" -d '{\"email\":\"admin@createbharat.com\",\"password\":\"admin123\"}'
```

**On Linux/Mac:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@createbharat.com","password":"admin123"}'
```

**Note**: Before using this method, you need to run the create-admin.js script first to create the admin user in the database.

## Steps to Setup Admin

1. **Navigate to Backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies (if not done already):**
   ```bash
   npm install
   ```

3. **Ensure your MongoDB connection is configured in `.env` file**

4. **Run the create admin script:**
   ```bash
   node create-admin.js
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Testing the Admin Login

### Using PowerShell (Windows)
```powershell
$body = @{
    email = "admin@createbharat.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Using cURL (Cross-platform)
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@createbharat.com\",\"password\":\"admin123\"}"
```

### Expected Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "...",
      "username": "admin",
      "email": "admin@createbharat.com",
      "fullName": "Super Admin",
      "role": "super_admin",
      ...
    },
    "token": "jwt-token-here"
  }
}
```

## Security Notes

⚠️ **IMPORTANT**: Change the default password after first login in production!

The default admin credentials are only for development. For production:
1. Change the password immediately after first login
2. Consider implementing 2FA
3. Use strong, unique passwords
4. Regularly rotate admin credentials

## Troubleshooting

### Error: "Admin already exists"
- This means the admin user is already created
- You can either use the existing credentials or reset the password

### Error: "MongoDB connection failed"
- Check your MongoDB connection string in `.env` file
- Ensure MongoDB is running
- Verify network connectivity

### Error: "Cannot connect to server"
- Make sure the backend server is running
- Check if the port 5000 is available
- Verify CORS settings

## Admin API Endpoints

- `POST /api/admin/login` - Login as admin
- `GET /api/admin/me` - Get current admin profile (protected)
- `PUT /api/admin/profile` - Update admin profile (protected)
- `PUT /api/admin/change-password` - Change password (protected)
- `GET /api/admin` - Get all admins (super_admin only)
- `POST /api/admin/create` - Create new admin (super_admin only)
- `PUT /api/admin/:id` - Update admin (super_admin only)
- `DELETE /api/admin/:id` - Delete admin (super_admin only)

