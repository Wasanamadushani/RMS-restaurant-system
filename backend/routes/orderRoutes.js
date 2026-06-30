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
  
} = require("../controllers/orderController");

const router = express.Router();

// Create New Order
router.post("/", createOrder);

// Get All Orders
router.get("/", getOrders);



// Update Order Status
router.put("/:id", updateOrderStatus);

// Delete Order
// router.delete("/:id", deleteOrder);
router.put("/admin-delete/:id", adminDeleteOrder);

router.put("/user-delete/:id", userDeleteOrder);

// Get Dashboard Statistics
router.get("/stats", getOrderStats);

// Get Recent Orders
router.get("/recent", getRecentOrders);

router.get("/my-orders/:userId", getMyOrders);

router.get("/history/:userId", getOrderHistory);

module.exports = router;