import { useState, useEffect } from "react";
import { Container, Box, Avatar } from "@mui/material";
import AppBar from "../../components/AppBar";
import Button from "@mui/material/Button";
import axios from "axios";
import { useUserStore } from "../../../stores/userStore";
import Boards from "../Boards";


function HomePage() {
  const { userModel } = useUserStore();

  return (
    <Container maxWidth={false} disableGutters sx={{ height: "100vh" }}>
      <AppBar />
      <Boards />
    </Container>
  );
}

export default HomePage;
