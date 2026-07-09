# 🚀 Quick Start Guide

This guide will help you get the Restaurant Management System up and running quickly.

## Prerequisites Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step 1: Check MongoDB Status

### Windows
```bash
# Check if MongoDB service is running
net start | findstr MongoDB

# If not running, start it
net start MongoDB
```

### Linux/Mac
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# If not running, start it
sudo systemctl start mongod
```

## Step 2: Clone & Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo MONGO_URI=mongodb://localhost:27017/restaurant_db > .env
echo PORT=5000 >> .env

# Start the server
npm start
```

**Expected Output:**
```
Server running on port 5000
MongoDB Connected
```

## Step 3: Setup Frontend (New Terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

## Step 4: Create Admin Account

1. Open browser: `http://localhost:3000`
2. Click **Register**
3. Create account with email: `admin@restaurant.com`
4. **Important**: Manually set role to "admin" in MongoDB

### Set Admin Role in MongoDB

```bash
# Open MongoDB shell
mongosh

# Use the database
use restaurant_db

# Update user role to admin
db.users.updateOne(
  { email: "admin@restaurant.com" },
  { $set: { role: "admin" } }
)
```

## Step 5: Test the System

### As Customer
1. Register a new customer account
2. Browse menu
3. Add items to cart
4. Complete checkout
5. Track order
6. Review delivered order

### As Admin
1. Login with admin account
2. Go to `/admin/dashboard`
3. Add food items
4. Manage orders
5. Approve payments
6. View reviews

## Common Issues & Solutions

### Issue: MongoDB Connection Error
**Solution:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# Windows: net start MongoDB
# Linux/Mac: sudo systemctl start mongod
```

### Issue: Port Already in Use
**Solution:**
```bash
# Backend (Port 5000)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Frontend (Port 3000)
# Similar commands with port 3000
```

### Issue: Module Not Found
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS Error
**Solution:**
Make sure backend is running on port 5000 and CORS is enabled in `server.js`:
```javascript
app.use(cors());
```

## Default Test Data

### Test Customer Account
- **Email**: customer@test.com
- **Password**: password123

### Test Admin Account (After manual setup)
- **Email**: admin@restaurant.com
- **Password**: admin123

### Bank Transfer Details (For Testing)
- **Bank**: Commercial Bank
- **Account Name**: FoodieHub Restaurant
- **Account Number**: 1234567890
- **Branch**: Colombo

## API Testing with Postman/Thunder Client

### Register User
```
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get All Foods
```
GET http://localhost:5000/api/foods
```

### Create Food (Admin)
```
POST http://localhost:5000/api/foods
Content-Type: multipart/form-data

name: Pizza Margherita
category: Pizza
description: Classic Italian pizza
price: 1200
image: [Select file]
```

### Get All Orders (Admin)
```
GET http://localhost:5000/api/orders
```

### Get All Reviews (Admin)
```
GET http://localhost:5000/api/reviews
```

## Directory Structure Quick Reference

```
├── backend/
│   ├── controllers/      # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Upload middleware
│   ├── uploads/         # Uploaded files
│   ├── .env            # Environment variables
│   └── server.js       # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context API
│   │   ├── services/    # API services
│   │   ├── App.js       # Main app component
│   │   └── App.css      # Global styles
│   └── public/          # Static files
```

## URLs Quick Reference

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Menu**: http://localhost:3000/menu
- **Cart**: http://localhost:3000/cart
- **My Orders**: http://localhost:3000/my-orders
- **Order History**: http://localhost:3000/order-history

## Feature Checklist

### Customer Features
- [ ] Register/Login
- [ ] Browse menu with search
- [ ] Filter by category
- [ ] Add to cart
- [ ] Checkout
- [ ] Cash on Delivery
- [ ] Bank Transfer with receipt
- [ ] Track orders
- [ ] View order history
- [ ] Download invoices
- [ ] Submit reviews
- [ ] View ratings

### Admin Features
- [ ] Login to admin panel
- [ ] View dashboard statistics
- [ ] Add food items
- [ ] Edit food items
- [ ] Delete food items
- [ ] View all orders
- [ ] Update order status
- [ ] Approve payments
- [ ] Reject payments
- [ ] View receipts
- [ ] Manage reviews
- [ ] Delete reviews

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Automatically refreshes on save
- Backend: Use `npm run dev` for nodemon hot reload

### Debugging
```bash
# Backend logs
console.log statements appear in backend terminal

# Frontend logs
Open browser DevTools (F12) → Console tab
```

### Database Inspection
```bash
# Open MongoDB Compass (GUI)
# Connection string: mongodb://localhost:27017

# Or use MongoDB shell
mongosh
use restaurant_db
db.orders.find().pretty()
db.foods.find().pretty()
db.reviews.find().pretty()
```

## Deployment Checklist

- [ ] Update MONGO_URI for production database
- [ ] Update API base URL in frontend
- [ ] Set NODE_ENV=production
- [ ] Configure file upload storage (AWS S3/Cloudinary)
- [ ] Enable HTTPS
- [ ] Set up environment variables on hosting platform
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Enable error logging (e.g., Sentry)
- [ ] Optimize images
- [ ] Minify frontend build
- [ ] Set up CDN for static assets

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review FIXES_SUMMARY.md for known issues
3. Check MongoDB and Node.js logs
4. Verify all dependencies are installed
5. Ensure correct Node.js and MongoDB versions

---

**Ready to go!** 🎉

Start with Step 1 and follow through Step 5. Happy coding!
