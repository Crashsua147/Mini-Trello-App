import { useState, useEffect } from "react";
import { Container, Box, Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useUserStore } from "../../../stores/userStore";
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
import { ref, onValue } from "firebase/database";
import { dbClient } from "../../../firebaseClientConfig";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";

export function AddCard() {
  const { id } = useParams();
  const { userModel } = useUserStore();
  const [boards, setBoards] = useState([]);
  const [cardName, setCardName] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const isError = cardName.trim() == "";

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const idCard = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const createCard = async () => {
    const payload = {
      id: idCard,
      name: cardName.trim(),
      description: cardDesc.trim(),
    };
    const token = localStorage.getItem("token");
    await axios.post(`http://localhost:4000/boards/${id}/cards`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setOpen(false);
  };

  return (
    <Box key="addCard" sx={{ minWidth: 300 }}>
      <Grid size={{ xs: 6, md: 3 }}>
        <Card
          sx={{ maxWidth: "100%", cursor: "pointer" }}
          onClick={handleClickOpen}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
            <Typography variant="h6">Add Card</Typography>
          </Box>
        </Card>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            CREATE CARD
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                id="card-name"
                label="Card Name"
                error={isError}
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                helperText={isError ? "Card name is required" : ""}
              />
              <TextField
                id="card-desc"
                label="Card Description"
                value={cardDesc}
                onChange={(e) => setCardDesc(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={createCard} autoFocus disabled={isError}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Box>
  );
}
