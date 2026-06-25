import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food) => {

    setCartItems([...cartItems, food]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};