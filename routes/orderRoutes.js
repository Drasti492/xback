const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    console.log("Incoming order:", req.body); 

    const order = new Order(req.body);
    await order.save();

    console.log(" Saved to DB"); 
    res.json({ message: " Order saved successfully" });
  } catch (err) {
    console.error(" ERROR:", err); 
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
