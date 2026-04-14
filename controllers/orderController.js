exports.createOrder = async (req, res) => {
  try {
    console.log(" Incoming order:", req.body);

    const newOrder = new Order(req.body);
    await newOrder.save();

    res.status(201).json({ message: " Order saved successfully" });
  } catch (error) {
    console.error(" ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};