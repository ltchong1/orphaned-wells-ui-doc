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
    const [ uploadedFiles, setUploadedFiles ] = useState<any>({})
    const [ warningMessage, setWarningMessage ] = useState("");
    const [ progress, setProgress ] = useState(0)
    const [ file, setFile ] = useState<File | null>(null);
    const maxFileSize = 10;
    //TODO: useeffect to check wehn files are finished uploading
    useEffect(() => {
        let uploadedAmt = Object.keys(uploadedFiles).length
        console.log(uploadedAmt, directoryFiles.length)
        if (uploadedAmt === directoryFiles.length) {
            setFinishedUploading(true)
        }
        try {
            if (directoryFiles.length!== 0) {
                setProgress(uploadedAmt / directoryFiles.length)
            }
        } catch(e) {
            setProgress(0)
        }
    },[uploadedFiles])

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
        // for (let file of directoryFiles) {
        directoryFiles.map((file) => {
            let formData = new FormData();
            formData.append('file', file, file.name);
            return callAPI(
                uploadDocument,
                [formData, recordGroupId, userEmail, false],
                () => handleSuccessfulDocumentUpload(file),
                () => handleAPIErrorResponse(file)
            );
        })
            
        // }
        

        // handleClose()
    }

    const handleSuccessfulDocumentUpload = (file: File) => {
        console.log(`successfully uploaded ${file.name}`)
        // TODO: add to list of uploaded files
        let tempUploadedFiles = {...uploadedFiles}
        tempUploadedFiles[file.name] = true
        setUploadedFiles(tempUploadedFiles)
    }

    const handleAPIErrorResponse = (file: File) => {
        console.error(`error uploading ${file.name}`)
        let tempUploadedFiles = {...uploadedFiles}
        tempUploadedFiles[file.name] = false
        setUploadedFiles(tempUploadedFiles)
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
                    {uploading && !finishedUploading && 
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
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
//     }, 800);
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}
