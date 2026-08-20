import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function CashierPayments() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);
  const [showCashConfirm, setShowCashConfirm] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to load payments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approvePayment = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/approve-payment`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Payment approved successfully");
      setShowConfirm(null);
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve payment");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const rejectPayment = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/reject-payment`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Payment rejected successfully");
      setShowConfirm(null);
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject payment");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifyCash = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/verify-cash`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("COD cash verified successfully. Payment marked as Paid.");
      setShowConfirm(null);
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify cash");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      return (
        order.paymentStatus === "Pending" &&
        order.paymentMethod !== "Cash on Delivery" &&
        (
          order.customerName?.toLowerCase().includes(query) ||
          order.paymentReference?.toLowerCase().includes(query) ||
          order._id?.toLowerCase().includes(query) ||
          order.phone?.toLowerCase().includes(query) ||
          order.paymentMethod?.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, search]);

  const codAwaitingVerification = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      return (
        order.paymentMethod === "Cash on Delivery" &&
        order.cashCollectedByDelivery === true &&
        order.cashVerifiedByCashier === false &&
        (
          order.customerName?.toLowerCase().includes(query) ||
          order._id?.toLowerCase().includes(query) ||
          order.phone?.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, search]);

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Pending Payments" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading payments...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Pending Payments"
        subtitle={`${filteredOrders.length} bank transfer(s) & ${codAwaitingVerification.length} COD verification(s) awaiting`}
      />

      {/* Confirmation Dialog for Payment Actions */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="order-modal" style={{ maxWidth: "400px" }}>
            <div className="modal-header">
              <div>
                <h2>Confirm Action</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowConfirm(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-section">
              <p style={{ marginBottom: "20px", fontSize: "16px" }}>
                {showConfirm.action === "reject"
                  ? "Are you sure you want to REJECT this payment? This action cannot be undone."
                  : "Approve this payment?"}
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  className="dashboard-action-btn"
                  onClick={() => setShowConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className={`dashboard-action-btn ${showConfirm.action === "reject" ? "dashboard-action-btn-danger" : ""}`}
                  onClick={() => {
                    if (showConfirm.action === "approve") {
                      approvePayment(showConfirm.orderId);
                    } else {
                      rejectPayment(showConfirm.orderId);
                    }
                  }}
                  disabled={updatingId === showConfirm.orderId}
                >
                  {updatingId === showConfirm.orderId ? "Processing..." : 
                    (showConfirm.action === "approve" ? "Approve" : "Reject")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for COD Cash Verification */}
      {showCashConfirm && (
        <div className="modal-overlay">
          <div className="order-modal" style={{ maxWidth: "400px" }}>
            <div className="modal-header">
              <div>
                <h2>Verify COD Cash</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowCashConfirm(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-section">
              <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                <strong>Customer:</strong> {showCashConfirm?.customerName}
              </p>
              <p style={{ marginBottom: "10px", fontSize: "16px" }}>
                <strong>Amount:</strong> Rs. {showCashConfirm?.amount}
              </p>
              <p style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
                Delivery staff has confirmed cash collection. Please verify and mark as paid.
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  className="dashboard-action-btn"
                  onClick={() => setShowCashConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="dashboard-action-btn"
                  onClick={() => handleVerifyCash(showCashConfirm.orderId)}
                  disabled={updatingId === showCashConfirm.orderId}
                >
                  {updatingId === showCashConfirm.orderId ? "Processing..." : "Verify Cash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DashboardTable
        title="Bank Transfer & Other Methods"
        subtitle="Payments waiting for verification"
        columns={[
          "Order ID",
          "Customer",
          "Phone",
          "Method",
          "Reference",
          "Total",
          "Receipt",
          "Status",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, order ID, or reference..."
        emptyMessage="No pending bank transfer payments found"
        renderRow={(order) => (
          <tr key={order._id}>
            <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
            <td>{order.customerName}</td>
            <td>{order.phone}</td>
            <td>{order.paymentMethod}</td>
            <td>{order.paymentReference || "-"}</td>
            <td>Rs. {order.totalAmount}</td>
            <td>
              {order.receipt ? (
                <a
                  href={`http://localhost:5000${order.receipt}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#ff5b38", textDecoration: "underline", fontSize: "12px" }}
                >
                  View
                </a>
              ) : (
                <span style={{ fontSize: "12px", color: "#999" }}>-</span>
              )}
            </td>
            <td>
              <span className={`dashboard-pill status-${order.paymentStatus?.toLowerCase()}`}>
                {order.paymentStatus}
              </span>
            </td>
            <td>
              <div className="dashboard-action-group">
                <button
                  type="button"
                  className="dashboard-action-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  View
                </button>

                <button
                  type="button"
                  className="dashboard-action-btn"
                  disabled={updatingId === order._id}
                  onClick={() => setShowConfirm({ action: "approve", orderId: order._id })}
                >
                  {updatingId === order._id ? "..." : "Approve"}
                </button>

                <button
                  type="button"
                  className="dashboard-action-btn dashboard-action-btn-danger"
                  disabled={updatingId === order._id}
                  onClick={() => setShowConfirm({ action: "reject", orderId: order._id })}
                >
                  {updatingId === order._id ? "..." : "Reject"}
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <DashboardTable
        title="Cash on Delivery - Awaiting Verification"
        subtitle="Delivered orders with cash collected, awaiting your verification"
        columns={[
          "Order ID",
          "Customer",
          "Phone",
          "Total",
          "Collected At",
          "Actions",
        ]}
        rows={codAwaitingVerification}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer or order ID..."
        emptyMessage="No COD cash awaiting verification"
        renderRow={(order) => {
          const collectedDate = new Date(order.cashCollectedAt);
          return (
            <tr key={order._id}>
              <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
              <td>{order.customerName}</td>
              <td>{order.phone}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>{collectedDate.toLocaleString()}</td>
              <td>
                <div className="dashboard-action-group">
                  <button
                    type="button"
                    className="dashboard-action-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="dashboard-action-btn"
                    disabled={updatingId === order._id}
                    onClick={() => setShowCashConfirm({
                      orderId: order._id,
                      amount: order.totalAmount,
                      customerName: order.customerName
                    })}
                  >
                    {updatingId === order._id ? "..." : "Verify Cash"}
                  </button>
                </div>
              </td>
            </tr>
          );
        }}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

export default CashierPayments;
