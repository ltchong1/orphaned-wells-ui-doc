import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getProjectData, uploadDocument, deleteProject } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';
import UploadDocumentsModal from '../../components/UploadDocumentsModal/UploadDocumentsModal';
import PopupModal from '../../components/PopupModal/PopupModal';
import { callAPI } from '../../assets/helperFunctions';

export default function Project() {
    const [ records, setRecords ] = useState([])
    const [ projectData, setProjectData ] = useState({attributes: []})
    const [ showDocumentModal, setShowDocumentModal ] = useState(false)
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false)
    let params = useParams(); 
    let navigate = useNavigate();
    
    useEffect(() => {
        callAPI(
            getProjectData,
            [params.id],
            handleSuccess,
            (e) => {console.error('error getting project data: ',e)}
        )
    }, [params.id])

    const handleSuccess = (data) => {
        setRecords(data.records)
        setProjectData(data.project_data)
    }

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

    const handleUploadDocument = (file) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        callAPI(
            uploadDocument,
            [formData, projectData.id_],
            handleSuccessfulDocumentUpload,
            (e) => {console.error('error on file upload: ',e)}
        )
    }

    const handleSuccessfulDocumentUpload = () => {
        setTimeout(function() {
            window.location.reload()
          }, 500)
    }

    const handleUpdateProject = () => {
        console.log("hanlde update project")
    }

    const handleDeleteProject = () => {
        setOpenDeleteModal(false)
        callAPI(
            deleteProject,
            [projectData.id_],
            (data) => navigate("/projects", {replace: true}),
            (e) => {console.error('error on deleting project: ',e)}
        )
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={projectData.name}
                buttonName="Upload new record(s)"
                handleClickButton={() => setShowDocumentModal(true)}
                actions={{"Update project": handleUpdateProject, "Delete project": () => setOpenDeleteModal(true)}}
                previousPages={{"Projects": () => navigate("/projects", {replace: true})}}
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