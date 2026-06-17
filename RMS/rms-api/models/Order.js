const mongoose = require("mongoose");
const { applyJsonTransform } = require("../utils/jsonTransform");

const orderSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true, trim: true },
    items: [
      {
        food_item: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    order_type: { type: String, default: "Delivery" },
    address: { type: String },
    payment_method: { type: String, default: "Cash" },
    order_date: { type: Date, required: true },
  },
  { timestamps: true },
);

applyJsonTransform(orderSchema);

module.exports = mongoose.model("Order", orderSchema);

{
  /*
const orderSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true, trim: true },
    food_item: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    order_type: { type: String, required: true, trim: true },
    address: { type: String, default: "" },
    payment_method: { type: String, required: true, trim: true },
    order_date: { type: Date, required: true },
  },
  { timestamps: true }
);*/
}
