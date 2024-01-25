import {useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { processors } from '../../assets/processors';


export default function NewProjectDialog(props) {
    const { open, onClose } = props;

    const [ dialogHeight, setDialogHeight ] = useState('85vh')
    const [ dialogWidth, setDialogWidth ] = useState('60vw')
    const [ projectName, setProjectName ] = useState("")
    const [ projectDescription, setProjectDescription ] = useState("")
    const [ selectedProcessor, setSelectedProcessor ] = useState(null)

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
            
        },
        processorGridItem: {
            paddingX: 1
        },
        processorImageBox: {
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
        },
        processorImage: {
            // width: '80%',
            maxHeight: "20vh"
        }
    }

    const handleClose = () => {
        onClose()
    };

    const handleSelectProcessor = (processorId) => {
        if (selectedProcessor === processorId) setSelectedProcessor(null)
        else {
            setSelectedProcessor(processorId)
        }
    }

    const getImageStyle = (processorId) => {
        let styling = {...styles.processorImage}
        if (selectedProcessor === processorId) {
            styling["border"] = "1px solid #2196F3"
        }
        return styling
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
                component={'span'}
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
                    <Grid item xs={5}></Grid>

                    <Grid item xs={12}>
                        <h4>
                            Select document type
                        </h4>
                        <p>
                            Select from following document types of well completion records. 
                            Data extraction will work best with one of the following document types.
                        </p>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            {processors.map((processorData, idx) => (
                                <Grid key={idx} item xs={4} sx={styles.processorGridItem}>
                                    <p>
                                        {idx+1}. {processorData.displayName}
                                    </p>
                                    <Box sx={styles.processorImageBox} onClick={() => handleSelectProcessor(processorData.id)}>
                                        <img src={processorData.img} style={getImageStyle(processorData.id)}/>
                                    </Box>
                                    
                                </Grid>
                            ))
                            }
                        </Grid>
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
            >
                Next
            </Button>
            </DialogContent>
        </Dialog>
    )
}

