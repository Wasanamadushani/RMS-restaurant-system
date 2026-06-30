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
        name: String,
        quantity: Number,
      },
    ],

    status: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Out for Delivery",
        "Delivered",
      ],
      default: "Pending",
    },

    adminDeleted: {
      type: Boolean,
      default: false
    },

    userDeleted: {
      type: Boolean,
      default: false
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
}
  },

  { timestamps: true }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);