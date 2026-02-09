# LocalMart 🏪

A platform where local shops list products and customers buy from nearby shops (within 200 meters).

## What We Built So Far

### ✅ Backend API Complete
- **User Authentication** (Register & Login)
- **Shop Registration** (for shop owners only)
- **Nearby Shop Search** (find shops within 200 meters)
- **Database Models** (Users & Shops)

## How to Run This Project

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your computer:
```bash
# If you have MongoDB installed
mongod
```

### Step 3: Start the Server
```bash
npm run server
```

The server will run on: http://localhost:5000

## API Endpoints (What We Can Do)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Shops
- `POST /api/shops/register` - Register new shop (shop owners only)
- `GET /api/shops/nearby?lat=X&lng=Y` - Find shops within 200 meters
- `GET /api/shops/` - Get all shops
- `GET /api/shops/:id` - Get specific shop

## How to Test

### 1. Register a Shop Owner
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Shop Owner",
    "email": "john@shop.com",
    "password": "123456",
    "phone": "9876543210",
    "role": "shop_owner",
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  }'
```

### 2. Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@shop.com",
    "password": "123456"
  }'
```

### 3. Register a Shop (use the token from login)
```bash
curl -X POST http://localhost:5000/api/shops/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Fresh Vegetables Store",
    "description": "Fresh organic vegetables and fruits",
    "category": "grocery",
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "address": {
      "street": "123 Main Street",
      "area": "Koramangala",
      "city": "Bangalore",
      "pincode": "560034"
    },
    "contact": {
      "phone": "9876543210",
      "email": "fresh@shop.com"
    },
    "timings": {
      "open": "09:00",
      "close": "21:00"
    }
  }'
```

### 4. Find Nearby Shops
```bash
curl "http://localhost:5000/api/shops/nearby?lat=12.9716&lng=77.5946"
```

## Next Steps (What We'll Build Next)

1. **Frontend (React App)** - User interface for customers and shop owners
2. **Product Management** - Add/edit/delete products for shops
3. **Order System** - Customers can place orders
4. **Payment Integration** - Online payments
5. **Real-time Notifications** - Order status updates
6. **Mobile App** - Native mobile experience

## Project Structure

```
localmart/
├── server/
│   ├── index.js          # Main server file
│   ├── models/           # Database models
│   │   ├── User.js       # User schema
│   │   └── Shop.js       # Shop schema
│   └── routes/           # API routes
│       ├── auth.js       # Authentication routes
│       └── shops.js      # Shop routes
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── README.md            # This file
```

## Technologies Used

- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - Database modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing

Happy Coding! 🚀
