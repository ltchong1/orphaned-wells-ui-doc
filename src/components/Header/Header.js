import './Header.css';
import React from 'react';
import logo from "../../assets/CATALOG-logo.png";
import { useNavigate } from "react-router-dom";
import { Button, Menu, MenuItem, IconButton } from '@mui/material';
import ListIcon from '@mui/icons-material/List';

export default function Header(props) {
  let navigate = useNavigate();
  const [ actionsList, setActionsList ] = React.useState(false)
  const [ anchorEl, setAnchorEl ] = React.useState(null);

  const handleNavigateHome = () => {
      // setActionsList(!actionsList)
      navigate("/", {replace: true})
  }

  const handleShowActions = (event) => {
    setActionsList(!actionsList)
    setAnchorEl(event.currentTarget);
  }
    return (
      <div id="Header">
         <div  className="titlebar" > 
          {/* <div id="nawi_logo" style={{cursor:'pointer'}} onClick={handleNavigateHome}>
            <img src={logo} alt="UOW logo"/>
          </div> */}
        <div id="titlebar-name" style={{cursor:'pointer'}} onClick={handleNavigateHome}>
          CATALOG
        </div>
        <div  className="right" >
        <IconButton style={{ color:"black" }} onClick={handleShowActions}><ListIcon/></IconButton>
        <Menu
          id="actions-list"
          anchorEl={anchorEl}
          open={actionsList}
          onClose={() => setActionsList(false)}
        >
            <MenuItem onClick={handleNavigateHome}>Return to list page</MenuItem>
        </Menu>
        </div>
      </div> 
      </div>
    );
}

