import { useRef, useMemo, useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Paper,
  Typography

} from "@mui/material";
import { NavLink, useNavigate, useParams, Route, Routes } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllData, postExportData, downloadData } from "../apis/data-export-db-config";
import { SiteContext } from "../../../index";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import { Button, createTheme, MenuItem, ThemeProvider } from "@mui/material";
import MaterialReactTable from "material-react-table";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ReplyIcon from "@mui/icons-material/Reply";
import _ from 'lodash';

const ViewDataDbConfigs = () => {
  const tableInstanceRef = useRef(null);
  const [rowSelection, setRowSelection] = useState({});
  let { table_name, config_id } = useParams();
  const navigate = useNavigate();
  const [dataColumns, setDataColums] = useState([])
  const [columnsFlag, setColumnsFlag] = useState(false)
  const [rowCount, setRowCount] = useState(0);
  const [columnsFilter, setColumnsFilter] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const siteContext = useContext(SiteContext)
  const tenant_id = siteContext.selectedSite.id
  // const {
  //   isLoading,
  //   isError,
  //   data: data,
  // } = useQuery(["getAllData", tenant_id, config_id], getAllData, {
  //   onSuccess: (response) => {
  //     //Replace to only update values needed
  //     if (response.data.length > 0) {
  //       let tempColumns = [];
  //       _.keys(response.data[0]).map(key => tempColumns.push({
  //         accessorKey: key,
  //         header: key
  //       }))
  //       setDataColums(tempColumns)
  //     }
  //   }
  // });

  const fetchData = async () => {
    const response = await postExportData({
      queryKey: ["postExportData", tenant_id, config_id],
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
      searchOptions: columnsFilter.map(({ id, value }) => ({
        column: id,
        value: value
      }))
    });
    return response.data;
  };


  const { data, isLoading, isError, refetch } = useQuery(
    ["postExportData", tenant_id, config_id],
    () => fetchData(),
    {
      enabled: !!config_id
    }
  );

  useEffect(() => {
    refetch();
  }, [pagination, columnsFilter]);

  useEffect(() => {
    if (data && data.data.length > 0 && columnsFlag === false) {
      let tempColumns = [];
      _.keys(data.data[0]).map(key => tempColumns.push({
        accessorKey: key,
        header: key
      }));
      setDataColums(tempColumns);
      setColumnsFlag(true);
    }
  }, [data]);

  const columns = useMemo(
    () => {
      var col = []
      dataColumns.map(c =>
        col.push(c)
      )
      return dataColumns;
    },
    [dataColumns],
  );

  const tableTheme = useMemo(

    () =>

      createTheme({

        palette: {
          background: {
            default: '#fff'
          }
        }
      })
  );


  const downloadCSV = async () => {
    const response = await downloadData({
      queryKey: ["postUploaddownloadDataData", tenant_id, config_id],
      pageNumber: pagination.pageIndex,
      pageSize: pagination.pageSize,
      searchOptions: columnsFilter.map(({ id, value }) => ({
        column: id,
        value: value
      }))
    });

    // Construct CSV content with headers
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = Object.keys(response.data[0]).join(",") + "\n";
    csvContent += headers;

    // Add rows of data
    response.data.forEach(row => {
      let rowData = "";
      Object.keys(response.data[0]).forEach((key, index) => {
        rowData += `"${row[key]}"`;
        if (index < Object.keys(response.data[0]).length - 1) {
          rowData += ",";
        }
      });
      csvContent += rowData + "\n";
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
  };



  return (
    <>
      <Box>
        <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
          <Card mb={6} square={true} sx={{ py: 5, pl: 2 }}>
            <Grid container spacing={12}>
              <Grid item md={12} sx>
                <Typography variant="h1" gutterBottom display="inline" sx={{ fontSize: '2rem' }}>
                  {table_name}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Paper>
      </Box>
      {!isLoading && !isError ? (
        <ThemeProvider theme={tableTheme}>
          <MaterialReactTable
            columns={columns}
            data={data.data}
            enableColumnActions={false}
            onRowSelectionChange={setRowSelection}
            state={{ rowSelection, pagination }}
            enablePagination={true}
            manualPagination={true}
            rowCount={rowCount}
            onPaginationChange={setPagination}
            tableInstanceRef={tableInstanceRef}
            onColumnFiltersChange={setColumnsFilter}
            defaultColumn={{
              minSize: 10,
              maxSize: 30,
              size: 30,
            }}
            muiTableHeadCellProps={{
              sx: {
                '& .Mui-TableHeadCell-Content': {
                  fontSize: '16px',
                  color: '#667085'
                },
              },
            }}
            muiTableHeadCellFilterTextFieldProps={{
              sx: {
                m: '1rem 0', width: '100%', fontSize: '12px',
                '& .MuiInputBase-root': {
                  color: '#0E6073',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  opacity: 0.9
                },
                '& .MuiBox-root': {
                  color: '#0E6073',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  opacity: 0.9
                },
                input: {
                  color: '#667085',
                  "&::placeholder": {    // <----- Add this.
                    opacity: 0.9,
                    color: '#0E6073',
                  }
                }
              },
              variant: 'outlined'
            }}
            initialState={{
              pagination: {
                pageSize: 10,
                pageIndex: 1
              },
              columnVisibility: { id: true }
            }} muiTablePaginationProps={{
              rowsPerPageOptions: [5, 10, 20],
              showFirstButton: false,
              showLastButton: false,
              SelectProps: {
                native: true
              },
              labelRowsPerPage: 'Number of rows visible'
            }}


            //add custom action buttons to top-left of top toolbar
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  p: "4px",
                  right: "15px",
                  position: "absolute",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<ReplyIcon />}
                  onClick={() =>
                    navigate(-1)
                  }
                  sx={{
                    fontWeight: 'bolder',
                    backgroundColor: '#333333',
                    "&:hover": {
                      background: "#333333",
                      color: "white"
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadForOfflineIcon />}
                  onClick={downloadCSV}
                  sx={{
                    fontWeight: 'bolder',
                    backgroundColor: '#333333',
                    "&:hover": {
                      background: "#333333",
                      color: "white"
                    }
                  }}
                >
                  Download
                </Button>
              </Box>
            )}

          />


        </ThemeProvider>

      ) : (<>No records found</>)}
    </>
  );
};

export default ViewDataDbConfigs;