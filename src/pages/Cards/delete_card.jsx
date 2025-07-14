import { useState, useEffect } from "react";
import { Container, Box, Avatar } from "@mui/material";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";

export function DeleteCard({ cardId }) {
  const [open, setOpen] = useState(false);
  const [card, setCard] = useState();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const deleteCard = async () => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:4000/cards/${cardId}`, payload, {
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
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box>
      <MenuItem onClick={handleClickOpen}>Delete Card</MenuItem>
      <Dialog
        disablePortal
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ p: 2 }}
      >
        {card && <DialogTitle>DELETE CARD: {card.name}</DialogTitle>}
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 400,
          }}
        >
          ARE YOU SURE DELETE THIS CARD !!!
        </Box>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteCard}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
