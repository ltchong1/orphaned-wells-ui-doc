import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams } from "react-router-dom";
import { getProjectData } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';

export default function Project(props) {
    const [ records, setRecords ] = useState([])
    const [ projectData, setProjectData ] = useState({attributes: []})
    let params = useParams(); 
    useEffect(() => {
        getProjectData(params.id)
        .then(response => response.json())
        .then((data)=>{
            console.log("Project Data:", data);
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

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={projectData.name}
                buttonName="Upload new record(s)"
                subtext={formatAttributes(projectData.attributes)}
            />
            <Box sx={styles.innerBox}>
                <RecordsTable
                    records={records}
                    attributes={projectData.attributes}
                />
            </Box>
        </Box>
    );
}