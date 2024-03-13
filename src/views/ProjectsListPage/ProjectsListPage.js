import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import ProjectsListTable from '../../components/ProjectsListTable/ProjectsListTable';
import NewProjectDialog from '../../components/NewProjectDialog/NewProjectDialog';
import { getProjects } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';

export default function ProjectsListPage() {
    const [ projects, setProjects ] = useState([])
    const [ unableToConnect, setUnableToConnect ]  = useState(false)
    const [ showNewProjectDialog, setShowNewProjectDialog ] = useState(false)

    useEffect(()=> {
        callAPI(getProjects, [], handleSuccess, handleError)
    },[])

    const handleSuccess = (data) => {
        // console.log('projects data: ')
        // console.log(data)
        setProjects(data)
    }

    const handleError = (e) => {
        console.error(e)
        setUnableToConnect(true)
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

    const handleClickNewProject = () => {
        setShowNewProjectDialog(true)
    }


    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="Projects"
                buttonName="New Project"
                handleClickButton={handleClickNewProject}
                topLevel
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ? 
                    <ProjectsListTable projects={projects}/>
                :
                    <h1>Unable to connect to backend. Please make sure that backend server is up and running.</h1>
                }
                <NewProjectDialog open={showNewProjectDialog} onClose={() => setShowNewProjectDialog(false)}/>
            </Box>
            
        </Box>
        
    );

}