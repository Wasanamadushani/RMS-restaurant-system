import { useState } from "react";

function Checkout() {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Order Placed Successfully!");

    console.log({
      address,
      phone
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;