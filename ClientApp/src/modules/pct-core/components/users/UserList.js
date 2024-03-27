import React from 'react';
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import {useMemo, useRef, useState} from "react";
import {Button, createTheme, MenuItem, ThemeProvider,useTheme,Typography,Grid} from "@mui/material";
import MaterialReactTable from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {useQuery} from "@tanstack/react-query";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getAllSites, getAllUsers } from "../../apis/mis-endpoints";
import { ToastContainer, toast } from "react-toastify";
import {deleteicl_user} from "../../apis/icl_user";
import { position } from 'polished';
import {useNavigate} from "react-router-dom";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight:'130px',
    color: theme.palette.text.secondary,
    boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

function UserList(props) {
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
    const navigate = useNavigate();

    const {
        isLoading,
        isError,
        refetch
    } = useQuery(["getAllUsersList"], getAllUsers,
        {
            onSuccess: (response) => {
                setData(response.data)
            }
        }
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'firstName', //simple recommended way to define a column
                header: 'First Name'
            },
            {
                accessorKey: 'lastName', //simple recommended way to define a column
                header: 'Last Name'
            },
            {
                accessorKey: 'otherNames', //simple recommended way to define a column
                header: 'Other Name'
            },
            {
                accessorKey: 'email', //simple recommended way to define a column
                header: 'Email'
            },
            {
                accessorKey: 'last_updated', //simple recommended way to define a column
                header: 'Last Updated'
            },
            {
                accessorKey: 'isDeleted', 
                header: 'Status',
                Cell: ({ row }) => (
                    <span style={{ color: row.original.isDeleted ? 'red' : 'inherit', opacity: row.original.isDeleted ? 0.5 : 1 }}>
                        {row.original.isDeleted ? 'Disabled' : 'Enabled'}
                    </span>
                )                
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

    const handleDeleteRow = async (row) => {
        if (row && row.id) {
            try {
                const result = await deleteicl_user(row.id);
                await refetch();
            } catch (e) {
                console.log("Error while changing status of role")
            }

        }
    }

    return (
        <Grid container alignItems="stretch" >
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
              sx={{ padding: "10px", textAlign: "left" }}
            >
              <Typography
                gutterBottom
                sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
              >
               Users
              </Typography>
              
            </Grid>
            <Grid>
           
            </Grid>
        <Item elevation={3}>
            <ThemeProvider theme={tableTheme}>

                <MaterialReactTable
                    columns={columns}
                    data={data}
                    enableColumnActions={false}
                    onRowSelectionChange={setRowSelection} //hoist internal state to your own state (optional)
                    state={{ rowSelection }} //manage your own state, pass it back to the table (optional)
                    tableInstanceRef={tableInstanceRef} //get a reference to the underlying table instance (optional)
                    muiTableHeadCellProps={{
                        sx: {
                            '& .Mui-TableHeadCell-Content': {
                                fontSize:'16px',
                                color: '#667085'
                            },
                        },
                    }}
                    muiTableHeadCellFilterTextFieldProps={{
                        sx: { m: '1rem 0', width: '100%',fontSize:'12px',
                            '& .MuiInputBase-root': {
                                color: '#0E6073',
                                fontSize:'12px',
                                fontWeight:'bold',
                                opacity:0.9
                            },
                            '& .MuiBox-root': {
                                color: '#0E6073',
                                fontSize:'12px',
                                fontWeight:'bold',
                                opacity:0.9
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
                    renderRowActionMenuItems={({row, closeMenu}) => {
                        let dropDownItems = [
                            <MenuItem key={1}
                                      onClick={() =>navigate(
                                          `/MISAdministration/users/user/${row.original.id}`
                                      )}
                                      sx={{
                                          width:'140px'
                                      }}
                            >
                                <VisibilityIcon/>&nbsp; View
                            </MenuItem>,
                            <MenuItem key={2} onClick={() => {
                                handleDeleteRow(row.original)
                                closeMenu();
                            }}>
                                <DeleteIcon/> &nbsp; Change Status
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
                    }} 
                    muiTablePaginationProps={{
                    rowsPerPageOptions: [5, 10, 20],
                    showFirstButton: false,
                    showLastButton: false,
                    SelectProps: {
                        native: true
                    },
                    labelRowsPerPage: 'Number of rows visible'
                }}
                muiTableBodyRowProps={({row}) => ({
                    sx: {
                        '&.MuiTableRow-root' : {
                            opacity: row.original.isDeleted ? 0.5 : 1,
                        },
                    },
                })}
                renderTopToolbarCustomActions={({ table }) => (
                <Box sx={{ display: 'flex', gap: '1rem', p: '4px', right:'15px', position:'absolute'}}>
                <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() =>navigate(
                        `/MISAdministration/users/user`
                    )}
                    sx={{
                        fontWeight:'bolder',
                        background: "Black",
                        "&:hover": {
                            background: "Black",
                            color: "white"
                        }
                    }}
                >
                    New User
                </Button>
            </Box>
 )}
               


                />


            </ThemeProvider>

        </Item>
        </Paper>
        </Grid>
        </Grid>

    );
}

export default UserList;
