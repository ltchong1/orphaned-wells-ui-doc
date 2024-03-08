import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import PopupModal from '../../components/PopupModal/PopupModal';
import { getPendingUsers, approveUser, addUser } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';

export default function AdminPage() {
    const [ pendingUsers, setPendingUsers ] = useState([])
    const [ unableToConnect, setUnableToConnect ]  = useState(false)
    const [ showNewUserModal, setShowNewUserModal ] = useState(false)
    const [ showApproveUserModal, setShowApproveUserModal ] = useState(false)
    const [ selectedUser, setSelectedUser ] = useState(null)

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

    const handleApproveUser = () => {
        callAPI(approveUser, [selectedUser], handleSuccessApproveUser, console.error("unable to approve user"))
    }

    const handleSuccessApproveUser = (data) => {
        setShowApproveUserModal(false)
        setSelectedUser(null)
        window.location.reload()
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
                    <PendingUsersTable 
                        pendingUsers={pendingUsers}
                        setSelectedUser={setSelectedUser}
                        setShowApproveUserModal= {setShowApproveUserModal}
                    />
                :
                    <h1>You are not authorized to view this page.</h1>
                }
            </Box>
            <PopupModal
                open={showApproveUserModal}
                handleClose={() => setShowApproveUserModal(false)}
                text="Would you like to approve this user for use of the application?"
                handleSave={handleApproveUser}
                buttonText='Approve'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
            {/* <PopupModal
                input
                open={showFieldNameModal}
                handleClose={() => setShowFieldNameModal(false)}
                text={customFieldName}
                textLabel='Optional: add name to save this field location.'
                handleEditText={handleEditCustomFieldName}
                handleSave={handleSearchTokens}
                buttonText='Submit'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            /> */}
            
        </Box>
        
    );

}

function PendingUsersTable(props) {

    const { pendingUsers, setSelectedUser, setShowApproveUserModal } = props;

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

      const handleSelectUser = (user) => {
        setShowApproveUserModal(true)
        setSelectedUser(user.email)
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
                    onClick={() => handleSelectUser(row)}
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