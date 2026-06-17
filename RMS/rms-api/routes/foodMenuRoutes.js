const express = require("express");
const FoodMenu = require("../models/FoodMenu");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/food_menu.php", async (_req, res) => {
  try {
    const foods = await FoodMenu.find().sort({ createdAt: -1 });
    res.json(foods.map((f) => f.toJSON()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/food_menu.php", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { food_name, category, price, description } = req.body;
    if (!food_name || !category || price === undefined) {
      return res.status(400).json({ status: false, message: "Required fields missing" });
    }

    const food = await FoodMenu.create({
      food_name,
      category,
      price: Number(price),
      description: description || "",
      image: req.file ? req.file.filename : null,
    });

    res.status(201).json({ status: true, message: "Food added", food: food.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Failed to add food" });
  }
});

router.put("/food_menu/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (req.file) updates.image = req.file.filename;

    const food = await FoodMenu.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!food) {
      return res.status(404).json({ status: false, message: "Food not found" });
    }

    res.json({ status: true, message: "Food updated", food: food.toJSON() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Failed to update food" });
  }
});

router.delete("/food_menu/:id", authMiddleware, async (req, res) => {
  try {
    const food = await FoodMenu.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ status: false, message: "Food not found" });
    }
    res.json({ status: true, message: "Food deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Failed to delete food" });
  }
});

module.exports = router;
