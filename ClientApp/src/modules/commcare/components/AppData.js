import React from "react";
import { useRef } from "react";
import { useMemo } from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MaterialReactTable from "material-react-table";
import GridOnIcon from "@mui/icons-material/GridOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider,
  Paper as MuiPaper,
  IconButton,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { Box, spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReplyIcon from "@mui/icons-material/Reply";
import {
  getForms
} from "../apis/commcare";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  minHeight: "130px",
  color: theme.palette.text.secondary,
  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important",
}));

const themeCustom = createTheme({
  palette: {
    custom_black: {
      main: "#000000",
      contrastText: "#FFFFFF",
    },
  },
});

function AppData(props) {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  let { id } = useParams();
  const [requisitions, setRequisitions] = useState([]);
  const [formAppData, setData] = useState([]);
  const tableInstanceRef = useRef(null);
  const [rowSelection, setRowSelection] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const open = Boolean(anchorEl);

  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const { refetch } = useQuery(["getForms", pagination, id], getForms, {
    onSuccess: (response) => {
      setData(response.data.data);
      setRowCount(response.data.totalRecords);
    },
  });

  useEffect(() => {
    refetch();
  }, [pagination.pageIndex, pagination.pageSize, refetch]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "formName",
        header: "Form Name",
        minSize: 30,
        maxSize: 30,
        size: 30,
      },
      {
        accessorKey: "fieldName",
        header: "Field Name",
        minSize: 5,
        maxSize: 5,
        size: 5,
      },
      {
        accessorKey: "fieldValue",
        header: "Field Value",
        minSize: 40,
        maxSize: 40,
        size: 40,
      },

    ],
    []
  );
  const handleArrowBackClick = () => {
    navigate(-1);
  };

  const tableTheme = useMemo(() =>
    createTheme({
      palette: {
        background: {
          default: "#fff",
        },
      },
    })
  );
  return (
    <Grid container alignItems="stretch">
      <Grid item md={12} style={{ display: "flex", width: "100%" }}>
        <Paper
          square={true}
          sx={{
            borderTop: 5,
            borderColor: "#000000",
            width: "100%",
            px: 3,
            py: 5,
          }}
          elevation={8}
        >
          <Grid
            item
            xs={12}
            md={6}
            sm={6}
            sx={{ padding: "10px", textAlign: "left", justifyContent: "flex-start", alignItems: "center", display: 'flex' }}
          >
            <IconButton
              onClick={handleArrowBackClick}
              sx={{
                marginRight: "8px",
                color: "#000",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: "2.5rem" }} />
            </IconButton>
            <Typography
              gutterBottom
              sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
            >
              Commcare
            </Typography>
          </Grid>
          <Grid></Grid>
          <Item elevation={3}>
            <ThemeProvider theme={tableTheme}>
              <MaterialReactTable
                columns={columns}
                data={formAppData}
                enableColumnActions={false}
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection, pagination }}
                enablePagination={true}
                manualPagination={true}
                rowCount={rowCount}
                onPaginationChange={setPagination}
                tableInstanceRef={tableInstanceRef}
                defaultColumn={{
                  minSize: 10, //allow columns to get smaller than default
                  maxSize: 30, //allow columns to get larger than default
                  size: 30, //make columns wider by default
                }}
                muiTableHeadCellProps={{
                  sx: {
                    "& .Mui-TableHeadCell-Content": {
                      fontSize: "18px",
                      color: "#000",
                      fontWeight: "bold",
                    },
                  },
                }}
                muiTableHeadCellFilterTextFieldProps={{
                  sx: {
                    m: "1rem 0",
                    width: "100%",
                    fontSize: "12px",
                    "& .MuiInputBase-root": {
                      color: "#0E6073",
                      fontSize: "12px",
                      fontWeight: "bold",
                      opacity: 0.9,
                    },
                    "& .MuiBox-root": {
                      color: "#0E6073",
                      fontSize: "12px",
                      fontWeight: "bold",
                      opacity: 0.9,
                    },
                    input: {
                      color: "#667085",
                      "&::placeholder": {
                        // <----- Add this.
                        opacity: 0.9,
                        color: "#0E6073",
                      },
                    },
                  },
                  variant: "outlined",
                }}
                initialState={{
                  pagination: pagination,
                  expanded: false,
                  columnVisibility: {
                    id: false,
                    "mrt-row-expand": false,
                  }
                }}
                muiTablePaginationProps={{
                  rowsPerPageOptions: [5, 10, 20, 30, 50, 100],
                  labelRowsPerPage: 'Number of rows visible'
                }}

              />
            </ThemeProvider>
          </Item>
        </Paper>
      </Grid>
    </Grid>
  );
}
export default AppData;
