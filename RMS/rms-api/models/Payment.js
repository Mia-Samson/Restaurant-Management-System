const mongoose = require("mongoose");
const { applyJsonTransform } = require("../utils/jsonTransform");

const paymentSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true, trim: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true, min: 0 },
    payment_method: { type: String, required: true, trim: true },
    payment_date: { type: Date, required: true },
  },
  { timestamps: true }
);

applyJsonTransform(paymentSchema);

module.exports = mongoose.model("Payment", paymentSchema);
