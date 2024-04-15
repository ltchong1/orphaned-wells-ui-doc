import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Grid, IconButton, Box, Menu, MenuItem } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Work from '@mui/icons-material/Work';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function Subheader(props) {
    let navigate = useNavigate();
    const { currentPage, buttonName, subtext, handleClickButton, disableButton, upFunction, previousPages, actions, topLevel } = props;
    const [ showActions, setShowActions ] = useState(false)
    const [ anchorEl, setAnchorEl ] = useState(null);
    const styles = {
        iconButton: {
            top: -5,
            color: "black",
        },
        icon: {
            fontSize: "15px"
        },
        box: {
            paddingTop: 5,
            paddingBottom: 5,
            backgroundColor: "white",
            width: "100%"
        },
        gridContainer: {
            margin: 0,
            padding: 0,
        },
        directoryDispaly: {
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: 40,
            overflow: "scroll",
            width: "80vw"
        },
        pageName: {
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: 50,
            fontSize: "25px"
        },
        newProjectColumn: {
            display: "flex",
            justifyContent: "flex-end",
            marginRight: 5,
            marginTop: 3
        },
        subtext: {
            marginTop: 2,
            display: "flex",
            justifyContent: "flex-start",
            marginLeft: 50,
            fontSize: "15px"
        }
    }

    const handleNavigate = (path) => {
        navigate(path, {replace: true})
    }

    const handleShowActions = (event) => {
        setShowActions(!showActions)
        setAnchorEl(event.currentTarget);
    }

    const handleSelectAction = (action_func) => {
        setShowActions(false)
        action_func()
    }

    return (
        <Box sx={styles.box}>
            <Grid container sx={styles.gridContainer}>
                <Grid item xs={9} >
                    <div style={styles.directoryDispaly}>
                        <IconButton sx={styles.iconButton} onClick={() => handleNavigate("/")}><HomeIcon sx={styles.icon}/></IconButton> 
                        /
                        {
                            previousPages && 
                            Object.entries(previousPages).map(([page, pageAction]) => (
                                <Fragment key={page}>
                                    <Button sx={styles.iconButton} size="small" onClick={pageAction}>{page}</Button>
                                    /
                                </Fragment>
                            ))
                        }
                        
                        {/* {
                            !topLevel && 
                            <>
                                <IconButton sx={styles.iconButton} onClick={upFunction}><MoreHorizIcon sx={styles.icon}/></IconButton> 
                                /
                            </>
                        } */}
                        
                        <Button sx={styles.iconButton} size="small">{currentPage}</Button>
                    </div>
                    <div style={styles.pageName}>
                        {currentPage}&nbsp;
                        {actions !== undefined && 
                            <>
                            <IconButton onClick={handleShowActions}><MoreHorizIcon sx={styles.icon}/></IconButton>
                            <Menu
                                id="actions"
                                anchorEl={anchorEl}
                                open={showActions}
                                onClose={() => setShowActions(false)}
                            >
                                {Object.entries(actions).map(([action_text, action_func]) => (
                                    <MenuItem key={action_text} onClick={() => handleSelectAction(action_func)}>{action_text}</MenuItem>
                                ))}
                            </Menu>
                            </>
                        }
                        
                    </div>
                    <div style={styles.subtext}>
                        {subtext}
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={styles.newProjectColumn}>
                        {buttonName && 
                            <Button variant="contained" onClick={handleClickButton} disabled={disableButton}>
                                {buttonName}
                            </Button>
                        }
                        
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

