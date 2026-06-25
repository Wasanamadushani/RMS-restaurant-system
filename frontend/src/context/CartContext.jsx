import { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (food) => {

    const existingItem = cartItems.find(
      item => item.id === food.id
    );

    if (existingItem) {

      setCartItems(
        cartItems.map(item =>
          item.id === food.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        )
      );

    } else {

      setCartItems([
        ...cartItems,
        {
          ...food,
          quantity: 1
        }
      ]);

    }
  };

  const removeFromCart = (id) => {

    setCartItems(
      cartItems.filter(item => item.id !== id)
    );

  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};