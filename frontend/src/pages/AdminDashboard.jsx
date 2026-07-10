import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaClock,
  FaUtensils,
} from "react-icons/fa";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";

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

      <DashboardTable
        title="Recent Orders"
        columns={["Customer", "Total", "Status"]}
        rows={recentOrders}
        emptyMessage="No recent orders found"
        renderRow={(order) => (
          <tr key={order._id}>
            <td>{order.customerName}</td>
            <td>Rs. {order.totalAmount}</td>
            <td>{order.status}</td>
          </tr>
        )}
      />
    </div>
  );
}

export default AdminDashboard;