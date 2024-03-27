import React, { useEffect, useState, useContext } from "react";
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
    Typography,
    TextField,
    Button,
    IconButton,
    OutlinedInput,
    FormControl,InputLabel,Input,FormHelperText
} from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {newDataExportDb} from "../apis/data-export-db-config";
import {Formik} from "formik";

import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { apiRoutes } from "../routes/apiRoutes";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
// import { addToShoppingCart } from "../../../api/order";
//import { useMsal } from "@azure/msal-react";
import { UserInformation } from "../../../index.js";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";



const AddDataExportDbConfigs = () => {
    //const { accounts } = useMsal();
    //const user = accounts.length > 0 && accounts[0];
    const user = useContext(UserInformation);
    const [imageSrc, setImageSrc] = useState(null);
    const [searchFamilyField, setsearchFamilyField] = useState("hidden");
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    let { product_code } = useParams();
    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        tenantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        dbTableName: "",
        tableName: "",
        description: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            axios.post(`${apiRoutes.dataExportDbConfigs}/DataExportDbConfigs`, formData )
                .then((response) => {
                    toast("Successfully Created an Category", {
                        type: "success",
                    });
                    navigate("/data-export/data-export-db-configs");
                })
                .catch((error) => {
                    toast(error.response.data, {
                            type: "error",
                        });
                })

        } catch (e) {
            toast(e.response.data, {
                type: "error",
            });
        }
    };

    return (
        <React.Fragment>
            <ToastContainer />
            <Helmet title="Data Export Db Configs" />

            <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                <Link component={NavLink} to="/">
                    Data Export
                </Link>
                <Typography>Data Export Db Cofigs</Typography>
            </Breadcrumbs>
            <Box mt={6} sx={{ borderTop: 5, width: "100%", height: "100%" }} >
                <Paper square={true} sx={{ borderTop: 5 }}  elevation={8}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Data Export Module
                            </Typography>
                            <Divider />
                        </CardContent>
                    </Card>
                    <Card >
                        <CardContent>
                            <Grid container spacing={2}>
                            {/*        <Formik>*/}
                                <form onSubmit={handleSubmit}>
                                    <TextField id="tableName" name="tableName" value={formData.tableName}  onChange={handleInputChange}
                                               label="Table Name" variant="filled"/>

                                    <TextField id="dbTableName" name="dbTableName" value={formData.dbTableName}  onChange={handleInputChange}
                                               aria-describedby="dbTableName-text" label="DB Table Name" variant="filled"/>
                                    <FormHelperText id="dbTableName-text">The name the table will be called in the database</FormHelperText>

                                    <TextField id="description" name="description" value={formData.description}  onChange={handleInputChange}
                                                label="description" variant="filled"/>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Add Table
                                    </Button>
                                </form>
                                    {/*</Formik>*/}
                            </Grid>
                        </CardContent>
                    </Card>
                </Paper>
            </Box>
        </React.Fragment>
    );
};

export default AddDataExportDbConfigs;
