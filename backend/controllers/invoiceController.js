const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    // Title
    doc
      .fontSize(24)
      .text("FoodieHub Restaurant", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(18)
      .text("Order Invoice", {
        align: "center",
      });

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(`Invoice ID : ${order._id}`);
    doc.text(`Customer : ${order.customerName}`);
    doc.text(`Phone : ${order.phone}`);
    doc.text(`Address : ${order.address}`);
    doc.text(`Payment : ${order.paymentMethod}`);
    doc.text(`Status : ${order.status}`);

    doc.text(
      `Date : ${new Date(
        order.createdAt
      ).toLocaleString()}`
    );

    doc.moveDown();

    doc
      .fontSize(16)
      .text("Ordered Items");

    doc.moveDown();

    order.items.forEach((item) => {
      doc.text(
        `${item.name}   x${item.quantity}`
      );
    });

    doc.moveDown();

    doc
      .fontSize(18)
      .text(
        `Total : Rs. ${order.totalAmount}`
      );

    doc.moveDown(2);

    doc
      .fontSize(14)
      .text(
        "Thank you for ordering with FoodieHub!",
        {
          align: "center",
        }
      );

    doc.end();

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

module.exports = {
  downloadInvoice,
};