const mongoose = require("mongoose");
const { applyJsonTransform } = require("../utils/jsonTransform");

const complaintSchema = new mongoose.Schema(
  {
    customer_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

applyJsonTransform(complaintSchema);

module.exports = mongoose.model("Complaint", complaintSchema);
