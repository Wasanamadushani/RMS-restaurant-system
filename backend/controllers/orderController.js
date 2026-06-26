const Order = require("../models/Order");

// Create Order
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      paymentMethod,
      totalAmount,
    } = req.body;

    const order = new Order({
      customerName,
      phone,
      address,
      paymentMethod,
      totalAmount,
    });

    await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Recent Orders
const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(recentOrders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Dashboard Statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    res.status(200).json({
      totalOrders,
      pendingOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const createFood = async (req, res) => {
  try {
    const { name, category, description, price } =
      req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const food = new Food({
      name,
      category,
      description,
      price,
      image,
    });

    await food.save();

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderStats,
  getRecentOrders,
};