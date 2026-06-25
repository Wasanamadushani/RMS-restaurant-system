import { useContext } from "react";
import { CartContext } from "../context/CartContext";

import { Link } from "react-router-dom";

function Cart() {

  const { cartItems } = useContext(CartContext);

  return (
    <div style={{ padding: "20px" }}>

      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item, index) => (
          <div key={index}>
            <h3>{item.name}</h3>
            <p>Rs. {item.price}</p>
            <hr />
          </div>
        ))
      )}

      <Link to="/checkout">
        <button>Proceed to Checkout</button>
      </Link>

    </div>
  );
}

export default Cart;