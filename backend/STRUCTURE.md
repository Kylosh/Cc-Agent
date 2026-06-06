// Backend Project Structure

backend/
├── config/
│   └── database.js                 # MongoDB connection configuration
├── middleware/
│   └── auth.js                     # JWT authentication middleware
├── models/
│   ├── Product.js                  # Product schema
│   ├── Order.js                    # Order schema
│   └── User.js                     # User schema
├── routes/
│   ├── products.js                 # Product routes (GET, POST, PUT, DELETE)
│   ├── orders.js                   # Order routes (GET, POST, PUT, DELETE)
│   └── users.js                    # User routes (register, login, profile, etc)
├── server.js                       # Express app entry point
├── package.json                    # Dependencies and scripts
├── .env.example                    # Environment variables template
├── README.md                       # API documentation
└── API_TESTING.md                  # Testing guide

## Key Features Implemented

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (user/admin)
- Password hashing with bcryptjs
- Token expiration (configurable)

### Products Management
- List products with pagination
- Filter by category, price range, search term
- Create/Update/Delete products (admin only)
- Product ratings and reviews

### Orders Management
- Create orders with multiple items
- Automatic stock management
- Order status tracking
- Payment status tracking
- Order history for users
- List all orders (admin)

### User Management
- User registration and login
- Profile management
- Password change functionality
- User listing and management (admin)
- Account activation/deactivation

### API Features
- RESTful design with proper HTTP methods
- Consistent error handling
- Pagination support
- Input validation
- Request/response formatting
- CORS support
- Environment-based configuration

## Installation & Setup

1. Install dependencies:
   npm install

2. Create .env file:
   cp .env.example .env

3. Configure MongoDB connection in .env

4. Start server:
   npm run dev (development)
   npm start (production)

## Database Models Summary

Product Model:
- name, description, price, category
- stock, image, rating, reviews
- origin, active status, timestamps

Order Model:
- userId (reference to User)
- items array (product references + quantity)
- totalAmount, status, paymentStatus
- shippingAddress, paymentMethod
- timestamps, delivery date

User Model:
- name, email, password
- phone, address
- role (user/admin), isActive status
- timestamps, password hashing with pre-save hook

## API Response Format

Success Response:
{
  "data": {...},
  "message": "Success message",
  "pagination": {...}
}

Error Response:
{
  "error": "Error type",
  "message": "Detailed error description",
  "status": 400
}

## Security Features

- Password hashing with bcryptjs (10 rounds)
- JWT token authentication
- Role-based authorization
- Input validation on all models
- MongoDB injection prevention via Mongoose
- CORS configuration
- Environment variable protection
- Secure password comparison

## Ready for Production

The backend is structured and includes:
- Proper error handling
- Database connection management
- Authentication/authorization
- Input validation
- Comprehensive documentation
- API testing guide
- Environment configuration
- RESTful API design
- Pagination support
- Status codes and response formatting
