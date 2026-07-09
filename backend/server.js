const express = require("express");

const path = require("path");

const mongoose = require("mongoose");

const foodRoutes = require("./routes/foodRoutes");

const userRoutes = require("./routes/userRoutes");

const orderRoutes = require("./routes/orderRoutes");

const invoiceRoutes = require("./routes/invoiceRoutes");

const reviewRoutes = require("./routes/reviewRoutes");



const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
app.use("/api/foods", foodRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/uploads", express.static("uploads"));
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Restaurant API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});