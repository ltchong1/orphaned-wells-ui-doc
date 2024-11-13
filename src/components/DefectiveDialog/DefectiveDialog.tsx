import React, { useEffect, useState, useRef } from 'react';
import { Chip, IconButton, Grid, Button, Stack, Dialog, DialogTitle, DialogContent, DialogContentText, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DefectiveDialogProps {
    open: boolean;
    handleMarkDefective: (categories: string[]) => void;
    onClose: () => void;
}

const DefectiveDialog = ({ open, handleMarkDefective, onClose }: DefectiveDialogProps) => {
    const [categoryOptions, setCategeoryOptions] = useState([
        "Wrong report type", "Missing fields", "Fields that aren't identified", "Fields not split out correctly", "Form quality"
    ]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const dialogHeight = '25vh';
    const dialogWidth = '40vw';

    const descriptionElementRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);


    const styles = {
        dialogPaper: {
            minHeight: dialogHeight,
            minWidth: dialogWidth,
        },
        chip: {
            m: 1,
            cursor: 'pointer'
        },
        submitButton: {
            // display: 'flex'
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleSelect = (option: string) => {
        let tempSelected = [...selectedCategories]
        const index = tempSelected.indexOf(option);
        if (index > -1) {
            tempSelected.splice(index, 1);
        } else {
            tempSelected.push(option)
        }

        setSelectedCategories(tempSelected)
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
            <DialogTitle id="new-project-dialog-title"><b>Mark Defective</b></DialogTitle>
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
                    aria-labelledby="new-project-dialog-content-text"
                    component={'span'}
                >
                    <Grid container>
                        <div>
                            Please select at least one category for why this record is defective:
                        </div>
                        <Grid item xs={12}>
                            {categoryOptions.map((option) => (
                                <Chip 
                                    key={option}
                                    color={'primary'}
                                    sx={styles.chip}
                                    label={option}
                                    variant={selectedCategories.includes(option) ? 'filled' : 'outlined'}
                                    onClick={() => handleSelect(option)}
                                />
                            ))}
                        </Grid>
                    </Grid>
                    <Stack
                        direction={'row-reverse'}
                        sx={{
                            gap: 2,
                            flexShrink: 0,
                            alignSelf: { xs: 'flex-end'},
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={
                                styles.submitButton
                            }
                            disabled={selectedCategories.length === 0}
                            onClick={() => handleMarkDefective(selectedCategories)}
                        >
                            Mark Defective
                        </Button>
                    </Stack>
                </DialogContentText>
                
            </DialogContent>
        </Dialog>
    );
}

export default DefectiveDialog;