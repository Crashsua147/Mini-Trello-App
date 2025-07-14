import express from "express";
import { ref, set, get } from "firebase/database";
import { db } from "../firebaseConfig.js";
import { authenticateJWT } from "../services/authJWT.js";


const RouteUser = express.Router();

RouteUser.get("/users", authenticateJWT, async (req, res) => {
  try {
    const snap = await get(ref(db, `user`));
    const users = snap.val() || [];
    const userArray = Object.values(users);
    res.status(200).json(userArray);
  } catch (error) {
    console.error("Rrror:", error);
    res.status(500).json({ error: error });
  }
});

RouteUser.get("/user/:id", authenticateJWT, async (req, res) => {
    const userId = req.params.id;
  try {
    const snap = await get(ref(db, `user/${userId}`));
    const user = snap.val();
    res.status(200).json(user);
  } catch (error) {
    console.error("Rrror:", error);
    res.status(500).json({ error: "Không tìm thấy user" });
  }
});
/// Lấy users theo ids
RouteUser.post("/users/batch", authenticateJWT, async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Danh sách IDs không hợp lệ." });
  }

  try {
    const snap = await get(ref(db, `user`));
    const allUsers = snap.val() || {};
    const selectedUsers = ids
      .map((id) => allUsers[id])
      .filter(Boolean);
    res.status(200).json(selectedUsers);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error });
  }
});

export default RouteUser;
