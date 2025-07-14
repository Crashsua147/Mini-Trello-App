import { useState, useEffect } from "react";
import { Container, Box, Avatar } from "@mui/material";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import { useUserStore } from "../../../stores/userStore";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import MenuItem from "@mui/material/MenuItem";

export function AddTask({ cardId }) {
  const { id } = useParams();
  const { userModel } = useUserStore();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const isError = name.trim() == "";

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setName("");
    setDesc("");
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const tasId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const addTask = async () => {
    const payload = {
      id: tasId,
      name: name.trim(),
      description: desc.trim(),
      createdBy: userModel?.id,
    };
    const token = localStorage.getItem("token");
    await axios.post(
      `http://localhost:4000/boards/${id}/cards/${cardId}/tasks`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setOpen(false);
  };

  return (
    <Box>
      <MenuItem onClick={handleClickOpen}>Add Task</MenuItem>
      <Dialog
        disablePortal
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ p: 2 }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          ADD TASK
        </DialogTitle>
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 400,
          }}
        >
          <TextField
            autoFocus
            fullWidth
            id="task-name"
            label="Task Name"
            error={isError}
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText={isError ? "Card name is required" : ""}
          />
          <TextField
            autoFocus
            fullWidth
            id="task-desc"
            label="Task Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Box>
        <DialogActions>
          <Button onClick={addTask} disabled={isError}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
