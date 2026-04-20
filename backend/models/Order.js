const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const revealSchema = new mongoose.Schema(
  { label: String, value: String },
  { _id: false },
);

const addonSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    reveal: [revealSchema],
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    seatNumber: { type: String, required: true },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    billing: {
      name: String,
      address: String,
    },
    items: { type: [itemSchema], required: true },
    addons: { type: [addonSchema], default: [] },
    subtotal: { type: Number, required: true },
    addonsTotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: null },
    status: {
      type: String,
      enum: ["placed", "preparing", "served", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
