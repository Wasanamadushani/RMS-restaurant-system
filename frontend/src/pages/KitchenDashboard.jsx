import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaFire, FaShoppingCart } from "react-icons/fa";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";

function KitchenDashboard() {
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

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, {
        status,
      });
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
    return {
      assignedOrders: orders.filter((order) =>
        ["Pending", "Preparing", "Ready"].includes(order.status)
      ).length,
      pendingOrders: orders.filter((order) => order.status === "Pending").length,
      preparing: orders.filter((order) => order.status === "Preparing").length,
      ready: orders.filter((order) => order.status === "Ready").length,
      completedToday: orders.filter(
        (order) => order.status === "Completed" && isToday(order.createdAt)
      ).length,
    };
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      ["Pending", "Preparing", "Ready", "Completed"].includes(order.status) &&
      (
        order.customerName?.toLowerCase().includes(query) ||
        order.phone?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query)
      )
    );
  });

  const stats = [
    { title: "Assigned Orders", value: metrics.assignedOrders, icon: <FaShoppingCart /> },
    { title: "Pending Orders", value: metrics.pendingOrders, icon: <FaClock /> },
    { title: "Preparing", value: metrics.preparing, icon: <FaFire /> },
    { title: "Ready", value: metrics.ready, icon: <FaCheckCircle /> },
    { title: "Completed Today", value: metrics.completedToday, icon: <FaCheckCircle /> },
  ];

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Kitchen Dashboard"
        subtitle="Track orders from pending to completed using the same restaurant dashboard theme."
      />

      <DashboardStats items={stats} />

      <DashboardTable
        id="assigned-orders"
        title="Assigned Orders"
        subtitle="Kitchen queue and preparation workflow"
        columns={[
          "Order ID",
          "Customer",
          "Items",
          "Total",
          "Status",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search orders..."
        emptyMessage="No kitchen orders found"
        renderRow={(order) => {
          const workflow = [
            { label: "Accept", status: "Preparing", enabled: order.status === "Pending" },
            { label: "Preparing", status: "Ready", enabled: order.status === "Preparing" },
            { label: "Ready", status: "Completed", enabled: order.status === "Ready" },
            { label: "Completed", status: "Completed", enabled: order.status === "Completed" },
          ];

          return (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>
                {order.items?.length > 0
                  ? order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} × {item.quantity}
                      </div>
                    ))
                  : "No Items"}
              </td>
              <td>Rs. {order.totalAmount}</td>
              <td>
                <span className={`dashboard-pill status-${order.status?.toLowerCase().replace(/\s+/g, "-")}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <div className="dashboard-action-group">
                  {workflow.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className="dashboard-action-btn"
                      disabled={!action.enabled}
                      onClick={() => updateStatus(order._id, action.status)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          );
        }}
      />
    </div>
  );
}

export default KitchenDashboard;