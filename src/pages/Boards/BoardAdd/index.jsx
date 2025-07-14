import { useState, useEffect } from "react";
import { Container, Box, Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { useUserStore } from "../../../../stores/userStore";
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
import { dbClient } from "../../../../firebaseClientConfig";
import { v4 as uuidv4 } from "uuid";

function BoardAdd() {
  const { userModel } = useUserStore();
  const [boards, setBoards] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [boardName, setBoardName] = useState("");
    const [boardDesc, setBoardDesc] = useState("");
  const isError = boardName.trim() == "";

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const id = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const createBoard = async () => {
    const payload = {
      id: id,
      name: boardName.trim(),
      description:  boardDesc.trim(),
      imageUrl: backgrounds[selectedIndex],
      createdBy: userModel?.id,
    };
     const token = localStorage.getItem("token");
     await axios.post("http://localhost:4000/boards", payload, {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

    setOpen(false);
  };

  const backgrounds = [
    "https://images.unsplash.com/photo-1742156345582-b857d994c84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDF8MzE3MDk5fHx8fHwyfHwxNzUyMjc2MTUwfA&ixlib=rb-4.1.0",
    "https://images.unsplash.com/photo-1741812191037-96bb5f12010a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MDY2fDB8MXxjb2xsZWN0aW9ufDJ8MzE3MDk5fHx8fHwyfHwxNzUyMjc2MTUwfA&ixlib=rb-4.1.0",
  ];

  return (
    <Grid size={{ xs: 6, md: 3 }}>
      <Card
        sx={{ maxWidth: "100%", cursor: "pointer" }}
        onClick={handleClickOpen}
      >
        <CardActionArea sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="210"
            image={BackgroundBoards}
            alt="Create Board"
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.4)",
              color: "#fff",
              zIndex: 1,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Create Board
            </Typography>
          </Box>
        </CardActionArea>
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
          CREATE BOARD
        </DialogTitle>
        <DialogContent>
          <Box>Background</Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {backgrounds.map((bg, index) => (
              <Box
                key={index}
                component="img"
                src={bg}
                onClick={() => setSelectedIndex(index)}
                sx={{
                  height: 60,
                  width: 60,
                  border:
                    selectedIndex === index
                      ? "2px solid #1976d2"
                      : "2px solid transparent",
                  borderRadius: 2,
                  cursor: "pointer",
                  boxShadow:
                    selectedIndex === index
                      ? "0 0 6px rgba(25, 118, 210, 0.6)"
                      : "none",
                  transition: "0.3s ease",
                }}
              />
            ))}
          </Box>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column',  gap: 2 }}>
            <TextField
              id="board-name"
              label="Board Name"
              error={isError}
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              helperText={isError ? "Board title is required" : ""}
            />
              <TextField
              id="board-desc"
              label="Board Description"
              value={boardDesc}
              onChange={(e) => setBoardDesc(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={createBoard} autoFocus disabled={isError}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default BoardAdd;
