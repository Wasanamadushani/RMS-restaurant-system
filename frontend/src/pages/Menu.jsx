import React, { useState } from "react";

const foods = [
  {
    id: 1,
    name: "Chicken Burger",
    category: "Burgers",
    description: "Delicious chicken burger",
    price: 1200,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
  },

  {
    id: 2,
    name: "Pizza",
    category: "Pizzas",
    description: "Cheesy Italian Pizza",
    price: 1800,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591",
  },

  {
    id: 3,
    name: "Double Burger",
    category: "Burgers",
    description: "Juicy beef burger",
    price: 1500,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349",
  },
];

function Menu() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredFoods = foods.filter((food) => {
    return (
      (category === "All" || food.category === category) &&
      food.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="menu-container">
      <h1 className="menu-title">Our Delicious Menu</h1>

      {/* Search Bar */}
      <div className="menu-search">
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Buttons */}
      <div className="category-buttons">
        <button onClick={() => setCategory("All")}>All</button>

        <button onClick={() => setCategory("Burgers")}>
          Burgers
        </button>

        <button onClick={() => setCategory("Pizzas")}>
          Pizzas
        </button>

        <button onClick={() => setCategory("Drinks")}>
          Drinks
        </button>

        <button onClick={() => setCategory("Desserts")}>
          Desserts
        </button>
      </div>

      {/* Food Cards */}
      <div className="menu-grid">
        {filteredFoods.map((food) => (
          <div className="food-card" key={food.id}>
            <img
              src={food.image}
              alt={food.name}
            />

            <div className="food-info">
              <h3>{food.name}</h3>

              <p>{food.description}</p>

              <div className="rating">
                ⭐ {food.rating}
              </div>

              <p className="food-price">
                Rs. {food.price}
              </p>

              <button className="add-btn">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;