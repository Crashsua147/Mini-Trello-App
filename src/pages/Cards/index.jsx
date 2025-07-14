import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Container, Box, Avatar } from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import AspectRatio from "@mui/joy/AspectRatio";
import { ref, onValue, update } from "firebase/database";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { muiS } from "~/muiShortcut";
import { IconToggleCard } from "./icon_toggle_card";
import { AddCard } from "./add_card";
import { dbClient } from "../../../firebaseClientConfig";
import Checkbox from "@mui/material/Checkbox";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import Tooltip from "@mui/material/Tooltip";
import { EditTask } from "../Task/edit_task";

const SortableItem = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksRef = ref(dbClient, `tasks`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      const list = data
        ? Object.values(data).filter((task) => task.cardId === card.id)
        : [];
      setTasks(list);
    });

    return () => unsubscribe();
  }, [card.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    minWidth: 300,
  };

  return (
    <Box ref={setNodeRef} {...attributes} sx={style}>
      <Card sx={{ height: "100%" }}>
        <Box
          sx={{
            ...muiS.dFlex,
            ...muiS.p1,
          }}
        >
          <Box {...listeners} sx={{ width: "100%", cursor: "pointer" }}>
            <Typography variant="h6">{card.name}</Typography>
          </Box>
          <IconToggleCard cardId={card.id} />
        </Box>

        {tasks.length > 0 && (
          <>
            {tasks.map((task) => (
              <EditTask key={task.id} task={task} />
            ))}
          </>
        )}
      </Card>
    </Box>
  );
};

export function Cards({ cards }) {
  const { id } = useParams();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const newIndex = cards.findIndex((c) => c.id === over.id);

    const movedCard = { ...cards[oldIndex] };
    const targetCard = { ...cards[newIndex] };

    await update(ref(dbClient, "cards"), {
      [movedCard.id]: { ...movedCard, createdAt: targetCard.createdAt },
      [targetCard.id]: { ...targetCard, createdAt: movedCard.createdAt },
    });
  };

  return (
    <Box
      sx={{
        overflowX: "auto",
        display: "flex",
        gap: 2,
        p: 2,
        minHeight: (theme) =>
          `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      }}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={cards} strategy={rectSortingStrategy}>
          {cards.map((x) => (
            <SortableItem key={x.id} card={x} />
          ))}
        </SortableContext>
      </DndContext>
      <AddCard />
    </Box>
  );
}
