const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Create new order from cart
router.post("/checkout", async (req, res) => {
  const { cartItems, totalPrice, shippingDetails, paymentMethod } = req.body;
  const userId = req.user.id; // Assuming you have user authentication middleware

  try {
    const orderItems = await Promise.all(cartItems.map(async (item) => {
      const product = await Product.findById(item._id);
      return {
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      };
    }));

    const newOrder = new Order({
      userId,
      items: orderItems,
      totalAmount: totalPrice,
      shippingAddress: shippingDetails,
      paymentMethod,
    });

    await newOrder.save();
    await Cart.findOneAndDelete({ userId }); // Clear the cart after order creation
    res.json({ orderId: newOrder._id });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

// Get order by ID
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('items.productId');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});

// ... existing routes ...

module.exports = router;
