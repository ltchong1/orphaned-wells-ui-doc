import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import PopupModal from '../../components/PopupModal/PopupModal';
import ErrorBar from '../../components/ErrorBar/ErrorBar';
import { getPendingUsers, approveUser, addUser } from '../../services/app.service';
import { callAPI } from '../../assets/helperFunctions';

export default function AdminPage() {
    const [ pendingUsers, setPendingUsers ] = useState([])
    const [ unableToConnect, setUnableToConnect ]  = useState(false)
    const [ showNewUserModal, setShowNewUserModal ] = useState(false)
    const [ showApproveUserModal, setShowApproveUserModal ] = useState(false)
    const [ selectedUser, setSelectedUser ] = useState(null)
    const [ newUser, setNewUser ] = useState("")
    const [ disableSubmitNewUserButton, setDisableSubmitNewUserButton ] = useState(true)
    const [ showError, setShowError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState("")

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

    useEffect(()=> {
        callAPI(getPendingUsers, [], handleAuthSuccess, handleAuthError)
    },[])

    useEffect(()=> {
        // check if text is a valid email address
        setDisableSubmitNewUserButton(!emailIsValid(newUser))
    },[newUser])

    const emailIsValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleAuthSuccess = (data) => {
        setPendingUsers(data)
    }

    const handleAuthError = (e) => {
        console.error(e)
        setUnableToConnect(true)
    }

    const handleApproveUser = () => {
        callAPI(approveUser, [selectedUser], handleSuccess, (e) => handleUserError("unable to approve user", e))
    }

    const handleAddUser = () => {
        callAPI(addUser, [newUser], handleSuccess, (e) => handleUserError("unable to add user", e))
    }

    const handleSuccess = () => {
        setTimeout(function() {
            window.location.reload()
          }, 500)
    }

    const handleClose = () => {
        setShowApproveUserModal(false)
        setSelectedUser(null)
        setShowNewUserModal(false)
        setNewUser("")
    }

    const handleUserError = (message, e) => {
        console.error(e.detail)
        setShowError(true)
        setErrorMessage(e.detail)
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="Admin"
                buttonName="+ Add user"
                handleClickButton={() => setShowNewUserModal(true)}
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
                handleClose={handleClose}
                text="Would you like to approve this user for use of the application?"
                handleSave={handleApproveUser}
                buttonText='Approve'
                buttonColor='primary'
                buttonVariant='contained'
                width={400}
            />
            <PopupModal
                input
                open={showNewUserModal}
                handleClose={handleClose}
                text={newUser}
                textLabel='Enter email address of new user.'
                handleEditText={(e) => setNewUser(e.target.value)}
                handleSave={handleAddUser}
                buttonText='Submit'
                buttonColor='primary'
                buttonVariant='contained'
                width={600}
                disableSubmit={disableSubmitNewUserButton}
            />
            {
                showError && <ErrorBar duration={10000} setOpen={setShowError} severity="error" errorMessage={errorMessage} />
            }
            
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