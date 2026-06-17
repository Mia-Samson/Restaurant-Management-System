const mongoose = require("mongoose");
const { applyJsonTransform } = require("../utils/jsonTransform");

const employeeSchema = new mongoose.Schema(
  {
    employee_name: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    salary: { type: Number, required: true, min: 0 },
    phone: { type: String, required: true, trim: true },
    joining_date: { type: Date, required: true },
  },
  { timestamps: true }
);

applyJsonTransform(employeeSchema);

module.exports = mongoose.model("Employee", employeeSchema);
