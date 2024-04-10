import {useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton, Grid, Autocomplete } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addContributors, getUsers } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';


export default function AddContributors(props) {
    const { open, onClose } = props;
    const [ users, setUsers ] = useState([])
    const [ selectedUsers, setSelectedUsers ] = useState([])
    const [ searchTerm, setSearchTerm ] = useState("")
    const dialogHeight = '60vh'
    const dialogWidth = '60vw'

    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
          label: 'The Lord of the Rings: The Return of the King',
          year: 2003,
        },
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
        {
          label: 'The Lord of the Rings: The Return of the King',
          year: 2003,
        },
    ]


    const styles = {
        dialogPaper: {
            minHeight: dialogHeight,
            // maxHeight: dialogHeight,
            minWidth: dialogWidth,
            // maxWidth: dialogWidth,
        },
        searchBar: {
            marginBottom: 2,
        }
    }

    useEffect(()=> {
        callAPI(getUsers, ["admin"], handleGetUsersSuccess, handleGetUsersError)
    },[])

    const handleGetUsersSuccess = (data) => {
        for (let each of data) {
            each["label"] = each["email"]
        }
        console.log(data)
        setUsers(data)
    } 

    const handleGetUsersError = (e) => {
        console.error(e)
    }

    const handleClose = () => {
        onClose()
    };

    const handleAddContributors = () => {
        // check that there is a processor selected
        // let body = {
        //     name: projectName,
        //     description: projectDescription,
        //     state: processors[selectedProcessor.idx].state,
        //     history: [],
        //     attributes: processors[selectedProcessor.idx].attributes,
        //     documentType: processors[selectedProcessor.idx].documentType,
        //     processorId: processors[selectedProcessor.idx].id,
        // }
        // callAPI(
        //     addContributors,
        //     [body],
        //     handleSuccessfulAPICall,
        //     (e) => console.error('unable to add contributors ',e)
        // )
    }

    const handleSuccessfulAPICall = () => {
        setTimeout(function() {
            window.location.reload()
          }, 500)
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="new-project-dialog"
            aria-describedby="new-project-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
              }}
        >
            <DialogTitle id="add-contributors-dialog-title">Add Contributors</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 8,
                }}
                >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers={true}>
            <DialogContentText
                // ref={descriptionElementRef}
                tabIndex={-1}
                component={'span'}
            >   
                <Grid container>
                    <Grid item xs={5}>
                        {/* <TextField
                            fullWidth
                            label="Contributor email"
                            variant="outlined" 
                            // size="small"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            sx={styles.searchBar}
                        /> */}
                        <Autocomplete
                            disablePortal
                            fullWidth
                            id="combo-box-demo"
                            options={users}
                            // sx={{ width: 300 }}
                            renderInput={(params) => <TextField  {...params} label="User" />}
                        />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={5}>
                        <p>
                            display added users
                        </p>
                    </Grid>
                </Grid>
            </DialogContentText>
            <Button 
                variant="contained"
                sx={{
                    position: 'absolute',
                    right: 10,
                    bottom: 10,
                }}
                onClick={handleAddContributors}
            >
                Add Contributor(s)
            </Button>
            </DialogContent>
        </Dialog>
    )
}

