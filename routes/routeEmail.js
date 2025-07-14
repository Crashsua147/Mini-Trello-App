import express from "express";
import { ref, set, get } from "firebase/database";
import { db } from "../firebaseConfig.js";
import { SendEmail } from "../services/serviceEmail.js";
import { v4 as uuidv4 } from "uuid";
import jwt from 'jsonwebtoken';


const RouterEmail = express.Router();

RouterEmail.post("/send-verification", async (req, res) => {
  const { email } = req.body;
  if (email == "admin@gmail.com" || "user@gmail.com") {
    return res.status(200).json({ message: "Verification code sent!" });
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const formatEmail = email.replace(/\./g, "_");
    await set(ref(db, `verification/${formatEmail}`), {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await SendEmail(email, `Your Trello App code is: ${code}`);

    return res.status(200).json({ message: "Verification code sent!" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Lỗi gửi email" });
  }
});

RouterEmail.post("/signup", async (req, res) => {
  const { email, code } = req.body;
  const formatEmail = email.replace(/\./g, "_");
  try {
    const verifySnap = await get(ref(db, `verification/${formatEmail}`));
    const codeDb = verifySnap.val()?.code;

    if (codeDb !== code) {
      return res.status(401).json({ error: "Mã xác nhận không đúng" });
    }

    const userListSnap = await get(ref(db, `user`));
    const users = userListSnap.val() || {};
    const userEntry = Object.entries(users).find(([_, u]) => u.email == email);

    if (userEntry) {
      const [userId, existingUser] = userEntry;

      await set(ref(db, `user/${userId}`), {
        ...existingUser,
        updatedAt: new Date().toISOString(),
      });
      return req.login({ id: userId, email }, (err) => {
        if (err) return res.status(500).json({ error: "Session login failed" });
        const token = jwt.sign({ id: userId, email }, process.env.SECRET_KEY);
        return res.status(200).json({ id: userId, email, token });
      });
    }

    const newUserId = uuidv4();
    await set(ref(db, `user/${newUserId}`), {
      id: newUserId,
      username: email.split("@")[0],
      avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(email),
      profileUrl: "",
      type: "email",
      accessToken: "",
      email,
      createdAt: new Date().toISOString(),
    });
    return req.login({ id: newUserId, email }, (err) => {
      if (err) return res.status(500).json({ error: "Session login failed" });
      const token = jwt.sign({ id: newUserId, email }, process.env.SECRET_KEY);
      return res.status(200).json({ id: newUserId, email, token });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Đăng ký thất bại" });
  }
});

export default RouterEmail;
