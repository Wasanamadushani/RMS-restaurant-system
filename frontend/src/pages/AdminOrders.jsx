import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/orders"
      );

      setOrders(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-orders-container">
      <h1>Manage Orders</h1>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.customerName}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>{order.paymentMethod}</td>
              <td>Rs. {order.totalAmount}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;