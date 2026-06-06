# API Testing Guide

This guide helps you test the Fruit Delivery API using curl or Postman.

## Setup

1. Start MongoDB:
```bash
mongod
```

2. Start the server:
```bash
npm run dev
```

The server should be running on `http://localhost:5000`

## Test Examples

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "555-1234"
  }'
```

Save the returned `token` for authenticated requests.

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Create an Admin User (Direct DB)
First, register and then use MongoDB to set role to admin:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### 4. Create a Product (Admin Only)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Fresh Mango",
    "description": "Delicious sweet mango from Philippines",
    "price": 7.99,
    "category": "tropical",
    "stock": 50,
    "origin": "Philippines"
  }'
```

### 5. Get All Products
```bash
curl http://localhost:5000/api/products
```

With filtering:
```bash
curl "http://localhost:5000/api/products?category=tropical&minPrice=5&maxPrice=10&page=1&limit=10"
```

### 6. Get Product by ID
```bash
curl http://localhost:5000/api/products/PRODUCT_ID
```

### 7. Create an Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "userId": "YOUR_USER_ID",
    "items": [
      {
        "productId": "PRODUCT_ID",
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
  }'
```

### 8. Get User's Orders
```bash
curl http://localhost:5000/api/orders/user/YOUR_USER_ID \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### 9. Get Order Details
```bash
curl http://localhost:5000/api/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### 10. Update Order Status (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "status": "shipped"
  }'
```

### 11. Update Payment Status (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "paymentStatus": "completed"
  }'
```

### 12. Get User Profile
```bash
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

### 13. Update User Profile
```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "name": "Jane Doe",
    "phone": "555-5678",
    "address": {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90001",
      "country": "USA"
    }
  }'
```

### 14. Change Password
```bash
curl -X POST http://localhost:5000/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

### 15. Get All Users (Admin Only)
```bash
curl "http://localhost:5000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 16. Update Product (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "price": 8.99,
    "stock": 40
  }'
```

### 17. Delete Product (Admin Only)
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 18. Health Check
```bash
curl http://localhost:5000/api/health
```

## Using Postman

Import this as a Postman environment:
```json
{
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:5000",
      "enabled": true
    },
    {
      "key": "user_token",
      "value": "{{token}}",
      "enabled": true
    },
    {
      "key": "admin_token",
      "value": "{{admin_token}}",
      "enabled": true
    }
  ]
}
```

Then use `{{base_url}}/api/products` in your Postman requests.

## Common Issues

1. **"MongoDB connection error"**: Make sure MongoDB is running
2. **"Invalid token"**: Check that the token is valid and not expired
3. **"Admin access required"**: Ensure your user has the admin role
4. **"Insufficient stock"**: Reduce the quantity or create more products

## Notes

- Tokens expire after 24 hours (configurable in .env)
- All timestamps are in UTC (ISO 8601 format)
- Passwords are hashed with bcryptjs (10 rounds)
- The API uses JWT Bearer token authentication
