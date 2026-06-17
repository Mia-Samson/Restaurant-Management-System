const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "dev-secret-key";

async function handleAdminLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ status: false, message: "Username and password required" });
    }

    const admin = await Admin.findOne({ username });
    console.log("Login attempt for", username, "adminFound", Boolean(admin));

    if (!admin) {
      return res.json({ status: false, message: "Admin Not Found" });
    }

    console.log("Stored password present", Boolean(admin.password));

    let valid = false;
    if (admin.password) {
      try {
        valid = await bcrypt.compare(password, admin.password);
      } catch (compareError) {
        console.warn("Password comparison failed", compareError.message);
      }
    }

    if (!valid && password === admin.password) {
      valid = true;
    }

    if (!valid) {
      return res.json({ status: false, message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      status: true,
      message: "Login Success",
      token,
      admin: admin.toJSON(),
    });
  } catch (err) {
    console.error("Login route error:", err);
    res
      .status(500)
      .json({ status: false, message: "Login Failed", error: err.message });
  }
}

router.post("/admin_register.php", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ status: false, message: "All fields are required" });
    }

    const existing = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res
        .status(409)
        .json({ status: false, message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ username, email, password: hashedPassword });

    res.json({ status: true, message: "Admin Registered Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Registration Failed" });
  }
});

router.post("/login", async (req, res) => handleAdminLogin(req, res));
router.post("/login.php", async (req, res) => handleAdminLogin(req, res));

module.exports = router;
