import mongoose from "mongoose";

const schema = new mongoose.Schema({
  first_name: { type: String, require: true },
  last_name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  gender: { type: String, enum: ["male", "female", "other"], require: true },
  profile_pic: { type: String },
});

export const Student = mongoose.model("student", schema);
