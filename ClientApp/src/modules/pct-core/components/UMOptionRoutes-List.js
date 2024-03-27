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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    geticl_options_route,
    geticl_options_route_byid,
    newicl_options_route,
    updateicl_options_route,
    deleteicl_options_route,
} from "../apis/icl_options_route";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import {
    Plus as PlusIcon,
    CheckCircle as CheckCircleIcon,
    XCircle as XCircleIcon,
} from "react-feather";

const UMOptionRoutesList = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, error, refetch } = useQuery(
        ["geticl_options_route"],
        geticl_options_route
    );
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [selectedOptionRoute, setSelectedOptionRoute] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(100);

    const mutation = useMutation({
        mutationFn: async (updatedOptionRoute) => {
            try {
                await updateicl_options_route(updatedOptionRoute);
                setSuccessMessage(t("Application section information changed successfully"));
                refetch();
            } catch (error) {
                setErrorMessage(t("Error updating application section information"));
                console.error("Error updating application section information:", error);
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

    const handleDialogOpen = (optionRoute) => {
        setSelectedOptionRoute(optionRoute);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setSelectedOptionRoute(null);
        setDialogOpen(false);
    };

    const handleCreateDialogOpen = () => {
        setSelectedOptionRoute({});
        setCreateDialogOpen(true);
    };

    const handleCreateDialogClose = () => {
        setSelectedOptionRoute(null);
        setCreateDialogOpen(false);
    };

    const handleCreateNewOptionRoute = async () => {
        try {
            if (!selectedOptionRoute.category) {
                setErrorMessage(t("Please provide a value for the Category field"));
                return;
            }
            if (!selectedOptionRoute.name) {
                setErrorMessage(t("Please provide a value for the Name field"));
                return;
            }

            await newicl_options_route(selectedOptionRoute);
            setSuccessMessage(t("Application section created successfully"));
            refetch();
            setCreateDialogOpen(false);
        } catch (error) {
            setErrorMessage(t("Error creating application section"));
            console.error("Error creating application section:", error);
        }
    };

    const handleUpdateOptionRoute = () => {
        if (selectedOptionRoute) {
            if (!selectedOptionRoute.category) {
                setErrorMessage(t("Please provide a value for the Category field"));
                return;
            }
            if (!selectedOptionRoute.name) {
                setErrorMessage(t("Please provide a value for the Name field"));
                return;
            }
            mutation.mutate(selectedOptionRoute);
            setDialogOpen(false);
        }
    };

    const handleDeleteOptionRoute = async (id) => {
        if (
            window.confirm(
                "Are you sure you want to change the status of this application section?"
            )
        ) {
            try {
                await deleteicl_options_route(id);
                setSuccessMessage(t("Application section status changed successfully"));
                refetch();
            } catch (error) {
                console.error("Error changing application section status:", error);
            }
        }
    };

    const handleCreateOptionRoute = () => {
        setSelectedOptionRoute({});
        setCreateDialogOpen(true);
    };

    const columns = [
        {
            field: "category", headerName: "Category", width: 200, headerClassName: "headerCell",
            renderCell: (params) => (
                <span style={{ color: getCategoryColor(params.value) }}>
                    {params.value}
                </span>
            ),
        },
        { field: "name", headerName: "Name", width: 250, headerClassName: "headerCell" },
        {
            field: "route",
            headerName: "Route",
            width: 350,
            headerClassName: "headerCell",
        },
        {
            field: "id",
            headerName: "ID",
            width: 150,
            hide: true,
        },
        {
            field: "isDeleted",
            headerName: "Status",
            width: 150,
            headerClassName: "headerCell",
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
            width: 150,
            sortable: false,
            headerClassName: "headerCell",
            hide: !showUpdateAndDelete,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDialogOpen(params.row)}
                >
                    Edit
                </Button>
            ),
        },
        {
            field: "delete",
            headerName: "",
            width: 150,
            sortable: false,
            headerClassName: "headerCell",
            hide: !showUpdateAndDelete,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDeleteOptionRoute(params.row.id)}
                >
                    Delete/restore
                </Button>
            ),
        },
    ];

    const rows = isLoading || isError ? [] : data ? data.data : [];
    const sortedRows = [...rows].sort((a, b) => {
        const categoryA = a.category.toLowerCase();
        const categoryB = b.category.toLowerCase();

        if (categoryA < categoryB) {
            return -1;
        }
        if (categoryA > categoryB) {
            return 1;
        }
        return 0;
    });

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
                <Grid container spacing={12}>
                    <Grid item md={12}>
                        <Typography variant="h4" gutterBottom style={{ color: "darkblue", fontWeight: "bold", borderBottom: "1px solid lightgray", paddingBottom: "8px" }}>
                            {t('Role Permission Management - Application Sections Management')}
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                {isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Error retrieving application section information: {error.message}
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
                    <Grid item md={12} sx={{ flexGrow: 1 }}>
                        <div style={{ height: 700, width: '100%', display: 'flex', flexDirection: 'column' }}>
                            <DataGrid
                                rows={sortedRows}
                                columns={columns}
                                pageSize={pageSize}
                                rowsPerPageOptions={[25, 50, 100]}
                                loading={isLoading}
                                onPageSizeChange={(params) => {
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
                                sortModel={[
                                    {
                                        field: "category",
                                        sort: "asc",
                                    },
                                ]}
                            />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<PlusIcon />}
                                onClick={handleCreateOptionRoute}
                                style={{ marginTop: "16px", display: showCreate ? "inline-flex" : "none" }}
                            >
                                {t('Create New Application Section')}
                            </Button>
                    </Grid>
                    <Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={() => navigate("/MISAdministration/roleoptions-List")}
                            style={{ marginTop: "16px" }}
                        >
                            {t('Return to Role Permission Management')}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>

            {/* Dialog for editing application section */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{t('Edit Application Section')}</DialogTitle>
                <DialogContent>
                    {selectedOptionRoute && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="category"
                                    label="Category"
                                    type="text"
                                    fullWidth
                                    value={selectedOptionRoute.category}
                                    onChange={(e) =>
                                        setSelectedOptionRoute({
                                            ...selectedOptionRoute,
                                            category: e.target.value,
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    value={selectedOptionRoute.name}
                                    onChange={(e) =>
                                        setSelectedOptionRoute({
                                            ...selectedOptionRoute,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="route"
                                    label="Route"
                                    type="text"
                                    fullWidth
                                    value={selectedOptionRoute.route}
                                    onChange={(e) =>
                                        setSelectedOptionRoute({
                                            ...selectedOptionRoute,
                                            route: e.target.value,
                                        })
                                    }
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
                        {t('Cancel')}
                    </Button>
                    <Button onClick={handleUpdateOptionRoute} color="primary" variant="contained">
                        {t('Save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for creating a new application section */}
            <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
                <DialogTitle>Create New Application Section</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('Please provide the details for the new application section')}.
                    </DialogContentText>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="category"
                                label="Category"
                                type="text"
                                fullWidth
                                value={selectedOptionRoute ? selectedOptionRoute.category : ""}
                                onChange={(e) =>
                                    setSelectedOptionRoute({
                                        ...selectedOptionRoute,
                                        category: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                                value={selectedOptionRoute ? selectedOptionRoute.name : ""}
                                onChange={(e) =>
                                    setSelectedOptionRoute({
                                        ...selectedOptionRoute,
                                        name: e.target.value,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="route"
                                label="Route"
                                type="text"
                                fullWidth
                                value={selectedOptionRoute ? selectedOptionRoute.route : ""}
                                onChange={(e) =>
                                    setSelectedOptionRoute({
                                        ...selectedOptionRoute,
                                        route: e.target.value,
                                    })
                                }
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
                    <Button onClick={handleCreateNewOptionRoute} color="primary" variant="contained">
                        {t('Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default UMOptionRoutesList;
