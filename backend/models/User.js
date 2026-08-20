const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Full Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Email
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Password
    password: {
      type: String,
      required: true,
    },

    // User Role
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },

    // Staff Sub-Role (for staff role only)
    staffRole: {
      type: String,
      enum: ["kitchen", "delivery", "cashier"],
      default: null,
    },

    // Block / Unblock
    isBlocked: {
      type: Boolean,
      default: false,
    },

    // Availability
    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },

    // Phone Number
    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // Address
    address: {
      type: String,
      default: "",
      trim: true,
    },

    // Profile Image
    profileImage: {
      type: String,
      default: "",
    },

    // User deleted by admin (optional)
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // Last Login
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);