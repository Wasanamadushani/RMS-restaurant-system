import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaClock,
  FaUtensils,
} from "react-icons/fa";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const [userStats, setUserStats] = useState({
    totalKitchenStaff: 0,
    totalDeliveryStaff: 0,
    totalCashiers: 0,
    availableStaff: 0,
    busyStaff: 0,
    blockedStaff: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
    fetchUserStats();
  }, []);

  // Fetch Dashboard Statistics
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Recent Orders
  const fetchRecentOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders/recent"
      );

      setRecentOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/stats");

      setUserStats(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Send order to cashier
  const handleSendToCashier = async (orderId) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/send-to-cashier`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Order sent to cashier for payment verification");
      setShowConfirm(null);
      await fetchRecentOrders();
      await fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send order to cashier");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Send order to delivery
  const handleSendToDelivery = async (orderId) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/send-to-delivery`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Order sent to delivery staff");
      setShowConfirm(null);
      await fetchRecentOrders();
      await fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send order to delivery");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard-content">
      <DashboardHeader title="Admin Dashboard" />

      <DashboardStats
        items={[
          {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: <FaShoppingCart className="card-icon" />,
          },
          {
            title: "Total Revenue",
            value: `Rs. ${stats.totalRevenue}`,
            icon: <FaMoneyBillWave className="card-icon" />,
          },
          {
            title: "Pending Orders",
            value: stats.pendingOrders,
            icon: <FaClock className="card-icon" />,
          },
          {
            title: "Total Foods",
            value: 12,
            icon: <FaUtensils className="card-icon" />,
          },
        ]}
      />

      <DashboardHeader title="Staff Summary" subtitle="Live staff availability across all operational roles." />

      <DashboardStats
        items={[
          {
            title: "Kitchen Staff",
            value: userStats.totalKitchenStaff,
            icon: <FaUtensils className="card-icon" />,
          },
          {
            title: "Delivery Staff",
            value: userStats.totalDeliveryStaff,
            icon: <FaShoppingCart className="card-icon" />,
          },
          {
            title: "Cashiers",
            value: userStats.totalCashiers,
            icon: <FaMoneyBillWave className="card-icon" />,
          },
          {
            title: "Available Staff",
            value: userStats.availableStaff,
            icon: <FaClock className="card-icon" />,
          },
          {
            title: "Busy Staff",
            value: userStats.busyStaff,
            icon: <FaClock className="card-icon" />,
          },
          {
            title: "Blocked Staff",
            value: userStats.blockedStaff,
            icon: <FaClock className="card-icon" />,
          },
        ]}
      />

      {/* Workflow Confirmation Dialog */}
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
                {showConfirm.action === "send-cashier"
                  ? "Send this order to Cashier for payment verification?"
                  : "Send this order to Delivery staff?"}
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
                    if (showConfirm.action === "send-cashier") {
                      handleSendToCashier(showConfirm.orderId);
                    } else {
                      handleSendToDelivery(showConfirm.orderId);
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

      <DashboardTable
        title="Recent Orders"
        columns={["Order ID", "Customer", "Total", "Status", "Workflow", "Actions"]}
        rows={recentOrders}
        emptyMessage="No recent orders found"
        renderRow={(order) => (
          <tr key={order._id}>
            <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
            <td>{order.customerName}</td>
            <td>Rs. {order.totalAmount}</td>
            <td>
              <span className={`dashboard-pill status-${order.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                {order.status}
              </span>
            </td>
            <td>
              <small style={{ color: "#666" }}>{order.workflowStage}</small>
            </td>
            <td>
              <div className="dashboard-action-group">
                <button
                  className="dashboard-action-btn"
                  onClick={() => setSelectedOrder(order)}
                >
                  View
                </button>

                {order.workflowStage === "ADMIN_PENDING" && (
                  <button
                    className="dashboard-action-btn"
                    disabled={updatingId === order._id}
                    onClick={() => setShowConfirm({ action: "send-cashier", orderId: order._id })}
                  >
                    {updatingId === order._id ? "..." : "→ Cashier"}
                  </button>
                )}

                {order.workflowStage === "READY_FOR_DELIVERY" && (
                  <button
                    className="dashboard-action-btn"
                    disabled={updatingId === order._id}
                    onClick={() => setShowConfirm({ action: "send-delivery", orderId: order._id })}
                  >
                    {updatingId === order._id ? "..." : "→ Delivery"}
                  </button>
                )}
              </div>
            </td>
          </tr>
        )}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}

export default AdminDashboard;
