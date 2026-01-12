import express from "express";
import multer from "multer";
import path from "path";
import {
  home,
  readData,
  sendData,
  updateData,
  deleteData,
} from "../controller/functionality.mjs";

const router = express.Router();

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
    file.originalname
  )}`;
  return dateString;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(import.meta.dirname, "../public"));
  },
  filename: (req, file, cb) => {
    const newFilename = imgName(file);
    cb(null, newFilename);
  },
});

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

router.get("/", home);
router.get("/:id", readData);
router.post("/", upload.single("profile_pic"), sendData);

router.put("/:id", upload.single("profile_pic"), updateData);

router.delete("/:id", deleteData);

//Error Route
router.use((error, req, res, next) => {
  if (error) {
    return res.json({ Error: error.message });
  }
  next();
});

export default router;
