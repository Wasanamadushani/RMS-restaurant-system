import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart } =
    useContext(CartContext);

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );
  const navigate = useNavigate();

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your Cart is Empty</h2>

          <p>Add some delicious food to your cart.</p>

          <button
            className="shop-btn"
            onClick={() => window.location.href = "/menu"}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >
              <img
                src={item.image}
                alt={item.name}
              />

              <div>
                <h3>{item.name}</h3>

                <p>
                  Price: Rs. {item.price}
                </p>

                <p>
                  Quantity: {item.quantity}
                </p>
              </div>

              <button
                onClick={() =>
                  removeFromCart(item.id)
                }
              >
                Remove
              </button>
            </div>
          ))}

          <h2>
            Total: Rs. {totalPrice}
          </h2>

          <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;