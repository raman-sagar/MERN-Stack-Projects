import { Student } from "../models/schema.mjs";
import path from "path";
import fs from "fs";

export const home = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit; //(Page No. - 1) * limit
    const search = req.query.search || "";
    const query = {
      $or: [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
      ],
    };
    const total = await Student.countDocuments(query);

    const Students = await Student.find(query).skip(skip).limit(limit);
    res.json({
      totalRecords: total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
      Students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const readData = async (req, res) => {
  try {
    const single_record = await Student.findById(req.params.id);
    if (!single_record) {
      return res.status(404).json({ message: "Stundent not found" });
    }
    res.json(single_record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendData = async (req, res) => {
  try {
    const student = new Student(req.body);
    if (req.file) {
      student.profile_pic = req.file.filename;
    }
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateData = async (req, res) => {
  try {
    const record = await Student.findById(req.params.id);
    if (!record) {
      if (req.file.filename) {
        const filePath = path.join(
          import.meta.dirname,
          "../public",
          req.file.filename
        );
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log("Image deletion error:", error);
          }
        });
      }

      return res.status(404).json({ message: "Student not found" });
    }

    if (req.file) {
      if (record.profile_pic) {
        const filePath = path.join(
          import.meta.dirname,
          "../public",
          record.profile_pic
        );
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log("Image deletion error:", error);
          }
        });
      }
      req.body.profile_pic = req.file.filename;
    }

    const updatedStundent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStundent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(updatedStundent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteData = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (student.profile_pic) {
      const filePath = path.join(
        import.meta.dirname,
        "../public",
        student.profile_pic
      );
      fs.unlink(filePath, (error) => {
        if (error) {
          console.log("Image deletion error:", error);
        }
      });
    }
    res.json({ message: "Student Record deleted successfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
