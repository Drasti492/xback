const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    console.log("📦 Incoming order:", req.body); // 👈 ADD THIS

    const order = new Order(req.body);
    await order.save();

    console.log("✅ Saved to DB"); // 👈 ADD THIS

    res.json({ message: "✅ Order saved successfully" });
  } catch (err) {
    console.error("❌ ERROR:", err); // 👈 ADD THIS
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
