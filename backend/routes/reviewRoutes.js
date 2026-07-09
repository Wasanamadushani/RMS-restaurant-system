const express = require("express");

const router = express.Router();

const {
  addReview,
  getFoodReviews,
  getAverageRating,
  deleteReview,
  getAllReviews,
} = require("../controllers/reviewController");

// IMPORTANT: Specific routes must come BEFORE parameterized routes

// =====================================
// Get Reviews By Food
// GET /api/reviews/food/:foodId
// =====================================
router.get("/food/:foodId", getFoodReviews);

// =====================================
// Get Average Rating
// GET /api/reviews/rating/:foodId
// =====================================
router.get("/rating/:foodId", getAverageRating);

// =====================================
// Get All Reviews (Admin)
// GET /api/reviews
// =====================================
router.get("/", getAllReviews);

// =====================================
// Add Review
// POST /api/reviews
// =====================================
router.post("/", addReview);

// =====================================
// Delete Review (Admin)
// DELETE /api/reviews/:id
// =====================================
router.delete("/:id", deleteReview);

module.exports = router;