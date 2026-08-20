import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import DashboardHeader from "../components/DashboardHeader";
import DashboardTable from "../components/DashboardTable";
import OrderDetailsModal from "../components/OrderDetailsModal";

function CashierHistory() {
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
      toast.error("Failed to load payment history");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase();
    return orders.filter((order) => {
      // Include both Paid and Rejected payments
      return (
        (order.paymentStatus === "Paid" || order.paymentStatus === "Rejected") &&
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

  const paymentStats = useMemo(() => {
    const paidOrders = orders.filter(o => o.paymentStatus === "Paid");
    const rejectedOrders = orders.filter(o => o.paymentStatus === "Rejected");
    
    // Get today's date at midnight
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const paidToday = paidOrders.filter(order => {
      const paidDate = new Date(order.updatedAt || order.createdAt);
      return paidDate >= todayStart;
    }).length;

    const totalPaidAmount = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const todayPaidAmount = paidOrders
      .filter(order => {
        const paidDate = new Date(order.updatedAt || order.createdAt);
        return paidDate >= todayStart;
      })
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
      totalPaid: paidOrders.length,
      paidToday: paidToday,
      totalRejected: rejectedOrders.length,
      totalPaidAmount: totalPaidAmount,
      todayPaidAmount: todayPaidAmount
    };
  }, [orders]);

  if (loading) {
    return (
      <div className="dashboard-content">
        <DashboardHeader title="Payment History" subtitle="Loading..." />
        <div className="dashboard-loading" style={{ textAlign: "center", padding: "40px" }}>
          Loading payment history...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Payment History"
        subtitle="All processed payments"
      />

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="dashboard-card-value">{paymentStats.totalPaid}</div>
          <div className="dashboard-card-title">Total Paid</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">{paymentStats.paidToday}</div>
          <div className="dashboard-card-title">Paid Today</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">Rs. {paymentStats.todayPaidAmount}</div>
          <div className="dashboard-card-title">Today's Amount</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">Rs. {paymentStats.totalPaidAmount}</div>
          <div className="dashboard-card-title">Total Amount</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">{paymentStats.totalRejected}</div>
          <div className="dashboard-card-title">Rejected</div>
        </div>
      </div>

      <DashboardTable
        title="All Processed Payments"
        subtitle="Approved and rejected payments"
        columns={[
          "Order ID",
          "Customer",
          "Phone",
          "Method",
          "Reference",
          "Total",
          "Payment Status",
          "Verified Date",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search by customer, phone, order ID, or reference..."
        emptyMessage="No payment history found"
        renderRow={(order) => {
          const verifiedDate = new Date(order.updatedAt || order.createdAt);
          const formattedDate = verifiedDate.toLocaleDateString() + " " + verifiedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <tr key={order._id}>
              <td><strong>{order._id.slice(-6).toUpperCase()}</strong></td>
              <td>{order.customerName}</td>
              <td>{order.phone}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.paymentReference || "-"}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>
                <span className={`dashboard-pill status-${order.paymentStatus?.toLowerCase()}`}>
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

export default CashierHistory;
