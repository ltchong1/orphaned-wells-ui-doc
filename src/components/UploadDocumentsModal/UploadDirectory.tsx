import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useUserContext } from '../../usercontext';
import { Grid, Box, Button, Typography, Stack } from '@mui/material';
import { UploadDirectoryProps, ProgressBarProps } from '../../types';
import { uploadDocument } from '../../services/app.service';
import { callAPI } from '../../assets/util';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

const UploadDirectory = (props: UploadDirectoryProps) => {
    const params = useParams<{ id: string }>();
    const { userEmail } = useUserContext();
    const { directoryName, directoryFiles } = props;
    const [ uploading, setUploading ] = useState(false)
    const [ finishedUploading, setFinishedUploading ] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
    const [ uploadedAmt, setUploadedAmt ] = useState(0)
    const [ progress, setProgress ] = useState(0)

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
        button: {
            borderRadius: '8px', 
            width: 200,
        },
        stack: {
            height: '30vh',
            overflow: 'scroll',
            // border: '1px solid',
            // borderRadius: '4px', 
            boxShadow: 1,
            padding: 2
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
                <p>Upload {directoryFiles.length} files from the directory <i>{directoryName}</i>:</p>
            </Grid>
            <Grid item xs={12}>
                <Stack direction='column' sx={styles.stack}>
                    {directoryFiles.map((file) =>  (
                        <p style={{margin: 3}} key={file.name}>
                            {
                                uploadedFiles.includes(file.name) ? 
                                <s>{`- ${file.name}`}</s> :
                                `- ${file.name}`
                            }
                        </p>
                    ))}
                </Stack>
                {/* <Grid container spacing={2} sx={{height: '30vh', overflow: 'scroll'}}>
                    {directoryFiles.map((file) =>  (
                        <Grid item xs={12} key={file.name} sx={{
            overflow: 'scroll'}}>
                            {
                                uploadedFiles.includes(file.name) ? 
                                <s>{file.name}</s> :
                                file.name
                            }
                        </Grid>
                    ))}
                </Grid> */}
            </Grid>
            <Grid item xs={12}>
                <Box sx={{display: "flex", justifyContent: "space-around", marginTop: 3}}>
                    {!uploading && !finishedUploading && 
                        <Button variant="contained" sx={styles.button} onClick={upload}>
                            Upload
                        </Button>
                    }
                    {uploading && 
                        <CircularProgress variant="determinate" value={progress} />
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
