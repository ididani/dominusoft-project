const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: [String],
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantityStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  brand: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false }); // This tells Mongoose not to auto-generate an _id

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
