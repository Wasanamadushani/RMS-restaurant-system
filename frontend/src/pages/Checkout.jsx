import React, { useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cartItems, setCartItems } =
    useContext(CartContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
  });

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Order Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const orderData = {
        customerName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        totalAmount: totalAmount,
        user: user.id,
      };

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        orderData
      );

      alert(res.data.message);

      // Clear form
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        paymentMethod: "Cash on Delivery",
      });

      // Clear Cart
      setCartItems([]);

      navigate("/");
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

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div
              key={item._id || item.id}
              className="summary-item"
            >
              <p>
                {item.name} x {item.quantity}
              </p>

              <p>
                Rs.{" "}
                {item.price * item.quantity}
              </p>
            </div>
          ))}

          <hr />

          <h2>Total: Rs. {totalAmount}</h2>
        </div>

        <button type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;