const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Food
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    // Order
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    // User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Customer Name
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    // Rating (1 - 5)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Review Comment
    comment: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent same user reviewing same order twice
reviewSchema.index(
  {
    order: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Review",
  reviewSchema
);