import { useState, useEffect } from "react";
import { Container, Box, Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import BackgroundBoards from "~/assets/background-boards.jpeg";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { ref, onValue, update } from "firebase/database";
import { dbClient } from "../../../firebaseClientConfig";
import { v4 as uuidv4 } from "uuid";
import { muiS } from "~/muiShortcut";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import AvatarGroup from '@mui/joy/AvatarGroup'
import PersonAddIcon from "@mui/icons-material/PersonAdd"
import PersonIcon from '@mui/icons-material/Person';

export function EditTask({ task }) {
  const [boards, setBoards] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [name, setName] = useState(task.name);
  const [desc, setDesc] = useState(task.description);
  const [comment, setComment] = useState("");
  const isError = name.trim() == "";

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setName(task.name);
    setDesc(task.description);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleToggleTask = async () => {
    const newStatus = task.status == 1 ? 0 : 1;

    try {
      await update(ref(dbClient, `tasks/${task.id}`), { status: newStatus });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const editTask = async () => {
    const payload = {
      id: task.id,
      name: name.trim(),
      description: desc.trim(),
    };
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:4000/tasks/${task.id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOpen(false);
  };

  return (
    <>
      <Card
        key={task.id}
        sx={{
          backgroundColor: "#efbcbc",
          m: 1,
          p: 2,
        }}
      >
        <Box sx={{ ...muiS.dFlex, ...muiS.jcBetween, pb: 1 }}>
          <Box sx={{ ...muiS.dFlex, ...muiS.aiCenter, gap: 1 }}>
            <Checkbox
              sx={{ p: 0 }}
              checked={task.status != 0}
              onChange={handleToggleTask}
              icon={<RadioButtonUncheckedIcon />}
              checkedIcon={<CheckCircleIcon />}
            />
            <Typography variant="body2">{task.name}</Typography>
          </Box>
          <Tooltip
            title="Edit Task"
            onClick={handleClickOpen}
            sx={{ ...muiS.cursor }}
          >
            <EditSquareIcon />
          </Tooltip>
        </Box>
        <Box sx={{ ...muiS.dFlex, ...muiS.aiCenter, gap: 1 }}>
          {task?.description && (
            <Tooltip title="This card has description">
              <Box sx={{ ...muiS.dFlex, ...muiS.cursor }}>
                <DescriptionIcon />
              </Box>
            </Tooltip>
          )}
          <Tooltip title="This card has comment">
            <Box sx={{ ...muiS.dFlex, ...muiS.cursor }}>
              <ChatBubbleOutlineIcon /> 1
            </Box>
          </Tooltip>
          <Tooltip title="This card has members">
            <Box sx={{ ...muiS.dFlex, ...muiS.cursor }}>
              <PersonIcon /> 3
            </Box>
          </Tooltip>
        </Box>
      </Card>
      <Dialog fullWidth maxWidth="false" open={open} onClose={handleClose}>
        <Box sx={{ pt: 2, px: 1 }}>
          <TextField
            fullWidth
            id="task-name"
            label="Task Name"
            error={isError}
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText={isError ? "Task name is required" : ""}
          />
        </Box>
        <>
          <Grid container spacing={2} sx={{ p: 1 }}>
            <Grid size={{ md: 6, xs: 12 }}>
              <Box sx={{ pt: 1 }}>
                <TextField
                  label="Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  multiline
                  rows={5}
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, pt: 1 }}
              >
                <Box>Members:</Box>
                <AvatarGroup sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title="admin@gmail.com" key="0">
                    <Avatar src="" alt="avatar" sx={{ cursor: "pointer" }} />
                  </Tooltip>
                  <Avatar
                    sx={{
                      backgroundColor: "#ccc",
                      cursor: "default",
                    }}
                  >
                    +3
                  </Avatar>
                </AvatarGroup>
                <Tooltip title="Add members">
                  <Avatar>
                    <PersonAddIcon />
                  </Avatar>
                </Tooltip>
              </Box>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Box sx={{ pt: 1 }}>
                <TextField
                  label="Write your comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  variant="outlined"
                  fullWidth
                />
              </Box>
              <Box sx={{ ...muiS.dFlex, ...muiS.flexDirectionColumn, pt: 1 }}>
                <Box sx={{ ...muiS.dFlex, gap: 1 }}>
                  <Avatar />
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{ backgroundColor: "#ebe5e5", borderRadius: 2, p: 1 }}
                    >
                      <Box sx={{ fontWeight: "bold" }}>Admin</Box>
                      <Box>Chat content</Box>
                    </Box>

                    <Box sx={{ pl: 1, ...muiS.cursor }}>
                      <Tooltip title="13:20 14/07/2025">1h</Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ ...muiS.dFlex, ...muiS.flexDirectionColumn, pt: 1 }}>
                <Box sx={{ ...muiS.dFlex, gap: 1 }}>
                  <Avatar />
                  <Box sx={{ width: "100%" }}>
                    <Box
                      sx={{ backgroundColor: "#ebe5e5", borderRadius: 2, p: 1 }}
                    >
                      <Box sx={{ fontWeight: "bold" }}>Admin</Box>
                      <Box>Chat content</Box>
                    </Box>

                    <Box sx={{ pl: 1, ...muiS.cursor }}>
                      <Tooltip title="13:20 14/07/2025">1h</Tooltip>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
        <DialogActions>
          <Button onClick={editTask} disabled={isError}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
