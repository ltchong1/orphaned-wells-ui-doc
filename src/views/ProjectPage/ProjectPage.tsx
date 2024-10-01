import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import RecordGroupsTable from '../../components/RecordGroupsTable/RecordGroupsTable';
import NewRecordGroupDialog from '../../components/NewRecordGroupDialog/NewRecordGroupDialog';
import { getRecordGroups } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectData } from '../../types';

const Project = () => {
    let params = useParams();
    const navigate = useNavigate();
    const [projectData, setProjectData] = useState({} as ProjectData)
    const [record_groups, setRecordGroups] = useState<any[]>([]);
    const [unableToConnect, setUnableToConnect] = useState(false);
    const [showNewRecordGroupDialog, setShowNewRecordGroupDialog] = useState(false);

    useEffect(() => {
        callAPI(getRecordGroups, [params.id], handleSuccess, handleError);
    }, []);

    const handleSuccess = (data: any) => {
        setRecordGroups(data.record_groups);
        setProjectData(data.project)
    };

    const handleError = (e: Error) => {
        console.error(e);
        setUnableToConnect(true);
    };

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY: 5,
            paddingX: 5,
        },
    };

    const handleClickNewRecordGroup = () => {
        setShowNewRecordGroupDialog(true);
    };

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage={projectData.name}
                buttonName="New Record Group"
                handleClickButton={handleClickNewRecordGroup}
                previousPages={
                    { 
                        "Projects": () => navigate("/projects", { replace: true }),
                    }
                }
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ? 
                    <RecordGroupsTable record_groups={record_groups} />
                :
                    <h1>Unable to connect to backend. Please make sure that backend server is up and running.</h1>
                }
                <NewRecordGroupDialog 
                    open={showNewRecordGroupDialog} 
                    onClose={() => setShowNewRecordGroupDialog(false)} 
                    project_id={params.id || ''}
                />
            </Box>
        </Box>
    );
};

export default Project;