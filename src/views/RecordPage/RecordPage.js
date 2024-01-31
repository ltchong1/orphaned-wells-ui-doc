import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useParams, useNavigate } from "react-router-dom";
import { getRecordData, updateRecord, deleteRecord } from '../../services/app.service';
import Subheader from '../../components/Subheader/Subheader';
import DocumentContainer from '../../components/DocumentContainer/DocumentContainer';
import PopupModal from '../../components/PopupModal/PopupModal';

export default function Record(props) {
    const [ recordData, setRecordData ] = useState({})
    const [ wasEdited, setWasEdited ] = useState(false)
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false)
    let params = useParams(); 
    let navigate = useNavigate();
    useEffect(() => {
        getRecordData(params.id)
        .then(response => response.json())
        .then((data)=>{
            // console.log("Record Data:", data);
            setRecordData(data)
        }).catch((e) => {
            console.error('error getting record data: ',e)
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

    const handleUpdateRecord = () => {
        updateRecord(params.id, recordData)
        .then(response => response.json())
        .then((data)=> {
            // console.log("successfully updated record: "+data)
            setWasEdited(true)
        }).catch((e) => {
            console.error("error updating record: ")
            console.error(e)
        })
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
        deleteRecord(params.id)
        .then(response => response.json())
        .then((data) => {
            navigate("/project/"+recordData.project_id, {replace: true})
        }).catch((e) => {
            console.error("error on deleting record: "+e)
        })
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={recordData.filename}
                buttonName="Update Record"
                // subtext={formatAttributes(projectData.attributes)}
                handleClickButton={handleUpdateRecord}
                disableButton={!wasEdited}
                actions={{"Delete record": () => setOpenDeleteModal(true)}}
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
        </Box>
    );
}