import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PersonIcon from "@mui/icons-material/Person";
import AvatarGroup from "@mui/joy/AvatarGroup";
import Tooltip from "@mui/material/Tooltip";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { BoardAddMembers } from "../BoardAddMembers.js";
import { ref, onValue } from "firebase/database";
import { dbClient } from "../../../../firebaseClientConfig.js";

export function BoardBar() {
  const { id } = useParams();
  const [boardData, setBoardData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const boardsRef = ref(dbClient, `boards/${id}`);

    const unsubscribe = onValue(boardsRef, (snapshot) => {
      const data = snapshot.val();
      setBoardData(data || null);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!boardData?.createdBy) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:4000/user/${boardData.createdBy}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(res.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [boardData]);

  const [memberUsers, setMemberUsers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!boardData?.members?.length) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          "http://localhost:4000/users/batch",
          { ids: boardData.members },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMemberUsers(res.data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchMembers();
  }, [boardData]);

  return (
    <Box sx={{ height: (theme) => theme.trello.boardBarHeight }}>
      {boardData ? (
        <Box
          sx={{
            background: "#efbcbc",
            width: "100%",
            height: (theme) => theme.trello.boardBarHeight,
            display: "flex",
            justifyItems: "center",
            justifyContent: "space-between",
            padding: 2,
            color: "white",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
          >
            {boardData.name}
          </Box>

          {userData ? (
            <Tooltip title={`Owner: ${userData.email}`}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
              >
                <Box>Ower:</Box>
                <Avatar src={userData.avatar} alt={userData.username} />
              </Box>
            </Tooltip>
          ) : loadingUser ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar>
                <CircularProgress size={24} />
              </Avatar>
            </Box>
          ) : (
            <Avatar>
              <PersonIcon />
            </Avatar>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box>Members:</Box>
            <AvatarGroup sx={{ display: "flex", alignItems: "center" }}>
              {memberUsers.slice(0, 3).map((user, index) => (
                <Tooltip
                  title={user.username}
                  key={`${user.username}_${index}`}
                >
                  <Avatar
                    src={user.avatar}
                    alt={user.username}
                    sx={{ cursor: "pointer" }}
                  />
                </Tooltip>
              ))}

              {memberUsers.length > 3 && (
                <Avatar
                  sx={{
                    backgroundColor: "#ccc",
                    cursor: "default",
                  }}
                >
                  +{memberUsers.length - 3}
                </Avatar>
              )}
            </AvatarGroup>

            <BoardAddMembers members={boardData.members || []} />
          </Box>
        </Box>
      ) : (
        <p></p>
      )}
    </Box>
  );
}
