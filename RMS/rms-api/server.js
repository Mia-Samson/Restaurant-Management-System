require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/database");
const Admin = require("./models/Admin");

const authRoutes = require("./routes/authRoutes");
const foodMenuRoutes = require("./routes/foodMenuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.JWT_SECRET) {
  console.warn(
    "JWT_SECRET is not set. Copy .env.example to .env and set a secret.",
  );
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: true, message: "RMS API is running" });
});

app.use("/api", (req, _res, next) => {
  console.log("Incoming API request", req.method, req.originalUrl);
  next();
});
app.use("/api", authRoutes);
app.use("/api", foodMenuRoutes);
app.use("/api", orderRoutes);
app.use("/api", employeeRoutes);
app.use("/api", paymentRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", complaintRoutes);

async function ensureDefaultAdmin() {
  const existingAdmin = await Admin.findOne({ username: "admin" });
  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);
  await Admin.create({
    username: "admin",
    email: "admin@restaurant.com",
    password: hashedPassword,
  });
  console.log("Default admin created: admin / admin123");
}

async function start() {
  await connectDB();
  await ensureDefaultAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
