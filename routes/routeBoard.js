import express from "express";
import { ref, set, get, update } from "firebase/database";
import { db } from "../firebaseConfig.js";
import { SendEmail } from "../services/serviceEmail.js";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';
import { authenticateJWT } from "../services/authJWT.js";


const RouteBoard = express.Router();

RouteBoard.get("/boards", authenticateJWT, async (req, res) => {
  try {
    const boardsSnap = await get(ref(db, `boards`));
    const boards = boardsSnap.val() || [];
    res.status(200).json(boards);
  } catch (error) {
    console.error("🧨 Fetch boards error:", error);
    res.status(500).json({ error: "Không lấy được danh sách board" });
  }
});

RouteBoard.post("/boards", authenticateJWT, async (req, res) => {
  try {
    const payload = req.body;
    const boardId = payload.id;

    await set(ref(db, `boards/${boardId}`), {
      id: boardId,
      name: payload.name,
      description: payload.description,
      imageUrl: payload.imageUrl,
      createdBy: payload.createdBy || req.user?.id || "",
      members: [],
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Tạo board thành công", id: boardId });
  } catch (error) {
    console.error("🔥 Create board error:", error);
    res.status(500).json({ error: "Không thể tạo board" });
  }
});

RouteBoard.get("/boards/:id", authenticateJWT, async (req, res) => {
  const boardId = req.params.id;

  try {
    const boardSnap = await get(ref(db, `boards/${boardId}`));
    const board = boardSnap.val();

    if (!board) {
      return res.status(404).json({ error: "Board không tồn tại" });
    }

    res.status(200).json({
      id: board.id,
      name: board.name,
      description: board.description,
      imageUrl: board.imageUrl,
      createdBy: board.createdBy,
      createdAt: board.createdAt,
      members: board.members || [],
    });
  } catch (error) {
    console.error("🧨 Fetch board detail error:", error);
    res.status(500).json({ error: "Không lấy được thông tin board" });
  }
});

RouteBoard.post("/boards/:id/invite", authenticateJWT, async (req, res) => {
  const boardId = req.params.id;
  const { members } = req.body;

  try {
    const boardRef = ref(db, `boards/${boardId}`);
    const snap = await get(boardRef);
    const boardData = snap.val();

    if (!boardData) {
      return res.status(404).json({ error: "Board không tồn tại." });
    }
    await update(boardRef, { members });

    res.status(200).json({
      success: true,
      updatedMembers: members
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error });
  }
});




export default RouteBoard;
