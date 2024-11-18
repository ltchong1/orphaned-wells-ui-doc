import { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Select, MenuItem, Menu, IconButton, Tooltip, InputLabel } from '@mui/material';
import Subheader from '../../components/Subheader/Subheader';
import PopupModal from '../../components/PopupModal/PopupModal';
import ErrorBar from '../../components/ErrorBar/ErrorBar';
import { getUsers, addUser, deleteUser, updateUserRole } from '../../services/app.service';
import { callAPI } from '../../assets/util';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CancelIcon from '@mui/icons-material/Cancel';
import { useUserContext } from '../../usercontext';

const AdminPage = () => {
    const { user, userPermissions } = useUserContext();
    const [users, setUsers] = useState<any[]>([]);
    const [unableToConnect, setUnableToConnect] = useState(false);
    const [showNewUserModal, setShowNewUserModal] = useState(false);
    const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [newUser, setNewUser] = useState("");
    const [newRole, setNewRole] = useState("")
    const [disableSubmitNewUserButton, setDisableSubmitNewUserButton] = useState(true);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const styles = {
        outerBox: {
            backgroundColor: "#F5F5F6",
            height: "100vh"
        },
        innerBox: {
            paddingY: 5,
            paddingX: 5,
        },
    }

    useEffect(() => {
        callAPI(getUsers, [], handleAuthSuccess, handleAuthError);
    }, []);

    useEffect(() => {
        setDisableSubmitNewUserButton(!emailIsValid(newUser));
    }, [newUser]);

    const emailIsValid = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const handleAuthSuccess = (data: any[]) => {
        setUsers(data);
    }

    const handleAuthError = (e: any) => {
        console.error(e);
        setUnableToConnect(true);
    }

    const handleAddUser = () => {
        callAPI(addUser, [newUser], handleSuccess, (e) => handleUserError("unable to add user", e));
    }

    const handleDeleteUser = () => {
        callAPI(deleteUser, [selectedUser], handleSuccess, (e) => handleUserError("unable to delete user", e));
    }

    const handleChangeRole = () => {
        let data = {
            email: selectedUser,
            new_role: newRole,
            role_type: "teams",
        }
        callAPI(updateUserRole, [data], handleSuccess, (e) => handleUserError("unable to change role", e));
    }

    const handleSuccess = () => {
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    const handleClose = () => {
        setSelectedUser(null);
        setNewRole("")
        setShowNewUserModal(false);
        setNewUser("");
        setShowDeleteUserModal(false);
        setShowChangeRoleModal(false)
    }

    const handleUserError = (message: string, e: any) => {
        console.error(message)
        console.error(e.detail);
        setShowError(true);
        setErrorMessage(e.detail);
    }

    return (
        <Box sx={styles.outerBox}>
            <Subheader
                currentPage="Admin"
                buttonName={(userPermissions && userPermissions.includes('add_user')) ? "+ Add user" : undefined}
                handleClickButton={() => setShowNewUserModal(true)}
            />
            <Box sx={styles.innerBox}>
                {!unableToConnect ?
                    <UsersTable
                        user={user}
                        users={users}
                        setSelectedUser={setSelectedUser}
                        setNewRole={setNewRole}
                        setShowChangeRoleModal={setShowChangeRoleModal}
                        setShowDeleteUserModal={setShowDeleteUserModal}
                        userPermissions={userPermissions}
                    />
                    :
                    <h1>You are not authorized to view this page.</h1>
                }
            </Box>
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
            <PopupModal
                open={showChangeRoleModal}
                handleClose={handleClose}
                text={"Are you sure you would like to change "+selectedUser+"'s role to "+newRole.replace('_', ' ')+"?"}
                handleSave={handleChangeRole}
                buttonText='Submit'
                buttonColor='primary'
                buttonVariant='contained'
                width={600}
            />
            <PopupModal
                open={showDeleteUserModal}
                handleClose={handleClose}
                text="Are you sure you would like to remove this user?"
                handleSave={handleDeleteUser}
                buttonText='Remove'
                buttonColor='error'
                buttonVariant='contained'
                width={400}
            />
            {
                showError && <ErrorBar duration={10000} setOpen={setShowError} severity="error" errorMessage={errorMessage} />
            }
        </Box>
    );
}

interface UsersTableProps {
    user: any;
    users: any[];
    setSelectedUser: (user: string | null) => void;
    setNewRole: (role: string) => void;
    setShowChangeRoleModal: (show: boolean) => void;
    setShowDeleteUserModal: (show: boolean) => void;
    userPermissions: any;
}

const UsersTable = ({ user, users, setSelectedUser, setShowChangeRoleModal, setNewRole, setShowDeleteUserModal, userPermissions }: UsersTableProps) => {

    const styles = {
        headerRow: {
            fontWeight: "bold"
        },
        userRow: {
            "&:hover": {
                background: "#efefef"
            },
        }
    }

    const handleDeleteUser = (user: any) => {
        setShowDeleteUserModal(true);
        setSelectedUser(user.email);
    }

    const handleChangeRole = (user: any, role: string) => {
        setNewRole(role)
        setSelectedUser(user.email)
        setShowChangeRoleModal(true)
    }

    const getRole = (roles: any) => {
        if (roles.teams && roles.teams[user.default_team]) {
            if (roles.teams[user.default_team].includes('team_lead')) return 'team lead'
            else if (roles.teams[user.default_team].includes('team_member')) return 'team member'
            else return null
        }
        return null
    }

    if (user) return (
        <TableContainer component={Paper}>
            <h1>Users</h1>
            <Table sx={{ minWidth: 650, borderTop: "5px solid #F5F5F6" }} aria-label="pending users table" size="small">
                <TableHead>
                    <TableRow>
                        {[["Name", "25%"], ["Email", "25%"], ["Role", "25%"], ["Actions", "25%"]].map((value) => (
                            <TableCell width={value[1]} sx={styles.headerRow} key={value[0]}>{value[0]}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((row) => (
                        <TableRow
                            key={row.email}
                            sx={styles.userRow}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{getRole(row.roles)}</TableCell>
                            <TableCell>
                            {userPermissions && userPermissions.includes('manage_team') &&
                                <RoleDropdown user={row} role={getRole(row.roles)} handleSelectRole={handleChangeRole}/>
                            }
                            {userPermissions && userPermissions.includes('manage_team') &&
                                <Tooltip title="Remove User">
                                    <IconButton color="error" onClick={() => handleDeleteUser(row)}><CancelIcon /></IconButton>
                                </Tooltip>
                            }
                                
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
    else return (
        <div>

        </div>
    )
}

interface RoleDropdownProps {
    user: any;
    role: string | null;
    handleSelectRole: (user: any, role: string) => void;
}

const RoleDropdown = ({ user, role, handleSelectRole }: RoleDropdownProps) => {

  const [anchorAr, setAnchorAr] = useState<null | HTMLElement>(null);
  const [roleActions, setRoleActions] = useState(false);

  const handleShowRoleActions = (event: React.MouseEvent<HTMLElement>) => {
    setRoleActions(!roleActions);
    setAnchorAr(event.currentTarget);
  }

  const handleClick = (user: any, r: string) => {
    handleSelectRole(user, r.replace(' ', '_'))
    setRoleActions(false)
  }

    return (
        <span>
            <Tooltip title="Change role">
                <IconButton color="primary" onClick={handleShowRoleActions}>
                    <ManageAccountsIcon/>
                </IconButton>
            </Tooltip>
            <Menu
                id="actions-list"
                anchorEl={anchorAr}
                open={roleActions}
                onClose={() => setRoleActions(false)}
            >
                {['team member', 'team lead'].map((r) => {
                    if (r !== role) return (
                        <MenuItem
                            key={r}
                            value={r}
                            onClick={() => handleClick(user, r.replace(' ', '_'))}
                        >
                            {r}
                        </MenuItem>
                    )
                })}
            </Menu>
        </span>
    );
}

export default AdminPage;