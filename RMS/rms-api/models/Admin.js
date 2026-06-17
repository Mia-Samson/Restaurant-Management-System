const mongoose = require("mongoose");
const { applyJsonTransform } = require("../utils/jsonTransform");

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

applyJsonTransform(adminSchema);

module.exports = mongoose.model("Admin", adminSchema);
