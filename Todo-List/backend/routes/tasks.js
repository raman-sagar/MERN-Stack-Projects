const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// GET /api/tasks - Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks - Get single task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tasks - Create a new task
router.post("/task", async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    if (!title || !description || !status ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const task = await Task.create({ title, description, status, dueDate });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// PUT /api/tasks/:id - Update a task
router.put("/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
