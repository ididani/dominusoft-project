const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();

router.get("/:category/:subCategory/:id", async (req, res) => {
  console.log("Received request params:", req.params);
  try {
    const { category, subCategory, id } = req.params;
    console.log("Searching for product:", { category, subCategory, id });

    const product = await Product.findOne({
      category: { $in: [category] },
      subCategory: subCategory,
      _id: id,
    });

    console.log("Database query result:", product);

    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/:category/:subCategory", async (req, res) => {
  try {
    const { category, subCategory } = req.params;
    const products = await Product.find({
      category: category,
      subCategory: subCategory,
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: category });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    description: req.body.description,
    quantityStock: req.body.quantityStock,
    brand: req.body.brand,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get("/suggestions", async (req, res) => {
  try {
    const randomProducts = await Product.aggregate([{ $sample: { size: 6 } }]);
    res.status(200).json(randomProducts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching random products", error: err.message });
  }
});
// Delete a product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/least-quantity", async (req, res) => {
  try {
    const products = await Product.find({ quantityStock: { $gt: 0 } })
      .sort({ quantityStock: 1 })
      .limit(4);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.q;

  try {
    const products = await Product.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    }).limit(3); // Limit to 3 results
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
