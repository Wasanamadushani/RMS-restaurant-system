import React, { useEffect, useState } from "react";
import axios from "axios";

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

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

  return (
    <div className="my-orders-container">

      <h1>Order History</h1>

      <div className="my-orders-list">

        {orders.length > 0 ? (

          orders.map((order) => (

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
                <strong>Total :</strong>
                {" "}
                Rs. {order.totalAmount}
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
                <strong>Delivered On :</strong>
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

                    <span>{item.name}</span>

                    <span>
                      x {item.quantity}
                    </span>

                  </div>

                ))

              ) : (

                <p>No Items</p>

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