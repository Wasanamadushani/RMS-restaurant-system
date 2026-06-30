import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Fetch My Orders
  const fetchMyOrders = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await axios.get(
        `http://localhost:5000/api/orders/my-orders/${user.id}`
      );

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-orders-container">

      <div className="my-orders-header">

        <h1>My Orders</h1>

        <div>

          {/* <button
            className="refresh-btn"
            onClick={fetchMyOrders}
          >
            Refresh
          </button>

          <button
            className="history-btn"
            onClick={() =>
              navigate("/order-history")
            }
          >
            Order History
          </button> */}

        </div>

      </div>

      <div className="my-orders-list">

        {orders.length > 0 ? (

          orders.map((order) => (

            <div
              key={order._id}
              className="my-order-card"
            >

              <div className="order-header">

                <h3>
                  Order #
                  {order._id.slice(-6)}
                </h3>

                <span
                  className={`order-status ${
                    order.status === "Pending"
                      ? "status-pending"
                      : order.status === "Preparing"
                      ? "status-preparing"
                      : order.status ===
                        "Out for Delivery"
                      ? "status-out"
                      : "status-delivered"
                  }`}
                >
                  {order.status}
                </span>

              </div>

              <hr />

              <p>
                <strong>Total :</strong>
                {" "}Rs. {order.totalAmount}
              </p>

              <p>
                <strong>Payment :</strong>
                {" "}
                {order.paymentMethod}
              </p>

              <p>
                <strong>Phone :</strong>
                {" "}
                {order.phone}
              </p>

              <p>
                <strong>Address :</strong>
                {" "}
                {order.address}
              </p>

              <p>
                <strong>Ordered On :</strong>
                {" "}
                {new Date(
                  order.createdAt
                ).toLocaleString()}
              </p>

              <h4>Ordered Items</h4>

              {order.items &&
              order.items.length > 0 ? (

                order.items.map((item) => (

                  <div
                    key={item._id || item.id}
                    className="ordered-item"
                  >

                    {item.name}

                    <span>
                      x {item.quantity}
                    </span>

                  </div>

                ))

              ) : (

                <p>No items found</p>

              )}

            </div>

          ))

        ) : (

          <div className="empty-orders">

            <h2>No Active Orders</h2>

            <p>
              You don't have any active
              orders.
            </p>

            <button className="browse-btn"
              onClick={() =>
                navigate("/menu")
              }
            >
              Browse Menu
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default MyOrders;