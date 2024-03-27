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
import { geticl_country, geticl_country_byid, newicl_country, updateicl_country, deleteicl_country } from "../apis/icl_country";
import { useNavigate } from "react-router-dom";
import { Plus as PlusIcon, CheckCircle as CheckCircleIcon, XCircle as XCircleIcon } from "react-feather";
import { useTranslation } from 'react-i18next';

const UMCountriesList = () => {
    const navigate = useNavigate();
    const { data, isLoading, isError, error, refetch } = useQuery(["geticl_country"], geticl_country);
    const [successMessage, setSuccessMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [selectedCountry, setSelectedCountry] = React.useState({});
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
    const [pageSize, setPageSize] = React.useState(15);

    const mutation = useMutation({
        mutationFn: async (updatedCountry) => {
            try {
                await updateicl_country(updatedCountry);
                setSuccessMessage(t("Country information changed successfully"));
                refetch();
            } catch (error) {
                setErrorMessage(t("Error updating country information"));
                console.error("Error updating country information:", error);
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

    const handleDialogOpen = (country) => {
        setSelectedCountry(country);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setSelectedCountry(null);
        setDialogOpen(false);
    };

    const handleCreateDialogOpen = () => {
        setSelectedCountry({});
        setCreateDialogOpen(true);
    };

    const handleCreateDialogClose = () => {
        setSelectedCountry(null);
        setCreateDialogOpen(false);
    };

    const handleCreateNewCountry = async () => {
        try {
            if (!selectedCountry.name) {
                setErrorMessage(t("Please provide a value for the Name field"));
                return;
            }
            if (!selectedCountry.code) {
                setErrorMessage(t("Please provide a value for the Code field"));
                return;
            }

            await newicl_country(selectedCountry);
            setSuccessMessage(t("Country created successfully"));
            refetch();
            setCreateDialogOpen(false);
        } catch (error) {
            setErrorMessage(t("Error creating country"));
            console.error("Error creating country:", error);
        }
    };

    const handleUpdateCountry = () => {
        if (selectedCountry) {
            if (!selectedCountry.name) {
                setErrorMessage(t("Please provide a value for the Name field"));
                return;
            }
            if (!selectedCountry.code) {
                setErrorMessage(t("Please provide a value for the Code field"));
                return;
            }
            mutation.mutate(selectedCountry);
            setDialogOpen(false);
        }
    };

    const handleDeleteCountry = async (id) => {
        if (window.confirm(t("Are you sure you want to change the status of this country?"))) {
            try {
                await deleteicl_country(id);
                setSuccessMessage(t("Country status changed successfully"));
                refetch();
            } catch (error) {
                console.error(t("Error changing country status"), error);
            }
        }
    };

    const handleCreateCountry = () => {
        setSelectedCountry({});
        setCreateDialogOpen(true);
    };

    const columns = [
        { field: "code", headerName: "Code", width: 150, headerClassName: "headerCell" },
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
                <Button variant="outlined" size="small" onClick={() => handleDeleteCountry(params.row.id)}>
                    Delete/restore
                </Button>
            ),
        },
    ];

    const rows = isLoading || isError ? [] : data ? data.data : [];

    const { t } = useTranslation();
    return (
        <Card>
            <CardContent>
                <Grid container spacing={12}>
                    <Grid item md={12}>
                        <Typography variant="h4" gutterBottom style={{ color: "darkblue", fontWeight: "bold", borderBottom: "1px solid lightgray", paddingBottom: "8px" }}>
                            {t('Countries Management')}
                        </Typography>
                    </Grid>
                </Grid>
                <br />
                {isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Error retrieving country information: {error.message}
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
                            <DataGrid rows={rows} columns={columns} pageSize={pageSize} rowsPerPageOptions={[10, 15, 30]} loading={isLoading} onPageSizeChange={(params) => {
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
                                    { field: 'code', sort: 'asc' }
                            ]}
                            />
                        </div>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Button variant="contained" startIcon={<PlusIcon />} onClick={handleCreateCountry}
                        style={{ marginTop: "16px", display: showCreate ? "inline-flex" : "none" }} >
                          {t('Create New Country')}
                    </Button>
                    <Typography variant="subtitle2" color="textSecondary">
                        {isLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            `Total Countries: ${data ? data.data.length : 0}`
                        )}
                    </Typography>
                </Box>
            </CardContent>

            {/* Dialog for editing country */}
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{t('Edit Country')}</DialogTitle>
                <DialogContent>
                    {selectedCountry && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="dense"
                                    id="code"
                                    label="Code"
                                    type="text"
                                    fullWidth
                                    value={selectedCountry.code}
                                    onChange={(e) => setSelectedCountry({ ...selectedCountry, code: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    label="Name"
                                    type="text"
                                    fullWidth
                                    value={selectedCountry.name}
                                    onChange={(e) => setSelectedCountry({ ...selectedCountry, name: e.target.value })}
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
                    <Button onClick={handleUpdateCountry} color="primary" variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for creating a new country */}
            <Dialog open={createDialogOpen} onClose={handleCreateDialogClose}>
                <DialogTitle>{t('Create New Country')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('Please provide the details for the new country.')}
                    </DialogContentText>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                margin="dense"
                                id="code"
                                label="Code"
                                type="text"
                                fullWidth
                                value={selectedCountry ? selectedCountry.code : ""}
                                onChange={(e) => setSelectedCountry({ ...selectedCountry, code: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Name"
                                type="text"
                                fullWidth
                                value={selectedCountry ? selectedCountry.name : ""}
                                onChange={(e) => setSelectedCountry({ ...selectedCountry, name: e.target.value })}
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
                    <Button onClick={handleCreateNewCountry} color="primary" variant="contained">
                        {t('Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default UMCountriesList;
