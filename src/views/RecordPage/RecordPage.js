import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useParams } from "react-router-dom";
import { getRecordData } from '../../services/app.service';
import Subheader from '../../components/Subheader/Subheader';
import DocumentContainer from '../../components/DocumentContainer/DocumentContainer';

export default function Record(props) {
    const [ recordData, setRecordData ] = useState({})
    let params = useParams(); 
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

    const handleReprocessImage = () => {
        console.log('this functionality might not work for a bit hehe')
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={recordData.filename}
                buttonName="Reprocess image"
                // subtext={formatAttributes(projectData.attributes)}
                handleClickButton={() => handleReprocessImage(true)}
                disableButton={true}
                previousPages={[{name: "project", path: "/project/"+recordData.project_id}]}
            />
            <Box sx={styles.innerBox}>
                <DocumentContainer
                    image={recordData.img_url}
                    attributes={recordData.attributes}
                />
            </Box>
            
        </Box>
    );
}