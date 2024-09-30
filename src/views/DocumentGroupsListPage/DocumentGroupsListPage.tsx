import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import DocumentGroupsTable from '../../components/DocumentGroupsTable/DocumentGroupsTable';
import NewDocumentGroupDialog from '../../components/NewDocumentGroupDialog/NewDocumentGroupDialog';
import { getDocumentGroups } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';

const DocumentGroupsListPage = () => {
    const [document_groups, setDocumentGroups] = useState<any[]>([]);
    const [unableToConnect, setUnableToConnect] = useState(false);
    const [showNewDocumentGroupDialog, setShowNewDocumentGroupDialog] = useState(false);

    useEffect(() => {
        callAPI(getDocumentGroups, [], handleSuccess, handleError);
    }, []);

    const handleSuccess = (data: any) => {
        setDocumentGroups(data);
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

    const handleClickNewDocumentGroup = () => {
        setShowNewDocumentGroupDialog(true);
    };

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="Document Groups"
                buttonName="New Document Group"
                handleClickButton={handleClickNewDocumentGroup}
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ? 
                    <DocumentGroupsTable document_groups={document_groups} />
                :
                    <h1>Unable to connect to backend. Please make sure that backend server is up and running.</h1>
                }
                <NewDocumentGroupDialog open={showNewDocumentGroupDialog} onClose={() => setShowNewDocumentGroupDialog(false)} />
            </Box>
        </Box>
    );
};

export default DocumentGroupsListPage;