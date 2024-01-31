import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams } from "react-router-dom";
import { getProjectData, uploadDocument } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';
import UploadDocumentsModal from '../../components/UploadDocumentsModal/UploadDocumentsModal';

export default function Project(props) {
    const [ records, setRecords ] = useState([])
    const [ projectData, setProjectData ] = useState({attributes: []})
    const [ showDocumentModal, setShowDocumentModal ] = useState(false)
    let params = useParams(); 
    useEffect(() => {
        getProjectData(params.id)
        .then(response => response.json())
        .then((data)=>{
            // console.log("Project Data:", data);
            setRecords(data.records)
            setProjectData(data.project_data)
        }).catch((e) => {
            console.error('error getting project data: ',e)
        });
    }, [params.id])

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY:5,
            paddingX:5,
        },
    }

    const formatAttributes = (attributes) => {
        let output = "Attributes: "
        if (attributes.length > 0) {
            
            for (let attribute of attributes) {
                output+=attribute+", "
            }
            output = output.substring(0,output.length-2)
        }
        return output
    }

    const handleUploadDocument = (file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);

        uploadDocument(formData, projectData.id_)
        .then(response => {
        if (response.status === 200) {
            response.json()
            .then((data)=>{
                console.log('fileupload successful: ',data)
                window.location.reload()
            }).catch((err)=>{
                console.error("error on file upload: ",err)
                // setErrorMessage(String(err))
                // setShowError(true)
            })
        }
        /*
            in the case of bad file type
        */
        else if (response.status === 400) {
            response.json()
            .then((data)=>{
                console.error("error on file upload: ",data.detail)
                // setErrorMessage(data.detail)
                // setShowError(true)
            }).catch((err)=>{
                console.error("error on file upload: ",err)
                // setErrorMessage(response.statusText)
                // setShowError(true)
            })
        }
        })
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={projectData.name}
                buttonName="Upload new record(s)"
                subtext={formatAttributes(projectData.attributes)}
                handleClickButton={() => setShowDocumentModal(true)}
            />
            <Box sx={styles.innerBox}>
                <RecordsTable
                    projectData={projectData}
                    records={records}
                />
            </Box>
            { showDocumentModal && 
                <UploadDocumentsModal 
                    setShowModal={setShowDocumentModal}
                    handleUploadDocument={handleUploadDocument}
                />
            }
            
        </Box>
    );
}