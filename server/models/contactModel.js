const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    trim: true,
  },
  lastName: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  message: {
    type: String,
    require: true,
    trim: true,
  },
});

const Contacts = mongoose.model("Contacts", contactSchema);
module.exports = Contacts;
