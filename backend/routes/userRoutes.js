const express = require("express");
const router = express.Router();
const { authenticateToken, requireRoles } = require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  getAllUsers,
  getStaffUsers,
  getUserStats,
  createStaff,
  updateStaff,
  resetStaffPassword,
  blockUser,
  unblockUser,
  deleteUser,
} = require("../controllers/userController");

// ===============================
// Authentication
// ===============================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ===============================
// User Management (Admin)
// ===============================

// Get All Users
router.get("/", authenticateToken, requireRoles("admin"), getAllUsers);

// Get Staff Users
router.get("/staff", authenticateToken, requireRoles("admin"), getStaffUsers);

// User Statistics
router.get("/stats", authenticateToken, requireRoles("admin"), getUserStats);

// Create Staff
router.post("/staff", authenticateToken, requireRoles("admin"), createStaff);

// Update Staff
router.put("/staff/:id", authenticateToken, requireRoles("admin"), updateStaff);

// Reset Staff Password
router.put("/staff/:id/reset-password", authenticateToken, requireRoles("admin"), resetStaffPassword);

// Block User
router.put("/block/:id", authenticateToken, requireRoles("admin"), blockUser);

// Unblock User
router.put("/unblock/:id", authenticateToken, requireRoles("admin"), unblockUser);

// Delete User
router.delete("/:id", authenticateToken, requireRoles("admin"), deleteUser);

module.exports = router;