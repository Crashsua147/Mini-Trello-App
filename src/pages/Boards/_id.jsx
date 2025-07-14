import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Container, Box, Avatar } from "@mui/material"
import AppBar from "~/components/AppBar"
import BoardBar from "./BoardBar"
import { ref, onValue, update } from "firebase/database"
import { dbClient } from "../../../firebaseClientConfig"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContentText from "@mui/material/DialogContentText"
import DialogActions from "@mui/material/DialogActions"
import { muiS } from "~/muiShortcut"
import DropdownIcon from "~/components/DropdownIcon"
import { Cards } from "../Cards"

function Board() {
  const { id } = useParams();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const cardsRef = ref(dbClient, "cards");

    const unsubscribe = onValue(cardsRef, (snapshot) => {
      const data = snapshot.val();
      const list = data
        ? Object.values(data).filter((card) => card.boardId === id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        : [];

      setCards(list);
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <Box>
      <AppBar />
      <BoardBar />
      <Cards cards={cards} />
    </Box>
  );
}

export default Board;
