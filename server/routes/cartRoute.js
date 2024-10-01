const express = require("express");
const router = express.Router();
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const mongoose = require('mongoose');

// Get cart by userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// Add item to cart
router.post("/:userId/add", async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  console.log(`Adding item to cart for user: ${userId}, product: ${productId}, quantity: ${quantity}`);

  try {
    const product = await Product.findById(productId);
    if (!product) {
      console.log(`Product not found: ${productId}`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log('Found product:', JSON.stringify(product, null, 2));

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex((item) =>
        item.productId === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    console.log('Cart before population:', JSON.stringify(cart, null, 2));

    const populatedCart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('Populated cart:', JSON.stringify(populatedCart, null, 2));
    res.json(populatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
});

// Update item quantity
router.put("/:userId/item/:productId/update", async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  console.log(`Updating cart for user: ${userId}, product: ${productId}, quantity: ${quantity}`);

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log(`Cart not found for user: ${userId}`);
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log('Cart before update:', JSON.stringify(cart, null, 2));

    const itemIndex = cart.items.findIndex((item) =>
      item.productId && item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      console.log(`Item not found in cart for user: ${userId}, product: ${productId}`);
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('Updated cart:', JSON.stringify(updatedCart, null, 2));
    res.json(updatedCart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Error updating cart", error: error.message });
  }
});

// Remove item from cart
router.delete("/:userId/item/:productId/delete", async (req, res) => {
  const { userId, productId } = req.params;

  console.log(`Removing item from cart for user: ${userId}, product: ${productId}`);

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      console.log(`Cart not found for user: ${userId}`);
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log('Cart before removal:', JSON.stringify(cart, null, 2));

    const itemIndex = cart.items.findIndex((item) =>
      item.productId && item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      console.log(`Item not found in cart for user: ${userId}, product: ${productId}`);
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    console.log('Updated cart after removal:', JSON.stringify(updatedCart, null, 2));
    res.json(updatedCart);
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ message: "Error deleting item from cart", error: error.message });
  }
});

// Clear cart
router.delete("/:userId/clear", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Cart.findOneAndDelete({ userId });
    
    if (!result) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
});

module.exports = router;
