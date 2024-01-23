import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Grid, IconButton, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Work from '@mui/icons-material/Work';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function Subheader(props) {
    const { currentPage } = props;

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
        }
    }

    return (
        <Box sx={styles.box}>
            <Grid container sx={styles.gridContainer}>
                <Grid item xs={6} >
                    <div style={styles.directoryDispaly}>
                        <IconButton sx={styles.iconButton}><HomeIcon sx={styles.icon}/></IconButton> 
                        /
                        <IconButton sx={styles.iconButton}><MoreHorizIcon sx={styles.icon}/></IconButton> 
                        / 
                        <Button sx={styles.iconButton} size="small" startIcon={<Work/>}>{currentPage}</Button>
                        {/* <IconButton sx={styles.iconButton}><Work sx={styles.icon}/></IconButton> 
                        {currentPage} */}
                    </div>
                    <div style={styles.pageName}>
                        {currentPage}
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={styles.newProjectColumn}>
                        <Button variant="contained">
                            New Project
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            
        </Box>
    );
}

