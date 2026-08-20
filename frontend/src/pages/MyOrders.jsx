import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // Fetch Active Orders
  const fetchMyOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `http://localhost:5000/api/orders/my-orders/${user.id}`
      );

      // Show only active orders (not completed)
      const activeOrders = res.data.filter(
        (order) => order.status !== "Completed"
      );

      setOrders(activeOrders);

    } catch (error) {
      console.log(error);
    }
  };

  // Get workflow step display
  const getWorkflowStep = (order) => {
    const steps = [];
    
    if (order.workflowStage === "ADMIN_PENDING" || order.status === "Pending") {
      steps.push({ name: "Order Placed", completed: true, current: true });
      steps.push({ name: "Payment Review", completed: false, current: false });
      steps.push({ name: "Preparing", completed: false, current: false });
      steps.push({ name: "Ready", completed: false, current: false });
      steps.push({ name: "Out for Delivery", completed: false, current: false });
      steps.push({ name: "Delivered", completed: false, current: false });
    } else if (order.workflowStage === "CASHIER_REVIEW") {
      steps.push({ name: "Order Placed", completed: true, current: false });
      steps.push({ name: "Payment Review", completed: true, current: true });
      steps.push({ name: "Preparing", completed: false, current: false });
      steps.push({ name: "Ready", completed: false, current: false });
      steps.push({ name: "Out for Delivery", completed: false, current: false });
      steps.push({ name: "Delivered", completed: false, current: false });
    } else if (order.workflowStage === "KITCHEN" || order.status === "Preparing") {
      steps.push({ name: "Order Placed", completed: true, current: false });
      steps.push({ name: "Payment Review", completed: true, current: false });
      steps.push({ name: "Preparing", completed: order.status === "Preparing", current: order.status === "Preparing" });
      steps.push({ name: "Ready", completed: false, current: false });
      steps.push({ name: "Out for Delivery", completed: false, current: false });
      steps.push({ name: "Delivered", completed: false, current: false });
    } else if (order.workflowStage === "READY_FOR_DELIVERY" || order.status === "Ready") {
      steps.push({ name: "Order Placed", completed: true, current: false });
      steps.push({ name: "Payment Review", completed: true, current: false });
      steps.push({ name: "Preparing", completed: true, current: false });
      steps.push({ name: "Ready", completed: true, current: true });
      steps.push({ name: "Out for Delivery", completed: false, current: false });
      steps.push({ name: "Delivered", completed: false, current: false });
    } else if (order.workflowStage === "DELIVERY" || order.status === "Out for Delivery") {
      steps.push({ name: "Order Placed", completed: true, current: false });
      steps.push({ name: "Payment Review", completed: true, current: false });
      steps.push({ name: "Preparing", completed: true, current: false });
      steps.push({ name: "Ready", completed: true, current: false });
      steps.push({ name: "Out for Delivery", completed: true, current: true });
      steps.push({ name: "Delivered", completed: false, current: false });
    } else if (order.status === "Delivered") {
      steps.push({ name: "Order Placed", completed: true, current: false });
      steps.push({ name: "Payment Review", completed: true, current: false });
      steps.push({ name: "Preparing", completed: true, current: false });
      steps.push({ name: "Ready", completed: true, current: false });
      steps.push({ name: "Out for Delivery", completed: true, current: false });
      steps.push({ name: "Delivered", completed: true, current: true });
    }
    
    return steps;
  };

  return (
    <div className="my-orders-container">

      <div className="my-orders-header">
        <h1>My Active Orders</h1>
      </div>

      <div className="my-orders-list">

        {orders.length > 0 ? (

          orders.map((order) => {
            const workflowSteps = getWorkflowStep(order);
            
            return (
              <div
                key={order._id}
                className="my-order-card"
              >

                <div className="order-header">

                  <h3>
                    Order #{order._id.slice(-6)}
                  </h3>

                  <span
                    className={`order-status ${
                      order.status === "Pending"
                        ? "status-pending"
                        : order.status === "Preparing"
                        ? "status-preparing"
                        : order.status === "Ready"
                        ? "status-ready"
                        : order.status ===
                          "Out for Delivery"
                        ? "status-out"
                        : "status-delivered"
                    }`}
                  >
                    {order.status}
                  </span>

                </div>

                {/* Workflow Progress */}
                <div style={{ margin: "15px 0", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                  <p style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "10px", color: "#333" }}>
                    Order Progress
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                    {workflowSteps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div
                          style={{
                            padding: "5px 10px",
                            borderRadius: "3px",
                            backgroundColor: step.current
                              ? "#ff6b35"
                              : step.completed
                              ? "#4caf50"
                              : "#ddd",
                            color: step.current || step.completed ? "#fff" : "#666",
                            fontSize: "11px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {step.completed || step.current ? "✓" : ""} {step.name}
                        </div>
                        {idx < workflowSteps.length - 1 && (
                          <span style={{ color: "#999", fontSize: "12px" }}>→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <hr />

                <p>
                  <strong>Total :</strong>
                  {" "}Rs. {order.totalAmount}
                </p>

                <p>
                  <strong>Payment Method :</strong>
                  {" "}
                  {order.paymentMethod}
                </p>

                <p>
                  <strong>Payment Status :</strong>

                  <span
                    className={`payment-status ${
                      order.paymentStatus === "Paid"
                        ? "payment-paid"
                        : order.paymentStatus === "Rejected"
                        ? "payment-rejected"
                        : order.paymentStatus === "Cash Collected"
                        ? "payment-cash-collected"
                        : "payment-pending"
                    }`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>

                </p>

                {order.paymentMethod === "Cash on Delivery" && (
                  <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                    <p style={{ margin: "5px 0", fontSize: "14px", fontWeight: "bold" }}>
                      Cash on Delivery Status:
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "13px" }}>
                      <span style={{ color: order.cashCollectedByDelivery ? "green" : "#999" }}>
                        {order.cashCollectedByDelivery ? "✓" : "○"} Delivery collected: {order.cashCollectedByDelivery ? "Yes" : "Awaiting"}
                      </span>
                    </p>
                    <p style={{ margin: "5px 0", fontSize: "13px" }}>
                      <span style={{ color: order.paymentStatus === "Paid" ? "green" : "#999" }}>
                        {order.paymentStatus === "Paid" ? "✓" : "○"} Cashier verified: {order.paymentStatus === "Paid" ? "Yes" : "Pending"}
                      </span>
                    </p>
                  </div>
                )}

                {order.paymentReference && (

                  <p style={{ marginTop: "10px" }}>
                    <strong>Reference :</strong>
                    {" "}
                    {order.paymentReference}
                  </p>

                )}

                <p>
                  <strong>Receipt :</strong>{" "}

                  {order.receipt ? (

                    <>
                      <span
                        style={{
                          color: "green",
                          fontWeight: "bold",
                        }}
                      >
                        Uploaded ✔
                      </span>

                      <br />

                      <a
                        href={`http://localhost:5000${order.receipt}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "13px" }}
                      >
                        View Receipt
                      </a>

                    </>

                  ) : (

                    <span
                      style={{
                        color: "red",
                      }}
                    >
                      Not Uploaded
                    </span>

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
                  <strong>Ordered On :</strong>{" "}
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
                        × {item.quantity}
                      </span>

                    </div>

                  ))

                ) : (

                  <p>No items found</p>

                )}

              </div>
            );
          })

        ) : (

          <div className="empty-orders">

            <h2>No Active Orders</h2>

            <p>
              You don't have any active orders at the moment.
            </p>

            <button
              className="browse-btn"
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
