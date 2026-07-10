import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTruck, FaBoxOpen, FaRoute, FaUsers } from "react-icons/fa";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats from "../components/DashboardStats";
import DashboardTable from "../components/DashboardTable";

function DeliveryDashboard() {
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
      assignedDeliveries: orders.filter((order) =>
        ["Ready", "Picked Up", "Out for Delivery", "Delivered"].includes(order.status)
      ).length,
      pendingPickup: orders.filter((order) => order.status === "Ready").length,
      outForDelivery: orders.filter((order) => order.status === "Out for Delivery").length,
      deliveredToday: orders.filter(
        (order) => order.status === "Delivered" && isToday(order.createdAt)
      ).length,
      totalDelivered: orders.filter((order) => order.status === "Delivered").length,
    };
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      ["Ready", "Picked Up", "Out for Delivery", "Delivered"].includes(order.status) &&
      (
        order.customerName?.toLowerCase().includes(query) ||
        order.address?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query)
      )
    );
  });

  const stats = [
    { title: "Assigned Deliveries", value: metrics.assignedDeliveries, icon: <FaTruck /> },
    { title: "Pending Pickup", value: metrics.pendingPickup, icon: <FaBoxOpen /> },
    { title: "Out For Delivery", value: metrics.outForDelivery, icon: <FaRoute /> },
    { title: "Delivered Today", value: metrics.deliveredToday, icon: <FaCheckCircle /> },
    { title: "Total Delivered", value: metrics.totalDelivered, icon: <FaUsers /> },
  ];

  return (
    <div className="dashboard-content">
      <DashboardHeader
        title="Delivery Dashboard"
        subtitle="Use the same dashboard structure to move deliveries through the dispatch flow."
      />

      <DashboardStats items={stats} />

      <DashboardTable
        id="assigned-deliveries"
        title="Assigned Deliveries"
        subtitle="Delivery queue and dispatch status"
        columns={[
          "Order ID",
          "Customer",
          "Address",
          "Total",
          "Status",
          "Actions",
        ]}
        rows={filteredOrders}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search deliveries..."
        emptyMessage="No deliveries found"
        renderRow={(order) => {
          const workflow = [
            { label: "Accept Delivery", status: "Picked Up", enabled: order.status === "Ready" },
            { label: "Picked Up", status: "Out for Delivery", enabled: order.status === "Picked Up" },
            { label: "Out For Delivery", status: "Delivered", enabled: order.status === "Out for Delivery" },
            { label: "Delivered", status: "Delivered", enabled: order.status === "Delivered" },
          ];

          return (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.customerName}</td>
              <td>{order.address}</td>
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

export default DeliveryDashboard;