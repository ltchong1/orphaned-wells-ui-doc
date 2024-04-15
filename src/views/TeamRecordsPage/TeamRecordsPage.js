import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { getTeamRecords } from '../../services/app.service';
import RecordsTable from '../../components/RecordsTable/RecordsTable';
import Subheader from '../../components/Subheader/Subheader';
import { callAPI } from '../../assets/helperFunctions';

export default function TeamRecordsPage() {
    const [ records, setRecords ] = useState([])

    useEffect(() => {
        callAPI(
            getTeamRecords,
            [],
            handleSuccess,
            (e) => {console.error('error getting team records: ',e)}
        )
    }, [])

    const handleSuccess = (data) => {
        setRecords(data.records)
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

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="All Records"
                // buttonName="Upload new record(s)"
            />
            <Box sx={styles.innerBox}>
                <RecordsTable
                    // projectData={projectData}
                    records={records}
                />
            </Box>
        </Box>
    );
}