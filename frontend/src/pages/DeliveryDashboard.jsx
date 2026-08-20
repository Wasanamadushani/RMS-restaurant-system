import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTruck, FaBoxOpen, FaRoute, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

  // Delivery: Accept Delivery
  const handleAcceptDelivery = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/delivery-accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Delivery accepted. Pick up the order.");
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept delivery");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delivery: Mark Delivered
  const handleMarkDelivered = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/delivery-delivered`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Order marked as delivered.");
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark delivered");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delivery: Mark Cash Received (COD only)
  const handleCashReceived = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/delivery-cash-received`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Cash received. Cashier will verify the payment.");
      setShowCashConfirm(null);
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record cash collection");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const metrics = useMemo(() => {
    const isToday = (value) => {
      const today = new Date();
      const date = new Date(value);
      return date.toDateString() === today.toDateString();
    };

    const deliveryOrders = orders.filter(o => o.workflowStage === "DELIVERY");

    return {
      assignedDeliveries: deliveryOrders.length,
      pendingPickup: deliveryOrders.filter((order) => order.deliveryStatus === "Assigned").length,
      outForDelivery: deliveryOrders.filter((order) => order.status === "Out for Delivery").length,
      deliveredToday: orders.filter(
        (order) => order.status === "Delivered" && isToday(order.deliveredAt || order.updatedAt || order.createdAt)
      ).length,
      totalDelivered: orders.filter((order) => order.status === "Delivered").length,
    };
  }, [orders]);

  const assignedDeliveries = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      // Show orders in DELIVERY stage (active deliveries) AND CASH_PAYMENT stage (pending cash collection)
      return (
        (order.workflowStage === "DELIVERY" || (order.workflowStage === "CASH_PAYMENT" && order.paymentMethod === "Cash on Delivery")) &&
        (
          order.customerName?.toLowerCase().includes(query) ||
          order.address?.toLowerCase().includes(query) ||
          order._id?.toLowerCase().includes(query) ||
          order.phone?.toLowerCase().includes(query)
        )
      );
    });
  }, [orders, search]);

  const deliveryHistory = useMemo(() => {
    return orders.filter((order) => order.status === "Delivered" || order.status === "Completed");
  }, [orders]);

  const stats = [
    { title: "Assigned Deliveries", value: metrics.assignedDeliveries, icon: <FaTruck /> },
    { title: "Pending Pickup", value: metrics.pendingPickup, icon: <FaBoxOpen /> },
    { title: "Out For Delivery", value: metrics.outForDelivery, icon: <FaRoute /> },
    { title: "Delivered Today", value: metrics.deliveredToday, icon: <FaCheckCircle /> },
    { title: "Total Delivered", value: metrics.totalDelivered, icon: <FaUsers /> },
  ];

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Delivery Dashboard" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading deliveries...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Delivery Dashboard"
        subtitle="Manage order deliveries and fulfillment"
      />

      {/* COD Cash Confirmation Dialog */}
      {showCashConfirm && (
        <div className="modal-overlay">
          <div className="order-modal" style={{ maxWidth: "400px" }}>
            <div className="modal-header">
              <div>
                <h2>Confirm Cash Collection</h2>
              </div>
              <button className="close-btn" onClick={() => setShowCashConfirm(null)}>✕</button>
            </div>
            <div className="modal-section">
              <p style={{ marginBottom: "20px", fontSize: "16px" }}>
                Confirm that you received <strong>Rs. {showCashConfirm.amount}</strong> cash from the customer?
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button className="dashboard-action-btn" onClick={() => setShowCashConfirm(null)}>Cancel</button>
                <button
                  className="dashboard-action-btn"
                  onClick={() => handleCashReceived(showCashConfirm.orderId)}
                  disabled={updatingId === showCashConfirm.orderId}
                >
                  {updatingId === showCashConfirm.orderId ? "Processing..." : "Confirm Cash Received"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DashboardStats items={stats} />

      <DashboardTable
        id="assigned-deliveries"
        title="Assigned Deliveries"
        subtitle="Orders ready for pickup and delivery"
        columns={[
          "Order ID",
          "Customer",
          "Phone",
          "Address",
          "Total",
          "Payment",
          "Status",
          "Actions",
        ]}
        rows={assignedDeliveries}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, or address..."
        emptyMessage="No deliveries assigned"
        renderRow={(order) => (
          <tr key={order._id}>
            <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
            <td>{order.customerName}</td>
            <td>{order.phone}</td>
            <td>{order.address}</td>
            <td>Rs. {order.totalAmount}</td>
            <td>
              <small>{order.paymentMethod}</small>
              <br />
              <span className={`dashboard-pill payment-${order.paymentStatus?.toLowerCase().replace(/\s+/g, "-")}`}>
                {order.paymentStatus}
              </span>
            </td>
            <td>
              <span className={`dashboard-pill status-${order.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                {order.status}
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

                {order.deliveryStatus === "Assigned" && (
                  <button
                    type="button"
                    className="dashboard-action-btn"
                    disabled={updatingId === order._id}
                    onClick={() => handleAcceptDelivery(order._id)}
                  >
                    {updatingId === order._id ? "..." : "Accept"}
                  </button>
                )}

                {order.deliveryStatus === "Accepted" && order.status !== "Out for Delivery" && (
                  <button
                    type="button"
                    className="dashboard-action-btn"
                    disabled
                  >
                    Picked Up
                  </button>
                )}

                {order.status === "Out for Delivery" && (
                  <button
                    type="button"
                    className="dashboard-action-btn"
                    disabled={updatingId === order._id}
                    onClick={() => handleMarkDelivered(order._id)}
                  >
                    {updatingId === order._id ? "..." : "Mark Delivered"}
                  </button>
                )}

                {order.status === "Delivered" && order.paymentMethod === "Cash on Delivery" && !order.cashCollectedByDelivery && (
                  <button
                    type="button"
                    className="dashboard-action-btn"
                    disabled={updatingId === order._id}
                    onClick={() => setShowCashConfirm({ orderId: order._id, amount: order.totalAmount })}
                  >
                    {updatingId === order._id ? "..." : "Cash Collected"}
                  </button>
                )}

                {order.status === "Delivered" && order.cashCollectedByDelivery && order.paymentMethod === "Cash on Delivery" && (
                  <button
                    type="button"
                    className="dashboard-action-btn"
                    disabled
                  >
                    Cash Collected ✓
                  </button>
                )}
              </div>
            </td>
          </tr>
        )}
      />

      <DashboardTable
        id="history"
        title="Delivery History"
        subtitle="All completed deliveries"
        columns={[
          "Order ID",
          "Customer",
          "Address",
          "Total",
          "Payment",
          "Status",
          "Delivered",
        ]}
        rows={deliveryHistory}
        emptyMessage="No completed deliveries"
        renderRow={(order) => {
          const deliveredDate = new Date(order.updatedAt || order.createdAt);
          return (
            <tr key={order._id}>
              <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
              <td>{order.customerName}</td>
              <td>{order.address}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>
                <small>{order.paymentMethod}</small>
                <br />
                <span className={`dashboard-pill payment-${order.paymentStatus?.toLowerCase().replace(/\s+/g, "-")}`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td>
                <span className={`dashboard-pill status-${order.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                  {order.status}
                </span>
              </td>
              <td>{deliveredDate.toLocaleDateString()}</td>
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

export default DeliveryDashboard;
