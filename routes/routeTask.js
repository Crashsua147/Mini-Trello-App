import express from "express";
import { ref, set, get, update } from "firebase/database";
import { db } from "../firebaseConfig.js";
import { SendEmail } from "../services/serviceEmail.js";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
import { authenticateJWT } from "../services/authJWT.js";


const RouteTask = express.Router();

RouteTask.post("/boards/:boardId/cards/:cardId/tasks", authenticateJWT, async (req, res) => {
  try {
    const { boardId, cardId } = req.params;
    const payload = req.body;
    const taskId = payload.id;

    const taskData = {
      id: taskId,
      name: payload.name,
      description: payload.description,
      boardId: boardId,
      cardId: cardId,
      status: payload.status || 0,
      createdAt: new Date().toISOString(),
      createdBy: payload.createdBy || req.user?.id || "unknown",
    };

    await set(ref(db, `tasks/${taskId}`), taskData);

    res.status(201).json({ message: "Tạo task thành công", id: taskId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Không thể tạo task" });
  }
});

// update task by id
RouteTask.put("/tasks/:id", authenticateJWT, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { name, description } = req.body;

    await update(ref(db, `tasks/${taskId}`), {
      name: name.trim(),
      description: description?.trim() || "",
    });

    res.status(200).json({ message: "Cập nhật task thành công", id: taskId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Không thể cập nhật task" });
  }
});

export default RouteTask;
