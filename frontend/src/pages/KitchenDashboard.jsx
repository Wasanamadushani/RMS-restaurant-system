import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaFire, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";

import OrderDetailsModal from "../components/OrderDetailsModal";


function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

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

  // Kitchen Accept Order
  const handleAcceptOrder = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/kitchen-accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Order accepted. Start preparing now.");
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept order");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Kitchen Mark Ready
  const handleMarkReady = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:5000/api/orders/${id}/kitchen-ready`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Order marked as ready for delivery.");
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as ready");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      
      // Only show orders that are in kitchen workflow (KITCHEN stage)
      const isKitchenOrder = order.workflowStage === "KITCHEN" || 
                             ["Pending", "Preparing", "Ready"].includes(order.status);
      
      return isKitchenOrder && (
        order.customerName?.toLowerCase().includes(query) ||
        order.phone?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query) ||
        order.items?.some(item => item.name?.toLowerCase().includes(query))
      );
    });
  }, [orders, search]);

  const stats = useMemo(() => {
    // Get today's date at midnight
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const kitchenOrders = orders.filter(o => o.workflowStage === "KITCHEN" || ["Pending", "Preparing", "Ready"].includes(o.status));
    
    const completedToday = orders.filter(order => {
      if (order.workflowStage !== "READY_FOR_DELIVERY") return false;
      const completedDate = order.readyAt ? new Date(order.readyAt) : new Date(order.updatedAt);
      return completedDate >= todayStart;
    }).length;

    return [
      { 
        title: "Assigned Orders", 
        value: kitchenOrders.length, 
        icon: <FaShoppingCart /> 
      },
      { 
        title: "Pending Orders", 
        value: kitchenOrders.filter((order) => order.status === "Pending").length, 
        icon: <FaClock /> 
      },
      { 
        title: "Preparing", 
        value: kitchenOrders.filter((order) => order.status === "Preparing").length, 
        icon: <FaFire /> 
      },
      { 
        title: "Ready", 
        value: kitchenOrders.filter((order) => order.status === "Ready").length, 
        icon: <FaCheckCircle /> 
      },
      { 
        title: "Completed Today", 
        value: completedToday, 
        icon: <FaCheckCircle /> 
      },
    ];
  }, [orders]);

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Kitchen Dashboard" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Kitchen Dashboard"
        subtitle="Manage orders from pending to completion"
      />

      <DashboardStats items={stats} />

      <DashboardTable
        id="assigned-orders"
        title="Assigned Orders"
        subtitle="Orders requiring kitchen preparation"
        columns={[
          "Order ID",
          "Customer",
          "Items",
          "Qty",
          "Total",
          "Status",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, or order ID..."
        emptyMessage="No assigned orders found"
        renderRow={(order) => {
          return (
            <tr key={order._id}>
              <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
              <td>{order.customerName}</td>
              <td>
                {Array.isArray(order.items) && order.items.length > 0
                  ? order.items.map((item) => item.name).join(", ")
                  : "No Items"}
              </td>
              <td>
                {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
              </td>
              <td>Rs. {order.totalAmount}</td>
              <td>
                <span className={`dashboard-pill status-${order.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <div className="dashboard-action-group">
                  <button
                    className="dashboard-action-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>

                  {order.status === "Pending" && (
                    <button
                      className="dashboard-action-btn"
                      disabled={updatingId === order._id}
                      onClick={() => handleAcceptOrder(order._id)}
                    >
                      {updatingId === order._id ? "..." : "Accept"}
                    </button>
                  )}

                  {order.status === "Preparing" && (
                    <button
                      className="dashboard-action-btn"
                      disabled={updatingId === order._id}
                      onClick={() => handleMarkReady(order._id)}
                    >
                      {updatingId === order._id ? "..." : "Mark Ready"}
                    </button>
                  )}

                  {order.status === "Ready" && (
                    <button
                      className="dashboard-action-btn"
                      disabled
                    >
                      Awaiting Pickup
                    </button>
                  )}
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

export default KitchenDashboard;
