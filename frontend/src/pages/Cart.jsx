import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your Cart is Empty</h2>
          <button
            className="shop-btn"
            onClick={() => navigate("/menu")}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              className="cart-item"
              key={item._id || item.id}
            >
              {/* LEFT SIDE */}
              <div className="cart-left">
                <img
                  className="cart-image"
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `http://localhost:5000${item.image}`
                  }
                  alt={item.name}
                />

                <div className="cart-details">
                  <h3>{item.name}</h3>

                  <p>Price: Rs. {item.price}</p>

                  <p>
                    Subtotal: Rs.
                    {item.price * item.quantity}
                  </p>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="cart-right">
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item._id || item.id
                      )
                    }
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      increaseQuantity(
                        item._id || item.id
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(
                      item._id || item.id
                    )
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <h2>Total: Rs. {totalPrice}</h2>

            <button
              className="checkout-btn"
              onClick={() =>
                navigate("/checkout")
              }
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;