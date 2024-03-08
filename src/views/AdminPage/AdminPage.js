import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import { getPendingUsers } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';

export default function AdminPage() {
    const [ pendingUsers, setPendingUsers ] = useState([])
    const [ unableToConnect, setUnableToConnect ]  = useState(false)
    const [ showNewProjectDialog, setShowNewProjectDialog ] = useState(false)

    useEffect(()=> {
        callAPI(getPendingUsers, [], handleSuccess, handleError)
    },[])

    const handleSuccess = (data) => {
        setPendingUsers(data)
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

    const handleClickAddUser = () => {

    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="Admin"
                buttonName="add user"
                handleClickButton={handleClickAddUser}
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ? 
                    <PendingUsersTable pendingUsers={pendingUsers}/>
                :
                    <h1>You are not authorized to view this page.</h1>
                }
            </Box>
            
        </Box>
        
    );

}

function PendingUsersTable(props) {

    const { pendingUsers } = props;

    const styles = {
        headerRow: {
          fontWeight: "bold"
        },
        userRow: {
          cursor: "pointer",
          "&:hover": {
            background: "#efefef"
          },
        }
      }

    return (
        <TableContainer component={Paper}>
            <h1>Pending Users</h1>
        <Table sx={{ minWidth: 650, borderTop: "5px solid #F5F5F6" }} aria-label="pending users table">
            <TableHead>
            <TableRow>
                {["Name", "Email", "Organization"].map((value)=>(
                    <TableCell sx={styles.headerRow} key={value}>{value}</TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
            {pendingUsers.map((row) => (
                <TableRow
                    key={row.name}
                    sx={styles.userRow}
                >
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.hd}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    )
}