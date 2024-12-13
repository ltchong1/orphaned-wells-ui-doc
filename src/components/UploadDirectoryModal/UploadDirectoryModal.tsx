import { useState, useEffect } from 'react';
import { Grid, Box, Modal, IconButton, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { UploadDirectoryModalProps, ProgressBarProps } from '../../types';
import { uploadDocument } from '../../services/app.service';
import { callAPI } from '../../assets/util';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

const UploadDirectoryModal = (props: UploadDirectoryModalProps) => {
    const { setShowModal, directoryName, directoryFiles, recordGroupId, userEmail } = props;
    const [ showWarning, setShowWarning ] = useState(false);
    const [ uploading, setUploading ] = useState(false)
    const [ finishedUploading, setFinishedUploading ] = useState(false)
    const [ uploadedAmt, setUploadedAmt ] = useState(0)
    const [ warningMessage, setWarningMessage ] = useState("");
    const [ progress, setProgress ] = useState(0)
    const maxFileSize = 10;

    useEffect(() => {
        console.log(uploadedAmt)
        if (uploadedAmt === directoryFiles.length) {
            setFinishedUploading(true)
        }
        try {
            if (directoryFiles.length!== 0) {
                setProgress( (uploadedAmt / directoryFiles.length) * 100)
            }
        } catch(e) {
            setProgress(0)
        }
    },[uploadedAmt])

    const styles = {
        modalStyle: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 650,
            bgcolor: 'background.paper',
            border: '1px solid #AEAEAE',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
        },
        header: {
            marginTop: 5
        },
        button: {
            borderRadius: '8px', 
            width: 200,
        },
        sampleFile: {
            textDecoration: "none",
            fontWeight: "bold",
            cursor: 'pointer'
        },
        fileUploaderBox: {
            border: showWarning ? '2px dashed #E07174' : '2px dashed black',
            borderRadius: 2,
            p: 8,
            cursor: "pointer",
            backgroundColor: showWarning ? '#FDF7F7' : 'white',
        },
        uploadIcon: {
            color: showWarning ? "#D3242F" : "#2196F3",
            paddingBottom: 3
        },
        uploadContainerBox: {
            display: 'flex', 
            justifyContent: 'center'
        },
        uploadContainerItem: {
            display: 'flex', 
            justifyContent: 'center'
        },
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const upload = () => {
        setUploading(true)
        directoryFiles.map((file) => {
            let formData = new FormData();
            formData.append('file', file, file.name);
            console.log('calling '+file.name)
            let promise = callAPI(
                uploadDocument,
                [formData, recordGroupId, userEmail, false],
                () => handleSuccessfulDocumentUpload(file),
                () => handleAPIErrorResponse(file)
            );
            promise.then(() => {
                setUploadedAmt((uploadedAmt) => uploadedAmt+1)
            }).catch((e) => {
                console.error(`error uploading ${file.name}`)
                setUploadedAmt((uploadedAmt) => uploadedAmt+1)
            })
        })
    }

    const handleSuccessfulDocumentUpload = (file: File) => {
        // console.log(`successfully uploaded ${file.name}`)
    }

    const handleAPIErrorResponse = (file: File) => {
        console.error(`error uploading ${file.name}`)
    }

    return (
        <Modal
            open={true}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Grid container sx={styles.modalStyle} spacing={1}>
                <Grid item xs={9}>
                    <h2 style={styles.header}>Upload {directoryFiles.length} files from {directoryName}</h2>
                </Grid>
                <Grid item xs={3}>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end', marginRight: '10px'}}>
                        <IconButton onClick={handleClose}><CloseIcon/></IconButton>
                    </Box>
                </Grid>
                {/* <Grid item xs={12}>
                    <Box style={{display: "flex", justifyContent: "space-between"}}>
                        {directoryFiles.map((file) => {
                            return (
                                <Grid item xs={6}>
                                    <p>
                                        {file.name}
                                    </p>
                                </Grid>
                            )
                        })}
                    </Box>
                </Grid> */}
                <Grid item xs={12}>
                    {uploading && 
                        <LinearWithValueLabel progress={progress}/>
                    }
                </Grid>
                <Grid item xs={12}>
                    <Box style={{display: "flex", justifyContent: "space-around"}}>
                        {!uploading && !finishedUploading && 
                            <Button variant="contained" style={styles.button} onClick={upload}>
                                Upload
                            </Button>
                        }
                    </Box>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default UploadDirectoryModal;


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function LinearWithValueLabel(props: ProgressBarProps) {
const { progress } = props;

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}
