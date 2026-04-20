const express = require("express");
const Order = require("../models/Order");
const { authRequired, authOptional } = require("../middleware/auth");

const router = express.Router();

function newOrderId() {
  return `#NC-${Math.floor(1000 + Math.random() * 9000)}`;
}

router.post("/", authOptional, async (req, res) => {
  try {
    const {
      seatNumber,
      contact,
      billing,
      items,
      addons = [],
      subtotal,
      addonsTotal,
      discount = 0,
      total,
      couponCode = null,
    } = req.body || {};

    if (!seatNumber) return res.status(400).json({ error: "seatNumber is required" });
    if (!contact?.phone || !contact?.email) {
      return res.status(400).json({ error: "contact.phone and contact.email are required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    const order = await Order.create({
      orderId: newOrderId(),
      userId: req.userId || undefined,
      seatNumber,
      contact,
      billing: billing || undefined,
      items,
      addons,
      subtotal,
      addonsTotal,
      discount,
      total,
      couponCode,
    });

    return res.status(201).json({ order });
  } catch (err) {
    console.error("[orders/create] error:", err);
    return res.status(500).json({ error: "Could not place order" });
  }
});

router.get("/", authRequired, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ orders });
  } catch (err) {
    console.error("[orders/list] error:", err);
    return res.status(500).json({ error: "Could not load orders" });
  }
});

module.exports = router;
