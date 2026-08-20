const express = require("express");
const { authenticateToken, requireRoles } = require("../middleware/authMiddleware");

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  updateKitchenStatus,
  getOrderStats,
  getRecentOrders,
  getMyOrders,
  getOrderHistory,
  adminDeleteOrder,
  userDeleteOrder,
  approvePayment,
  rejectPayment,
  rateOrder,
  saveKitchenNotes,
  cashReceived,
  verifyCash,
  // New workflow endpoints
  sendToCashier,
  confirmCOD,
  verifyOnlinePayment,
  kitchenAcceptOrder,
  kitchenMarkReady,
  sendToDelivery,
  deliveryAcceptOrder,
  deliveryMarkDelivered,
  deliveryMarkCashReceived,
  cashierConfirmCashPayment,
} = require("../controllers/orderController");

const uploadReceipt = require("../middleware/uploadReceipt");


const router = express.Router();

// IMPORTANT: Specific routes must come BEFORE parameterized routes

// ============== GET ROUTES (Specific first) ==============

// Get Dashboard Statistics
router.get("/stats", authenticateToken, requireRoles("admin"), getOrderStats);

// Get Recent Orders
router.get("/recent", authenticateToken, requireRoles("admin"), getRecentOrders);

// Get My Orders (uses :userId parameter, but different pattern)
router.get("/my-orders/:userId", authenticateToken, getMyOrders);

// Get Order History
router.get("/history/:userId", authenticateToken, getOrderHistory);

// Get All Orders (Admin)
router.get("/", authenticateToken, getOrders);

// ============== POST ROUTES ==============

// Create New Order
router.post(
  "/",
  uploadReceipt.single("receipt"),
  createOrder
);

// ============== PUT ROUTES (Specific patterns before :id) ==============

// WORKFLOW ROUTES - Admin Actions
router.put("/:id/send-to-cashier", authenticateToken, requireRoles("admin"), sendToCashier);
router.put("/:id/send-to-delivery", authenticateToken, requireRoles("admin"), sendToDelivery);

// WORKFLOW ROUTES - Cashier Actions
router.put("/:id/confirm-cod", authenticateToken, requireRoles("cashier"), confirmCOD);
router.put("/:id/verify-online-payment", authenticateToken, requireRoles("cashier"), verifyOnlinePayment);
router.put("/:id/cashier-confirm-cash", authenticateToken, requireRoles("cashier"), cashierConfirmCashPayment);

// WORKFLOW ROUTES - Kitchen Actions
router.put("/:id/kitchen-accept", authenticateToken, requireRoles("kitchen"), kitchenAcceptOrder);
router.put("/:id/kitchen-ready", authenticateToken, requireRoles("kitchen"), kitchenMarkReady);

// WORKFLOW ROUTES - Delivery Actions
router.put("/:id/delivery-accept", authenticateToken, requireRoles("delivery"), deliveryAcceptOrder);
router.put("/:id/delivery-delivered", authenticateToken, requireRoles("delivery"), deliveryMarkDelivered);
router.put("/:id/delivery-cash-received", authenticateToken, requireRoles("delivery"), deliveryMarkCashReceived);

// Approve Payment (specific route pattern)
router.put("/:id/approve-payment", authenticateToken, requireRoles("admin", "cashier"), approvePayment);

// Reject Payment (specific route pattern)
router.put("/:id/reject-payment", authenticateToken, requireRoles("admin", "cashier"), rejectPayment);

// Rate Order (specific route pattern)
router.put("/:id/rate", authenticateToken, rateOrder);

// Admin Delete Order (specific route pattern)
router.put("/:id/admin-delete", authenticateToken, requireRoles("admin"), adminDeleteOrder);

// User Delete Order (specific route pattern)
router.put("/:id/user-delete", authenticateToken, userDeleteOrder);

// Update Kitchen Status (specific route pattern)
router.put("/:id/kitchen", authenticateToken, requireRoles("kitchen"), updateKitchenStatus);

// Save Kitchen Notes (specific route pattern)
router.put(
  "/:id/kitchen-notes",
  authenticateToken,
  requireRoles("kitchen"),
  saveKitchenNotes
);

// Cash on Delivery - Delivery Staff receives cash
router.put(
  "/:id/cash-received",
  authenticateToken,
  requireRoles("delivery"),
  cashReceived
);

// Cash on Delivery - Cashier verifies cash
router.put(
  "/:id/verify-cash",
  authenticateToken,
  requireRoles("cashier"),
  verifyCash
);

// ============== Generic parameterized routes (MUST come last) ==============

// Update Order Status (General - used by delivery and admin)
router.put("/:id", authenticateToken, updateOrderStatus);

module.exports = router;