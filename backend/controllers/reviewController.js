
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Order = require("../models/Order");
const Food = require("../models/Food");

// =====================================
// Add Review
// =====================================
const addReview = async (req, res) => {
  try {
    const {
      food,
      user,
      order,
      customerName,
      rating,
      comment,
    } = req.body;

    // Validate order exists and is delivered
    const existingOrder = await Order.findById(order);
    
    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (existingOrder.status !== "Delivered") {
      return res.status(400).json({
        message: "You can only review delivered orders.",
      });
    }

    // Check if order already reviewed
    if (existingOrder.reviewed) {
      return res.status(400).json({
        message: "You have already reviewed this order.",
      });
    }

    // Check duplicate review
    const existingReview = await Review.findOne({
      order,
      user,
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this order.",
      });
    }

    // Create review
    const review = new Review({
      food,
      user,
      order,
      customerName,
      rating,
      comment,
    });

    await review.save();

    // Mark order as reviewed
    await Order.findByIdAndUpdate(order, {
      reviewed: true,
    });

    // Update food average rating and total reviews
    const foodReviews = await Review.find({ food });
    const totalReviews = foodReviews.length;
    const averageRating = foodReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await Food.findByIdAndUpdate(food, {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
    });

    res.status(201).json({
      message: "Review submitted successfully.",
      review,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// =====================================
// Get Reviews By Food
// =====================================
const getFoodReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      food: req.params.foodId,
    })
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// =====================================
// Get Average Rating
// =====================================
const getAverageRating = async (req, res) => {
  try {

    const foodId = new mongoose.Types.ObjectId(
      req.params.foodId
    );

    const ratingResult = await Review.aggregate([
      {
        $match: {
          food: foodId,
        },
      },
      {
        $group: {
          _id: "$food",
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

    const latestReviews = await Review.find({
      food: req.params.foodId,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    if (ratingResult.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      });
    }

    res.json({
      averageRating: Number(
        ratingResult[0].averageRating.toFixed(1)
      ),
      totalReviews: ratingResult[0].totalReviews,
      reviews: latestReviews,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// =====================================
// Delete Review (Admin)
// =====================================
const deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    const foodId = review.food;

    await Review.findByIdAndDelete(req.params.id);

    // Recalculate food ratings
    const foodReviews = await Review.find({ food: foodId });
    const totalReviews = foodReviews.length;
    const averageRating = totalReviews > 0 
      ? foodReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;

    await Food.findByIdAndUpdate(foodId, {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews,
    });

    res.status(200).json({
      message: "Review deleted successfully.",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

// =====================================
// Get All Reviews (Admin)
// =====================================
const getAllReviews = async (req, res) => {
  try {

    const reviews = await Review.find()
      .populate("food", "name category")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  addReview,
  getFoodReviews,
  getAverageRating,
  deleteReview,
  getAllReviews,
};
