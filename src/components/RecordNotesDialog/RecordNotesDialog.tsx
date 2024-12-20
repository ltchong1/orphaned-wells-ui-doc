import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { IconButton, Grid, TextField, Button, Stack, Box, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import ReplyIcon from '@mui/icons-material/Reply';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { updateRecord } from '../../services/app.service';
import { callAPI, formatDateTime } from '../../assets/util';
import { RecordNote, RecordNotesDialogProps } from '../../types';
import { useUserContext } from '../../usercontext';

const RecordNotesDialog = ({ record_id, notes, open, onClose }: RecordNotesDialogProps) => {
    const { userEmail } = useUserContext();
    const [ replyToIdx, setReplyToIdx ] = useState<number>()
    const [ editIdx, setEditIdx ] = useState<number>()
    const [ deleteIdx, setDeleteIdx ] = useState<number>()
    const [ newNoteText, setNewNoteText ] = useState('')
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
        },
        divider: {
            marginY: 1,
        },
        replyToText: {
            opacity: 0.5,
            fontStyle: 'italic',
            overflow: 'hidden'
        }
    };

    const handleAddNote = () => {
        //TODO: check for replyto
        let newNote = {
            text: newNoteText,
            record_id: record_id,
            timestamp: Date.now(),
            creator: userEmail,
            resolved: false,
            lastUpdated: Date.now(),
        } as RecordNote
        if (replyToIdx) {
            newNote.isReply = true
            newNote.repliesTo = replyToIdx
        } else newNote.isReply = false
        console.log('new note: ')
        console.log(newNote)
    }

    const handleClickAction = (idx: number, action: string, newValue?: string) => {
        if (action === 'edit') {
            if (editIdx === idx)  {
                // TODO: update this comment with newValue
                let newLastUpdate = Date.now()
                console.log('edited '+notes[idx].text+' to '+newValue)
                setEditIdx(undefined)
            }
            else setEditIdx(idx)
        }
        else if (action === 'reply') {
            if (replyToIdx === idx) setReplyToIdx(undefined)
            else setReplyToIdx(idx)
            
        }
        else if (action === 'resolve') {
            console.log('resolve: '+notes[idx].text)
        }
        else if (action === 'delete') {
            console.log('delete: '+notes[idx].text)
        }
    }

    const populateNotes = () => {
        return notes.map((note, idx) => {
            if (!note.isReply) return (
                <div key={idx}>
                    <IndividualNote
                        note={note}
                        idx={idx}
                        highlighted={replyToIdx === idx}
                        editMode={editIdx === idx}
                        handleClickAction={handleClickAction}
                    />
                    {note.replies && note.replies.map((replyIdx) => {
                        return <IndividualNote
                            key={replyIdx}
                            note={notes[replyIdx]}
                            idx={replyIdx}
                            highlighted={replyToIdx === replyIdx}
                            editMode={editIdx === replyIdx}
                            handleClickAction={handleClickAction}
                        />
                    })}
                </div>
            )
        })
    }

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
                    {populateNotes()}

                    <Divider sx={styles.divider}/>
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
                        // value={newNoteText}
                        onChange={(e) => setNewNoteText(e.target.value)}
                        multiline
                        minRows={2}
                    />
                    <Box display="flex" justifyContent='space-between' mt={1}>
                        <Typography noWrap paragraph sx={styles.replyToText}>
                            {replyToIdx !== undefined && 
                                `reply to: ${notes[replyToIdx].text.substring(0, 20)}...` 
                            }
                        </Typography>
                        <Button variant="contained" onClick={handleAddNote} disabled={newNoteText===''}>
                            Add new note
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
            
        </Dialog>
    );
}

interface IndividualNoteProps {
    note: RecordNote,
    idx: number,
    highlighted?: boolean;
    editMode?: boolean;
    handleClickAction: (idx: number, action: string, newText?: string) => void;
}

const IndividualNote = ({ note, idx, editMode, highlighted, handleClickAction }: IndividualNoteProps) => {
    const [ newText, setNewText ] = useState<string>()
    const styles = {
        div: {
            paddingX: 1,
            paddingBottom: 1,
            marginLeft: note.isReply ? 4 : 0,
            backgroundColor: highlighted ? "#F5F5F6" : 'inherit',
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

                {editMode ? 
                    <TextField
                        fullWidth
                        variant='standard'
                        defaultValue={note.text}
                        onChange={(e) => setNewText(e.target.value)}
                    />
                : 
                    <Typography>
                        {note.text}
                    </Typography>
                }

                <Stack direction='row'>
                    <IconButton onClick={() => handleClickAction(idx, 'edit', newText)}>
                        {editMode ? <DoneAllIcon sx={styles.icon}/> : <EditIcon sx={styles.icon}/>}
                    </IconButton>
                    <IconButton disabled={editMode} onClick={() => handleClickAction(idx, 'resolve')}>
                        <CheckIcon sx={styles.icon}/>
                    </IconButton>
                    {!note.isReply && 
                        <IconButton disabled={editMode} onClick={() => handleClickAction(idx, 'reply')}>
                            <ReplyIcon sx={styles.icon}/>
                        </IconButton>
                    }
                    {!note.isReply && 
                        <IconButton disabled={editMode} onClick={() => handleClickAction(idx, 'delete')}>
                        <DeleteIcon sx={styles.icon}/>
                    </IconButton>
                    }
                </Stack>
            </Stack>
            <Typography sx={styles.metadata}>
                - <i>{note.creator}</i>, {formatDateTime(note.lastUpdated)}
            </Typography>
            
        </Typography>            
    );
}

export default RecordNotesDialog;