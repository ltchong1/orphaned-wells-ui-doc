import './Header.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, IconButton, Avatar } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout } from '../../assets/helperFunctions';

export default function Header(props) {
  let navigate = useNavigate();
  const [ actionsList, setActionsList ] = useState(false)
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ anchorAr, setAnchorAr ] = useState(null);
  const [ profileActions, setProfileActions ] = useState(false)

  const styles = {
    icon: {
      top: 5,
      color: "black",
      right: 5
    },
    avatar: {
      width: 24,
      height: 24
    }
  }

  const handleNavigateHome = () => {
      // setActionsList(!actionsList)
      navigate("/", {replace: true})
  }

  const handleShowActions = (event) => {
    setActionsList(!actionsList)
    setAnchorEl(event.currentTarget);
  }

  const handleShowProfileActions = (event) => {
    setProfileActions(!actionsList)
    setAnchorAr(event.currentTarget);
  }

    return (
      <div id="Header">
         <div  className="titlebar" > 
          {/* <div id="nawi_logo" style={{cursor:'pointer'}} onClick={handleNavigateHome}>
            <img src={logo} alt="UOW logo"/>
          </div> */}
        <IconButton sx={styles.icon} onClick={handleShowActions}><ListIcon/></IconButton>
        <Menu
          id="actions-list"
          anchorEl={anchorEl}
          open={actionsList}
          onClose={() => setActionsList(false)}
        >
            <MenuItem onClick={handleNavigateHome}>Return to list page</MenuItem>
        </Menu>
        <div id="titlebar-name" style={{cursor:'pointer'}} onClick={handleNavigateHome}>
          CATALOG
        </div>
        <div  className="right" >
        <IconButton sx={styles.icon} onClick={handleShowProfileActions}>
          <Avatar sx={styles.avatar} alt={localStorage.getItem("user_name")} src={localStorage.getItem("user_picture")}/>
        </IconButton>
          
          {/* <IconButton sx={styles.icon} onClick={handleShowProfileActions}><AccountCircleIcon/></IconButton> */}
          <Menu
            id="actions-list"
            anchorEl={anchorAr}
            open={profileActions}
            onClose={() => setProfileActions(false)}
          >
              <MenuItem onClick={logout}>Sign out</MenuItem>
          </Menu>
        </div>
      </div> 
      </div>
    );
}

