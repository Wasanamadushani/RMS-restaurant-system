import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const [rating, setRating] = useState({});
  const [comment, setComment] = useState({});

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  // Fetch Delivered Orders
  const fetchOrderHistory = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:5000/api/orders/history/${user.id}`
      );

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // Search
  const filteredOrders = orders.filter((order) =>
    order._id.toLowerCase().includes(search.toLowerCase())
  );

  // Total Spent
  const totalSpent = filteredOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );


  //submit Review
  const submitReview = async (order) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // Validation
      if (!order.items || order.items.length === 0) {
        return alert("No food items found in this order.");
      }

      // Get food ID from first item
      const foodId = order.items[0].food;
      
      if (!foodId) {
        return alert(
          "Food ID not found. This order may have been placed before the system update. Please contact support."
        );
      }

      if (!rating[order._id]) {
        return alert("Please select a rating.");
      }

      const response = await axios.post("http://localhost:5000/api/reviews", {
        food: foodId,
        order: order._id,
        user: user.id,
        customerName: user.name,
        rating: Number(rating[order._id]),
        comment: comment[order._id] || "",
      });

      alert(response.data.message || "Review Submitted Successfully");

      // Clear form
      setRating((prev) => ({
        ...prev,
        [order._id]: "",
      }));

      setComment((prev) => ({
        ...prev,
        [order._id]: "",
      }));

      // Refresh orders
      fetchOrderHistory();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to submit review"
      );
    }
  };

  return (
    <div className="my-orders-container">

      <h1>Order History</h1>

      {/* Summary */}

      <div className="history-summary">

        <div className="summary-box">
          <h3>{filteredOrders.length}</h3>
          <p>Total Orders</p>
        </div>

        <div className="summary-box">
          <h3>Rs. {totalSpent}</h3>
          <p>Total Spent</p>
        </div>

      </div>

      {/* Search */}

      <div className="history-search">

        <input
          type="text"
          placeholder="Search Order ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="my-orders-list">

        {filteredOrders.length > 0 ? (

          filteredOrders.map((order) => (

            <div
              key={order._id}
              className="my-order-card"
            >

              <div className="order-header">

                <h3>
                  Order #{order._id.slice(-6)}
                </h3>

                <span className="order-status status-delivered">
                  Delivered
                </span>

              </div>

              <hr />

              <p>
                <strong>Total :</strong> Rs. {order.totalAmount}
              </p>

              <p>
                <strong>Payment :</strong>{" "}
                {order.paymentMethod}
              </p>

              <p>
                <strong>Payment Status :</strong>{" "}

                <span
                  className={`payment-status ${
                    order.paymentStatus === "Paid"
                      ? "payment-paid"
                      : order.paymentStatus === "Rejected"
                      ? "payment-rejected"
                      : "payment-pending"
                  }`}
                >
                  {order.paymentStatus}
                </span>

              </p>

              {order.paymentReference && (
                <p>
                  <strong>Reference :</strong>{" "}
                  {order.paymentReference}
                </p>
              )}

              <p>
                <strong>Receipt :</strong>{" "}

                {order.receipt ? (
                  <a
                    href={`http://localhost:5000${order.receipt}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Receipt
                  </a>
                ) : (
                  "Not Uploaded"
                )}
              </p>

              <p>
                <strong>Phone :</strong>{" "}
                {order.phone}
              </p>

              <p>
                <strong>Address :</strong>{" "}
                {order.address}
              </p>

              <p>
                <strong>Delivered On :</strong>{" "}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>

              <h4>Ordered Items</h4>

              {order.items?.map((item, index) => (

                <div
                  key={index}
                  className="ordered-item"
                >

                  <span>{item.name}</span>

                  <span>
                    × {item.quantity}
                  </span>

                </div>

              ))}

              {/* Invoice */}

              <button
                className="invoice-btn"
                style={{ marginTop: "20px" }}
                onClick={() =>
                  window.open(
                    `http://localhost:5000/api/invoices/${order._id}`,
                    "_blank"
                  )
                }
              >
                📄 Download Invoice
              </button>

              {/* Review */}

              {!order.reviewed && order.items?.length > 0 && (

                <div className="review-box">

                  <h4>Rate this Order</h4>

                  <select
                    value={rating[order._id] || ""}
                    onChange={(e) =>
                      setRating({
                        ...rating,
                        [order._id]: e.target.value,
                      })
                    }
                  >
                     <option value="">Select Rating</option>
                      <option value="5">★★★★★ (5)</option>
                      <option value="4">★★★★☆ (4)</option>
                      <option value="3">★★★☆☆ (3)</option>
                      <option value="2">★★☆☆☆ (2)</option>
                      <option value="1">★☆☆☆☆ (1)</option>
                  </select>

                  <textarea
                    placeholder="Write your review..."
                    value={
                      comment[order._id] || ""
                    }
                    onChange={(e) =>
                      setComment({
                        ...comment,
                        [order._id]:
                          e.target.value,
                      })
                    }
                  />

                  <button
                    className="review-btn"
                    onClick={() =>
                      submitReview(order)
                    }
                  >
                    Submit Review
                  </button>

                </div>

              )}

              {order.reviewed && (

                <div
                  style={{
                    marginTop: "20px",
                    color: "green",
                    fontWeight: "bold",
                  }}
                >
                  ✅ You have already reviewed this order.
                </div>

              )}

            </div>

          ))

        ) : (

          <div className="empty-orders">

            <h2>No Order History</h2>

            <p>
              You haven't completed any
              orders yet.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default OrderHistory;