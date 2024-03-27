import React, { useState, useContext, useMemo  } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from 'react-i18next';
import {
    getlog_record,
    getlog_record_users,
    getlog_record_structures,
    getlog_record_byuser,
    getlog_record_bystructure,
} from "../apis/log_record";

const LOGRecordsList = () => {
    //Select information:
    const [searchCriteria, setSearchCriteria] = useState("DataBase structure");
    const [secondSelectOptions, setSecondSelectOptions] = useState([]);

    const {
        data: structureData,isLoading: structureLoading,isError: structureError
    } = useQuery(["getlog_record_structures"], getlog_record_structures, {staleTime: Infinity});
    const {
        data: usersData,isLoading: usersLoading,isError: usersError
    } = useQuery(["getlog_record_users"], getlog_record_users, {staleTime: Infinity});

    React.useEffect(() => {
        if (searchCriteria === "DataBase structure") {
           if (!structureLoading && !structureError && structureData && structureData.data && structureData.data.length>0) {
              const mappedOptions = structureData.data.map((structure) => ({
                      id: structure.structureName || "", 
                      value: structure.structureName || "",
                      label: structure.structureName || "",
                    }));
               setSecondSelectOptions(mappedOptions);
               setFilterCriteria(structureData.data[0].structureName || "");
           }          
        } else if (searchCriteria === "Users") {
           if (!usersLoading && !usersError && usersData && usersData.data && usersData.data.length>0) {
              const mappedOptions = usersData.data.map((users) => ({
                      id: users.userName || "", 
                      value: users.userName || "", 
                      label: users.userName || "", 
                    }));
               setSecondSelectOptions(mappedOptions);
               setFilterCriteria2(usersData.data[0].userName || "");  
           } 
        } else {
          setSecondSelectOptions([]);
        }
    }, [searchCriteria, structureData, usersData]);
    const handleSearchCriteriaChange = (event) => {
        const value = event.target.value;
        setSearchCriteria(value);
    };

    //GRID information:
    const [filterCriteria, setFilterCriteria] = useState(null);
    const [filterCriteria2, setFilterCriteria2] = useState(null);
    const [logRecords, setLogRecords] = React.useState([]);

    const {
        data:  gridStructureData,isLoading: gridStructureLoading,isError: gridStructureError
    } = useQuery([filterCriteria,searchCriteria,"getlog_record_bystructure"], getlog_record_bystructure, {staleTime: Infinity});
    const {
        data:  gridUserData,isLoading: gridUserLoading,isError: gridUserError
    } = useQuery([filterCriteria2,searchCriteria,"getlog_record_byuser"], getlog_record_byuser, {staleTime: Infinity});

    React.useEffect(() => {
        if (searchCriteria === "DataBase structure") {
           if (!gridStructureLoading && !gridStructureError && gridStructureData) {
               setLogRecords(gridStructureData.data);
           }          
        } else if (searchCriteria === "Users") {
           if (!gridUserLoading && !gridUserError && gridUserData) {
                setLogRecords(gridUserData.data);
           } 
        }
    }, [gridStructureData,gridUserData]);
    const handleSecondCriteriaChange = async (event) => {
        const value = event.target.value;
        if (searchCriteria === "DataBase structure") {
            setFilterCriteria(value);
        } else if (searchCriteria === "Users") {
            setFilterCriteria2(value);  
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

    const { t } = useTranslation();
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" gutterBottom style={{ color: "darkblue", fontWeight: "bold", borderBottom: "1px solid lightgray", paddingBottom: "8px" }}>
                            {t('Log Records information')}
                        </Typography>
                    </Grid>

                    <Grid item container alignItems="center" xs={12}>
                      <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", width: "100%" }}>
                        <Typography variant="body2" gutterBottom style={{ paddingBottom: "8px" }}>
                          {t('Select a search criteria')}
                        </Typography>
                        <div style={{ width: "300", display: "flex", alignItems: "center", borderRadius: "4px", marginLeft: "16px", marginRight: "16px" }}>
                          <select
                            style={{
                              width: "100%",
                              fontWeight: "bold",
                              padding: "8px",
                              appearance: "menulist-button",
                            }}
                            value={searchCriteria}
                            onChange={handleSearchCriteriaChange}
                          >
                            <option value="DataBase structure">{t('DataBase structure')}</option>
                            <option value="Users">{t('Users')}</option>
                          </select>
                        </div>
                        <div
                          style={{
                            width: "40%",
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
                            id="options-select"
                            onChange={handleSecondCriteriaChange}
                          >
                            {secondSelectOptions.map((option) => (
                              <option key={option.id} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                            {t('Log records')}
                        </Typography>
                        {logRecords.length > 0 ? (
                            <div style={{ height: 700, width: "100%" }}>
                                <DataGrid
                                    rows={logRecords}
                                    columns={[
                                        { field: "id", headerName: "id", width: 100, hide: true },
                                        { field: "createDate", headerName: t('Date'), width: 350, headerClassName: "headerCell" },
                                        { field: "userName", headerName:  t('User Name'), width: 350, headerClassName: "headerCell" },
                                        { field: "userId", headerName:  "UserId" , width: 100, hide: true },
                                        { field: "userIp", headerName:  t('User Ip'), width: 350, headerClassName: "headerCell" },

                                        { field: "structureName", headerName: t('Structure Name'), width: 350, headerClassName: "headerCell" },
                                        { field: "routeName", headerName: t('Route Name'), width: 350, headerClassName: "headerCell" },
                                        { field: "operation", headerName: t('Operation'), width: 350, headerClassName: "headerCell",
                                                    renderCell: (params) => {
                                                        const operationValue = params.value;
                                                        let operationText = "";
                                                        let color = "";
                                                        switch (operationValue) {
                                                            case 0:
                                                                operationText = t('Query');
                                                                color = "green";
                                                                break;
                                                            case 1:
                                                                operationText = t('Insert');
                                                                color = "darkorange";
                                                                break;
                                                            case 2:
                                                                operationText = t('Update');
                                                                color = "purple";
                                                                break;
                                                            case 3:
                                                                operationText = t('Delete');
                                                                color = "red";
                                                                break;
                                                            case 4:
                                                                operationText = t('Custom SQL');
                                                                color = "darkblue";
                                                                break;
                                                            default:
                                                                operationText = "";
                                                                color = "black";
                                                        }
                                                        return <strong style={{color }}>{operationText}</strong>;

                                                    },
                                         },


                                        { field: "customSQL", headerName: t('Custom SQL'), width: 350, headerClassName: "headerCell", hide: true  },
                                        { field: "fieldName", headerName: "FieldName", width: 200, headerClassName: "headerCell", hide: true  },
                                        { field: "newValue", headerName: "NewValue", width: 350, headerClassName: "headerCell", hide: true },
                                    ]}
                                    getRowId={(row) => row.id}
                                    sx={{
                                        boxShadow: 1,
                                        '& .headerCell': {
                                            fontSize: 'medium',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                    sortModel={[
                                    {
                                        field: "createDate",
                                        sort: "desc", 
                                    },
                                    ]}
                                />
                            </div>
                        ) : (
                            <Typography variant="body2">
                                {t('No log records available.')}
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
                </Grid>
            </CardContent>
        </Card>
    );

};

export default LOGRecordsList;
