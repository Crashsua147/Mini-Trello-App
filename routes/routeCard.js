import express from "express";
import { ref, set, get, update } from "firebase/database";
import { db } from "../firebaseConfig.js";
import { SendEmail } from "../services/serviceEmail.js";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
import { authenticateJWT } from "../services/authJWT.js";


const RouteCard = express.Router();

RouteCard.post("/boards/:id/cards", authenticateJWT, async (req, res) => {
  try {
    const boardId = req.params.id;
    const payload = req.body;
    const cardId = payload.id;

    await set(ref(db, `cards/${cardId}`), {
      id: cardId,
      name: payload.name,
      description: payload.description,
      boardId: boardId,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Tạo card thành công", id: cardId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Không thể tạo card" });
  }
});

RouteCard.get("/cards/:id", authenticateJWT, async (req, res) => {
  try {
    const cardId = req.params.id;

    const snapshot = await get(ref(db, `cards/${cardId}`));

    if (!snapshot.exists()) {
      return res.status(404).json({ error: "Card không tồn tại" });
    }

    const cardData = snapshot.val();

    res.status(200).json(cardData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Không thể lấy card" });
  }
});

// update card by id
RouteCard.put("/cards/:id", authenticateJWT, async (req, res) => {
  try {
    const cardId = req.params.id;
    const { name, description } = req.body;

    await update(ref(db, `cards/${cardId}`), {
      name: name.trim(),
      description: description?.trim() || "",
    });

    res.status(200).json({ message: "Cập nhật card thành công", id: cardId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Không thể cập nhật card" });
  }
});

//delete card by id
RouteCard.delete("/cards/:id", authenticateJWT, async (req, res) => {
  try {
    const cardId = req.params.id;

    await remove(ref(db, `cards/${cardId}`));

    res.status(200).json({ message: "Xóa card thành công", id: cardId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Không thể xóa card" });
  }
});

export default RouteCard;
