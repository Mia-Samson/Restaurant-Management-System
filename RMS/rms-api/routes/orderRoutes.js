const express = require("express");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/auth");
const { toDateString, parseDate } = require("../utils/formatDate");

const router = express.Router();

function formatOrder(doc) {
  const json = doc.toJSON ? doc.toJSON() : doc;
  if (json.order_date) json.order_date = toDateString(json.order_date);
  return json;
}
router.post("/create_order.php", async (req, res) => {
  try {
    console.log("Incoming order payload:", req.body);
    const {
      customer_name,
      items,
      order_type,
      address,
      payment_method,
      order_date,
    } = req.body;

    if (!customer_name?.trim() || !Array.isArray(items) || items.length === 0) {
      return res.json({
        status: false,
        message: "Customer name and at least one item required",
      });
    }

    // Validate each item (accept both foodItem and food_item)
    const validatedItems = items.map((it) => {
      const name = (it.food_item || it.foodItem || "").trim();
      return {
        food_item: name,
        quantity: Number(it.quantity) || 1,
        price: Number(it.price) || 0,
      };
    });

    if (validatedItems.some((it) => !it.food_item)) {
      return res.json({ status: false, message: "Invalid food item in order" });
    }

    const date = parseDate(order_date);
    if (!date) {
      return res.json({
        status: false,
        message: "Valid order date is required",
      });
    }

    await Order.create({
      customer_name: customer_name.trim(),
      items: validatedItems, // store array of items
      order_type: order_type?.trim() || "Delivery",
      address: address?.trim() || "",
      payment_method: payment_method?.trim() || "Cash",
      order_date: date,
    });

    res.json({ status: true, message: "Order Created Successfully" });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "Order Failed" });
  }
});

{
  /*router.post("/create_order.php", async (req, res) => {
  try {
    const { customer_name, food_item, quantity, order_type, address, payment_method, order_date } =
      req.body;

    if (!customer_name?.trim() || !food_item?.trim()) {
      return res.json({ status: false, message: "Required fields missing" });
    }

    const date = parseDate(order_date);
    if (!date) {
      return res.json({ status: false, message: "Valid order date is required" });
    }

    await Order.create({
      customer_name: customer_name.trim(),
      food_item: food_item.trim(),
      quantity: Number(quantity) || 1,
      order_type: order_type?.trim() || "Delivery",
      address: address?.trim() || "",
      payment_method: payment_method?.trim() || "Cash",
      order_date: date,
    });

    res.json({ status: true, message: "Order Created Successfully" });
  } catch (err) {
    console.error(err);
    res.json({ status: false, message: "Order Failed" });
  }
});
*/
}
router.get("/get_orders.php", async (_req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders.map(formatOrder));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

router.put("/orders/:id", authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.quantity !== undefined)
      updates.quantity = Number(updates.quantity);
    if (updates.order_date) {
      const date = parseDate(updates.order_date);
      if (!date)
        return res
          .status(400)
          .json({ status: false, message: "Invalid order date" });
      updates.order_date = date;
    }
    const order = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!order)
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });
    res.json({
      status: true,
      message: "Order updated",
      order: formatOrder(order),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Update failed" });
  }
});

router.delete("/orders/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ status: false, message: "Order not found" });
    res.json({ status: true, message: "Order deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: "Delete failed" });
  }
});

module.exports = router;
