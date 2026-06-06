# Fruit Delivery API Documentation

## Overview
This is a RESTful API backend for a fruit delivery website built with Node.js, Express, and MongoDB.

## Tech Stack
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration

4. Start the server:
```bash
npm start          # Production mode
npm run dev        # Development mode with auto-reload
```

## API Endpoints

### Products

#### GET /api/products
Retrieve all products with optional filtering and pagination.

Query Parameters:
- `category` (optional): Filter by category
- `minPrice` (optional): Filter by minimum price
- `maxPrice` (optional): Filter by maximum price
- `search` (optional): Search by product name
- `page` (default: 1): Page number for pagination
- `limit` (default: 10): Items per page

Response:
```json
{
  "data": [...products],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

#### GET /api/products/:id
Retrieve a specific product by ID.

Response:
```json
{
  "_id": "...",
  "name": "Apple",
  "description": "Fresh red apples",
  "price": 5.99,
  "category": "citrus",
  "stock": 100,
  "rating": 4.5,
  "reviews": 25,
  "image": "...",
  "createdAt": "2026-06-06T...",
  "updatedAt": "2026-06-06T..."
}
```

#### POST /api/products (Admin Only)
Create a new product.

Request:
```json
{
  "name": "Mango",
  "description": "Sweet tropical mango",
  "price": 7.99,
  "category": "tropical",
  "stock": 50,
  "image": "...",
  "origin": "Philippines"
}
```

#### PUT /api/products/:id (Admin Only)
Update a product.

#### DELETE /api/products/:id (Admin Only)
Delete a product.

---

### Orders

#### POST /api/orders (Authenticated)
Create a new order.

Request:
```json
{
  "userId": "user_id",
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card",
  "notes": "Please deliver after 5pm"
}
```

#### GET /api/orders (Admin Only)
Retrieve all orders with pagination.

Query Parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `status` (optional): Filter by order status

#### GET /api/orders/user/:userId (Authenticated)
Retrieve orders for a specific user.

#### GET /api/orders/:id (Authenticated)
Retrieve a specific order by ID.

#### PUT /api/orders/:id/status (Admin Only)
Update order status.

Request:
```json
{
  "status": "processing"
}
```

Valid statuses: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

#### PUT /api/orders/:id/payment (Admin Only)
Update payment status.

Request:
```json
{
  "paymentStatus": "completed"
}
```

Valid statuses: `pending`, `completed`, `failed`

#### DELETE /api/orders/:id (Admin Only)
Delete an order.

---

### Users

#### POST /api/users/register
Register a new user.

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "555-1234"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "role": "user"
  },
  "token": "eyJhbGc..."
}
```

#### POST /api/users/login
Login user.

Request:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: Same as register

#### GET /api/users/profile (Authenticated)
Get current user profile.

#### PUT /api/users/profile (Authenticated)
Update current user profile.

Request:
```json
{
  "name": "John Smith",
  "phone": "555-5678",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

#### POST /api/users/change-password (Authenticated)
Change user password.

Request:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

#### GET /api/users (Admin Only)
Get all users with pagination.

#### GET /api/users/:id (Admin Only)
Get specific user by ID.

#### PUT /api/users/:id (Admin Only)
Update user by ID (admin).

#### DELETE /api/users/:id (Admin Only)
Delete user.

---

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Error Handling

The API returns error responses in the following format:

```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "status": 400
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Database Models

### Product
- name (required, string)
- description (string)
- price (required, number)
- category (required, enum)
- stock (required, number)
- image (string)
- rating (number, 0-5)
- reviews (number)
- origin (string)
- active (boolean)
- createdAt (date)
- updatedAt (date)

### Order
- userId (required, ObjectId ref)
- items (array of product orders)
- totalAmount (required, number)
- status (enum: pending, processing, shipped, delivered, cancelled)
- shippingAddress (object)
- paymentMethod (required, enum)
- paymentStatus (enum: pending, completed, failed)
- notes (string)
- createdAt (date)
- updatedAt (date)
- deliveredAt (date)

### User
- name (required, string)
- email (required, unique string)
- password (required, hashed string)
- phone (string)
- address (object)
- role (enum: user, admin)
- isActive (boolean)
- createdAt (date)
- updatedAt (date)

---

## Environment Variables

See `.env.example` for all available configuration options.

---

## Development

For development with auto-reload:
```bash
npm run dev
```

This uses nodemon to watch for file changes.

---

## License

ISC
