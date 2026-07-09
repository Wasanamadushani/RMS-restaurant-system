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

        name: {
          type: String,
        },

        price: {
          type: Number,
        },

        quantity: {
          type: Number,
        },
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
},


    paymentStatus: {
      type: String,
      enum: [
        "Pending",
        "Paid",
        "Rejected",
      ],
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


  },

  

  { timestamps: true }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);