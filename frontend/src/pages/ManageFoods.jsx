import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageFoods() {
  const [foods, setFoods] = useState([]);
  const [editId, setEditId] = useState(null);
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  // Get Foods
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

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update Food
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("price", formData.price);

      if (image) {
        data.append("image", image);
      }

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/foods/${editId}`,
          data
        );

        alert("Food Updated Successfully");
      } else {
        await axios.post(
          "http://localhost:5000/api/foods",
          data
        );

        alert("Food Added Successfully");
      }

      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
      });

      setImage(null);
      setEditId(null);

      fetchFoods();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Food
  const editFood = (food) => {
    setFormData({
      name: food.name,
      category: food.category,
      description: food.description,
      price: food.price,
    });

    setEditId(food._id);
  };

  // Delete Food
  const deleteFood = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/foods/${id}`
      );

      fetchFoods();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="manage-foods-container">
      <h1>Manage Foods</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="food-form">
        <input
          type="text"
          name="name"
          placeholder="Food Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        <button type="submit">
          {editId ? "Update Food" : "Add Food"}
        </button>
      </form>

      {/* Table */}
      <table className="food-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {foods.map((food) => (
            <tr key={food._id}>
              <td>{food.name}</td>
              <td>{food.category}</td>
              <td>Rs. {food.price}</td>

              <td>
                <img
                  src={`http://localhost:5000${food.image}`}
                  alt={food.name}
                  width="80"
                  height="80"
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </td>

              <td>
                <button
                  className="edit-button"
                  onClick={() => editFood(food)}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteFood(food._id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageFoods;