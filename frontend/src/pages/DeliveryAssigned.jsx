import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function DeliveryAssigned() {
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
      toast.error("Failed to load deliveries");
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
      if (newStatus === "Accepted") {
        // Accept delivery
        await axios.put(
          `http://localhost:5000/api/orders/${id}/delivery-accept`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Delivery accepted. Collect order from restaurant.");
      } else if (newStatus === "Out for Delivery") {
        // Mark as out for delivery
        await axios.put(
          `http://localhost:5000/api/orders/${id}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Order is on the way");
      } else if (newStatus === "Delivered") {
        // Mark as delivered
        await axios.put(
          `http://localhost:5000/api/orders/${id}/delivery-delivered`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Order delivered successfully");
      }
      
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update delivery status");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      
      // Only show orders in DELIVERY workflow stage
      const isDeliveryOrder = order.workflowStage === "DELIVERY";
      
      return isDeliveryOrder && (
        order.customerName?.toLowerCase().includes(query) ||
        order.phone?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query) ||
        order.address?.toLowerCase().includes(query)
      );
    });
  }, [orders, search]);

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Assigned Deliveries" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading deliveries...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Assigned Deliveries"
        subtitle="Manage all active deliveries"
      />

      <DashboardTable
        title="All Assigned Deliveries"
        subtitle="Ready, Picked Up, and Out for Delivery orders"
        columns={[
          "Order ID",
          "Customer",
          "Phone",
          "Address",
          "Total",
          "Status",
          "Created",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, or address..."
        emptyMessage="No deliveries assigned"
        renderRow={(order) => {
          const createdDate = new Date(order.createdAt);
          const formattedDate = createdDate.toLocaleDateString() + " " + createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <tr key={order._id}>
              <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
              <td>{order.customerName}</td>
              <td>{order.phone}</td>
              <td style={{ fontSize: "13px" }}>{order.address}</td>
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

                  {order.deliveryStatus === "Assigned" && (
                    <button
                      className="dashboard-action-btn"
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, "Accepted")}
                    >
                      {updatingId === order._id ? "..." : "Accept"}
                    </button>
                  )}

                  {order.deliveryStatus === "Accepted" && order.status === "Out for Delivery" && (
                    <button
                      className="dashboard-action-btn"
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, "Delivered")}
                    >
                      {updatingId === order._id ? "..." : "Delivered"}
                    </button>
                  )}

                  {(order.status === "Delivered" || order.status === "Completed") && (
                    <button
                      className="dashboard-action-btn"
                      disabled
                    >
                      Completed
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

export default DeliveryAssigned;
