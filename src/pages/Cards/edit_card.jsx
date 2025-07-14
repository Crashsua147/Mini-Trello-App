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

export function EditCard({ cardId }) {
  const { id } = useParams();
  const { userModel } = useUserStore();
  const [card, setCard] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const isError = name.trim() == "";

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const editCard = async () => {
    const payload = {
      id: id,
      name: name.trim(),
      description: desc.trim(),
    };
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:4000/cards/${cardId}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOpen(false);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:4000/cards/${cardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCard(res.data);
        setName(res.data.name);
        setDesc(res.data.description);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box>
      <MenuItem onClick={handleClickOpen}>Edit Card</MenuItem>
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
          EDIT CARD
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
            fullWidth
            id="card-name"
            label="Card Name"
            error={isError}
            value={name}
            onChange={(e) => setName(e.target.value)}
            helperText={isError ? "Card name is required" : ""}
          />
          <TextField
            fullWidth
            id="card-desc"
            label="Card Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Box>
        <DialogActions>
          <Button onClick={editCard} disabled={isError}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
