const Order = require("../models/Order");

// =============================
// Create Order
// =============================
const createOrder = async (req, res) => {
  try {

    console.log("===== ORDER REQUEST =====");
    console.log(req.body);

    const {
      customerName,
      phone,
      address,
      paymentMethod,
      totalAmount,
      items,
      user,
      paymentReference,
    } = req.body;

    console.log("Items Raw:", items);

    let parsedItems = [];

    if (items) {
      try {
        parsedItems = JSON.parse(items);
        console.log("Parsed Items:", parsedItems);
      } catch (parseError) {
        console.error("Error parsing items:", parseError);
        return res.status(400).json({
          message: "Invalid items format",
        });
      }
    }

    // Validate items
    if (!parsedItems || parsedItems.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    const receipt = req.file
      ? `/uploads/receipts/${req.file.filename}`
      : "";

    // Set payment status based on payment method
    let paymentStatus = "Pending";
    let orderStatus = "Pending";
    
    if (paymentMethod === "Cash on Delivery") {
      paymentStatus = "Pending";
      orderStatus = "Pending";
    } else if (paymentMethod === "Bank Transfer") {
      paymentStatus = "Pending";
      orderStatus = "Pending";
    }

    const order = new Order({
      customerName,
      phone,
      address,
      paymentMethod,
      totalAmount,
      items: parsedItems,
      user,
      paymentReference,
      receipt,
      paymentStatus,
      paymentVerified: false,
      status: orderStatus,
    });

    const savedOrder = await order.save();
    
    console.log("Order saved successfully with items:", savedOrder.items);

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });

  } catch (error) {
    console.error("Error creating order:", error);

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



// Approve Payment
const approvePayment = async (req, res) => {
  try {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "Paid",
        paymentVerified: true,
        status: "Preparing",
      },
      { new: true }
    );

    res.status(200).json({
      message: "Payment Approved",
      order,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// Reject Payment
const rejectPayment = async (req, res) => {

  try {

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus: "Rejected",
        paymentVerified: false,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Payment Rejected",
      order,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};



const rateOrder = async (req, res) => {
  try {

    const { rating, review } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        rating,
        review,
        reviewed: true,
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
  approvePayment,
  rejectPayment,
  rateOrder,
};