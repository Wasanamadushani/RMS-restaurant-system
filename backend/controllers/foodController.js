const Food = require("../models/Food");

// Get all foods
exports.getFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add new food
exports.addFood = async (req, res) => {
    try {
        const food = new Food(req.body);
        const savedFood = await food.save();

        res.status(201).json(savedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update food
exports.updateFood = async (req, res) => {
    try {
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete food
exports.deleteFood = async (req, res) => {
    try {
        await Food.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Food deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};