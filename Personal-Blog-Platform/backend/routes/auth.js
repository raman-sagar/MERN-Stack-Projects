import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import { formValidation } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", formValidation, async (req, res) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const user = await User.create({ email, password: hashPassword });
      return res.status(201).json({
        user: { id: user._id, email: user.email },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: error.array()[0].msg });
  }
});

router.post("/login", formValidation, async (req, res) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        token,
        user: { id: user._id, email: user.email },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: error.array()[0].msg });
  }
});

export default router;
