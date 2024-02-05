import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import ProjectsListTable from '../../components/ProjectsListTable/ProjectsListTable';
import NewProjectDialog from '../../components/NewProjectDialog/NewProjectDialog';
import { getProjects } from '../../services/app.service';
import { logout } from '../../assets/helperFunctions';

export default function ProjectsListPage(props) {
    const [ projects, setProjects ] = useState([])
    const [ unableToConnect, setUnableToConnect ]  = useState(false)
    const [ showNewProjectDialog, setShowNewProjectDialog ] = useState(false)

    useEffect(()=> {
        getProjects()
        .then(response => {
            response.json()
            .then((data)=> {
                if (response.status === 200) {
                    console.log('projects data: ')
                    console.log(data)
                    setProjects(data)
                } else if (response.status === 401) {
                    logout()
                } else {
                    console.log('error: ')
                    console.log(data)
                    setUnableToConnect(true)
                }
            }).catch((e) => {
                console.error(e)
                setUnableToConnect(true)
            })
        })
    },[])

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