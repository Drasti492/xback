const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  name: String,
  phone: String,
  emergency: String,
  email: String,
  county: String,
  town: String,
  address: String,
  date: String
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);