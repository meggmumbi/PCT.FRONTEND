
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
import { getAllDataExportDbConfigs, getAllData } from "../apis/data-export-db-config";
import { SiteContext } from "../../../index";

import MoreVertIcon from '@mui/icons-material/MoreVert';
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Papa from 'papaparse';


function DataExportDbConfigs(props) {
  const tableInstanceRef = useRef(null);
  const [rowSelection, setRowSelection] = useState({});
  const [datas, setDatas] = useState([])
  const [loading, setLoading] = useState(false);
  const [isFetching, setFetching] = useState(false);

  let { product_code } = useParams();
  const navigate = useNavigate();

  const siteContext = useContext(SiteContext)
  const tenant_id = siteContext.selectedSite.id
  const {
    isLoading,
    isError,
    data: data,
  } = useQuery(["getAllDataExportDbConfigs", tenant_id], getAllDataExportDbConfigs, {
  });
  

  const fetchData = async (rowId) => {
    try {
       getAllData({queryKey:["getAllData", tenant_id, rowId]}).then((response) => {
        exportToCSV(response.data);
      })
    } catch(e) {
      console.log(e);
    }
  };

  // const configs = data.data;
  const columns = useMemo(
    () => [
      {
        accessorKey: 'tableName', //simple recommended way to define a column
        enableHiding: false,
        header: 'Table Name'
      },
      {
        accessorKey: 'description', //simple recommended way to define a column
        header: 'Description'
      },
      {
        accessorKey: 'createDate', //simple recommended way to define a column
        header: 'Created'
      },
      {
        accessorKey: 'updateDate', //simple recommended way to define a column
        header: 'Updated'
      }
    ],
    [],
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


  useEffect(() => {
  }, [data]);

  if (isLoading) {
    return "...loading";
  }

  if (isError) {
    return "...error";
  }

  const exportToCSV = (exportData) => {
    if (exportData.length === 0) {
      alert('No data to export!');
      return;
    }

    const csv = Papa.unparse(exportData, {
      header: true,
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  return (
    <>
      <Box>
        <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
          <Card mb={6} square={true} sx={{ py: 5, pl: 2 }}>
            <Grid container spacing={12}>
              <Grid item md={12} sx>
                <Typography variant="h1" gutterBottom display="inline" sx={{ fontSize: '2rem' }}>
                  Data Export
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
            state={{ rowSelection }} //manage your own state, pass it back to the table (optional)
            tableInstanceRef={tableInstanceRef} //get a reference to the underlying table instance (optional)
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
            enableRowActions
            positionActionsColumn="last"
            renderRowActionMenuItems={({ row, closeMenu }) => {
              let dropDownItems = [
                <MenuItem key={1}
                  onClick={() =>
                    navigate(
                      `${window.location.pathname}/view-data/${row.original.tableName}/${row.original.id}`
                    )
                  }
                  sx={{
                    width: '140px'
                  }}
                >
                  <VisibilityIcon />&nbsp; View
                </MenuItem>,
                <MenuItem key={2}
                  onClick={() =>
                    fetchData(row.original.id)                  
                  }
                  sx={{
                    width: '140px'
                  }}
                >
                <DownloadIcon />&nbsp; Download
              </MenuItem>
              ];
              return dropDownItems;
            }}
            initialState={{
              pagination: {
                pageSize: 10,
                pageIndex: 0
              },
              columnVisibility: { id: false }
            }} muiTablePaginationProps={{
              rowsPerPageOptions: [5, 10, 20],
              showFirstButton: false,
              showLastButton: false,
              SelectProps: {
                native: true
              },
              labelRowsPerPage: 'Number of rows visible'
            }}




          />


        </ThemeProvider>

      ) : (
        <>No Applications Configured</>
      )}
    </>
  );
};

export default DataExportDbConfigs;
