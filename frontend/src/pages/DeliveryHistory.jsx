import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function DeliveryHistory() {
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
      toast.error("Failed to load delivery history");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      
      // Only show delivered orders
      return order.status === "Delivered" && (
        order.customerName?.toLowerCase().includes(query) ||
        order.phone?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query) ||
        order.address?.toLowerCase().includes(query)
      );
    });
  }, [orders, search]);

  const deliveryStats = useMemo(() => {
    const deliveredOrders = orders.filter(o => o.status === "Delivered");
    
    // Get today's date at midnight
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const deliveredToday = deliveredOrders.filter(order => {
      const deliveredDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.updatedAt);
      return deliveredDate >= todayStart;
    }).length;

    const totalDeliveryValue = deliveredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
      total: deliveredOrders.length,
      today: deliveredToday,
      totalValue: totalDeliveryValue
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Delivery History" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading delivery history...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Delivery History"
        subtitle={`Total: ${deliveryStats.total} | Today: ${deliveryStats.today}`}
      />

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-value">{deliveryStats.total}</div>
          <div className="dashboard-card-title">Total Delivered</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">{deliveryStats.today}</div>
          <div className="dashboard-card-title">Delivered Today</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">Rs. {deliveryStats.totalValue}</div>
          <div className="dashboard-card-title">Total Value</div>
        </div>
      </div>

      <DashboardTable
        title="Completed Deliveries"
        subtitle="All successfully delivered orders"
        columns={[
          "Order ID",
          "Customer",
          "Phone",
          "Address",
          "Total",
          "Status",
          "Payment",
          "Delivered",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, or address..."
        emptyMessage="No completed deliveries"
        renderRow={(order) => {
          const deliveredDate = order.deliveredAt ? new Date(order.deliveredAt) : new Date(order.updatedAt);
          const formattedDate = deliveredDate.toLocaleDateString() + " " + deliveredDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
              <td>
                <span style={{ fontSize: "12px" }}>
                  {order.paymentStatus}
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

export default DeliveryHistory;
