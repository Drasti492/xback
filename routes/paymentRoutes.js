const express = require("express");
const axios = require("axios");
const Payment = require("../models/payment");
const Order = require("../models/order");

const router = express.Router();


// INITIATE PAYMENT (STK PUSH)

router.post("/stk-push", async (req, res) => {
  try {
    const { phone, amountKES, orderId } = req.body;

    if (!phone || !amountKES) {
      return res.status(400).json({ message: "Phone and amount required" });
    }

    // create payment
    const payment = await Payment.create({
      phone,
      amountKES,
      status: "pending",
      order: orderId || null
    });

    console.log(" STK PUSH START:", payment.reference);

    const response = await axios.post(
      `${process.env.PAYHERO_BASE_URL}/api/v2/payments`,
      {
        amount: amountKES,
        phone_number: phone,
        channel_id: Number(process.env.PAYHERO_CHANNEL_ID),
        provider: "m-pesa",
        external_reference: payment.reference,
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
      reference: payment.reference
    });

  } catch (err) {
    console.error(" STK ERROR FULL:", err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
});



// CALLBACK FROM PAYHERO

router.post("/callback", async (req, res) => {
  try {
    const externalRef = req.body?.response?.ExternalReference;

    if (!externalRef) return res.sendStatus(400);

    const payment = await Payment.findOne({ reference: externalRef });

    if (!payment) return res.sendStatus(404);

    const resultCode = req.body.response?.ResultCode;

    if (resultCode === 0) {
      payment.status = "success";
      await payment.save();

      //  UPDATE ORDER AFTER PAYMENT SUCCESS
      if (payment.order) {
        await Order.findByIdAndUpdate(payment.order, {
          paid: true,
          paymentReference: payment.reference
        });
      }

      console.log(" PAYMENT SUCCESS:", payment.reference);

    } else {
      payment.status = "failed";
      await payment.save();
      console.log(" PAYMENT FAILED:", payment.reference);
    }

    res.sendStatus(200);

  } catch (err) {
    console.error(" CALLBACK ERROR:", err);
    res.sendStatus(500);
  }
});



// CHECK PAYMENT STATUS

router.get("/status/:reference", async (req, res) => {
  try {
    const payment = await Payment.findOne({
      reference: req.params.reference
    });

    if (!payment) return res.json({ status: "not_found" });

    res.json({ status: payment.status });

  } catch (err) {
    res.json({ status: "error" });
  }
});

module.exports = router;