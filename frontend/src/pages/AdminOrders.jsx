import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch Orders
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

      fetchOrders();

    } catch (error) {

      console.log(error);
      alert("Failed to update status");

    }
  };

  // Delete Order
  const deleteOrder = async (id) => {

    if (
      !window.confirm(
        "Delete this order from Admin Panel?"
      )
    )
      return;

    try {

      await axios.put(
        `http://localhost:5000/api/orders/admin-delete/${id}`
      );

      fetchOrders();

    } catch (error) {

      console.log(error);

    }
  };

  // Approve Payment
  const approvePayment = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/orders/${id}/approve-payment`
      );

      alert("Payment Approved");

      fetchOrders();

    } catch (error) {

      console.log(error);

    }
  };

  // Reject Payment
  const rejectPayment = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/api/orders/${id}/reject-payment`
      );

      alert("Payment Rejected");

      fetchOrders();

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

            <th>Items</th>

            <th>Total</th>

            <th>Payment</th>

            <th>Receipt</th>

            <th>Payment Status</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {orders.length > 0 ? (

            orders.map((order) => (

              <tr key={order._id}>

                <td>{order.customerName}</td>

                <td>{order.phone}</td>

                <td>

                  {order.items?.length > 0 ? (

                    order.items.map((item, index) => (

                      <div key={index}>

                        {item.name} × {item.quantity}

                      </div>

                    ))

                  ) : (

                    "No Items"

                  )}

                </td>

                <td>
                  Rs. {order.totalAmount}
                </td>

                <td>

                  <strong>
                    {order.paymentMethod}
                  </strong>

                  {order.paymentReference && (
                    <p
                      style={{
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      Ref:
                      <br />
                      {order.paymentReference}
                    </p>
                  )}

                </td>

                <td>

                  {order.receipt ? (

                    <a
                      href={`http://localhost:5000${order.receipt}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Receipt
                    </a>

                  ) : (

                    "-"

                  )}

                </td>

                <td>

                  <b>{order.paymentStatus}</b>

                  <br />

                  {order.paymentMethod ===
                    "Bank Transfer" &&
                    order.paymentStatus ===
                      "Pending" && (

                      <>

                        <button
                          onClick={() =>
                            approvePayment(
                              order._id
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          style={{
                            marginTop: "5px",
                          }}
                          onClick={() =>
                            rejectPayment(
                              order._id
                            )
                          }
                        >
                          Reject
                        </button>

                      </>

                    )}

                </td>

                <td>

                  <select
                    value={order.status}
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

              <td colSpan="9">
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