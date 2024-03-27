import React, { useState, useContext } from "react";
import { useLocation } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Alert,
    Checkbox,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { geticl_role } from "../apis/icl_role";
import { geticl_country } from "../apis/icl_country";
import { geticl_user } from "../apis/icl_user";
import { useTranslation } from 'react-i18next';
import {
    geticl_user_role,
    geticl_user_role_byid,
    geticl_user_role_byuser,
    geticl_user_role_byrole,
    geticl_user_role_bycountry,
    newicl_user_role_batch,
    newicl_user_role,
    updateicl_user_role_batch,
    updateicl_user_role,
    deleteicl_user_role,
} from "../apis/icl_user_role";

import { useNavigate } from "react-router-dom";
import {
    Plus as PlusIcon,
    CheckCircle as CheckCircleIcon,
    XCircle as XCircleIcon,
    Save as SaveIcon,
} from "react-feather";

const UMUserRolesList = () => {
    // Access to user data
    const {
        data: userData,
        isLoading: userLoading,
        isError: userError,
    } = useQuery(["geticl_user"], geticl_user);

    // Access to roles data
    const {
        data: rolesAData,
        isLoading: rolesALoading,
        isError: rolesAError,
    } = useQuery(["geticl_role"], geticl_role);
    // Access to countries data
    const {
        data: countiresAData,
        isLoading: countriesALoading,
        isError: countriesAError,
    } = useQuery(["geticl_country"], geticl_country);    

    let users = [];
    if (!userLoading && !userError && userData) {
        users = userData.data.filter((user) => !user.isDeleted);
    }

    const [rolesAs, setRolesA] = React.useState([]);
    const [selectedUserCard, setSelectedUserCard] = React.useState(null);
    const [countryCodes, setCcountryCodes] = useState(null);

    //Filter page options based on permissions
    const location = useLocation();
    const currentPath = location.pathname.replace(/\//g, "", "");
    const showCreate = true;
    const showUpdateAndDelete = true;

    React.useEffect(() => {
        if (!rolesALoading && !rolesAError && rolesAData && !countriesALoading && !countriesAError && countiresAData) {
            const updatedRolesA = rolesAData.data
                .filter((role) => !role.isDeleted)
                .flatMap(role => {
                    return countiresAData.data
                        .filter((country) => !country.isDeleted)
                        .map(country => ({
                            ...role,
                            roleid: role.id,
                            id: null,
                            enabled: false,
                            userid: null,
                            countrycode: country.code,
                            countryid: country.id,
                            countryname: country.name,
                        }));
            });
            const countryCodes = countiresAData.data.filter(country => !country.isDeleted)
                .map(country => country.code).sort().filter((_, index) => index % 2 === 0);
            setCcountryCodes(countryCodes);

        setRolesA(updatedRolesA);
        if (selectedUser) {
            handleUserChange({ target: { value: selectedUser } });
        }
    }
}, [rolesALoading, rolesAError, rolesAData, countriesALoading, countriesAError, countiresAData]);


    const handlePermissionChange = (event, params) => {
        const field = params.field;
        const { checked } = event.target;

        const updatedRolesA = rolesAs.map((role, index) => {
            if (`${role.roleid}-${role.countryid}` === params.id) {
                return {
                    ...role,
                    [field]: checked,
                };
            }
            return role;
        });
        setRolesA(updatedRolesA);

    };

    const handleSaveChanges = async () => {
        if (!selectedUser) {
            setErrorMessage(t("Please select a user"));
            return;
        }
        const userRolesNew = rolesAs
            .filter((role) => role.id === null)
            .map(({ id, ...rest }) => ({
                roleid: rest.roleid,
                countryid: rest.countryid,
                enabled: rest.enabled,
                userid: selectedUser,
            }));

        const userRolesUpdate = rolesAs
            .filter((role) => role.id !== null)
            .map((rest) => ({
                id: rest.id,
                roleid: rest.roleid,
                countryid: rest.countryid,
                enabled: rest.enabled,
                userid: selectedUser,
            }));

        try {
            if (userRolesNew.length > 0) {
                await newicl_user_role_batch(userRolesNew);
            }
            if (userRolesUpdate.length > 0) {
                await updateicl_user_role_batch(userRolesUpdate);
            }
            setSuccessMessage(t("Changes saved successfully"));
        } catch (error) {
            setErrorMessage(t("Error saving changes. Please try again"));
        }
    };

    const handleUserChange = async (event) => {
        const userid = event.target.value;
        setSelectedUser(userid);
        const user = users.find((user) => user.id === userid);
        setSelectedUserCard(user);

        //disable box:
        setSearchText(user.email);
        setFilteredUsers([]);

        if (userid) {
            try {
                const userRolesData = await geticl_user_role_byuser(userid);
                const updatedRolesA = rolesAs.map((role) => {
                    const userRole = userRolesData.data.find((option) => option.roleId === role.roleid && option.countryId === role.countryid);
                    if (userRole) {
                        return {
                            ...role,
                            id: userRole.id,
                            enabled: userRole.enabled
                        };
                    } else {
                        return {
                            ...role,
                            id: null,
                            enabled: false
                        };
                    }
                });
                setRolesA(updatedRolesA);
            } catch (error) {
                console.error(error);
            }
        } else {
            const updatedRolesA = rolesAs.map((role) => ({
                ...role,
                id: null,
                enabled: false
            }));
            setRolesA(updatedRolesA);
        }
    };


    const [errorMessage, setErrorMessage] = React.useState("");
    const [successMessage, setSuccessMessage] = React.useState("");
    React.useEffect(() => {
        if (errorMessage) {
            const timeoutId = setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [errorMessage]);
    React.useEffect(() => {
        if (successMessage) {
            const timeoutId = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [successMessage]);

    const [searchText, setSearchText] = React.useState('');
    const [filteredUsers, setFilteredUsers] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const listRef = React.useRef(null);


    const filterUsers = (text) => {
        const filteredUsers = users.filter(
            (user) =>
                user.email.toLowerCase().includes(text.toLowerCase()) ||
                user.fullName.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filteredUsers);
    };
    const handleSearchChange = (event) => {
        let searchedText = event.target.value;
        setSearchText(searchedText);

        if (searchText.length <4 ) {
            searchedText = "";
        }
        filterUsers(searchedText);
    };
    const handleInputFocus = () => {
        filterUsers("");
    };
    const handleInputBlur= () => {
    };

    const { t } = useTranslation();
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom style={{ color: "darkblue", fontWeight: "bold", borderBottom: "1px solid lightgray", paddingBottom: "8px" }}>
                            {t('Roles Assignment')}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 165, 0, 0.05)',
                                borderRadius: '4px',
                                border: '1px solid rgba(180, 155, 10, 1)',
                            }}
                        >
                            <input
                                type="text"
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    fontWeight: 'bold',
                                    padding: '8px',
                                    backgroundColor: 'rgba(255, 165, 0, 0.05)',
                                }}
                                placeholder={t('Search user')}                                
                                value={searchText}
                                onChange={handleSearchChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                            />
                        </div>
                    </Grid>

                    {filteredUsers.length > 0 && (
                        <Grid item xs={12}>
                            <div
                                ref={listRef}
                                style={{
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    marginTop: '8px',
                                    border: '1px solid rgba(180, 155, 10, 1)',
                                    borderRadius: '4px',
                                }}
                            >
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => handleUserChange({ target: { value: user.id } })}
                                        style={{
                                            cursor: 'pointer',
                                            padding: '8px',
                                            backgroundColor: user.id === selectedUser ? 'lightblue' : 'transparent',
                                        }}
                                    >
                                        {user.email}  ({user.fullName})
                                    </div>
                                ))}
                            </div>
                        </Grid>
                    )}

                    {selectedUserCard && (
                        <Grid item xs={12}>
                          <Card variant="outlined" style={{ maxWidth: '450px', borderWidth: '2px', borderColor: 'black' }}>
                            <CardContent>
                              <Typography variant="h5" gutterBottom style={{ marginBottom: '16px' }}>
                                {t('User Information')}
                              </Typography>
                              <div style={{ display: 'flex', marginBottom: '5px' }}>
                                <Typography variant="body1" style={{ fontWeight: 'bold', width: '100px' }}>
                                  {t('Full Name:')}
                                </Typography>
                                <Typography variant="body1">{selectedUserCard.fullName}</Typography>
                              </div>
                              {/*<div style={{ display: 'flex' }}>*/}
                              {/*  <Typography variant="body1" style={{ fontWeight: 'bold', width: '100px' }}>*/}
                              {/*    {t('Email:')}*/}
                              {/*  </Typography>*/}
                              {/*  <Typography variant="body1">{selectedUserCard.email}</Typography>*/}
                              {/*</div>*/}
                            </CardContent>
                          </Card>
                        </Grid>

                    )}

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                            {t('Roles selection:')}
                        </Typography>
                        {rolesAs.length > 0 ? (
                            <div style={{ height: 900, width: "100%" }}>
                                <DataGrid
                                    rows={rolesAs}
                                    columns={[
                                        { field: "id", headerName: "Id", width: 100, hide: true },
                                        { field: "roleid", headerName: "roleid", width: 100, hide: true },
                                        { field: "countryid", headerName: "countryid", width: 100, hide: true },
                                        { field: "countrycode", headerName: " ", width: 80, headerClassName: "headerCell",
                                            renderCell: (params) => (
                                                <Typography
                                                    variant="body1"
                                                    style={{fontWeight: 800}}
                                                >
                                                    {params.value}
                                                </Typography>
                                            ),
                                        },
                                        { field: "countryname", headerName: "Country", width: 220, headerClassName: "headerCell",
                                            renderCell: (params) => (
                                                <Typography
                                                    variant="body1"
                                                    style={{fontWeight: 800}}
                                                >
                                                    {params.value}
                                                </Typography>
                                            ),
                                        },
                                        { field: "category", headerName: "Category", width: 150, headerClassName: "headerCell" },
                                        { field: "name", headerName: "Role", width: 220, headerClassName: "headerCell" },
                                        {
                                            field: "enabled",
                                            headerName: "",
                                            width: 180,
                                            headerClassName: "headerCell",
                                            renderCell: (params) => (
                                                <Checkbox
                                                    checked={params.value}
                                                    color="primary"
                                                    onChange={(event) => handlePermissionChange(event, params)}
                                                />
                                            ),
                                        }
                                    ]}
                                    getRowId={(row) => `${row.roleid}-${row.countryid}`}
                                    sx={{
                                        boxShadow: 1,
                                        '& .headerCell': {
                                            fontSize: 'medium',
                                            textDecoration: 'underline',
                                        },
                                        '& .fr-background': {
                                            backgroundColor: '#F2EDF3',
                                        },
                                    }}
                                    getRowClassName={(params) =>
                                        countryCodes.includes(params.row.countrycode) ? 'fr-background' : ''
                                    }
                                    sortModel={[
                                        { field: 'countrycode', sort: 'asc' }
                                    ]}
                                />
                            </div>
                        ) : (
                            <Typography variant="body2">
                                {t('No roles available.')}
                            </Typography>
                        )}
                    </Grid>



                    {successMessage && (
                        <Grid item xs={12}>
                            <Box mt={2}>
                                <Alert severity="success">{successMessage}</Alert>
                            </Box>
                        </Grid>
                    )}
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Box mt={2}>
                                <Alert severity="error">{errorMessage}</Alert>
                            </Box>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveChanges}
                            style={{ marginTop: "16px", display: showCreate ? "inline-flex" : "none" }}
                        >
                            {t('Save Changes')}
                        </Button>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    );

};

export default UMUserRolesList;
