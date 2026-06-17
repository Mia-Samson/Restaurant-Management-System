const express = require("express");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/auth");
const { toDateString, parseDate } = require("../utils/formatDate");

const router = express.Router();

function formatPayment(doc) {
  const json = doc.toJSON ? doc.toJSON() : doc;
  if (json.payment_date) json.payment_date = toDateString(json.payment_date);
  return json;
}

router.get("/get_payments.php", async (_req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments.map(formatPayment));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.post("/create_payment.php", async (req, res) => {
  try {
    const { customer_name, order_id, amount, payment_method, payment_date } = req.body;

    if (!customer_name || !order_id || amount === undefined || !payment_method || !payment_date) {
      return res.json({ status: false, message: "Required fields missing" });
    }

    const order = await Order.findById(order_id);
    if (!order) {
      return res.json({ status: false, message: "Order not found" });
    }

    const date = parseDate(payment_date);
    if (!date) {
      return res.json({ status: false, message: "Valid payment date is required" });
    }

    await Payment.create({
      customer_name: customer_name.trim(),
      order_id,
      amount: Number(amount),
      payment_method: payment_method.trim(),
      payment_date: date,
    });

    res.json({ status: true, message: "Payment Recorded" });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "Payment Failed" });
  }
});

router.put("/payments/:id", authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.amount !== undefined) updates.amount = Number(updates.amount);
    if (updates.payment_date) {
      const date = parseDate(updates.payment_date);
      if (!date) return res.status(400).json({ status: false, message: "Invalid payment date" });
      updates.payment_date = date;
    }
    if (updates.order_id) {
      const order = await Order.findById(updates.order_id);
      if (!order) return res.status(400).json({ status: false, message: "Order not found" });
    }
    const payment = await Payment.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!payment) return res.status(404).json({ status: false, message: "Payment not found" });
    res.json({ status: true, message: "Payment updated", payment: formatPayment(payment) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Update failed" });
  }
});

router.delete("/payments/:id", authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ status: false, message: "Payment not found" });
    res.json({ status: true, message: "Payment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Delete failed" });
  }
});

module.exports = router;
