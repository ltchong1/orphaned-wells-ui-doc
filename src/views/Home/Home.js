import { useState, useEffect } from 'react';
import { Grid, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from '@mui/material';
import ProjectsListTable from '../../components/ProjectsListTable/ProjectsListTable';
import { getProjects } from '../../services/app.service';

export default function Home(props) {
    const [ projects, setProjects ] = useState([])

    useEffect(()=> {
        console.log('getting projects')
        getProjects().then((response) => response.json()).then((data)=> {
            console.log('projects data: ')
            console.log(data)
            setProjects(data)
        })
    },[])

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY:5,
            paddingX:15,
        },
    }

    return (
        <Box sx={styles.outerBox}>
            <Box sx={styles.innerBox}>
                <ProjectsListTable/>
            </Box>
            
        </Box>
        
    );

}