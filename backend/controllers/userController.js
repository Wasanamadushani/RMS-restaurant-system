const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const STAFF_ROLES = ["kitchen", "delivery", "cashier"];

// ==========================================
// Register User
// ==========================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role && role !== "customer") {
      return res.status(403).json({
        success: false,
        message: "Staff accounts can only be created by the administrator.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      availability: "available",
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Login User
// ==========================================
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Blocked User
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by the administrator.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        phone: user.phone,
        availability: user.availability,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================================
// Get All Users
// ==========================================
const getAllUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// Get Staff Users
// ==========================================
const getStaffUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: STAFF_ROLES },
      isDeleted: false,
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// User Statistics
// ==========================================
const getUserStats = async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();

    const totalAdmins = await User.countDocuments({
      role: "admin",
    });

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalKitchenStaff = await User.countDocuments({
      role: "kitchen",
    });

    const totalDeliveryStaff = await User.countDocuments({
      role: "delivery",
    });

    const totalCashiers = await User.countDocuments({
      role: "cashier",
    });

    const availableStaff = await User.countDocuments({
      role: { $in: STAFF_ROLES },
      availability: "available",
      isBlocked: false,
    });

    const busyStaff = await User.countDocuments({
      role: { $in: STAFF_ROLES },
      availability: "busy",
      isBlocked: false,
    });

    const blockedUsers = await User.countDocuments({
      isBlocked: true,
    });

    const blockedStaff = await User.countDocuments({
      role: { $in: STAFF_ROLES },
      isBlocked: true,
    });

    const totalStaff = totalKitchenStaff + totalDeliveryStaff + totalCashiers;

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalCustomers,
      totalStaff,
      totalKitchenStaff,
      totalDeliveryStaff,
      totalCashiers,
      availableStaff,
      busyStaff,
      blockedStaff,
      blockedUsers,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// Block User
// ==========================================
const blockUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin account cannot be blocked.",
      });
    }

    user.isBlocked = true;

    if (STAFF_ROLES.includes(user.role)) {
      user.availability = "offline";
    }

    await user.save();

    res.status(200).json({
      message: "User blocked successfully.",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// Unblock User
// ==========================================
const unblockUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = false;

    if (STAFF_ROLES.includes(user.role) && user.availability === "offline") {
      user.availability = "available";
    }

    await user.save();

    res.status(200).json({
      message: "User unblocked successfully.",
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// Delete User
// ==========================================
const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin account cannot be deleted.",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// ==========================================
// Create Staff
// ==========================================
const createStaff = async (req, res) => {
  try {
    const { name, email, phone, role, password, availability } = req.body;

    if (!STAFF_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Role must be Kitchen, Delivery, or Cashier.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      role,
      password: hashedPassword,
      availability: availability || "available",
      isBlocked: false,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Staff member created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        availability: user.availability,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Staff
// ==========================================
const updateStaff = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { name, email, phone, role, availability } = req.body;

    if (!STAFF_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Role must be Kitchen, Delivery, or Cashier.",
      });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.role = role;
    user.availability = availability;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Staff member updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Reset Staff Password
// ==========================================
const resetStaffPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!STAFF_ROLES.includes(user.role)) {
      return res.status(400).json({
        message: "Password reset is only available for staff accounts.",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
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
};