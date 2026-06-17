const mongoose = require("mongoose");
const { applyJsonTransform } = require("../utils/jsonTransform");

const feedbackSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comments: { type: String, default: "" },
  },
  { timestamps: true }
);

applyJsonTransform(feedbackSchema);

module.exports = mongoose.model("Feedback", feedbackSchema);
