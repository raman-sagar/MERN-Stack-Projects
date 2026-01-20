import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { body } from "express-validator";

export const protect = async (req, res, next) => {
  try {
    const BearerHeader = req.headers["authorization"];
    if (typeof BearerHeader !== "undefined") {
      const token = BearerHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "No token, access denied" });
    }
  } catch (error) {
    res.status(403).json({ message: "invalid or expired token" });
  }
};
export const formValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password field is required")
    .isLength({ min: 6, max: 10 })
    .withMessage("password must be 6 to 10 characters long"),
];

export const postForm = [
  body("title").notEmpty().withMessage("title field is required").trim(),
  body("newsPic").optional(),
  body("content").notEmpty().withMessage("content field is required").trim(),
  body("Published").optional(),
];
