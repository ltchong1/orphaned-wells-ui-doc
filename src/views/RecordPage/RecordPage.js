import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams } from "react-router-dom";
import { getRecordData } from '../../services/app.service';
import Subheader from '../../components/Subheader/Subheader';

export default function Record(props) {
    const [ recordData, setRecordData ] = useState(null)
    let params = useParams(); 
    useEffect(() => {
        getRecordData(params.id)
        .then(response => response.json())
        .then((data)=>{
            console.log("Record Data:", data);
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
                currentPage={"Record"}
                buttonName="Reprocess image"
                // subtext={formatAttributes(projectData.attributes)}
                handleClickButton={() => handleReprocessImage(true)}
            />
            <Box sx={styles.innerBox}>
                
            </Box>
            
        </Box>
    );
}