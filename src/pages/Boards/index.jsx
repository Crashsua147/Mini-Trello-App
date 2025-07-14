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
import { ref, onValue } from "firebase/database";
import { dbClient } from "../../../firebaseClientConfig";
import { BoardAdd } from "./BoardAdd";
import { useNavigate } from "react-router-dom";

function Boards() {
  const { userModel } = useUserStore();
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    document.title = "Board";
    const boardsRef = ref(dbClient, "boards");

    const unsubscribe = onValue(boardsRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.values(data) : [];
      setBoards(list);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Container maxWidth={false}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <BoardAdd />
          {boards
            .filter((board) => board)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((board, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={board.id}>
                <Card
                  sx={{ maxWidth: "100%" }}
                  onClick={() => navigate(`/boards/${board.id}`)}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={board.imageUrl}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {board.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default Boards;
