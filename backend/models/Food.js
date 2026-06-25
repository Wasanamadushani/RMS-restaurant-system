const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
    name: String,

    category: String,

    description: String,

    price: Number,

    image: String,

    available: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("Food", foodSchema);