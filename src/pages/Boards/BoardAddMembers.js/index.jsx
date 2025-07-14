import { useState, useEffect } from "react"
import { Container, Box, Avatar } from "@mui/material"
import { useParams } from "react-router-dom"
import Button from "@mui/material/Button"
import axios from "axios"
import { useUserStore } from "../../../../stores/userStore"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"
import PersonAddIcon from "@mui/icons-material/PersonAdd"

function BoardAddMembers({ members }) {
  const { id } = useParams();
  const { userModel } = useUserStore();
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => { 
    setSelectedIds([...members]);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const addMembers = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:4000/boards/${id}/invite`,
        {
          members: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:4000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box>
      <Tooltip title="Add Members">
        <Avatar onClick={handleClickOpen} sx={{ cursor: "pointer" }}>
          <PersonAddIcon />
        </Avatar>
      </Tooltip>
      <Dialog
      disablePortal
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          MEMBERS
        </DialogTitle>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            pl: 2,
            pr: 2,
          }}
        >
          {users.map((user, index) => {
            const isSelected = selectedIds.includes(user.id);
            return (
              <Box
                key={index}
                onClick={() => {
                  setSelectedIds((prevSelected) =>
                    prevSelected.includes(user.id)
                      ? prevSelected.filter((id) => id !== user.id)
                      : [...prevSelected, user.id]
                  );
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  border: isSelected
                    ? "2px solid #1976d2"
                    : "1px solid transparent",
                  backgroundColor: isSelected ? "#e3f2fd" : "transparent",
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              >
                <Avatar src={user.avatar} />
                <Box>{user.username}</Box>
              </Box>
            );
          })}
        </Box>
        <DialogActions>
          <Button onClick={addMembers}>Add Members</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BoardAddMembers;
