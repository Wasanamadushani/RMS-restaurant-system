import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function KitchenPreparing() {
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

  const markReady = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("token");
      
      // Use new kitchen-ready endpoint
      await axios.put(
        `http://localhost:5000/api/orders/${id}/kitchen-ready`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success("Order marked as Ready for delivery");
      await fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark order as ready");
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      
      // Only show orders currently being prepared
      return order.status === "Preparing" && (
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
        <DashboardHeader title="Preparing Orders" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Preparing Orders"
        subtitle={`${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''} currently being prepared`}
      />

      <DashboardTable
        title="Currently Preparing"
        subtitle="Mark orders as ready when preparation is complete"
        columns={[
          "Order ID",
          "Customer",
          "Items",
          "Total",
          "Started",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, or order ID..."
        emptyMessage="No orders currently being prepared"
        renderRow={(order) => {
          const startedDate = order.preparingAt ? new Date(order.preparingAt) : new Date(order.createdAt);
          const formattedDate = startedDate.toLocaleDateString() + " " + startedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
              <td>{formattedDate}</td>
              <td>
                <div className="dashboard-action-group">
                  <button
                    className="dashboard-action-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>

                  <button
                    className="dashboard-action-btn"
                    disabled={updatingId === order._id}
                    onClick={() => markReady(order._id)}
                  >
                    {updatingId === order._id ? "..." : "Mark Ready"}
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

export default KitchenPreparing;
