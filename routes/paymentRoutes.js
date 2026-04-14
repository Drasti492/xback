const express = require("express");
const axios = require("axios");
const Payment = require("../models/Payment");

const router = express.Router();

/**PUSH */
router.post("/stk-push", async (req, res) => {
  try {
    const { phone, amountKES } = req.body;

    if (!phone || !amountKES) {
      return res.status(400).json({ message: "Phone and amount required" });
    }

    const reference = `ORDER-${Date.now()}`;

    const payment = await Payment.create({
      phone,
      amountKES,
      reference,
      status: "pending"
    });

    const response = await axios.post(
      `${process.env.PAYHERO_BASE_URL}/api/v2/payments`,
      {
        amount: amountKES,
        phone_number: phone,
        channel_id: Number(process.env.PAYHERO_CHANNEL_ID),
        provider: "m-pesa",
        external_reference: reference,
        callback_url: process.env.PAYHERO_CALLBACK_URL,
        customer_name: "Lumina Customer"
      },
      {
        headers: {
          Authorization: `Basic ${process.env.PAYHERO_BASIC_AUTH}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      success: true,
      reference
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed" });
  }
});

/*STATUS */
router.get("/status/:reference", async (req, res) => {
  const payment = await Payment.findOne({ reference: req.params.reference });

  if (!payment) return res.json({ status: "not_found" });

  res.json({ status: payment.status });
});

module.exports = router;