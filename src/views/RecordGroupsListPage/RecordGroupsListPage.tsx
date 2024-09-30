import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import RecordGroupsTable from '../../components/RecordGroupsTable/RecordGroupsTable';
import NewRecordGroupDialog from '../../components/NewRecordGroupDialog/NewRecordGroupDialog';
import { getRecordGroups } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';

const RecordGroupsListPage = () => {
    const [record_groups, setRecordGroups] = useState<any[]>([]);
    const [unableToConnect, setUnableToConnect] = useState(false);
    const [showNewRecordGroupDialog, setShowNewRecordGroupDialog] = useState(false);

    useEffect(() => {
        callAPI(getRecordGroups, [], handleSuccess, handleError);
    }, []);

    const handleSuccess = (data: any) => {
        setRecordGroups(data);
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
                currentPage="Record Groups"
                buttonName="New Record Group"
                handleClickButton={handleClickNewRecordGroup}
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ? 
                    <RecordGroupsTable record_groups={record_groups} />
                :
                    <h1>Unable to connect to backend. Please make sure that backend server is up and running.</h1>
                }
                <NewRecordGroupDialog open={showNewRecordGroupDialog} onClose={() => setShowNewRecordGroupDialog(false)} />
            </Box>
        </Box>
    );
};

export default RecordGroupsListPage;