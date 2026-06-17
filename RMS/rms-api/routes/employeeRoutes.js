const express = require("express");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/auth");
const { toDateString, parseDate } = require("../utils/formatDate");

const router = express.Router();

function formatEmployee(doc) {
  const json = doc.toJSON ? doc.toJSON() : doc;
  if (json.joining_date) json.joining_date = toDateString(json.joining_date);
  return json;
}

router.get("/employees", authMiddleware, async (_req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 });
  res.json(employees.map(formatEmployee));
});

router.post("/employees", authMiddleware, async (req, res) => {
  const { employee_name, position, salary, phone, joining_date } = req.body;
  const date = parseDate(joining_date);
  if (!employee_name || !position || salary === undefined || !phone || !date) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }
  const employee = await Employee.create({
    employee_name,
    position,
    salary: Number(salary),
    phone,
    joining_date: date,
  });
  res.status(201).json({ status: true, employee: formatEmployee(employee) });
});

router.put("/employees/:id", authMiddleware, async (req, res) => {
  const updates = { ...req.body };
  if (updates.salary !== undefined) updates.salary = Number(updates.salary);
  if (updates.joining_date) {
    const date = parseDate(updates.joining_date);
    if (!date) return res.status(400).json({ status: false, message: "Invalid joining date" });
    updates.joining_date = date;
  }
  const employee = await Employee.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!employee) return res.status(404).json({ status: false, message: "Employee not found" });
  res.json({ status: true, employee: formatEmployee(employee) });
});

router.delete("/employees/:id", authMiddleware, async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ status: false, message: "Employee not found" });
  res.json({ status: true, message: "Employee deleted" });
});

module.exports = router;
