const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken, authRequired } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "name, email, phone, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      passwordHash,
    });
    const token = signToken(user);
    return res.status(201).json({ user: user.toPublic(), token });
  } catch (err) {
    console.error("[auth/register] error:", err);
    return res.status(500).json({ error: "Could not create account" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    const token = signToken(user);
    return res.json({ user: user.toPublic(), token });
  } catch (err) {
    console.error("[auth/login] error:", err);
    return res.status(500).json({ error: "Could not sign in" });
  }
});

router.get("/me", authRequired, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user: user.toPublic() });
  } catch (err) {
    console.error("[auth/me] error:", err);
    return res.status(500).json({ error: "Could not load account" });
  }
});

module.exports = router;
