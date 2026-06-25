const express = require("express");
const mongoose = require("mongoose");

const foodRoutes = require("./routes/foodRoutes");

const userRoutes = require("./routes/userRoutes");

const orderRoutes = require("./routes/orderRoutes");

const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/foods", foodRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
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