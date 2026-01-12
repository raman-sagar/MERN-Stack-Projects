import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

export const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader != "undefined") {
      const token = bearerHeader.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);
      //console.log(user);
      req.token = user;
      next();
    } else {
      res.status(401).json({ message: "No token provided" });
    }
  } catch (error) {
    res.status(403).json({ message: "invalid or expired token" });
  }
};

export const limiter = rateLimit({
  windowMs: 1000 * 60,
  limit: 20,
  message: "Too may request from this IP,Please try again later",
});
