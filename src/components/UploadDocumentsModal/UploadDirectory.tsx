import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useUserContext } from '../../usercontext';
import { Grid, Box, Modal, IconButton, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { UploadDirectoryProps, ProgressBarProps } from '../../types';
import { uploadDocument } from '../../services/app.service';
import { callAPI } from '../../assets/util';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';

const UploadDirectory = (props: UploadDirectoryProps) => {
    const params = useParams<{ id: string }>();
    const { userEmail } = useUserContext();
    const { directoryName, directoryFiles } = props;
    const [ showWarning, setShowWarning ] = useState(false);
    const [ uploading, setUploading ] = useState(false)
    const [ finishedUploading, setFinishedUploading ] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
    const [ uploadedAmt, setUploadedAmt ] = useState(0)
    const [ warningMessage, setWarningMessage ] = useState("");
    const [ progress, setProgress ] = useState(0)
    const maxFileSize = 10;

    useEffect(() => {
        if (uploadedAmt === directoryFiles.length) {
            setFinishedUploading(true)
            setTimeout(()=> {
                window.location.reload()
            },3000)
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
        gridStyle: {
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
        button: {
            borderRadius: '8px', 
            width: 200,
        }
    };

    const upload = () => {
        setUploading(true)
        directoryFiles.map((file) => {
            let formData = new FormData();
            formData.append('file', file, file.name);
            let promise = callAPI(
                uploadDocument,
                [formData, params.id, userEmail, false],
                () => handleSuccessfulDocumentUpload(file),
                () => handleAPIErrorResponse(file)
            );
            promise.then(() => {
                setUploadedFiles((uploadedFiles) => [...uploadedFiles, file.name]);
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
        <Grid container>
            <Grid item xs={12}>
                <p>Upload {directoryFiles.length} files from {directoryName}:</p>
            </Grid>
            {/* <Grid item xs={12}>
                <Box>
                    {directoryFiles.map((file) =>  (
                        <p key={file.name}>
                            {
                                uploadedFiles.includes(file.name) ? 
                                <s>{file.name}</s> :
                                file.name
                            }
                        </p>
                    ))}
                </Box>
            </Grid> */}
            <Grid item xs={12}>
                {uploading && 
                    <LinearWithValueLabel progress={progress}/>
                }
            </Grid>
            {/* <Grid item xs={12}>
                {uploadedFiles.map((filename) => (
                    <p key={filename}>{filename}</p>
                ))
                }
            </Grid> */}
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
    );
};

export default UploadDirectory;


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
