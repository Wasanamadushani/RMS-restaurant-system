const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserStats,
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

// User Statistics
router.get("/stats", getUserStats);

// Block User
router.put("/block/:id", blockUser);

// Unblock User
router.put("/unblock/:id", unblockUser);

// Delete User
router.delete("/:id", deleteUser);

module.exports = router;