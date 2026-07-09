
const express = require("express");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderStats,
  getRecentOrders,
  getMyOrders,
  getOrderHistory,
  adminDeleteOrder,
  userDeleteOrder,
  approvePayment,
  rejectPayment,
  rateOrder
} = require("../controllers/orderController");

const uploadReceipt = require("../middleware/uploadReceipt");


const router = express.Router();

// IMPORTANT: Specific routes must come BEFORE parameterized routes

// Get Dashboard Statistics
router.get("/stats", getOrderStats);

// Get Recent Orders
router.get("/recent", getRecentOrders);

// Get My Orders
router.get("/my-orders/:userId", getMyOrders);

// Get Order History
router.get("/history/:userId", getOrderHistory);

// Get All Orders (Admin)
router.get("/", getOrders);

// Create New Order
router.post(
  "/",
  uploadReceipt.single("receipt"),
  createOrder
);

// Update Order Status
router.put("/:id", updateOrderStatus);

// Approve Payment
router.put("/:id/approve-payment", approvePayment);

// Reject Payment
router.put("/:id/reject-payment", rejectPayment);

// Rate Order
router.put("/rate/:id", rateOrder);

// Admin Delete Order
router.put("/admin-delete/:id", adminDeleteOrder);

// User Delete Order
router.put("/user-delete/:id", userDeleteOrder);

module.exports = router;