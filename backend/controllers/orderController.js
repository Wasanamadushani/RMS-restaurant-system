const Order = require("../models/Order");

// =============================
// Create Order
// =============================
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      paymentMethod,
      totalAmount,
      items,
      user,
    } = req.body;

    const order = new Order({
      customerName,
      phone,
      address,
      paymentMethod,
      totalAmount,
      items,
      user,
      status: "Pending",
      adminDeleted: false,
      userDeleted: false,
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

// =============================
// Get All Orders (Admin)
// =============================
const getOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      adminDeleted: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// =============================
// Update Status
// =============================
const updateOrderStatus = async (req, res) => {
  try {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    );

    res.status(200).json(order);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// =============================
// Dashboard Statistics
// =============================
const getOrderStats = async (req, res) => {
  try {

    const totalOrders =
      await Order.countDocuments({
        adminDeleted: false,
      });

    const pendingOrders =
      await Order.countDocuments({
        status: "Pending",
        adminDeleted: false,
      });

    const orders = await Order.find({
      adminDeleted: false,
    });

    const totalRevenue = orders.reduce(
      (sum, order) =>
        sum + Number(order.totalAmount || 0),
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

// =============================
// Recent Orders
// =============================
const getRecentOrders = async (req, res) => {
  try {

    const recentOrders = await Order.find({
      adminDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(recentOrders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// =============================
// My Orders
// Pending / Preparing / Out for Delivery
// =============================
const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.params.userId,
      userDeleted: false,
      status: {
        $in: [
          "Pending",
          "Preparing",
          "Out for Delivery",
        ],
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// =============================
// Order History
// Delivered Only
// =============================
const getOrderHistory = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.params.userId,
      userDeleted: false,
      status: "Delivered",
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// =============================
// Admin Delete
// =============================
const adminDeleteOrder = async (req, res) => {
  try {

    await Order.findByIdAndUpdate(
      req.params.id,
      {
        adminDeleted: true,
      }
    );

    res.status(200).json({
      message:
        "Order removed from Admin Dashboard",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// =============================
// User Delete
// =============================
const userDeleteOrder = async (req, res) => {
  try {

    await Order.findByIdAndUpdate(
      req.params.id,
      {
        userDeleted: true,
      }
    );

    res.status(200).json({
      message:
        "Order removed successfully",
    });

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
  getMyOrders,
  getOrderHistory,
  adminDeleteOrder,
  userDeleteOrder,
};