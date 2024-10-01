const express = require("express");
const router = express.Router();
const Brand = require("../models/brandModel"); // Adjust the path as necessary

// GET route for fetching all brands
router.get("/", async (req, res) => {
  console.log("Received a request to /api/brands");
  try {
    const brands = await Brand.find(); // Fetch all brands from the database
    res.json(brands); // Respond with all brands
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load brands" });
  }
});

// GET route for fetching a specific brand by ID
router.get("/:id", async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id); // Use 'Brand', not 'BrandModel'
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ message: "Failed to load brand information" });
  }
});

module.exports = router;
