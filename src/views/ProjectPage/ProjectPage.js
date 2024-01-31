import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getProjectData, uploadDocument, deleteProject } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';
import UploadDocumentsModal from '../../components/UploadDocumentsModal/UploadDocumentsModal';
import PopupModal from '../../components/PopupModal/PopupModal';

export default function Project(props) {
    const [ records, setRecords ] = useState([])
    const [ projectData, setProjectData ] = useState({attributes: []})
    const [ showDocumentModal, setShowDocumentModal ] = useState(false)
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false)
    let params = useParams(); 
    let navigate = useNavigate();
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

    const handleUpdateProject = () => {
        console.log("hanlde update project")
    }

    const handleDeleteProject = () => {
        setOpenDeleteModal(false)
        deleteProject(projectData.id_)
        .then(response => response.json())
        .then((data) => {
            navigate("/projects", {replace: true})
        }).catch((e) => {
            console.error("error on deleting project: "+e)
        })
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={projectData.name}
                buttonName="Upload new record(s)"
                subtext={formatAttributes(projectData.attributes)}
                handleClickButton={() => setShowDocumentModal(true)}
                actions={{"Update project": handleUpdateProject, "Delete project": () => setOpenDeleteModal(true)}}
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
            <PopupModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                text="Are you sure you want to delete this project?"
                handleSave={handleDeleteProject}
                buttonText='Delete'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            
        </Box>
    );
}