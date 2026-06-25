const Order = require("../models/Order");

// Place Order
exports.placeOrder = async (req, res) => {
  try {

    const order = new Order(req.body);

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Orders
exports.getOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("user")
      .populate("items.food");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};