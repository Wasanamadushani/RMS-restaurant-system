const express = require("express");
const router = express.Router();

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
router.get("/", getAllUsers);

// Get Staff Users
router.get("/staff", getStaffUsers);

// User Statistics
router.get("/stats", getUserStats);

// Create Staff
router.post("/staff", createStaff);

// Update Staff
router.put("/staff/:id", updateStaff);

// Reset Staff Password
router.put("/staff/:id/reset-password", resetStaffPassword);

// Block User
router.put("/block/:id", blockUser);

// Unblock User
router.put("/unblock/:id", unblockUser);

// Delete User
router.delete("/:id", deleteUser);

module.exports = router;