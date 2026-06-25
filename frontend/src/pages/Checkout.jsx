import React, { useState } from "react";
import axios from "axios";

function Checkout() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
  });

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        totalAmount: 4800, // Temporary value
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData
      );

      alert(res.data.message);

      // Clear Form
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        paymentMethod: "Cash on Delivery",
      });

    } catch (error) {
      alert("Failed to place order");
      console.log(error);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <form
        className="checkout-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Delivery Address"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
        >
          <option value="Cash on Delivery">
            Cash on Delivery
          </option>

          <option value="Card Payment">
            Card Payment
          </option>
        </select>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <p>Pizza x 2 - Rs. 3600</p>
          <p>Burger x 1 - Rs. 1200</p>
          <h2>Total: Rs. 4800</h2>
        </div>

        <button type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;