import {useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import { Box, TextField, IconButton, Grid, Autocomplete } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addContributors, getUsers } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';


export default function AddContributors(props) {
    let params = useParams(); 
    const { open, onClose } = props;
    const [ users, setUsers ] = useState([])
    const [ selectedUsers, setSelectedUsers ] = useState([])
    const [ searchTerm, setSearchTerm ] = useState(null)
    const dialogHeight = '60vh'
    const dialogWidth = '60vw'

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
    },[props])

    const handleGetUsersSuccess = (data) => {
        let i = 0
        let userIdx
        for (let each of data) {
            each["label"] = each["email"]
            if (each["email"] === localStorage.getItem("user_email")) userIdx = i
            i+=1
        }
        try {
            data.splice(userIdx,1)
        } catch(e) {
            console.log("unable to remove current user")
        }
        
        setUsers(data)
        setSearchTerm(null)
        setSelectedUsers([])
    } 

    const handleGetUsersError = (e) => {
        console.error(e)
    }

    const handleClose = () => {
        onClose()
    };

    const handleAddContributors = () => {
        let body = {
            users: selectedUsers,
        }
        callAPI(
            addContributors,
            [params.id, body],
            handleSuccessfulAPICall,
            (e) => console.error('unable to add contributors ',e)
        )
    }

    const handleAutocompleteAdd = (value) => {
        if (value === null || value === "") return
        let tempSelectedUsers = [...selectedUsers]
        tempSelectedUsers.push(value)
        setSelectedUsers(tempSelectedUsers)
        setSearchTerm(null)

        // remove this user from search options
        let tempUsers = [...users]
        let i = 0
        for (let user of users) {
            if (user.email === value.email) {
                tempUsers.splice(i, 1)
                setUsers(tempUsers)
                break
            }
            i++
        }
    }

    const handleSuccessfulAPICall = () => {
        onClose()
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
                        <Autocomplete
                            disablePortal
                            fullWidth
                            id="contributor-search"
                            value={searchTerm}
                            onChange={(event, newValue) => {
                                handleAutocompleteAdd(newValue)
                            }}
                            options={users}
                            // sx={{ width: 300 }}
                            renderInput={(params) => <TextField  {...params} label="User" />}
                        />
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={5}>
                        
                            {selectedUsers.map((value, idx) => (
                                <p key={value.email+idx}>{value.email+ " "}</p>
                            ))}
                        
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

