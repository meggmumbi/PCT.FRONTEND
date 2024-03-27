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
import { geticl_options_route } from "../apis/icl_options_route";
import { useTranslation } from 'react-i18next';
import {
    geticl_role_option,
    geticl_role_option_byid,
    geticl_role_option_byrole,
    geticl_role_option_byoption,
    newicl_role_option,
    newicl_role_option_batch,
    updateicl_role_option,
    updateicl_role_option_batch,
    deleteicl_role_option,
} from "../apis/icl_role_option";
import { useNavigate } from "react-router-dom";
import {
    Plus as PlusIcon,
    CheckCircle as CheckCircleIcon,
    XCircle as XCircleIcon,
    Save as SaveIcon,
} from "react-feather";

const UMRoleOptionsList = () => {
    // Access to role data
    const {
        data: roleData,
        isLoading: roleLoading,
        isError: roleError,
        error: roleErrorData,
        refetch: roleRefetch,
    } = useQuery(["geticl_role"], geticl_role);

    // Access to options route data
    const {
        data: optionsRouteData,
        isLoading: optionsRouteLoading,
        isError: optionsRouteError,
        error: optionsRouteErrorData,
        refetch: optionsRouteRefetch,
    } = useQuery(["geticl_options_route"], geticl_options_route);

    let roles = [];
    if (!roleLoading && !roleError && roleData) {
        roles = roleData.data
            .filter((role) => !role.isDeleted)
            .sort((a, b) => {
                if (a.category === "Internal" && b.category !== "Internal") {
                    return -1; // a debe ir antes que b
                }
                if (a.category !== "Internal" && b.category === "Internal") {
                    return 1; // b debe ir antes que a
                }
                return 0; // no se cambia el orden
            });
    }

    const [optionsRoutes, setOptionsRoutes] = React.useState([]);

    //Filter page options based on permissions
    const location = useLocation();
    const currentPath = location.pathname.replace(/\//g, "", "");
    const showCreate = true;
    const showUpdateAndDelete = true;

    React.useEffect(() => {
        if (!optionsRouteLoading && !optionsRouteError && optionsRouteData) {
            const updatedOptionsRoutes = optionsRouteData.data
                .filter((route) => !route.isDeleted)
                .map((route) => ({
                    ...route,
                    optionid: route.id,
                    id: null,
                    readpermission: false,
                    writepermission: false,
                    updatepermission: false,
                    roleid: null,
                }));
            setOptionsRoutes(updatedOptionsRoutes);
            const selectedRole = document.getElementById("role-select").value;
            if (selectedRole) { 
                handleRoleChange({ target: { value: selectedRole } });
            }
        }
    }, [optionsRouteLoading, optionsRouteError, optionsRouteData]);

    const handlePermissionChange = (event, params) => {
        const field = params.field;
        const { checked } = event.target;

        const updatedOptionsRoutes = optionsRoutes.map((route, index) => {
            if (route.optionid === params.id) {
                return {
                    ...route,
                    [field]: checked,
                };
            }
            return route;
        });
        setOptionsRoutes(updatedOptionsRoutes);
    };

    const [isLoading, setIsLoading] = useState(false);

    const handleSaveChanges = async () => {
        const selectedRole = document.getElementById("role-select").value;
        if (!selectedRole) {
            setErrorMessage(t("Please select a role"));
            return;
        }
        setIsLoading(true);
        const selectedOptionsNew = optionsRoutes
            .filter((option) => option.id === null)
            .map(({ id, ...rest }) => ({
                optionid: rest.optionid,
                readpermission: rest.readpermission,
                writepermission: rest.writepermission,
                updatepermission: rest.updatepermission,
                roleid: selectedRole,
            }));

        const selectedOptionsUpdate = optionsRoutes
            .filter((option) => option.id !== null)
            .map((rest) => ({
                id: rest.id,
                optionid: rest.optionid,
                readpermission: rest.readpermission,
                writepermission: rest.writepermission,
                updatepermission: rest.updatepermission,
                roleid: selectedRole,
            }));


        try {
            if (selectedOptionsNew.length > 0) { 
                await newicl_role_option_batch(selectedOptionsNew);
            }
            if (selectedOptionsUpdate.length > 0) { 
                await updateicl_role_option_batch(selectedOptionsUpdate);
            }
            setSuccessMessage(t("Changes saved successfully"));
        } catch (error) {
            setErrorMessage(t("Error saving changes. Please try again"));
        } finally {
            setIsLoading(false); 
        }
    };

    const navigate = useNavigate();

    const handleRoleChange = async (event) => {
        const selectedRole = event.target.value;
        if (selectedRole) {
            try {
                const roleOptionsData = await geticl_role_option_byrole(selectedRole);
                const updatedOptionsRoutes = optionsRoutes.map((route) => {
                    const roleOption = roleOptionsData.data.find((option) => option.optionId === route.optionid);
                    if (roleOption) {
                        return {
                            ...route,
                            id: roleOption.id,
                            readpermission: roleOption.readPermission,
                            writepermission: roleOption.writePermission,
                            updatepermission: roleOption.updatePermission
                        };
                    } else {
                        return {
                            ...route,
                            id: null,
                            readpermission: false,
                            writepermission: false,
                            updatepermission: false
                        };
                    }
                });
                setOptionsRoutes(updatedOptionsRoutes);
            } catch (error) {
                console.error(error);
            }
        } else {
            const updatedOptionsRoutes = optionsRoutes.map((route) => ({
                ...route,
                id: null,
                readpermission: false,
                writepermission: false,
                updatepermission: false
            }));
            setOptionsRoutes(updatedOptionsRoutes);
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

    const getCategoryColor = (category) => {
        const categoryColors = {
            '/': "blue",
            '/manage': "green",
            '/plan': "blue",
            '/source': "green",
            '/store': "blue",
            'about': "green",
            'control-tower': "blue",
            'customer-order-upload': "green",
            'customer-orders': "blue",
            'dashboard': "green",
            'deliver': "blue",
            'enable': "green",
            'MISAdministration': "blue",            
            'shipment': "green",                      
        };

        return categoryColors[category] || "black";
    };
    const { t } = useTranslation();
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom style={{ color: "darkblue", fontWeight: "bold", borderBottom: "1px solid lightgray", paddingBottom: "8px" }}>
                            {t('Role Permission Management')}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <div style={{ marginBottom: "16px" }}></div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "rgba(255, 165, 0, 0.05)",
                                borderRadius: "4px",                                
                                border: "1px solid rgba(180, 155, 10, 1)",
                            }}
                        >
                            <select
                                style={{
                                    width: "100%",
                                    border: "none",
                                    fontWeight: "bold",
                                    padding: "8px",
                                    backgroundColor: "rgba(255, 165, 0, 0.05)",
                                    appearance: "menulist-button",
                                }}
                                id="role-select"
                                onChange={handleRoleChange}
                            >
                                <option value="">-- {t('Select a role')} --</option>
                                {roles.map((role) => (
                                    <option
                                        key={role.id}
                                        value={role.id}
                                        style={
                                            role.category === "Internal"
                                                ? { color: "darkblue", fontWeight: 700 }
                                                : { fontWeight: "bold" }
                                        }
                                    >
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                            {t('Application Sections:')}
                        </Typography>
                        {optionsRoutes.length > 0 ? (
                            <div style={{ height: 700, width: "100%" }}>
                                <DataGrid
                                    rows={optionsRoutes}
                                    columns={[
                                        { field: "optionid", headerName: "optionid", width: 100, hide: true },
                                        { field: "category", headerName: "Category", width: 200, headerClassName: "headerCell", 
                                            renderCell: (params) => (
                                                <span style={{ color: getCategoryColor(params.value) }}>
                                                    {params.value}
                                                </span>
                                            ), },
                                        { field: "name", headerName: "Name", width: 200, headerClassName: "headerCell"  },
                                        { field: "route", headerName: "Route", width: 350, headerClassName: "headerCell" },
                                        { field: "id", headerName: "Id", width: 100, hide: true },
                                        {
                                            field: "readpermission",
                                            headerName: "Read Permission",
                                            width: 180,
                                            headerClassName: "headerCell",
                                            renderCell: (params) => (
                                                <Checkbox
                                                    checked={params.value}
                                                    color="primary"
                                                    onChange={(event) => handlePermissionChange(event, params)}
                                                />
                                            ),
                                        },
                                        {
                                            field: "writepermission",
                                            headerName: "Write Permission",
                                            width: 180,
                                            headerClassName: "headerCell",
                                            renderCell: (params) => (
                                                <Checkbox
                                                    checked={params.value}
                                                    color="primary"
                                                    onChange={(event) => handlePermissionChange(event, params)}
                                                />
                                            ),
                                        },
                                        {
                                            field: "updatepermission",
                                            headerName: "Update Permission",
                                            width: 180,
                                            headerClassName: "headerCell",
                                            renderCell: (params) => (
                                                <Checkbox
                                                    checked={params.value}
                                                    color="primary"
                                                    onChange={(event) => handlePermissionChange(event, params)}
                                                />
                                            ),
                                        },
                                    ]}
                                    getRowId={(row) => row.optionid}
                                    sx={{
                                        boxShadow: 1,
                                        '& .headerCell': {
                                            fontSize: 'medium',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                    sortModel={[
                                    {
                                        field: "category",
                                        sort: "asc", 
                                    },
                                    ]}
                                />
                            </div>
                        ) : (
                            <Typography variant="body2">
                                {t('No application sections available.')}
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
                    <Grid item xs={6}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                            onClick={handleSaveChanges}
                            disabled={isLoading}
                            style={{ marginTop: "16px", display: showCreate ? "inline-flex" : "none" }}
                        >
                            {t('Save Changes')}
                        </Button>
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={() => navigate("/MISAdministration/optionroutes-List")}
                            style={{marginTop: "16px"}}
                        >
                            {t('Application Sections Management')}
                        </Button>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>
    );

};

export default UMRoleOptionsList;
