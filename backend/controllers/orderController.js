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
    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
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
      items: Array.isArray(parsedItems) ? parsedItems : [],
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

    const { status, kitchenNotes } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Validate delivery status transitions
    const validDeliveryTransitions = {
      "Ready": ["Picked Up"],
      "Picked Up": ["Out for Delivery"],
      "Out for Delivery": ["Delivered"],
      "Delivered": []
    };

    if (status && validDeliveryTransitions[order.status] && !validDeliveryTransitions[order.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${order.status} to ${status}`,
      });
    }

    const updateData = {};

    if (status) {
      updateData.status = status;
      
      // Set delivery-specific timestamps
      switch (status) {
        case "Picked Up":
          updateData.pickedUpAt = new Date();
          break;
        case "Out for Delivery":
          // Keep existing pickedUpAt, no new timestamp needed
          break;
        case "Delivered":
          updateData.deliveredAt = new Date();
          break;
        default:
          break;
      }
    }

    if (kitchenNotes !== undefined) {
      updateData.kitchenNotes = kitchenNotes;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json(updatedOrder);

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
          "Ready",
          "Picked Up",
          "Out for Delivery",
          "Completed",
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
        // Status remains "Pending" for kitchen to accept and start preparing
        // Kitchen will transition it from Pending -> Preparing when they accept
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




// =============================
// Kitchen Status Update
// =============================
const updateKitchenStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, kitchenNotes } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Validate status transition for kitchen workflow
    const validTransitions = {
      "Pending": ["Preparing"],
      "Preparing": ["Ready"],
      "Ready": ["Completed"],  // Kitchen marks as complete before delivery
      "Completed": []
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from ${order.status} to ${status}`,
      });
    }

    order.status = status;

    if (kitchenNotes !== undefined) {
      order.kitchenNotes = kitchenNotes;
    }

    // Set kitchen-specific timestamps
    switch (status) {
      case "Preparing":
        if (!order.acceptedAt) order.acceptedAt = new Date();
        if (!order.preparingAt) order.preparingAt = new Date();
        break;

      case "Ready":
        order.readyAt = new Date();
        break;

      case "Completed":
        order.completedAt = new Date();
        break;

      default:
        break;
    }

    await order.save();

    res.status(200).json({
      message: "Kitchen status updated successfully",
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }
};


const saveKitchenNotes = async (req, res) => {
    try {

        const { kitchenNotes } = req.body;
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
          return res.status(404).json({
            message: "Order not found",
          });
        }

        order.kitchenNotes = kitchenNotes;
        await order.save();

        res.status(200).json({
          message: "Kitchen notes saved successfully",
          order
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }
};




// =============================
// Cash on Delivery (COD) Functions
// =============================

// Delivery Staff receives cash
const cashReceived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Validate COD
    if (order.paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({
        message: "This order is not Cash on Delivery",
      });
    }

    // Check if already collected
    if (order.cashCollectedByDelivery) {
      return res.status(400).json({
        message: "Cash has already been received",
      });
    }

    // Update order
    order.cashCollectedByDelivery = true;
    order.cashCollectedAt = new Date();
    await order.save();

    res.status(200).json({
      message: "Cash received successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Cashier verifies cash
const verifyCash = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Validate COD
    if (order.paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({
        message: "This order is not Cash on Delivery",
      });
    }

    // Check if delivery staff collected cash
    if (!order.cashCollectedByDelivery) {
      return res.status(400).json({
        message: "Cash has not yet been confirmed by delivery staff",
      });
    }

    // Check if already verified
    if (order.cashVerifiedByCashier) {
      return res.status(400).json({
        message: "Cash has already been verified",
      });
    }

    // Update order
    order.cashVerifiedByCashier = true;
    order.cashVerifiedAt = new Date();
    order.paymentStatus = "Paid";
    order.paymentVerified = true;
    await order.save();

    res.status(200).json({
      message: "Cash verified successfully",
      order,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




// =============================
// WORKFLOW ENDPOINTS
// =============================

// Admin: Send Order to Cashier
const sendToCashier = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: only ADMIN_PENDING orders can go to cashier
    if (order.workflowStage !== "ADMIN_PENDING") {
      return res.status(400).json({
        message: "Only pending orders can be sent to cashier",
      });
    }

    order.workflowStage = "CASHIER_REVIEW";
    await order.save();

    res.status(200).json({
      message: "Order sent to cashier for payment review",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cashier: Confirm COD
const confirmCOD = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: only CASHIER_REVIEW orders can confirm COD
    if (order.workflowStage !== "CASHIER_REVIEW") {
      return res.status(400).json({
        message: "Order is not in cashier review stage",
      });
    }

    // Validate: must be Cash on Delivery
    if (order.paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({
        message: "This is not a Cash on Delivery order",
      });
    }

    // Move to kitchen workflow
    order.workflowStage = "KITCHEN";
    order.paymentStatus = "Pending"; // COD payment pending
    await order.save();

    res.status(200).json({
      message: "COD confirmed. Order sent to kitchen",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cashier: Verify Online Payment
const verifyOnlinePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: only CASHIER_REVIEW orders
    if (order.workflowStage !== "CASHIER_REVIEW") {
      return res.status(400).json({
        message: "Order is not in cashier review stage",
      });
    }

    // Validate: must be online payment
    if (order.paymentMethod !== "Bank Transfer") {
      return res.status(400).json({
        message: "Only Bank Transfer orders can be verified this way",
      });
    }

    // Mark as paid and move to kitchen
    order.paymentStatus = "Paid";
    order.paymentVerified = true;
    order.paymentCompleted = true;
    order.workflowStage = "KITCHEN";
    await order.save();

    res.status(200).json({
      message: "Online payment verified. Order sent to kitchen",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kitchen: Accept Order
const kitchenAcceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: must be in KITCHEN workflow
    if (order.workflowStage !== "KITCHEN") {
      return res.status(400).json({
        message: "Order is not available for kitchen",
      });
    }

    // Update status
    order.status = "Preparing";
    order.acceptedAt = new Date();
    if (!order.preparingAt) {
      order.preparingAt = new Date();
    }
    await order.save();

    res.status(200).json({
      message: "Order accepted and preparation started",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kitchen: Mark Ready
const kitchenMarkReady = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: must be preparing
    if (order.status !== "Preparing") {
      return res.status(400).json({
        message: "Only preparing orders can be marked ready",
      });
    }

    order.status = "Ready";
    order.readyAt = new Date();
    order.workflowStage = "READY_FOR_DELIVERY";
    await order.save();

    res.status(200).json({
      message: "Order marked as ready for delivery",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Send to Delivery
const sendToDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: must be ready for delivery
    if (order.workflowStage !== "READY_FOR_DELIVERY") {
      return res.status(400).json({
        message: "Order is not ready for delivery",
      });
    }

    order.status = "Out for Delivery";
    order.workflowStage = "DELIVERY";
    order.deliveryStatus = "Assigned";
    await order.save();

    res.status(200).json({
      message: "Order sent to delivery",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery: Accept Delivery
const deliveryAcceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: must be in DELIVERY workflow
    if (order.workflowStage !== "DELIVERY") {
      return res.status(400).json({
        message: "Order is not available for delivery",
      });
    }

    order.deliveryStatus = "Accepted";
    order.deliveryAcceptedAt = new Date();
    await order.save();

    res.status(200).json({
      message: "Delivery accepted",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery: Mark Delivered
const deliveryMarkDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: must be out for delivery
    if (order.status !== "Out for Delivery") {
      return res.status(400).json({
        message: "Order must be out for delivery first",
      });
    }

    order.status = "Delivered";
    order.deliveryStatus = "Delivered";
    order.deliveredAt = new Date();

    // For online payment: mark as completed immediately
    if (order.paymentMethod === "Bank Transfer") {
      order.status = "Completed";
      order.paymentCompleted = true;
      order.workflowStage = "COMPLETED";
      order.completedAt = new Date();
    } else if (order.paymentMethod === "Cash on Delivery") {
      // For COD: wait for cash payment flow
      order.workflowStage = "CASH_PAYMENT";
    }

    await order.save();

    res.status(200).json({
      message: "Order marked as delivered",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delivery: Mark Cash Received (COD)
const deliveryMarkCashReceived = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: must be COD
    if (order.paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({
        message: "This is not a Cash on Delivery order",
      });
    }

    // Validate: must be delivered
    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Order must be delivered first",
      });
    }

    // Validate: cash not already received
    if (order.cashCollectedByDelivery) {
      return res.status(400).json({
        message: "Cash already marked as received",
      });
    }

    order.cashCollectedByDelivery = true;
    order.cashCollectedAt = new Date();
    order.paymentStatus = "Cash Collected";
    await order.save();

    res.status(200).json({
      message: "Cash received from customer",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cashier: Confirm Cash Payment (COD)
const cashierConfirmCashPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate: must be COD
    if (order.paymentMethod !== "Cash on Delivery") {
      return res.status(400).json({
        message: "This is not a Cash on Delivery order",
      });
    }

    // Validate: cash must be collected
    if (!order.cashCollectedByDelivery) {
      return res.status(400).json({
        message: "Cash not yet collected by delivery",
      });
    }

    // Mark payment as completed
    order.paymentStatus = "Paid";
    order.paymentVerified = true;
    order.paymentCompleted = true;
    order.cashConfirmed = true;
    order.cashConfirmedAt = new Date();
    order.status = "Completed";
    order.workflowStage = "COMPLETED";
    order.completedAt = new Date();
    await order.save();

    res.status(200).json({
      message: "Cash payment confirmed. Order completed",
      order,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
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
  updateKitchenStatus,
  saveKitchenNotes,
  cashReceived,
  verifyCash,
  // New workflow endpoints
  sendToCashier,
  confirmCOD,
  verifyOnlinePayment,
  kitchenAcceptOrder,
  kitchenMarkReady,
  sendToDelivery,
  deliveryAcceptOrder,
  deliveryMarkDelivered,
  deliveryMarkCashReceived,
  cashierConfirmCashPayment,
};