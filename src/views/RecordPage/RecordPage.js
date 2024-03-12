import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getRecordData, updateRecord, deleteRecord } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';
import Subheader from '../../components/Subheader/Subheader';
import DocumentContainer from '../../components/DocumentContainer/DocumentContainer';
import PopupModal from '../../components/PopupModal/PopupModal';

export default function Record() {
    const [ recordData, setRecordData ] = useState({})
    const [ wasEdited, setWasEdited ] = useState(false)
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false)
    const [ openUpdateNameModal, setOpenUpdateNameModal ] = useState(false)
    const [ recordName, setRecordName ] = useState("")
    let params = useParams(); 
    let navigate = useNavigate();

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100%"
        },
        innerBox: {
            paddingY:5,
            paddingX:5,
        },
    }

    useEffect(() => {
        callAPI(
            getRecordData,
            [params.id],
            handleSuccessfulFetchRecord,
            (e) => console.error('error getting record data: ',e)
        )
    }, [params.id])

    const handleSuccessfulFetchRecord = (data) => {
        setRecordData(data)
        setRecordName(data.name)
    }

    const handleChangeRecordName = (event) => {
        setRecordName(event.target.value)
    }

    const handleUpdateRecordName = () => {
        setOpenUpdateNameModal(false)
        callAPI(
            updateRecord,
            [params.id, {data: {name: recordName}, type: "name"}],
            (data) => window.location.reload(),
            (e) => console.error('error on updating record name: ',e)
        )
    }

    const handleUpdateRecord = () => {
        callAPI(
            updateRecord,
            [params.id, {data: recordData, type: "attributes"}],
            (data) => setWasEdited(false),
            (e) => console.error('error updating record: ',e)
        )
    }

    const handleChangeValue = (event) => {
        let attribute = event.target.name
        let value = event.target.value
        let tempRecordData = {...recordData}
        let tempAttributes = {...tempRecordData.attributes}
        let tempAttribute = {...tempAttributes[attribute]}
        tempAttribute.value = value
        tempAttributes[attribute] = tempAttribute
        tempRecordData.attributes = tempAttributes
        setRecordData(tempRecordData)
        setWasEdited(true)
    }

    const handleDeleteRecord = () => {
        setOpenDeleteModal(false)
        callAPI(
            deleteRecord,
            [params.id],
            (data) => goToProject,
            (e) => console.error('error on deleting record: ',e)
        )
    }

    const goToProject = () => {
        navigate("/project/"+recordData.project_id, {replace: true})
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={recordData.name}
                buttonName="Update Record"
                // subtext={formatAttributes(projectData.attributes)}
                handleClickButton={handleUpdateRecord}
                disableButton={!wasEdited}
                actions={{
                    "Change name": () => setOpenUpdateNameModal(true),
                    "Delete record": () => setOpenDeleteModal(true)
                }}
                upFunction={goToProject}
                // previousPages={[{name: "project", path: "/project/"+recordData.project_id}]}
            />
            <Box sx={styles.innerBox}>
                <DocumentContainer
                    image={recordData.img_url}
                    attributes={recordData.attributes}
                    handleChangeValue={handleChangeValue}
                />
            </Box>
            <PopupModal
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                text="Are you sure you want to delete this record?"
                handleSave={handleDeleteRecord}
                buttonText='Delete'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                input
                open={openUpdateNameModal}
                handleClose={() => setOpenUpdateNameModal(false)}
                text={recordName}
                textLabel='Record Name'
                handleEditText={handleChangeRecordName}
                handleSave={handleUpdateRecordName}
                buttonText='Update'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
        </Box>
    );
}