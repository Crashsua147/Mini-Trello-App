import { useState, useEffect } from "react"
import { Container, Box, Avatar } from "@mui/material"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import IconButton from "@mui/material/IconButton"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { AddTask } from "./add_task"
import { EditCard } from "./edit_card"
import { DeleteCard } from "./delete_card"


export function IconToggleCard( {cardId} ) {
 const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const menuId = "dropdown-icon-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <AddTask cardId={cardId} />
      <EditCard cardId={cardId} />
      <DeleteCard cardId={cardId} />
    </Menu>
  );

  return (
    <>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
  <MoreHorizIcon />
      </IconButton>
      {renderMenu}
    </>
  );
}
