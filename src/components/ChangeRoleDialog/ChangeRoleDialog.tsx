import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton, Grid, Button, Tooltip } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { } from '../../services/app.service';
import { callAPI } from '../../assets/util';
import ErrorBar from '../ErrorBar/ErrorBar';

interface ChangeRoleDialogProps {
    open: boolean;
    selectedUser: any;
    onClose: () => void;
    team: string;
}

const ChangeRoleDialog = ({ open, selectedUser, onClose, team }: ChangeRoleDialogProps) => {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [roles, setRoles] = useState([])
    const dialogHeight = '25vh';
    const dialogWidth = '60vw';

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
        let initialRoles = selectedUser?.roles;
        if (initialRoles && initialRoles.team && initialRoles.team[team])
            setRoles(initialRoles.team[team])
    }, [selectedUser])


    const styles = {
        dialogPaper: {
            minHeight: dialogHeight,
            maxHeight: dialogHeight,
            minWidth: dialogWidth,
            maxWidth: dialogWidth,
        },
        recordGroupName: {
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

    const handleClose = () => {
        onClose();
    };

    const handleUpdateRole = () => {

    }

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
            <DialogTitle id="new-dg-dialog-title">Change role for {selectedUser?.email}</DialogTitle>
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

                        <Grid item xs={12}>
                            {roles.map((role) => <div>{role}</div>)}
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
                    onClick={handleUpdateRole}
                >
                    Update Role
                </Button>
            </DialogContent>
            <ErrorBar
                errorMessage={errorMsg}
                setErrorMessage={setErrorMsg}
            />
        </Dialog>
    );
}

export default ChangeRoleDialog;