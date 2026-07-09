import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaTrash } from "react-icons/fa";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  // Fetch All Reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/reviews"
      );
      setReviews(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Delete Review
  const deleteReview = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review?"
      )
    )
      return;

    try {
      await axios.delete(
        `http://localhost:5000/api/reviews/${id}`
      );
      alert("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      console.log(error);
      alert("Failed to delete review");
    }
  };

  // Filter reviews
  const filteredReviews = reviews.filter((review) => {
    const searchLower = search.toLowerCase();
    return (
      review.customerName?.toLowerCase().includes(searchLower) ||
      review.food?.name?.toLowerCase().includes(searchLower) ||
      review.comment?.toLowerCase().includes(searchLower)
    );
  });

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={index < rating ? "star-filled" : "star-empty"}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="admin-reviews-container">
        <div className="loading-spinner">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="admin-reviews-container">
      <h1>Review Management</h1>

      <div className="reviews-stats">
        <div className="stat-card">
          <h3>{reviews.length}</h3>
          <p>Total Reviews</p>
        </div>
        <div className="stat-card">
          <h3>
            {reviews.length > 0
              ? (
                  reviews.reduce((sum, r) => sum + r.rating, 0) /
                  reviews.length
                ).toFixed(1)
              : "0.0"}
          </h3>
          <p>Average Rating</p>
        </div>
      </div>

      {/* Search */}
      <div className="reviews-search">
        <input
          type="text"
          placeholder="Search by customer, food, or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Reviews Table */}
      <div className="reviews-table-container">
        {filteredReviews.length > 0 ? (
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Food</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review._id}>
                  <td>
                    <div className="customer-info">
                      <strong>{review.customerName}</strong>
                      <br />
                      <small>{review.user?.email || "N/A"}</small>
                    </div>
                  </td>
                  <td>
                    <strong>{review.food?.name || "Deleted Food"}</strong>
                  </td>
                  <td>{review.food?.category || "N/A"}</td>
                  <td>
                    <div className="rating-cell">
                      {renderStars(review.rating)}
                      <span className="rating-number">
                        {review.rating}/5
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="comment-cell">
                      {review.comment || "No comment"}
                    </div>
                  </td>
                  <td>
                    {new Date(review.createdAt).toLocaleDateString()}
                    <br />
                    <small>
                      {new Date(review.createdAt).toLocaleTimeString()}
                    </small>
                  </td>
                  <td>
                    <button
                      className="delete-review-btn"
                      onClick={() => deleteReview(review._id)}
                      title="Delete Review"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-reviews">
            <h2>No Reviews Found</h2>
            <p>
              {search
                ? "No reviews match your search criteria."
                : "No customer reviews yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;
