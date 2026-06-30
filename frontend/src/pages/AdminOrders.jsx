import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch All Orders
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

  // Update Order Status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status }
      );

      setOrders(
        orders.map((order) =>
          order._id === id
            ? { ...order, status }
            : order
        )
      );

    } catch (error) {
      console.log(error);
      alert("Failed to update status");
    }
  };

  // Delete Order
  const deleteOrder = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    try {

      await axios.put(
        `http://localhost:5000/api/orders/admin-delete/${id}`
      );

      alert("Order deleted successfully");

      fetchOrders();

    } catch (error) {

      console.log(error);
      alert("Failed to delete order");

    }
  };

  // Filter invalid orders
  const validOrders = orders.filter(
    (order) =>
      order.customerName &&
      order.phone &&
      order.address
  );

  return (
    <div className="admin-orders-container">

      <h1>Manage Orders</h1>

      <table className="orders-table">

        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Items</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {validOrders.length > 0 ? (

            validOrders.map((order) => (

              <tr key={order._id}>

                <td>{order.customerName}</td>

                <td>{order.phone}</td>

                <td>{order.address}</td>

                <td>
                  {order.items &&
                  order.items.length > 0 ? (
                    order.items.map((item) => (
                      <div
                        key={item._id || item.id}
                      >
                        {item.name} x {item.quantity}
                      </div>
                    ))
                  ) : (
                    "No Items"
                  )}
                </td>

                <td>{order.paymentMethod}</td>

                <td>
                  Rs. {order.totalAmount}
                </td>

                <td>
                  <select
                    value={
                      order.status || "Pending"
                    }
                    onChange={(e) =>
                      updateStatus(
                        order._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Preparing">
                      Preparing
                    </option>

                    <option value="Out for Delivery">
                      Out for Delivery
                    </option>

                    <option value="Delivered">
                      Delivered
                    </option>
                  </select>
                </td>

                {/* Delete Button */}
                <td>
                  <button
                    className="delete-order-btn"
                    onClick={() =>
                      deleteOrder(order._id)
                    }
                  >
                    Delete
                  </button>
                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td colSpan="8">
                No Orders Found
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default AdminOrders;