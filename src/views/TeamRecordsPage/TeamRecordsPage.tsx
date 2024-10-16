import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Box } from '@mui/material';
import { getTeamInfo } from '../../services/app.service';
import Subheader from '../../components/Subheader/Subheader';
import { callAPI } from '../../assets/util';
import { RecordData } from '../../types';
import RecordsTable from '../../components/RecordsTable/RecordsTable';

const TeamRecordsPage = () => {
    const params = useParams<{ id: string }>(); 
    const [showRecordsTable, setShowRecordsTable] = useState(false);
    const [teamInfo, setTeamInfo] = useState<any>({})

    useEffect(() => {
        /*
            - get team data. this includes all record groups that team owns
            - display records table with all those record groups

        */
        callAPI(
            getTeamInfo,
            [],
            handleFetchedTeamInfo,
            (e: Error) => { console.error('error getting team records: ', e) }
        );
    }, []);

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

    const handleFetchedTeamInfo = (data: any) => {
        console.log(data)
        setTeamInfo(data);
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="All Records"
            />
            <Box sx={styles.innerBox}>
                {showRecordsTable && 
                    <RecordsTable
                        location="team_records"
                        params={params}
                        filter_options={{}}
                        handleUpdate={(e) => {}}
                    />
                }
            </Box>
        </Box>
    );
}

export default TeamRecordsPage;