const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const paymentRoutes = require("./routes/paymentRoutes");


require("dotenv").config();

const app = express();

// Middleware
app.use(cors({
  origin: ["https://luminaadulttoys.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", paymentRoutes);
app.use("/api/payhero", paymentRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(" MongoDB connected"))
.catch(err => console.log(" DB Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));