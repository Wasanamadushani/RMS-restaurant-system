import React, { useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
    paymentReference: "",
  });

  const [receipt, setReceipt] = useState(null);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReceiptChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      return alert("Your cart is empty.");
    }

    if (
      formData.paymentMethod === "Bank Transfer" &&
      !receipt
    ) {
      return alert("Please upload your payment receipt.");
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const data = new FormData();

      data.append("customerName", formData.fullName);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("paymentMethod", formData.paymentMethod);
      data.append("paymentReference", formData.paymentReference);
      data.append("totalAmount", totalAmount);
      data.append("user", user.id);

      // Save correct order items
      const orderItems = cartItems.map((item) => ({
        food: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      data.append("items", JSON.stringify(orderItems));

      if (receipt) {
        data.append("receipt", receipt);
      }

      const res = await axios.post(
        "http://localhost:5000/api/orders",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

      setCartItems([]);

      setFormData({
        fullName: "",
        phone: "",
        address: "",
        paymentMethod: "Cash on Delivery",
        paymentReference: "",
      });

      setReceipt(null);

      navigate("/my-orders");

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Failed to place order."
      );
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

          <option value="Bank Transfer">
            Online Bank Transfer
          </option>
        </select>

        {formData.paymentMethod === "Bank Transfer" && (
          <div className="bank-payment-box">

            <h3>Bank Transfer Details</h3>

            <p>
              <strong>Bank :</strong> Commercial Bank
            </p>

            <p>
              <strong>Account Name :</strong> FoodieHub Restaurant
            </p>

            <p>
              <strong>Account Number :</strong> 1234567890
            </p>

            <p>
              <strong>Branch :</strong> Colombo
            </p>

            <p>
              <strong>Amount :</strong> Rs. {totalAmount}
            </p>

            <hr />

            <input
              type="text"
              name="paymentReference"
              placeholder="Payment Reference Number"
              value={formData.paymentReference}
              onChange={handleChange}
              required
            />

            <label>Upload Payment Receipt</label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleReceiptChange}
              required
            />

          </div>
        )}

        <div className="order-summary">

          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="summary-item"
            >
              <p>
                {item.name} × {item.quantity}
              </p>

              <p>
                Rs. {item.price * item.quantity}
              </p>
            </div>
          ))}

          <hr />

          <h2>Total : Rs. {totalAmount}</h2>

        </div>

        <button type="submit">
          Place Order
        </button>

      </form>

    </div>
  );
}

export default Checkout;