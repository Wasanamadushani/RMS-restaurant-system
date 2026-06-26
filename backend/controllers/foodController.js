const Food = require("../models/Food");

// Create Food
const createFood = async (req, res) => {
  try {
    const { name, category, description, price } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const food = await Food.create({
      name,
      category,
      description,
      price,
      image,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Foods
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Food
const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    food.name = req.body.name || food.name;
    food.category = req.body.category || food.category;
    food.description =
      req.body.description || food.description;
    food.price = req.body.price || food.price;

    // If new image uploaded
    if (req.file) {
      food.image = `/uploads/${req.file.filename}`;
    }

    const updatedFood = await food.save();

    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Food
const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createFood,
  getFoods,
  deleteFood,
  updateFood,
};