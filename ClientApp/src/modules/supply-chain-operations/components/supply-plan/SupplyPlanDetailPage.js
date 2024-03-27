import React, { useMemo, useRef, useState, useContext } from "react";
import MaterialReactTable from "material-react-table";
import Box from "@mui/material/Box";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {  Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import { useQuery } from "@tanstack/react-query";

import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { UserInformation } from "../../../../index.js";
import { getFromLocalStorage } from "../../../../common/utils/LocalStorage.js";

import 'react-toastify/dist/ReactToastify.min.css'
import { getSupplyPlan, postSupplyPlanApproveStatus } from "../../apis/supply-plan.js";
import { toast } from "react-toastify";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  minHeight: "250px",
  color: theme.palette.text.secondary,
  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important",
}));

const  RequisitionDetailPage = ()  => {

  const supplyplan = getFromLocalStorage("supply-plan-detail-row") || {}
  const [data, setData] = useState([]);
  const tableInstanceRef = useRef(null);
  const { userInformation } = useContext(UserInformation)


  const [approvalStatus, setApprovalStatus] = React.useState("");
  const [approvedStatus, setApprovedStatus] = useState(supplyplan.status === "Approve");
  const [description, setDescription] = useState();
  const approvalCategories = [
      "Approve",
      "Reject"
  ];


  const { _ } = useQuery(
    ["getSupplyPlan", supplyplan.id],
    getSupplyPlan,
    {
      onSuccess: (data) => {
        setData(data.data.products);
      },
    }
  );

const handleChange = (event) => {
    setApprovalStatus(event.target.value);
};

const popError = (message) => {
    toast.error(message, {
        position: 'top-right',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

const popSuccess = (message) => {
    toast.success(message, {
        position: 'top-right',
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}

  const updateApprovalStatus = (stati) => {
    setApprovedStatus(stati);
}

const handleSubmitApproval = () => {

    let errors = null;
    if(!approvalStatus) {
       errors = "Error, Approval status is required"
    } 

    if(errors) {
        popError(errors);
        return false;
    }

    let request = {
      "Id": supplyplan.id,
      "status": approvalStatus,
      "approved_by": userInformation.username,
      "justification":description
    }
    postSupplyPlanApproveStatus(request).then((response) => {
        popSuccess("Supply Plan  approval successfully" );
        updateApprovalStatus(true);
    });

}

  const tableTheme =  createTheme({
      palette: {
        background: {
          default: "#fff",
        },
      },
    })

  const columns = useMemo(
    () => [
      {
        accessorKey: "productCode", 
        width: 50,
        header: "PRODUCT CODE",
      },
      {
        accessorKey: "productName", 
        width: 50,
        header: "PRODUCT NAME",
      },
      {
        accessorKey: "unitName", 
        width: 60,
        header: "UNIT NAME",
      },
      {
        accessorKey: "stockOnHand", 
        width: 60,
        header: "STOCK ON HAND",
      },
      {
        accessorKey: "amc", 
        width: 60,
        header: "AMC",
      },
      {
        accessorKey: "desiredProductQuantity", 
        width: 50,
        header: "DESIRED PRODUCT QUANTITY",
      },
      {
        accessorKey: "estimatedUnitPrice",
        width: 50,
        header: "UNIT PRICE",
      },
      {
        accessorKey: "estimatedShipmentDate",
        width: 50,
        header: "ESTIMATED SHIPMENT DATE",
      },
    ],
    []
  );


  return (
    <Grid container spacing={3} alignItems="stretch" >
     <Paper
          square={true}
          sx={{
            borderTop: 5,
            borderColor: "#000000",
            width:"100%"
          }}
          elevation={8}
        >
          <Grid
            item
            xs={12}
            md={6}
            sm={6}
            sx={{ padding: "10px", textAlign: "left" }}
          >
            <Typography
              gutterBottom
              sx={{ fontSize: "2rem", fontWeight: "bold" }}
            >
              Supply Plan Details
            </Typography>
          </Grid>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    Country: {supplyplan.countryName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    FY Start Date: {supplyplan.fyStartDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    FY End Date: {supplyplan.fyEndDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    Status: { supplyplan.status} 
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    Created By: {supplyplan.created_by}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Grid item xs={12} sm={12}>
            <Box sx={{ width: "100%" }}>
                <Grid item xs={12} sm={12} sx={{ marginBottom: 10 }}>
                  <Item
                    sx={{
                      flexGrow: 1,
                      backgroundColor: "#fff",
                      padding: "5px 5px 10px 5px",
                    }}
                  >
                    <Grid item xs={12} sx={{ marginTop: "10px" }}>
                            <TableContainer component={Paper}>
                              <ThemeProvider theme={tableTheme}>
                                <MaterialReactTable
                                  columns={columns}
                                  data={data}
                                  tableInstanceRef={tableInstanceRef}
                                  enableColumnActions={false}
                                  enablePagination={false}
                                  enableFilters={false}
                                  enableFullScreenToggle={false}
                                  enableTopToolbar={false}
                                  muiTableHeadCellProps={{
                                    sx: {
                                      "& .Mui-TableHeadCell-Content": {
                                        fontSize: "11px",
                                        color: "#667085",
                                      },
                                    },
                                  }}
                                />
                              </ThemeProvider>
                            </TableContainer>
                    </Grid>

                  </Item>
                </Grid>
            </Box>
          </Grid>
          {!approvedStatus && ( <Grid item xs={12} sm={12}>
                <Box sx={{ width: '100%' }}>
                
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={2}>
                            <InputLabel
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontWeight: 700
                                }}
                            >
                                Approver
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <Typography sx={{ fontSize: 14, color:'#000',fontWeight:'bold' }}>
                                {userInformation.username}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                            <InputLabel
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontWeight: 700
                                }}
                            >
                                Status
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10} sx={{padding:'20px'}}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={approvalStatus}
                                    label="Status"
                                    onChange={handleChange}
                                >
                                    {approvalCategories.map((item) => (
                                        <MenuItem value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <InputLabel
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontWeight: 700
                                }}
                            >
                                Justification
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10} sx={{padding:'20px'}}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Justification"
                                multiline
                                fullWidth
                                rows={4}
                                onChange={(e) => setDescription(e.target.value)}
                                defaultValue={description}
                            />
                        </Grid>

                    </Grid>

                    <Box sx={{ mb: 2 }}>
                        <div>
                            <Button
                                variant="contained"
                                onClick={ handleSubmitApproval}
                                sx={{ mt: 1, mr: 1 }}
                            >
                                Approve
                            </Button>
                        </div>
                    </Box>
                            
                </Box>
            </Grid>)
        }
        </Paper>
    </Grid>
  );
}

export default RequisitionDetailPage;
