import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaWallet, FaCoins } from "react-icons/fa";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";

function CashierDashboard() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyPayment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/approve-payment`);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const rejectPayment = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/reject-payment`);
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const isToday = (value) => {
    const today = new Date();
    const date = new Date(value);
    return date.toDateString() === today.toDateString();
  };

  const metrics = useMemo(() => {
    const paidOrders = orders.filter((order) => order.paymentStatus === "Paid");
    const rejectedPayments = orders.filter((order) => order.paymentStatus === "Rejected");

    return {
      pendingPayments: orders.filter((order) => order.paymentStatus === "Pending").length,
      paidToday: paidOrders.filter((order) => isToday(order.updatedAt || order.createdAt)).length,
      todaysIncome: paidOrders
        .filter((order) => isToday(order.updatedAt || order.createdAt))
        .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
      totalIncome: paidOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
      rejectedPayments: rejectedPayments.length,
    };
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      order.paymentStatus === "Pending" &&
      (
        order.customerName?.toLowerCase().includes(query) ||
        order.paymentReference?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query)
      )
    );
  });

  const completedPayments = orders.filter(
    (order) => order.paymentStatus !== "Pending"
  );

  const stats = [
    { title: "Pending Payments", value: metrics.pendingPayments, icon: <FaMoneyBillWave /> },
    { title: "Paid Today", value: metrics.paidToday, icon: <FaCheckCircle /> },
    { title: "Today's Income", value: `Rs. ${metrics.todaysIncome}`, icon: <FaWallet /> },
    { title: "Total Income", value: `Rs. ${metrics.totalIncome}`, icon: <FaCoins /> },
    { title: "Rejected Payments", value: metrics.rejectedPayments, icon: <FaTimesCircle /> },
  ];

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Cashier Dashboard"
        subtitle="Verify or reject payments with the same layout used across the system."
      />

      <DashboardStats items={stats} />

      <DashboardTable
        id="pending-payments"
        title="Pending Payments"
        subtitle="Payments waiting for cashier verification"
        columns={[
          "Order ID",
          "Customer",
          "Reference",
          "Total",
          "Payment Status",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search pending payments..."
        emptyMessage="No pending payments found"
        renderRow={(order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.customerName}</td>
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
                  onClick={() => verifyPayment(order._id)}
                >
                  Verify
                </button>

                <button
                  type="button"
                  className="dashboard-action-btn dashboard-action-btn-danger"
                  onClick={() => rejectPayment(order._id)}
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      <DashboardTable
        id="payment-history"
        title="Completed Payments"
        subtitle="Paid and rejected payments recorded in the same dashboard style"
        columns={[
          "Order ID",
          "Customer",
          "Reference",
          "Total",
          "Payment Status",
        ]}
        rows={completedPayments}
        emptyMessage="No completed payments found"
        renderRow={(order) => (
          <tr key={order._id}>
            <td>{order._id}</td>
            <td>{order.customerName}</td>
            <td>{order.paymentReference || "-"}</td>
            <td>Rs. {order.totalAmount}</td>
            <td>
              <span className={`dashboard-pill payment-${order.paymentStatus?.toLowerCase()}`}>
                {order.paymentStatus}
              </span>
            </td>
          </tr>
        )}
      />
    </div>
  );
}

export default CashierDashboard;