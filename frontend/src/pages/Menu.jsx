import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

function Menu() {
  const { addToCart } = useContext(CartContext);

  const [foods, setFoods] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});

  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState(null);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchFoods();
  }, []);

  // Fetch Foods
  const fetchFoods = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/foods"
      );

      setFoods(res.data);

      res.data.forEach((food) => {
        fetchRating(food._id);
        fetchReviews(food._id);
      });

    } catch (error) {
      console.log(error);
    }
  };

  // Average Rating
  const fetchRating = async (foodId) => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/reviews/rating/${foodId}`
      );

      setRatings((prev) => ({
        ...prev,
        [foodId]: res.data,
      }));

    } catch (error) {

      setRatings((prev) => ({
        ...prev,
        [foodId]: {
          averageRating: 0,
          totalReviews: 0,
        },
      }));

    }
  };

  // Customer Reviews
  const fetchReviews = async (foodId) => {
    try {

      const res = await axios.get(
        `http://localhost:5000/api/reviews/food/${foodId}`
      );

      setReviews((prev) => ({
        ...prev,
        [foodId]: res.data,
      }));

    } catch (error) {

      console.log(error);

    }
  };

  // Categories
  const categories = [
    "All",
    ...new Set(foods.map((food) => food.category)),
  ];

  // Filter
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

      {/* Search */}
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

      {/* Categories */}
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

      {/* Foods */}
      <div className="menu-grid">

        {filteredFoods.map((food) => (

          <div
            key={food._id}
            className="food-card"
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

                ⭐{" "}
                {ratings[food._id]?.averageRating
                  ? Number(
                      ratings[food._id].averageRating
                    ).toFixed(1)
                  : "0.0"}

                <span
                  style={{
                    marginLeft: 8,
                    color: "#666",
                    fontSize: 13,
                  }}
                >
                  ({ratings[food._id]?.totalReviews || 0} Reviews)
                </span>

              </div>

              <p className="food-price">
                Rs. {food.price}
              </p>

              <button
                className="add-btn"
                onClick={(e) => {

                  e.stopPropagation();

                  addToCart(food);

                  toast.success(
                    `${food.name} added to cart!`
                  );

                }}
              >
                Add To Cart
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* Modal */}

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

            <p>{selectedFood.description}</p>

            <h4>
              Category : {selectedFood.category}
            </h4>

            <div
              style={{
                margin: "15px 0",
              }}
            >

              <strong>

                ⭐{" "}

                {ratings[selectedFood._id]
                  ?.averageRating
                  ? Number(
                      ratings[selectedFood._id]
                        .averageRating
                    ).toFixed(1)
                  : "0.0"}

              </strong>

              <p>
                {ratings[selectedFood._id]
                  ?.totalReviews || 0} Reviews
              </p>

            </div>

            <div className="review-box">

              <h3>Customer Reviews</h3>

              {reviews[selectedFood._id]?.length > 0 ? (

                reviews[selectedFood._id].map(
                  (review) => (

                    <div
                      key={review._id}
                      className="single-review"
                    >

                      <strong>
                        {review.customerName ||
                          review.user?.name ||
                          "Customer"}
                      </strong>

                      <p>
                        ⭐ {review.rating}/5
                      </p>

                      <p>
                        {review.comment}
                      </p>

                      <hr />

                    </div>

                  )
                )

              ) : (

                <p>No reviews yet.</p>

              )}

            </div>

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