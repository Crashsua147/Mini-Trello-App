
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Board from './pages/Boards/_id'
import Login from './pages/Login'
import RequireAuth from './components/RequireAuth'
import Button from "@mui/material/Button";
import { Container, Box } from "@mui/material";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/Helo"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/boards"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />
        <Route
          path="/boards/:id"
          element={
            <RequireAuth>
              <Board />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
