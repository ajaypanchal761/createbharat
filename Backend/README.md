# CreateBharat Backend API

A comprehensive Node.js backend API for the CreateBharat platform, built with Express.js and MongoDB.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User, Admin, Mentor, Company)
  - Password hashing with bcrypt
  - Email and phone validation

- **User Management**
  - User registration and login
  - Profile management
  - Password change functionality
  - Admin user management

- **Security**
  - Helmet for security headers
  - CORS configuration
  - Input validation with express-validator
  - Error handling middleware

- **Database**
  - MongoDB with Mongoose ODM
  - User schema with comprehensive fields
  - Data validation and indexing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/createbharat
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:3000
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/change-password` | Change user password | Private |

### User Management Routes (`/api/users`) - Admin Only

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all users | Admin |
| GET | `/:id` | Get user by ID | Admin |
| PUT | `/:id` | Update user | Admin |
| DELETE | `/:id` | Delete user | Admin |
| PATCH | `/:id/deactivate` | Deactivate user | Admin |

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get User Profile (with JWT token)
```bash
GET /api/auth/me
Authorization: Bearer <jwt-token>
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/createbharat` |
| `JWT_SECRET` | JWT secret key | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## Project Structure

```
Backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   └── userController.js   # User-related controllers
├── middleware/
│   ├── auth.js            # Authentication middleware
│   ├── errorHandler.js    # Error handling middleware
│   └── notFound.js        # 404 handler
├── models/
│   └── User.js            # User model
├── routes/
│   ├── authRoutes.js      # Authentication routes
│   └── userRoutes.js      # User management routes
├── server.js              # Main server file
├── .env.example           # Environment variables example
└── package.json           # Dependencies and scripts
```

## Development

The server uses nodemon for development with hot reloading. Make sure to have MongoDB running locally or use a cloud MongoDB service.

## Security Notes

- Change the JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting for production
- Regularly update dependencies
- Use environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
