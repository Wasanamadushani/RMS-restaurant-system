import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaWallet, FaCoins } from "react-icons/fa";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function CashierDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
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
      toast.error("Failed to load orders");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Verify Online Payment
  const handleVerifyOnlinePayment = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/verify-online-payment`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Online payment verified. Order sent to kitchen.");
      setShowConfirm(null);
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify payment");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Confirm COD
  const handleConfirmCOD = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/confirm-cod`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("COD confirmed. Order sent to kitchen.");
      setShowConfirm(null);
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm COD");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Confirm Cash Payment (after delivery collected)
  const handleConfirmCashPayment = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/cashier-confirm-cash`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Cash payment confirmed. Order completed.");
      setShowCashConfirm(null);
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm cash payment");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const metrics = useMemo(() => {
    const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
    const rejectedPayments = orders.filter((order) => order.paymentStatus === "Rejected");
    const pendingOnlineOrders = orders.filter(
      (order) => 
        order.paymentStatus === "Pending" &&
        order.paymentMethod === "Bank Transfer" &&
        order.workflowStage === "CASHIER_REVIEW"
    );
    
    // COD-specific metrics
    const codAwaitingConfirmation = orders.filter(
      (order) => 
        order.paymentMethod === "Cash on Delivery" && 
        order.workflowStage === "CASHIER_REVIEW"
    );
    
    const codCashReceivedAwaitingConfirm = orders.filter(
      (order) => 
        order.paymentMethod === "Cash on Delivery" && 
        order.cashCollectedByDelivery === true && 
        order.paymentStatus === "Cash Collected"
    );

    const isToday = (value) => {
      const today = new Date();
      const date = new Date(value);
      return date.toDateString() === today.toDateString();
    };

    return {
      pendingOnlinePayments: pendingOnlineOrders.length,
      paidToday: paidOrders.filter((order) => isToday(order.updatedAt || order.createdAt)).length,
      todaysIncome: paidOrders
        .filter((order) => isToday(order.updatedAt || order.createdAt))
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
      totalIncome: paidOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
      rejectedPayments: rejectedPayments.length,
      codAwaitingConfirmation: codAwaitingConfirmation.length,
      codCashReceivedAwaitingConfirm: codCashReceivedAwaitingConfirm.length,
    };
  }, [orders]);

  // Online payments awaiting verification (CASHIER_REVIEW stage)
  const pendingOnlinePaymentOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      return (
        order.workflowStage === "CASHIER_REVIEW" &&
        order.paymentMethod === "Bank Transfer" &&
        order.paymentStatus === "Pending" &&
        (
          order.customerName?.toLowerCase().includes(query) ||
          order.paymentReference?.toLowerCase().includes(query) ||
          order._id?.toLowerCase().includes(query) ||
          order.paymentMethod?.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, search]);

  // COD awaiting confirmation (CASHIER_REVIEW stage)
  const codAwaitingConfirmation = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      return (
        order.workflowStage === "CASHIER_REVIEW" &&
        order.paymentMethod === "Cash on Delivery" &&
        (
          order.customerName?.toLowerCase().includes(query) ||
          order._id?.toLowerCase().includes(query) ||
          order.phone?.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, search]);

  // COD cash received but awaiting cashier confirmation
  const codCashReceivedAwaitingConfirm = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      return (
        order.paymentMethod === "Cash on Delivery" &&
        order.cashCollectedByDelivery === true &&
        order.paymentStatus === "Cash Collected" &&
        (
          order.customerName?.toLowerCase().includes(query) ||
          order._id?.toLowerCase().includes(query) ||
          order.phone?.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, search]);

  const completedPayments = useMemo(() => {
    return orders.filter(
      (order) => order.paymentStatus === "Paid" || order.paymentStatus === "Cash Collected"
    );
  }, [orders]);

  const stats = [
    { title: "Pending Online", value: metrics.pendingOnlinePayments, icon: <FaMoneyBillWave /> },
    { title: "Paid Today", value: metrics.paidToday, icon: <FaCheckCircle /> },
    { title: "Today's Income", value: `Rs. ${metrics.todaysIncome}`, icon: <FaWallet /> },
    { title: "Total Income", value: `Rs. ${metrics.totalIncome}`, icon: <FaCoins /> },
    { title: "COD Awaiting", value: metrics.codAwaitingConfirmation, icon: <FaMoneyBillWave /> },
    { title: "Cash to Confirm", value: metrics.codCashReceivedAwaitingConfirm, icon: <FaCheckCircle /> },
  ];

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Cashier Dashboard" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading payments...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Cashier Dashboard"
        subtitle="Process and verify customer payments"
      />

      <DashboardStats items={stats} />

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
                {showConfirm.action === "verify-online"
                  ? "Verify this online payment? Order will be sent to kitchen."
                  : "Confirm this COD order? Order will be sent to kitchen."}
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  className="dashboard-action-btn"
                  onClick={() => setShowConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  className="dashboard-action-btn"
                  onClick={() => {
                    if (showConfirm.action === "verify-online") {
                      handleVerifyOnlinePayment(showConfirm.orderId);
                    } else {
                      handleConfirmCOD(showConfirm.orderId);
                    }
                  }}
                  disabled={updatingId === showConfirm.orderId}
                >
                  {updatingId === showConfirm.orderId ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Cash Confirmation */}
      {showCashConfirm && (
        <div className="modal-overlay">
          <div className="order-modal" style={{ maxWidth: "400px" }}>
            <div className="modal-header">
              <div>
                <h2>Confirm COD Cash Payment</h2>
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
              <p style={{ marginBottom: "20px", fontSize: "16px" }}>
                <strong>Amount:</strong> Rs. {showCashConfirm?.amount}
              </p>
              <p style={{ marginBottom: "20px", fontSize: "14px", color: "#666" }}>
                Delivery staff has collected cash. Confirm payment received and mark as paid?
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
                  onClick={() => handleConfirmCashPayment(showCashConfirm.orderId)}
                  disabled={updatingId === showCashConfirm.orderId}
                >
                  {updatingId === showCashConfirm.orderId ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DashboardTable
        id="pending-online-payments"
        title="Online Payments - Awaiting Verification"
        subtitle="Bank Transfer and other online payment methods"
        columns={[
          "Order ID",
          "Customer",
          "Method",
          "Reference",
          "Total",
          "Status",
          "Actions",
        ]}
        rows={pendingOnlinePaymentOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, order ID, or reference..."
        emptyMessage="No pending online payments found"
        renderRow={(order) => (
          <tr key={order._id}>
            <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
            <td>{order.customerName}</td>
            <td>{order.paymentMethod}</td>
            <td>{order.paymentReference || "-"}</td>
            <td>Rs. {order.totalAmount}</td>
            <td>
              <span className={`dashboard-pill payment-${order.paymentStatus?.toLowerCase()}`}>
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
                  onClick={() => setShowConfirm({ action: "verify-online", orderId: order._id })}
                >
                  {updatingId === order._id ? "..." : "Verify"}
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <DashboardTable
        id="cod-awaiting-confirmation"
        title="Cash on Delivery - Awaiting Confirmation"
        subtitle="New COD orders ready to send to kitchen"
        columns={[
          "Order ID",
          "Customer",
          "Phone",
          "Total",
          "Status",
          "Actions",
        ]}
        rows={codAwaitingConfirmation}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer or order ID..."
        emptyMessage="No COD orders awaiting confirmation"
        renderRow={(order) => (
          <tr key={order._id}>
            <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
            <td>{order.customerName}</td>
            <td>{order.phone}</td>
            <td>Rs. {order.totalAmount}</td>
            <td>
              <span className={`dashboard-pill payment-${order.paymentStatus?.toLowerCase()}`}>
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
                  onClick={() => setShowConfirm({ action: "confirm-cod", orderId: order._id })}
                >
                  {updatingId === order._id ? "..." : "Confirm COD"}
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <DashboardTable
        id="cod-cash-received"
        title="Cash on Delivery - Cash Collected"
        subtitle="Delivered orders with cash collected from customer"
        columns={[
          "Order ID",
          "Customer",
          "Phone",
          "Total",
          "Collected At",
          "Actions",
        ]}
        rows={codCashReceivedAwaitingConfirm}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer or order ID..."
        emptyMessage="No cash awaiting confirmation"
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
                    {updatingId === order._id ? "..." : "Confirm Cash"}
                  </button>
                </div>
              </td>
            </tr>
          );
        }}
      />

      <DashboardTable
        id="payment-history"
        title="Payment History"
        subtitle="All processed payments"
        columns={[
          "Order ID",
          "Customer",
          "Method",
          "Reference",
          "Total",
          "Status",
          "Date",
        ]}
        rows={completedPayments}
        emptyMessage="No completed payments found"
        renderRow={(order) => {
          const processDate = new Date(order.updatedAt || order.createdAt);
          return (
            <tr key={order._id}>
              <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
              <td>{order.customerName}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.paymentReference || "-"}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>
                <span className={`dashboard-pill payment-${order.paymentStatus?.toLowerCase()}`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td>{processDate.toLocaleDateString()}</td>
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

export default CashierDashboard;
