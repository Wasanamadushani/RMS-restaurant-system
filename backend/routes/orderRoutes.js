const express = require("express");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderStats,
  getRecentOrders
} = require("../controllers/orderController");

const router = express.Router();

// Create New Order
router.post("/", createOrder);

// Get All Orders
router.get("/", getOrders);

// Update Order Status
router.put("/:id", updateOrderStatus);

// Get Dashboard Statistics
router.get("/stats", getOrderStats);

// Get Recent Orders
router.get("/recent", getRecentOrders);

module.exports = router;