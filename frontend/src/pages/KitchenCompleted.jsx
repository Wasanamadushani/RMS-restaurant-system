import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function KitchenCompleted() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      
      // Only show completed orders
      return order.status === "Completed" && (
        order.customerName?.toLowerCase().includes(query) ||
        order.phone?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query) ||
        order.items?.some(item => item.name?.toLowerCase().includes(query))
      );
    });
  }, [orders, search]);

  const completedStats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === "Completed");
    
    // Get today's date at midnight
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayCompleted = completedOrders.filter(order => {
      const completedDate = order.completedAt ? new Date(order.completedAt) : new Date(order.updatedAt);
      return completedDate >= todayStart;
    }).length;

    return {
      total: completedOrders.length,
      today: todayCompleted
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Completed Orders" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Completed Orders"
        subtitle={`Total: ${completedStats.total} | Today: ${completedStats.today}`}
      />

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-value">{completedStats.total}</div>
          <div className="dashboard-card-title">Total Completed</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">{completedStats.today}</div>
          <div className="dashboard-card-title">Completed Today</div>
        </div>
      </div>

      <DashboardTable
        title="Completed Kitchen Orders"
        subtitle="Orders successfully prepared by kitchen"
        columns={[
          "Order ID",
          "Customer",
          "Items",
          "Total",
          "Completed",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, or order ID..."
        emptyMessage="No completed orders found"
        renderRow={(order) => {
          const completedDate = order.completedAt ? new Date(order.completedAt) : new Date(order.updatedAt);
          const formattedDate = completedDate.toLocaleDateString() + " " + completedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

export default KitchenCompleted;
