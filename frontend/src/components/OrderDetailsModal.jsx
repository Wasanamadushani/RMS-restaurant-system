import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function OrderDetailsModal({ order, onClose }) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setNotes(order.kitchenNotes || "");
    }
  }, [order]);

  if (!order) return null;

  const saveNotes = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/${order._id}/kitchen-notes`,
        {
          kitchenNotes: notes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Kitchen notes saved successfully");
      onClose();

    } catch (err) {
      console.error("Error saving notes:", err);
      toast.error(err.response?.data?.message || "Failed to save notes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">

      <div className="order-modal">

        {/* Header */}

        <div className="modal-header">

          <div>

            <h2>🍽 Order Details</h2>

            <p className="modal-subtitle">
              Kitchen preparation information
            </p>

          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* Customer */}

        <div className="modal-section">

          <h3>Customer Information</h3>

          <div className="info-grid">

            <div>
              <strong>Name</strong>
              <p>{order.customerName}</p>
            </div>

            <div>
              <strong>Phone</strong>
              <p>{order.phone}</p>
            </div>

            <div>
              <strong>Payment</strong>
              <p>{order.paymentMethod}</p>
            </div>

            <div>
              <strong>Status</strong>

              <span
                className={`dashboard-pill status-${order.status
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {order.status}
              </span>

            </div>

            <div style={{ gridColumn: "1 / span 2" }}>
              <strong>Address</strong>
              <p>{order.address}</p>
            </div>

          </div>

        </div>

        {/* Items */}

        <div className="modal-section">

          <h3>Ordered Items</h3>

          <table className="modal-table">

            <thead>

              <tr>

                <th>Item</th>

                <th>Qty</th>

                <th>Price</th>

                <th>Total</th>

              </tr>

            </thead>

            <tbody>

              {Array.isArray(order.items) && order.items.map((item, index) => (

                <tr key={index}>

                  <td>{item.name}</td>

                  <td>{item.quantity}</td>

                  <td>Rs. {item.price}</td>

                  <td>
                    Rs. {item.price * item.quantity}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          <div
            style={{
              textAlign: "right",
              marginTop: "15px",
              fontSize: "18px",
              fontWeight: "700",
              color: "#ff5b38",
            }}
          >
            Grand Total : Rs. {order.totalAmount}
          </div>

        </div>

        {/* Extra Information */}

        <div className="modal-section">

          <h3>Kitchen Information</h3>

          <div className="info-grid">

            <div>

              <strong>Priority</strong>

              <p>
                {order.priority || "Normal"}
              </p>

            </div>

            <div>

              <strong>Estimated Time</strong>

              <p>
                {order.estimatedTime || "25 Minutes"}
              </p>

            </div>

          </div>

        </div>

        {/* COD Payment Information */}

        {order.paymentMethod === "Cash on Delivery" && (

          <div className="modal-section">

            <h3>Cash on Delivery Status</h3>

            <div className="info-grid">

              <div>

                <strong>Amount to Collect</strong>

                <p style={{ color: "#ff5b38", fontWeight: "bold" }}>
                  Rs. {order.totalAmount}
                </p>

              </div>

              <div>

                <strong>Collected by Delivery</strong>

                <p>
                  <span style={{
                    color: order.cashCollectedByDelivery ? "green" : "orange",
                    fontWeight: "bold"
                  }}>
                    {order.cashCollectedByDelivery ? "✔ Yes" : "⏳ Pending"}
                  </span>
                </p>

              </div>

              {order.cashCollectedAt && (

                <div>

                  <strong>Collected At</strong>

                  <p>
                    {new Date(order.cashCollectedAt).toLocaleString()}
                  </p>

                </div>

              )}

              <div>

                <strong>Verified by Cashier</strong>

                <p>
                  <span style={{
                    color: order.cashVerifiedByCashier ? "green" : "red",
                    fontWeight: "bold"
                  }}>
                    {order.cashVerifiedByCashier ? "✔ Yes" : "✕ No"}
                  </span>
                </p>

              </div>

              {order.cashVerifiedAt && (

                <div>

                  <strong>Verified At</strong>

                  <p>
                    {new Date(order.cashVerifiedAt).toLocaleString()}
                  </p>

                </div>

              )}

            </div>

          </div>

        )}

        {/* Notes */}

        <div className="modal-section">

          <h3>Kitchen Notes</h3>

          <textarea
            rows="6"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`Example

• Extra spicy
• No onion
• Birthday order
• VIP customer
• Extra sauce
• Allergic to peanuts`}
          />

        </div>

        {/* Receipt */}

        {order.receipt && (

          <div className="modal-section">

            <h3>Payment Receipt</h3>

            <a
              href={`http://localhost:5000${order.receipt}`}
              target="_blank"
              rel="noreferrer"
              className="dashboard-action-btn"
            >
              View Uploaded Receipt
            </a>

          </div>

        )}

        {/* Footer */}

        <div className="modal-footer">

          <button
            className="dashboard-action-btn"
            onClick={saveNotes}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Notes"}
          </button>

          <button
            className="dashboard-action-btn"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

export default OrderDetailsModal;