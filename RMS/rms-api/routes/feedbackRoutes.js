const express = require("express");
const Feedback = require("../models/Feedback");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

function normalizeFeedbackPayload(body = {}) {
  const customerName =
    body.customer_name ?? body.customerName ?? body.name ?? "";
  const email = body.email ?? body.customerEmail ?? "";
  const phone = body.phone ?? body.customerPhone ?? "";
  const rating = body.rating;
  const comments = body.comments ?? body.message ?? "";

  return {
    customer_name: customerName,
    email,
    phone,
    rating,
    comments,
  };
}

router.post("/feedback.php", async (req, res) => {
  try {
    const payload = normalizeFeedbackPayload(req.body);

    if (!payload.customer_name || payload.rating === undefined) {
      return res.json({ status: false, message: "Required fields missing" });
    }

    await Feedback.create({
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      rating: Number(payload.rating),
      comments: payload.comments || "",
    });

    res.json({ status: true, message: "Feedback Submitted Successfully" });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "Feedback Failed" });
  }
});

router.get("/get_feedback.php", async (_req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: -1 });
    res.json(items.map((f) => f.toJSON()));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.post("/feedback", authMiddleware, async (req, res) => {
  try {
    const payload = normalizeFeedbackPayload(req.body);
    if (!payload.customer_name || payload.rating === undefined) {
      return res
        .status(400)
        .json({ status: false, message: "Required fields missing" });
    }
    const item = await Feedback.create({
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      rating: Number(payload.rating),
      comments: payload.comments || "",
    });
    res.status(201).json({ status: true, feedback: item.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Create failed" });
  }
});

router.put("/feedback/:id", authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.rating !== undefined) updates.rating = Number(updates.rating);
    const item = await Feedback.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!item)
      return res
        .status(404)
        .json({ status: false, message: "Feedback not found" });
    res.json({ status: true, feedback: item.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Update failed" });
  }
});

router.delete("/feedback/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Feedback.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ status: false, message: "Feedback not found" });
    res.json({ status: true, message: "Feedback deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Delete failed" });
  }
});

module.exports = router;
