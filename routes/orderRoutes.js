const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ message: "✅ Order saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;