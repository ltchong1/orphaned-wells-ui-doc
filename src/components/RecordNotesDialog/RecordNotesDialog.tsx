import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { IconButton, Grid, TextField, Button, Stack, Box, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateRecord } from '../../services/app.service';
import { callAPI, formatDateTime } from '../../assets/util';
import { RecordNote, RecordNotesDialogProps } from '../../types';
import { Check, Edit, NoteRounded } from '@mui/icons-material';

const RecordNotesDialog = ({ record_id, notes, open, onClose }: RecordNotesDialogProps) => {

    const descriptionElementRef = useRef<HTMLDivElement | null>(null);
    const dialogHeight = '80vh';
    const dialogWidth = '35vw';
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
            maxHeight: dialogHeight,
            minWidth: dialogWidth,
            maxWidth: dialogWidth,
            display: 'flex',
            flexDirection: 'column',
        },
        dialogContent: {
            flex: 1, // Make content area take up available vertical space
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // Ensure bottom section stays at the bottom
        },
        boxTop: {
            overflow: 'scroll'
        },
        boxBottom: {
            marginTop: 2
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            scroll={"paper"}
            aria-labelledby="new-dg-dialog"
            aria-describedby="new-dg-dialog-description"
            PaperProps={{
                sx: styles.dialogPaper
            }}
        >
            <DialogTitle id="new-dg-dialog-title">Notes</DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent
                sx={styles.dialogContent}
            >
                {/* Top content */}
                <Box sx={styles.boxTop}>
                    {TEST_NOTES.map((note, idx) => (
                        <div key={idx}>
                            <IndividualNote
                                note={note}
                            />
                            {note.replies && note.replies.map((reply) => (
                                <IndividualNote
                                    key={idx}
                                    note={reply}
                                />
                            ))}
                        </div>
                        
                    ))}

                    <Divider />
                </Box>

                {/* Bottom section */}
                <Box sx={styles.boxBottom}>
                    <TextField
                        fullWidth
                        required
                        variant='outlined'
                        id="margin-none"
                        placeholder='Type in a new note'
                        // label={}
                        // value={}
                        // onChange={}
                        multiline
                        minRows={2}
                    />
                    <Box display="flex" justifyContent="flex-end" mt={1}>
                        <Button variant="contained" >
                            Add new note
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            
        </Dialog>
    );
}

interface IndividualNoteProps {
    note: RecordNote
}

const IndividualNote = ({ note }: IndividualNoteProps) => {
    const styles = {
        div: {
            paddingX: 1,
            paddingBottom: 1,
            marginLeft: note.isReply ? 4 : 0,
            "&:hover": {
                backgroundColor: "#F5F5F6", // Highlight color on hover
            },
        },
        metadata: {
            opacity: 0.6
        },
        divider: {
            marginY: 1,
        },
        icon: {
            fontSize: '14px',
            color: 'black'
        },
    }

    return (
        <Typography component={'div'} sx={styles.div}>
            <Divider sx={styles.divider}/>
            <Stack direction={'row'} justifyContent={'space-between'} alignItems='start'>

                <Typography>
                    {note.text}
                </Typography>

                <Stack direction='row'>
                    <IconButton>
                        <EditIcon sx={styles.icon}/>
                    </IconButton>
                    <IconButton>
                        <CheckIcon sx={styles.icon}/>
                    </IconButton>
                    <IconButton>
                        <ReplyIcon sx={styles.icon}/>
                    </IconButton>
                    <IconButton>
                        <DeleteIcon sx={styles.icon}/>
                    </IconButton>
                </Stack>
            </Stack>
            <Typography sx={styles.metadata}>
                - <i>{note.creator}</i>, {formatDateTime(note.lastUpdated)}
            </Typography>
            
        </Typography>            
    );
}

export default RecordNotesDialog;

const TEST_NOTES = [
    {
        text: 'Company not legible',
        record_id: '67619d1576a84e22d6cc71cc',
        timestamp: 1734715386,
        creator: 'mpesce@lbl.gov',
        resolved: false,
        lastUpdated: 1734715386,
        isReply: false,
        replies: [
            {
                text: 'It says OGRRE dummy',
                record_id: '67619d1576a84e22d6cc71cc',
                timestamp: 1734715486,
                creator: 'michaelcpesce@lbl.gov',
                resolved: false,
                lastUpdated: 1734715486,
                isReply: true
            } as RecordNote,
        ]
    } as RecordNote,
    {
        text: 'A wee bit blurry',
        record_id: '67619d1576a84e22d6cc71cc',
        timestamp: 1734715426,
        creator: 'pescemike@lbl.gov',
        resolved: false,
        lastUpdated: 1734715486,
        isReply: false
    } as RecordNote,
    {
        text: 'Something something somethingSomething something somethingSomething something somethingSomething something somethingSomething something something',
        record_id: '67619d1576a84e22d6cc71cc',
        timestamp: 1734716486,
        creator: 'mpesce@lbl.gov',
        resolved: false,
        lastUpdated: 1734716486,
        isReply: false
    } as RecordNote,
]