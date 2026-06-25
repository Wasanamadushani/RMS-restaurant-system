import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function FoodCard({ food }) {

  const { addToCart } = useContext(CartContext);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "20px",
        margin: "10px",
        width: "250px",
        borderRadius: "10px"
      }}
    >
      <h3>{food.name}</h3>

      <p>{food.category}</p>

      <p>{food.description}</p>

      <h4>Rs. {food.price}</h4>

      <button onClick={() => addToCart(food)}>
        Add to Cart
      </button>
    </div>
  );
}

export default FoodCard;