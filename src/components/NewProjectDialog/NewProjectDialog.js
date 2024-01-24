import {useEffect, useState, useRef } from 'react';
import { InputAdornment, TextField, IconButton, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


export default function NewProjectDialog(props) {
    const { open, onClose } = props;

    const [ dialogHeight, setDialogHeight ] = useState('60vh')
    const [ dialogWidth, setDialogWidth ] = useState('60vw')
    const [ projectName, setProjectName ] = useState("")
    const [ projectDescription, setProjectDescription ] = useState("")

    const descriptionElementRef = useRef(null);
    useEffect(() => {
      if (open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
          descriptionElement.focus();
        }
      }
    }, [open]);


    const styles = {
        dialogTitle: {

        },
        dialogContent: {

        },
        dialogContentText: {

        },
        dialog: {

        },
        dialogPaper: {
            minHeight: dialogHeight,
            maxHeight: dialogHeight,
            minWidth: dialogWidth,
            maxWidth: dialogWidth,
        },
        projectName: {
            marginBottom: 2
        },
        projectDescription: {
            
        }
    }

    const handleClose = () => {
        onClose()
    };

    

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
            <DialogTitle id="new-project-dialog-title" style={styles.dialogTitle}>New Project</DialogTitle>
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
            <DialogContent style={styles.dialogContent} dividers={true}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
                style={styles.dialogContentText}
                aria-labelledby="new-project-dialog-content-text"
            >   
                <Grid container>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label="Project Name"
                            variant="outlined" 
                            // size="small"
                            value={projectName}
                            onChange={(event) => setProjectName(event.target.value)}
                            sx={styles.projectName}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined" 
                            // size="small"
                            value={projectDescription}
                            onChange={(event) => setProjectDescription(event.target.value)}
                            sx={styles.projectDescription}
                            multiline
                            rows={4}
                        />
                    </Grid>

                    <Grid item xs={2}></Grid>

                    <Grid item xs={5}>

                    </Grid>

                </Grid>
                
            </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

