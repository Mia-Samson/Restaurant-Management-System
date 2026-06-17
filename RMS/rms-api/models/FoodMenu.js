const mongoose = require("mongoose");
const { applyJsonTransform } = require("../utils/jsonTransform");

const foodMenuSchema = new mongoose.Schema(
  {
    food_name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    image: { type: String, default: null },
  },
  { timestamps: true }
);

applyJsonTransform(foodMenuSchema);

module.exports = mongoose.model("FoodMenu", foodMenuSchema);
