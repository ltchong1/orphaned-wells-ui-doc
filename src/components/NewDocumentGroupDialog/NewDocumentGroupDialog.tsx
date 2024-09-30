import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton, Grid, Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { addDocumentGroup, getProcessors } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';
import { Processor } from '../../types';

interface NewDocumentGroupDialogProps {
    open: boolean;
    onClose: () => void;
}

const NewDocumentGroupDialog = ({ open, onClose }: NewDocumentGroupDialogProps) => {
    const [documentGroupName, setDocumentGroupName] = useState("");
    const [documentGroupDescription, setDocumentGroupDescription] = useState("");
    const [processors, setProcessors] = useState<Processor[]>([])
    const [selectedProcessor, setSelectedProcessor] = useState<Processor>({} as Processor);
    const [disableCreateButton, setDisableCreateButton] = useState(true);
    const dialogHeight = '85vh';
    const dialogWidth = '60vw';
    const state = process.env.REACT_APP_STATE || "illinois";

    const descriptionElementRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    useEffect(() => {
        if (documentGroupName !== "" && selectedProcessor.id && disableCreateButton) {
            setDisableCreateButton(false);
        } else if ((documentGroupName === "" || !selectedProcessor.id) && !disableCreateButton) {
            setDisableCreateButton(true);
        }
    }, [documentGroupName, selectedProcessor]);

    useEffect(() => {
        if (open) {
            let state_code;
            if (state === "illinois") state_code = "IL"
            else if (state === "colorado") state_code = "CO"
            else state_code = "IL"
            callAPI(
                getProcessors,
                [state_code],
                handleSuccessGetProcessors,
                (e: Error) => console.error('error on getting processors ', e)
            );
        }
    }, [open]);

    const styles = {
        dialogPaper: {
            minHeight: dialogHeight,
            maxHeight: dialogHeight,
            minWidth: dialogWidth,
            maxWidth: dialogWidth,
        },
        documentGroupName: {
            marginBottom: 2
        },
        processorGridItem: {
            paddingX: 1,
            paddingBottom: 5
        },
        processorTextBox: {
            display: "flex",
            justifyContent: "center",
        },
        processorImageBox: {
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
        },
        processorImage: {
            maxHeight: "20vh"
        }
    };

    const handleSuccessGetProcessors = (processor_data: Processor[]) => {
        setProcessors(processor_data)
    }

    const handleClose = () => {
        onClose();
    };

    const handleSelectProcessor = (processorData: Processor) => {
        if (selectedProcessor.id === processorData.id) setSelectedProcessor({ } as Processor);
        else {
            setSelectedProcessor(processorData);
        }
    };

    const getImageStyle = (processorId: string): React.CSSProperties => {
        let styling: React.CSSProperties = { ...styles.processorImage };
        if (selectedProcessor.id === processorId) {
            styling["border"] = "1px solid #2196F3";
        }
        return styling;
    };

    const handleCreateDocumentGroup = () => {
        let body = {
            name: documentGroupName,
            description: documentGroupDescription,
            state: selectedProcessor.state,
            history: [],
            documentType: selectedProcessor.documentType,
            processorId: selectedProcessor.id,
        };
        callAPI(
            addDocumentGroup,
            [body],
            handleSuccessfulDocumentGroupCreation,
            (e: Error) => console.error('error on documentGroup add ', e)
        );
    };

    const handleSuccessfulDocumentGroupCreation = () => {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="new-dg-dialog"
            aria-describedby="new-dg-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
            }}
        >
            <DialogTitle id="new-dg-dialog-title">New Document Group</DialogTitle>
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
                    id="scroll-dialog-description"
                    ref={descriptionElementRef}
                    tabIndex={-1}
                    aria-labelledby="new-dg-dialog-content-text"
                    component={'span'}
                >
                    <Grid container>
                        <Grid item xs={5}>
                            <TextField
                                fullWidth
                                label="Document Group Name"
                                variant="outlined"
                                value={documentGroupName}
                                onChange={(event) => setDocumentGroupName(event.target.value)}
                                sx={styles.documentGroupName}
                                id="dg-name-textbox"
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                value={documentGroupDescription}
                                onChange={(event) => setDocumentGroupDescription(event.target.value)}
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
                                        <p style={styles.processorTextBox}>
                                            {idx + 1}. {processorData.displayName}
                                        </p>
                                        <Box sx={styles.processorImageBox} onClick={() => handleSelectProcessor(processorData)}>
                                            <Tooltip title={processorData.documentType}>
                                                <img id={`processor_${idx}`} src={processorData.img} style={getImageStyle(processorData.id)} />
                                            </Tooltip>
                                        </Box>
                                    </Grid>
                                ))}
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
                    disabled={disableCreateButton}
                    onClick={handleCreateDocumentGroup}
                >
                    Create Document Group
                </Button>
            </DialogContent>
        </Dialog>
    );
}

export default NewDocumentGroupDialog;