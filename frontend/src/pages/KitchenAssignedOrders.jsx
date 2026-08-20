import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function KitchenAssignedOrders() {
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

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      // Use new workflow-specific endpoints
      if (newStatus === "Preparing") {
        // Use kitchen-accept endpoint
        await axios.put(
          `http://localhost:5000/api/orders/${id}/kitchen-accept`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (newStatus === "Ready") {
        // Use kitchen-ready endpoint
        await axios.put(
          `http://localhost:5000/api/orders/${id}/kitchen-ready`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      toast.success(`Order status updated to ${newStatus}`);
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order status");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      
      // Only show orders that are in kitchen workflow (KITCHEN stage)
      const isKitchenOrder = order.workflowStage === "KITCHEN";
      
      return isKitchenOrder && (
        order.customerName?.toLowerCase().includes(query) ||
        order.phone?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query) ||
        order.items?.some(item => item.name?.toLowerCase().includes(query))
      );
    });
  }, [orders, search]);

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Assigned Orders" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Assigned Orders"
        subtitle="All orders requiring kitchen preparation"
      />

      <DashboardTable
        title="All Assigned Orders"
        subtitle="Pending, Preparing, and Ready orders"
        columns={[
          "Order ID",
          "Customer",
          "Items",
          "Total",
          "Status",
          "Created",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, or order ID..."
        emptyMessage="No assigned orders found"
        renderRow={(order) => {
          const createdDate = new Date(order.createdAt);
          const formattedDate = createdDate.toLocaleDateString() + " " + createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <tr key={order._id}>
              <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
              <td>{order.customerName}</td>
              <td>
                {Array.isArray(order.items) && order.items.length > 0
                  ? order.items.map((item) => item.name).join(", ")
                  : "No Items"}
              </td>
              <td>Rs. {order.totalAmount}</td>
              <td>
                <span className={`dashboard-pill status-${order.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                  {order.status}
                </span>
              </td>
              <td>{formattedDate}</td>
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
                      onClick={() => updateStatus(order._id, "Preparing")}
                    >
                      {updatingId === order._id ? "..." : "Accept"}
                    </button>
                  )}

                  {order.status === "Preparing" && (
                    <button
                      className="dashboard-action-btn"
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, "Ready")}
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

export default KitchenAssignedOrders;
