const express = require("express");
const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

function normalizeComplaintPayload(body = {}) {
  return {
    customer_name: body.customer_name ?? body.customerName ?? body.name ?? "",
    email: body.email ?? "",
    phone: body.phone ?? "",
    subject: body.subject ?? "",
    message: body.message ?? body.complaint ?? "",
    status: body.status ?? "Pending",
  };
}

router.post("/complaint.php", async (req, res) => {
  try {
    const payload = normalizeComplaintPayload(req.body);

    if (
      !payload.customer_name ||
      !payload.email ||
      !payload.phone ||
      !payload.subject ||
      !payload.message
    ) {
      return res.json({ status: false, message: "Required fields missing" });
    }

    await Complaint.create({
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
      status: payload.status,
    });

    res.json({ status: true, message: "Complaint Submitted Successfully" });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "Complaint Failed" });
  }
});

router.get("/get_complaints.php", async (_req, res) => {
  try {
    const items = await Complaint.find().sort({ createdAt: -1 });
    res.json(items.map((c) => c.toJSON()));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.post("/complaints", authMiddleware, async (req, res) => {
  try {
    const payload = normalizeComplaintPayload(req.body);
    if (
      !payload.customer_name ||
      !payload.email ||
      !payload.phone ||
      !payload.subject ||
      !payload.message
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Required fields missing" });
    }
    const item = await Complaint.create({
      customer_name: payload.customer_name,
      email: payload.email,
      phone: payload.phone,
      subject: payload.subject,
      message: payload.message,
      status: payload.status,
    });
    res.status(201).json({ status: true, complaint: item.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Create failed" });
  }
});

router.put("/complaints/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!complaint) {
      return res
        .status(404)
        .json({ status: false, message: "Complaint not found" });
    }
    res.json({ status: true, complaint: complaint.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Update failed" });
  }
});

router.patch("/complaints/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res
        .status(400)
        .json({ status: false, message: "Status is required" });
    }
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    if (!complaint) {
      return res
        .status(404)
        .json({ status: false, message: "Complaint not found" });
    }
    res.json({ status: true, complaint: complaint.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Update failed" });
  }
});

router.delete("/complaints/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res
        .status(404)
        .json({ status: false, message: "Complaint not found" });
    }
    res.json({ status: true, message: "Complaint deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Delete failed" });
  }
});

module.exports = router;
