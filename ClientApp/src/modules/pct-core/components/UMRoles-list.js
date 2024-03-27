import React, { useState, useContext } from "react";
import { useLocation } from 'react-router-dom';
import {
    Button,
    Card,
    CardContent,
    Grid,
    MenuItem,
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery, refetch } from "@tanstack/react-query";
import { geticl_role, geticl_role_byid, newicl_role, updateicl_role, deleteicl_role } from "../apis/icl_role";
import { useNavigate } from "react-router-dom";
import { Plus as PlusIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon } from "react-feather";
import { useTranslation } from 'react-i18next';

const UMRolesList = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, error, refetch } = useQuery(["geticl_role"], geticl_role);
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [selectedRole, setSelectedRole] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(15);

    const mutation = useMutation({
        mutationFn: async (updatedRole) => {
            try {
                await updateicl_role(updatedRole);
                setSuccessMessage(t("Role information changed successfully"));
                refetch();
            } catch (error) {
                setErrorMessage(t("Error updating role information"));
                console.error("Error updating role information:", error);
            }
        },
    });

    //Filter page options based on permissions
    const location = useLocation();
    const currentPath = location.pathname.replace(/\//g, "", "");
    const showCreate = true;
    const showUpdateAndDelete = true;

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
        if (isError) {
            console.error("Error:", error);
        }
    }, [isError, error]);

    const handleDialogOpen = (role) => {
        setSelectedRole(role);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setSelectedRole(null);
        setDialogOpen(false);
    };

    const handleCreateDialogOpen = () => {
        setSelectedRole({});
        setCreateDialogOpen(true);
    };

    const handleCreateDialogClose = () => {
        setSelectedRole(null);
        setCreateDialogOpen(false);
    };

    const handleCreateNewRole = async () => {
        try {
            if (!selectedRole.name) {
                setErrorMessage(t("Please provide a value for the Name field"));
                return;
            }
            if (!selectedRole.category) {
                setErrorMessage(t("Please provide a value for the Category field"));
                return;
            }

            await newicl_role(selectedRole);
            setSuccessMessage(t("Role created successfully"));
            refetch();
            setCreateDialogOpen(false);
        } catch (error) {
            setErrorMessage(t("Error creating role"));
            console.error("Error creating role:", error);
        }
    };

    const handleUpdateRole = () => {
        if (selectedRole) {
            if (!selectedRole.name) {
                setErrorMessage(t("Please provide a value for the Name field"));
                return;
            }
            if (!selectedRole.category) {
                setErrorMessage(t("Please provide a value for the Category field"));
                return;
            }
            mutation.mutate(selectedRole);
            setDialogOpen(false);
        }
    };

    const handleDeleteRole = async (id) => {
        if (window.confirm("Are you sure you want to change the status of this role?")) {
            try {
                await deleteicl_role(id);
                setSuccessMessage("Role status changed successfully.");
                refetch();
            } catch (error) {
                console.error("Error changing role status:", error);
            }
        }
    };

    const handleCreateRole = () => {
        setSelectedRole({});
        setCreateDialogOpen(true);
    };

    const columns = [
        {
            field: "category",
            headerName: "Category",
            width: 150,
            headerClassName: "headerCell",
            renderCell: (params) => (
                <Typography
                    variant="body1"
                    style={{
                        fontWeight: params.value === "Internal" ? 700 : 400,
                        color: params.value === "Internal" ? "darkblue" : "black",
                    }}
                >
                    {params.value}
                </Typography>
            ),
        },
        { field: "name", headerName: "Name", width: 250, headerClassName: "headerCell" },
        {
            field: "id",
            headerName: "ID",
            width: 150,
            hide: true,
        },
        {
            field: "isDeleted",
            headerName: "Status",
            headerClassName: "headerCell",
            width: 150,
            renderCell: (params) => (
                <>
                    {params.value ? (
                        <div>
                            <XCircleIcon style={{ color: "red" }} />
                        </div>
                    ) : (
                        <div>
                            <CheckCircleIcon style={{ color: "green" }} />
                        </div>
                    )}
                </>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            headerClassName: "headerCell",
            hide: !showUpdateAndDelete,
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Button variant="outlined" size="small" onClick={() => handleDialogOpen(params.row)}>
                    Edit
                </Button>
            ),
        },
        {
            field: "delete",
            headerName: "",
            headerClassName: "headerCell",
            hide: !showUpdateAndDelete,
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Button variant="outlined" size="small" onClick={() => handleDeleteRole(params.row.id)}>
                    Delete/restore
                </Button>
            ),
        },
    ];

    const rows = isLoading || isError ? [] : data ? data.data : [];

    const sortedRolesAs = [...rows].sort((a, b) =>
        a.category === "Internal" && b.category !== "Internal" ? -1 : 1
    );
    const { t } = useTranslation();
    return (
        <Card>
            <CardContent>
                <Grid container spacing={12}>
                    <Grid item md={12}>
                        <Typography variant="h4" gutterBottom style={{ color: "darkblue", fontWeight: "bold", borderBottom: "1px solid lightgray", paddingBottom: "8px" }}>
                            {t('Roles Management')}
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                {isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Error retrieving role information: {error.message}
                    </Alert>
                )}
                {successMessage && (
                    <Box mt={2}>
                        <Alert severity="success">{successMessage}</Alert>
                    </Box>
                )}
                {errorMessage && (
                    <Box mt={2}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Box>
                )}
                <Grid container spacing={6}>
                    <Grid item md={12}>
                        <div style={{ height: 600, width: "100%" }}>
                            <DataGrid rows={sortedRolesAs} columns={columns} pageSize={pageSize} rowsPerPageOptions={[10, 15, 30]} loading={isLoading} onPageSizeChange={(params) => {
                                setPageSize(params);
                                refetch({ page: 1, pageSize: params });
                            }}
                            sx={{
                                boxShadow: 1,
                                '& .headerCell': {
                                        fontSize: 'medium',
                                        textDecoration: 'underline',
                                },
                            }}    
                            />
                        </div>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateRole}
                        style={{ marginTop: "16px", display: showCreate ? "inline-flex" : "none" }} >
                          {t('Create New Role')}
                    </Button>
                    <Typography variant="subtitle2" color="textSecondary">
                        {isLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            `Total Roles: ${data ? data.data.length : 0}`
                        )}
                    </Typography>
                </Box>
            </CardContent>

            {/* Dialog for editing role */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{t('Edit Role')}</DialogTitle>
                <DialogContent>
                    {selectedRole && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    margin="dense"
                                    id="category"
                                    label="Category"
                                    fullWidth
                                    value={selectedRole.category}
                                    onChange={(e) => setSelectedRole({ ...selectedRole, category: e.target.value })}
                                >
                                    <MenuItem value="Internal">Internal</MenuItem>
                                    <MenuItem value="External">External</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    value={selectedRole.name}
                                    onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                                />
                            </Grid>

                        </Grid>
                    )}
                    {errorMessage && (
                        <Box mt={2}>
                            <Alert severity="error">{errorMessage}</Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateRole} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for creating a new role */}
            <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
                <DialogTitle>{t('Create New Role')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('Please provide the details for the new role.')}
                    </DialogContentText>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                margin="dense"
                                id="category"
                                label="Category"
                                fullWidth
                                value={selectedRole ? selectedRole.category : ""}
                                onChange={(e) => setSelectedRole({ ...selectedRole, category: e.target.value })}
                            >
                                <MenuItem value="Internal">Internal</MenuItem>
                                <MenuItem value="External">External</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                                value={selectedRole ? selectedRole.name : ""}
                                onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                    {errorMessage && (
                        <Box mt={2}>
                            <Alert severity="error">{errorMessage}</Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateDialogClose} color="primary">
                        {t('Cancel')}
                    </Button>
                    <Button onClick={handleCreateNewRole} color="primary" variant="contained">
                        {t('Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default UMRolesList;
