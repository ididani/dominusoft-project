const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  _id:{
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String],
    required: true,
  },
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
