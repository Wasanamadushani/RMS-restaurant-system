const express = require("express");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// Create New Order
router.post("/", createOrder);

// Get All Orders
router.get("/", getOrders);

// Update Order Status
router.put("/:id", updateOrderStatus);

module.exports = router;