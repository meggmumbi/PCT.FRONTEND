import React, { useMemo, useRef, useState, useContext } from "react";
import MaterialReactTable from "material-react-table";
import Box from "@mui/material/Box";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {  Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import { useQuery } from "@tanstack/react-query";
import {
  getRequisitionsProducts,
} from "../../../apis/product-catalog";

import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { UserInformation } from "../../../../../index.js";
import { getFromLocalStorage } from "../../../../../common/utils/LocalStorage.js";

import 'react-toastify/dist/ReactToastify.min.css'

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

  const requisition = getFromLocalStorage("requisition-apporoval-row") || {}
  const [data, setData] = useState([]);
  const tableInstanceRef = useRef(null);
  const user = useContext(UserInformation);


  const { _ } = useQuery(
    ["getRequisitionsProducts", requisition.id],
    getRequisitionsProducts,
    {
      onSuccess: (data) => {
        setData(data.data);
      },
    }
  );

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
        accessorKey: "requisitionOrderId", 
        width: 50,
        header: "Order ID",
      },
      {
        accessorKey: "productName", 
        width: 60,
        header: "Product Name",
      },
      {
        accessorKey: "estimatedLeadTime", 
        width: 60,
        header: "Lead Time (days)",
      },
      {
        accessorKey: "transportMode", 
        width: 60,
        header: "Mode of Delivery   ",
      },
      {
        accessorKey: "quantity", 
        width: 50,
        header: "Quantity",
      },
      {
        accessorKey: "total",
        width: 50,
        header: "Total Value",
      },
      {
        accessorKey: "deliveryDate",
        width: 50,
        header: "Estimated Delivery Date",
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
            sx={{ padding: "10px", textAlign: "left" }}
          >
            <Typography
              gutterBottom
              sx={{ fontSize: "2rem", fontWeight: "bold" }}
            >
              Requisition Code: {requisition.code}
            </Typography>
          </Grid>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    Requisition Date: {requisition.requisitionDate}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    Requisition Type: {requisition.requisitionType}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    Destination: {requisition.destinationCountry}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    Requisition Date: { requisition.requisitionDate }
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Status: {requisition.approvalStatus}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Total Amount: {requisition.totalAmount}
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
        </Paper>
    </Grid>
  );
}

export default RequisitionDetailPage;
