import express from "express";
import BlogPost from "../models/BlogPost.js";
import { protect, postForm } from "../middleware/auth.js";
import { validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import fs from "fs";
const router = express.Router();
//Rename the uploded file
const imgName = (file) => {
  let date = new Date();
  let fullYear = date.getFullYear();
  let month = date.getMonth() + 1;
  let today_date = date.getDate();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  //Two digit format
  month = month < 10 ? "0" + month : month;
  today_date = today_date < 10 ? "0" + today_date : today_date;

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  let dateString = `IMG_${fullYear}${month}${today_date}_${hours}${minutes}${seconds}${path.extname(
    file.originalname,
  )}`;
  return dateString;
};
//Storage location
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(import.meta.dirname, "../public"));
  },
  filename: (req, file, cb) => {
    const newFilename = imgName(file);
    cb(null, newFilename);
  },
});
//File Filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only Images are allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});
// Get all public posts
router.get("/", async (req, res) => {
  try {
    const posts = await BlogPost.find({ published: true })
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's posts (protected)
router.get("/my-posts", protect, async (req, res) => {
  try {
    const posts = await BlogPost.find({ author: req.user._id })
      .populate("author", "email")
      .sort({
        createdAt: -1,
      });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create post (protected)
router.post(
  "/",
  protect,
  upload.single("newsPic"),
  postForm,
  async (req, res) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
      try {
        const { title, content } = req.body;
        const published = req.body.published === "on";
        const post = new BlogPost({
          title,
          content,
          published,
          author: req.user._id,
        });
        if (req.file) {
          post.newsPic = req.file.filename;
        }
        const savedPost = await post.save();
        return res.status(201).json(savedPost);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    } else {
      if (req.file.filename) {
        const filePath = path.join(
          import.meta.dirname,
          "../public",
          req.file.filename,
        );
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log(`Image Deletion Error:${error.message}`);
          }
        });
      }
      res.status(401).json({ message: error.array()[0].msg });
    }
  },
);

// Update post (protected)
router.put("/:id", protect, upload.single("newsPic"), async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!post) {
      if (req.file.filename) {
        const filePath = path.join(
          import.meta.dirname,
          "../public",
          req.file.filename,
        );
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log(`Image Deletion Error:${error.message}`);
          }
        });
      }

      return res.status(404).json({ message: "Post not found" });
    }
    if (req.file) {
      if (post.newsPic) {
        const filePath = path.join(
          import.meta.dirname,
          "../public",
          post.newsPic,
        );
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log(`Image Deletion Error:${error.message}`);
          }
        });
      }
      req.body.newsPic = req.file.filename;
    }

    req.body.published = req.body.published === "on";

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete post (protected)
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await BlogPost.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.newsPic) {
      const filePath = path.join(
        import.meta.dirname,
        "../public",
        post.newsPic,
      );
      fs.unlink(filePath, (error) => {
        if (error) {
          console.log(`Image Deletion Error:${error.message}`);
        }
      });
    }
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
