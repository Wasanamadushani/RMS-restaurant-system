const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    items: [
      {
        food: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },

        name: String,

        price: Number,

        quantity: Number,
      },
    ],

    // ===========================
    // Order Status (Customer-facing)
    // ===========================

    status: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Ready",
        "Picked Up",
        "Out for Delivery",
        "Delivered",
        "Completed",
      ],
      default: "Pending",
    },

    // ===========================
    // Workflow Stage (Internal - controls which staff sees the order)
    // ===========================

    workflowStage: {
      type: String,
      enum: [
        "ADMIN_PENDING",
        "CASHIER_REVIEW",
        "KITCHEN",
        "READY_FOR_DELIVERY",
        "DELIVERY",
        "CASH_PAYMENT",
        "COMPLETED"
      ],
      default: "ADMIN_PENDING",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    estimatedTime: {
      type: Number,
      default: 30, // minutes
    },

    // ===========================
    // Kitchen Module
    // ===========================

    assignedKitchenStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    preparingAt: {
      type: Date,
      default: null,
    },

    readyAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    kitchenNotes: {
      type: String,
      default: "",
    },

    // ===========================
    // Delivery Module
    // ===========================

    assignedDeliveryStaff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    pickedUpAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    // ===========================
    // Delete Flags
    // ===========================

    adminDeleted: {
      type: Boolean,
      default: false,
    },

    userDeleted: {
      type: Boolean,
      default: false,
    },

    // ===========================
    // Customer
    // ===========================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ===========================
    // Payment
    // ===========================

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Rejected", "Cash Collected"],
      default: "Pending",
    },

    paymentReference: {
      type: String,
      default: "",
    },

    receipt: {
      type: String,
      default: "",
    },

    paymentVerified: {
      type: Boolean,
      default: false,
    },

    paymentCompleted: {
      type: Boolean,
      default: false,
    },

    // ===========================
    // Cash on Delivery (COD)
    // ===========================

    cashCollectedByDelivery: {
      type: Boolean,
      default: false,
    },

    cashCollectedAt: {
      type: Date,
      default: null,
    },

    cashCollectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    cashVerifiedByCashier: {
      type: Boolean,
      default: false,
    },

    cashVerifiedAt: {
      type: Date,
      default: null,
    },

    cashVerifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    cashConfirmed: {
      type: Boolean,
      default: false,
    },

    cashConfirmedAt: {
      type: Date,
      default: null,
    },

    cashConfirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    preparedBy: {
        type: String,
        default: "",
    },

    preparedTime: {
        type: Date,
    },

    // ===========================
    // Delivery Status
    // ===========================

    deliveryStatus: {
      type: String,
      enum: ["Pending", "Assigned", "Accepted", "Out for Delivery", "Delivered"],
      default: "Pending",
    },

    // ===========================
    // Review
    // ===========================

    rating: {
      type: Number,
      default: 0,
    },

    review: {
      type: String,
      default: "",
    },

    reviewed: {
      type: Boolean,
      default: false,
    },

    // ===========================
    // Delivery Staff Acceptance
    // ===========================

    deliveryAcceptedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);