import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams } from "react-router-dom";
import { getProjectData } from '../../services/app.service';

export default function Project(props) {
    let params = useParams(); 
    useEffect(() => {
        getProjectData(params.id)
        .then(response => response.json())
        .then((data)=>{
            console.log("Project Data:", data);
            
        }).catch((e) => {
            console.error('error getting project data: ',e)
        });
    }, [params.id])

    const styles = {
        
    }

    return (
        <Box>
            in project page
        </Box>
    );
}