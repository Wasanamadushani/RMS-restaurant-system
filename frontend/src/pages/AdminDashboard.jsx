import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaShoppingCart,
  FaMoneyBillWave,
  FaClock,
  FaUtensils,
} from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
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

  return (
    <div className="dashboard-content">
      <h1>Admin Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <FaShoppingCart className="card-icon" />
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>

        <div className="dashboard-card">
          <FaMoneyBillWave className="card-icon" />
          <h3>Total Revenue</h3>
          <p>Rs. {stats.totalRevenue}</p>
        </div>

        <div className="dashboard-card">
          <FaClock className="card-icon" />
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>

        <div className="dashboard-card">
          <FaUtensils className="card-icon" />
          <h3>Total Foods</h3>
          <p>12</p>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="recent-orders-section">

        <h2>Recent Orders</h2>

        <table className="recent-orders">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.customerName}</td>
                  <td>Rs. {order.totalAmount}</td>
                  <td>{order.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">
                  No recent orders found
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>
    </div>
  );
}

export default AdminDashboard;