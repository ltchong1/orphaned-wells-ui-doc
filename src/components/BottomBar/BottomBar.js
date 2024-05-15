import React from 'react';
import {useEffect, useState} from 'react';   
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PopupModal from '../PopupModal/PopupModal';


export default function Bottombar(props) {
    const { onPreviousButtonClick,  onNextButtonClick, onReviewButtonClick } = props;
    const [ openNotesModal, setOpenNotesModal ] = useState(false)
    const [ recordNotes, setRecordNotes ] = useState("")
    const styles = {
        button: {
            marginX: 1,
        },
        paper: {
            position: 'fixed',
            bottom: 0, 
            left: '0px',
            right: 0,
            height: '60px',
            zIndex: 2,
        }
    }

    const handleChangeRecordNotes = (event) => {
        setRecordNotes(event.target.value)
    }

    const handleUpdateRecordNotes = () => {

    }

  return ( 
    <Box sx={{ width: 500 }}>
      <CssBaseline />
      <Paper sx={styles.paper} elevation={3}>
            <Grid container sx={{marginTop: '10px'}}>
                <Grid item xs={6}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-start', marginLeft:'10px'}}>
                        <Button 
                            variant="outlined" 
                            startIcon={<KeyboardArrowLeftIcon/>}
                            onClick={onPreviousButtonClick}
                        > 
                            Previous
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', marginRight:'10px'}}>
                        <Button 
                            sx={styles.button} 
                            variant="outlined" 
                            startIcon={<BorderColorOutlinedIcon/>}
                            onClick={() => setOpenNotesModal(true)}
                        >
                            add notes
                        </Button>
                        <Button 
                            sx={styles.button} 
                            variant="outlined" 
                            endIcon={<KeyboardArrowRightIcon/>}
                            onClick={onNextButtonClick}
                        >
                            next
                        </Button>
                        <Button 
                            sx={styles.button} 
                            variant="contained" 
                            endIcon={<CheckCircleOutlineIcon/>}
                            onClick={onReviewButtonClick}
                        > 
                            Mark as reviewed & next 
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <PopupModal
                input
                open={openNotesModal}
                handleClose={() => setOpenNotesModal(false)}
                text={recordNotes}
                textLabel='Notes'
                handleEditText={handleChangeRecordNotes}
                handleSave={handleUpdateRecordNotes}
                buttonText='Save notes'
                buttonColor='primary'
                buttonVariant='contained'
                width={600}
                multiline
                inputrows={4}
            />
      </Paper>
    </Box>
  );

}


