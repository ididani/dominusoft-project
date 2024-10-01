const express = require("express");
const router = express.Router();
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");

// Process payment (dummy implementation)
router.post("/:orderId/pay", async (req, res) => {
  const { orderId } = req.params;
  const { paymentMethod, transactionId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const payment = new Payment({
      userId: order.userId,
      orderId: order._id,
      amount: order.totalAmount,
      paymentMethod,
      transactionId,
      status: "completed", // Assume it's successful for now
    });

    await payment.save();
    order.paymentStatus = "paid";
    await order.save();

    res.json({ message: "Payment successful", payment });
  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error });
  }
});

module.exports = router;
