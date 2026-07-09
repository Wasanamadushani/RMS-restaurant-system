# Restaurant Management System (RMS)

A full-stack MERN (MongoDB + Express + React + Node.js) Restaurant Management System with advanced features including order management, payment processing, reviews, and admin dashboard.

## 🚀 Features

### Customer Features
- ✅ User Authentication (Register/Login)
- ✅ Browse Menu with Search & Filter by Category
- ✅ View Food Details with Ratings & Reviews
- ✅ Shopping Cart Management
- ✅ Checkout with Multiple Payment Methods
  - Cash on Delivery
  - Bank Transfer with Receipt Upload
- ✅ Real-time Order Tracking
- ✅ Order History
- ✅ Download PDF Invoices
- ✅ Review & Rate Delivered Orders
- ✅ View Average Ratings & Customer Reviews

### Admin Features
- ✅ Admin Dashboard with Statistics
  - Total Orders
  - Total Revenue
  - Pending Orders
  - Recent Orders
- ✅ Food Management (CRUD Operations)
- ✅ Order Management
  - Update Order Status (Pending → Preparing → Out for Delivery → Delivered)
  - Approve/Reject Bank Transfer Payments
  - View Receipt Images
- ✅ Review Management
  - View All Customer Reviews
  - Delete Inappropriate Reviews
  - See Customer Details & Ratings
  - Filter Reviews by Food, Customer, or Comment

## 🛠️ Tech Stack

### Frontend
- **React** - UI Library
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Context API** - State Management
- **React Toastify** - Notifications
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File Upload Middleware
- **PDFKit** - PDF Generation
- **dotenv** - Environment Variables
- **CORS** - Cross-Origin Resource Sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
MONGO_URI=mongodb://localhost:27017/restaurant_db
PORT=5000
```

4. Start backend server:
```bash
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
restaurant-management-system/
├── backend/
│   ├── controllers/
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   ├── userController.js
│   │   └── invoiceController.js
│   ├── models/
│   │   ├── Food.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   └── invoiceRoutes.js
│   ├── middleware/
│   │   ├── uploadMiddleware.js
│   │   └── uploadReceipt.js
│   ├── uploads/
│   │   └── receipts/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FoodCard.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   └── AdminSidebar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── MyOrders.jsx
│   │   │   ├── OrderHistory.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminReviews.jsx
│   │   │   └── ManageFoods.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🔧 Recent Fixes & Improvements

### Backend Fixes

1. **Order Items Storage**
   - Fixed empty items array issue in MongoDB
   - Added proper JSON parsing with error handling
   - Added validation to ensure orders contain at least one item
   - Improved logging for debugging

2. **Review System**
   - Fixed food ID undefined issue
   - Added validation: Only delivered orders can be reviewed
   - Implemented one review per order policy
   - Automatic order marking as `reviewed: true`
   - Automatic food rating updates (average & total count)

3. **Food Model Enhancement**
   - Added `averageRating` field (auto-updated)
   - Added `totalReviews` field (auto-updated)

4. **Review Controller**
   - `addReview`: Validates order status, prevents duplicates, updates food ratings
   - `getAllReviews`: New endpoint for admin to view all reviews with populated data
   - `deleteReview`: Recalculates food ratings after deletion
   - `getAverageRating`: Returns rating stats and latest reviews
   - `getFoodReviews`: Returns all reviews for a specific food

### Frontend Fixes

1. **Order History Page**
   - Fixed review submission with proper food ID extraction
   - Added better error messages
   - Improved validation logic
   - Added visual feedback for reviewed orders

2. **Menu Page**
   - Displays average rating and review count for each food
   - Shows rating stars in food cards
   - Modal shows detailed rating information
   - Lists latest customer reviews in modal

3. **Admin Review Management (NEW)**
   - Complete review management interface
   - View all reviews with customer details
   - Delete inappropriate reviews
   - Search/filter functionality
   - Statistics: Total reviews & average rating
   - Star rating visualization
   - Responsive table design

4. **UI/UX Improvements**
   - Modern card designs with hover effects
   - Professional color scheme
   - Responsive layouts for all screen sizes
   - Loading states and animations
   - Empty state messages
   - Better spacing and typography
   - Improved form styling
   - Payment status badges
   - Order status badges with color coding

## 🎯 API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/stats` - Get dashboard statistics
- `GET /api/orders/recent` - Get recent orders
- `GET /api/orders/my-orders/:userId` - Get user's active orders
- `GET /api/orders/history/:userId` - Get user's delivered orders
- `PUT /api/orders/:id/approve-payment` - Approve payment
- `PUT /api/orders/:id/reject-payment` - Reject payment
- `PUT /api/orders/admin-delete/:id` - Admin delete order
- `PUT /api/orders/user-delete/:id` - User delete order

### Reviews
- `POST /api/reviews` - Add review
- `GET /api/reviews` - Get all reviews (Admin)
- `GET /api/reviews/food/:foodId` - Get reviews by food
- `GET /api/reviews/rating/:foodId` - Get average rating
- `DELETE /api/reviews/:id` - Delete review (Admin)

### Foods
- `POST /api/foods` - Create food (with image upload)
- `GET /api/foods` - Get all foods
- `PUT /api/foods/:id` - Update food
- `DELETE /api/foods/:id` - Delete food

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Invoice
- `GET /api/invoice/:id` - Download PDF invoice

## 🔐 User Roles

### Customer
- Browse and order food
- Manage cart
- Track orders
- Review delivered orders
- Download invoices

### Admin
- Manage foods (Add/Edit/Delete)
- Manage orders
- Approve/Reject payments
- View all reviews
- Delete reviews
- View statistics

## 📝 Usage Guide

### For Customers

1. **Register/Login**
   - Create an account or login with existing credentials

2. **Browse Menu**
   - Use search bar to find specific foods
   - Filter by category (Pizza, Burger, Pasta, etc.)
   - View ratings and reviews
   - Click on food card to see details

3. **Order Food**
   - Add items to cart
   - Proceed to checkout
   - Fill in delivery details
   - Choose payment method:
     - **Cash on Delivery**: Order will be pending until delivered
     - **Bank Transfer**: Upload payment receipt for admin approval

4. **Track Orders**
   - View active orders in "My Orders"
   - Check order status (Pending → Preparing → Out for Delivery → Delivered)
   - View payment status

5. **Review Orders**
   - After delivery, go to "Order History"
   - Select rating (1-5 stars)
   - Write review comment
   - Submit review (one per order)

6. **Download Invoice**
   - Available in Order History
   - PDF format with all order details

### For Admins

1. **Access Admin Panel**
   - Login with admin credentials
   - Navigate to `/admin/dashboard`

2. **Dashboard**
   - View total orders
   - Check total revenue
   - Monitor pending orders
   - See recent orders

3. **Manage Foods**
   - Add new food items with image
   - Edit existing foods
   - Delete foods
   - Set categories and prices

4. **Manage Orders**
   - View all orders in table format
   - Update order status using dropdown
   - Approve/Reject bank transfer payments
   - View payment receipts
   - Delete orders from dashboard

5. **Manage Reviews**
   - View all customer reviews
   - See customer names and email
   - Check ratings and comments
   - Delete inappropriate reviews
   - Search/filter reviews

## 🐛 Known Issues & Solutions

### Issue: Items array empty in MongoDB
**Solution**: Already fixed. Items are now properly parsed from FormData and validated before saving.

### Issue: Food ID undefined in reviews
**Solution**: Already fixed. Properly extracts food ID from order items with validation.

### Issue: Multiple reviews per order
**Solution**: Already fixed. Added database index and validation to prevent duplicate reviews.

## 🚧 Future Enhancements

- [ ] Email notifications for order status
- [ ] Push notifications
- [ ] Multi-item reviews (review each food separately)
- [ ] Customer profile management
- [ ] Advanced analytics dashboard
- [ ] Order scheduling
- [ ] Promo codes and discounts
- [ ] Multiple delivery addresses
- [ ] Wishlist functionality
- [ ] Social media integration

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Developer

Built with ❤️ using MERN Stack

## 🙏 Acknowledgments

- React team for amazing documentation
- MongoDB for excellent database solution
- Express.js community
- All open-source contributors

---

**Note**: Make sure MongoDB is running before starting the backend server. Update the `MONGO_URI` in your `.env` file with your MongoDB connection string.
