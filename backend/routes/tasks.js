import express from "express";
import pool from "../db.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Create Task
router.post("/", authenticate, async (req, res) => {
  console.log(req.user);
  const { title, dayOfWeek } = req.body;
  if (!title || !dayOfWeek) {
    return res.status(400).json({ error: "Title and day must be specified" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tasks (user_id, title, day_of_week) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title, dayOfWeek]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get Tasks
router.get("/", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reset all tasks
router.put("/reset", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE tasks SET completed = false WHERE user_id = $1 RETURNING *",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error resetting tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update Task
router.put("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { title, completed, dayOfWeek } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title), 
           completed = COALESCE($2, completed), 
           day_of_week = COALESCE($3, day_of_week)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
      [title, completed, dayOfWeek, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Task
router.delete("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
