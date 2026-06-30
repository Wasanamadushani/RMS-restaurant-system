import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

function Menu() {
  const { addToCart } = useContext(CartContext);

  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/foods"
      );

      setFoods(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Dynamic Categories
  const categories = [
    "All",
    ...new Set(foods.map((food) => food.category)),
  ];

  // Filter Foods
  const filteredFoods = foods.filter((food) => {
    return (
      (category === "All" ||
        food.category === category) &&
      food.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  return (
    <div className="menu-container">
      <h1 className="menu-title">
        Our Delicious Menu
      </h1>

      {/* Search Bar */}
      <div className="menu-search">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </div>

      {/* Category Buttons */}
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Cards */}
      <div className="menu-grid">
        {filteredFoods.map((food) => (
          <div
            className="food-card"
            key={food._id}
            onClick={() =>
              setSelectedFood(food)
            }
          >
            <img
              src={`http://localhost:5000${food.image}`}
              alt={food.name}
            />

            <div className="food-info">
              <h3>{food.name}</h3>

              <p>{food.description}</p>

              <div className="rating">
                ⭐ 4.8
              </div>

              <p className="food-price">
                Rs. {food.price}
              </p>

              <button
                className="add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(food);
                  toast.success(`${food.name} added to cart!`);
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Food Modal */}
      {selectedFood && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedFood(null)
          }
        >
          <div
            className="food-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <img
              src={`http://localhost:5000${selectedFood.image}`}
              alt={selectedFood.name}
            />

            <h2>{selectedFood.name}</h2>

            <p>
              {selectedFood.description}
            </p>

            <h4>
              Category:{" "}
              {selectedFood.category}
            </h4>

            <h3>
              Rs. {selectedFood.price}
            </h3>

            <button
              className="add-btn"
                onClick={() => {
                  addToCart(selectedFood);

                  toast.success(
                    `${selectedFood.name} added to cart!`
                  );
                }}
            >
              Add To Cart
            </button>

            <button
              className="close-btn"
              onClick={() =>
                setSelectedFood(null)
              }
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;