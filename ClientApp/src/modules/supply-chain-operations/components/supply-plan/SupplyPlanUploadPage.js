import React, { useState, useMemo, useContext, useCallback, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ToastContainer, toast } from "react-toastify";
import { UserInformation, SiteContext } from "../../../../index.js";
import FormControl from '@mui/material/FormControl';
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLocations } from "../../apis/location.js";
import * as XLSX from 'xlsx';
import MaterialReactTable from "material-react-table";
import { Button } from "react-bootstrap";
import UploadIcon from '@mui/icons-material/Upload';
import CheckIcon from '@mui/icons-material/DoneSharp';
import CloseIcon from '@mui/icons-material/CloseSharp';

import { removeItem } from "../../../../common/utils/LocalStorage.js";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { saveSupplyPlan } from "../../apis/supply-plan.js";

import 'react-toastify/dist/ReactToastify.min.css'
import { getProductSelected } from "../../apis/product-catalog.js";


const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const popError = (message) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

const popSuccess = (message) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

const orderHeaderCss = {
    fontSize: "34px",
    fontWeight: "bolder",
    textAlign: "left",
    margin: "10px 15px"
}

const headerTopGrid = {
    border: "none",
    mariginBotton: "10px",
    boxShadow: "5px"
}
const orderHeaderCssSmall = {
    fontSize: "24px",
    fontWeight: "normal",
    textAlign: "left",
    margin: "10px 15px"
}
const SupplyPlanUploadPage = () => {

    const [supplyPlanUploadData, setSupplyPlanUploadData] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [destinationCountry, setDestinationCountry] = useState('');
    const [destinationCountryName, setDestinationCountryName] = useState('');
    const [createdDate, setCreatedDate] = useState();
    const [fyStartDate, setFyStartDate] = useState();
    const [fyEndDate, setFyEndDate] = useState();
    const [createdBy, setCreatedBy] = useState();

    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;


    const user = useContext(UserInformation);

    const columns = [
        //accessorKey as first argument, rest of column options as second argument
        {
            accessorKey: 'PRODUCT CODE',
            header: 'PRODUCT CODE',
            id: "PRODUCT CODE"
        },
        {
            accessorKey: 'PRODUCT NAME',
            header: 'PRODUCT NAME',
            id: "PRODUCT NAME"
        },
        {
            accessorKey: 'UNIT CODE',
            header: 'UNIT CODE',
            id: 'UNIT CODE'
        },
        {
            accessorKey: 'UNIT NAME',
            header: 'UNIT NAME',
            id: 'UNIT NAME'
        },
        {
            accessorKey: 'STOCK ON HAND',
            header: 'STOCK ON HAND',
            id: "STOCK ON HAND"
        },
        //accessorFn as first argument, rest of column options as second argument
        {
            accessorKey: 'AMC',
            header: 'AMC',
            id: 'AMC',
        },
        //accessorFn as first argument, rest of column options as second argument
        {
            accessorKey: 'DESIRED PRODUCT QUANTITY',
            header: 'DESIRED PRODUCT QUANTITY',
            id: 'DESIRED PRODUCT QUANTITY',
        },
        //accessorFn as first argument, rest of column options as second argument
        {
            accessorKey: 'ESTIMATED UNIT PRICE',
            header: 'ESTIMATED UNIT PRICE',
            id: 'ESTIMATED UNIT PRICE',
        },
        //accessorFn as first argument, rest of column options as second argument
        {
            accessorKey: 'ESTIMATED SHIPMENT DATE',
            header: 'ESTIMATED SHIPMENT DATE',
            id: 'ESTIMATED SHIPMENT DATE',
        },
        {
            accessorKey: 'Valid',
            header: 'ITEM CHECK',
            id: 'Valid',
            Cell:({ cell, row} ) => {
                return row.original.Valid === true ?  <CheckIcon /> : <CloseIcon /> 
            }
        },  
    ];

    useEffect(() => {
        setCreatedDate(dayjs().format('YYYY-MM-DD'));
        setFyStartDate(dayjs().format('YYYY-MM-DD'));
        setFyEndDate(dayjs().format('YYYY-MM-DD'));
    }, []); 


    const mutation = useMutation({
        mutationFn: saveSupplyPlan,
        onError: (error, variables, context) => {
            // An error happened!
            toast.error('Error occurred while saving supply plan upload', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        },
        onSuccess: (data, variables, context) => {
            toast.success('Supply Plan saved successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setUploadedFileName(null);
            setSupplyPlanUploadData([])
        }
    });

    const cancelSupplyPlanUpload = () => {

        setUploadedFileName(null);
        setSupplyPlanUploadData([]);
        setCreatedBy(null);
        setCreatedDate(null);
        setFyEndDate(null);
        setFyStartDate(null);
        toast.success('Supply Plan upload camcelled', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    const submitSupplyPlanUpload = async () => {
        if (!supplyPlanUploadData) {
            popError("Error, Could not submit empty list of products");
            return false;
        }
        if (!createdBy) {
            popError("Error, Created by not provided");
            return false;
        }

        if (!createdDate) {
           
            popError("Error, Created date not provided");
            return false;
        }
        if (!fyStartDate) {
            
            popError("Error, FY Start date not provided");
            return false;
        }
        if (!fyEndDate) {
            popError("Error, FY end date not provided");
            return false;
        }
        let productError;
        let productList = [];
        supplyPlanUploadData.map((item, index) => {
            if (!item?.["PRODUCT CODE"]) {
                productError = "Error, Item Id for " + item?.["PRODUCT CODE"] + " on line " + (index + 1);
            } else if (!item?.["UNIT CODE"]) {
                productError = "Error, Unit Id for " + item?.["UNIT CODE"] + " on line " + (index + 1);
            } else if (!item?.["STOCK ON HAND"]) {
                productError = "Error, Stock on hand for " + item?.["STOCK ON HAND"] + " on line " + (index + 1);
            } else if (!item?.["STOCK ON PIPELINE"]) {
                productError = "Error, Stock on pipeline for " + item?.["STOCK ON PIPELINE"] + " on line " + (index + 1);
            } else if (!item?.["AMC"]) {
                productError = "Error, AMC for " + item?.["AMC"] + " on line " + (index + 1);
            } else if (!item?.["DESIRED PRODUCT QUANTITY"]) {
                productError = "Error, Panned Quanity for " + item?.["DESIRED PRODUCT QUANTITY"] + " on line " + (index + 1);
            } else if (!item?.["ESTIMATED UNIT PRICE"]) {
                productError = "Error, Init Cost for " + item?.["ESTIMATED UNIT PRICE"] + " on line " + (index + 1);
            } else if (!item?.["ESTIMATED SHIPMENT DATE"]) {
                productError = "Error, Shipping Date for " + item?.["ESTIMATED SHIPMENT DATE"] + " on line " + (index + 1);
            } else  if (item?.Valid !== true) {
                productError = "Error, Product " + item?.["PRODUCT ID"] + " on line " + (index + 1) + " not found in global product register";
            }
            productList.push(
                Object.fromEntries(Object.keys(item).map(
                    (k, i) => [toCamelCase(k), String(item[k])?.replace(/(\d+)\/(\d+)\/(\d+)/, '20$3-$1-$2')]
                )
                )
            );
        });

        if (productError) {
            popError(productError);
            return;
        }

        
        console.log("Submitting product list ", productList)
        let payload = {
            "countryId": destinationCountry,
            "countryName":destinationCountryName,
            "fyStartDate": fyStartDate,
            "fyEndDate": fyEndDate,
            "createdDate":createdDate,
            "countryProgramId": "0d75af39-4b7f-42c1-87d9-12d4c03be900",
            "countryProgramName":createdBy,
            "supplyChainLevel": "1a385039-d3c7-47d1-a040-93b70def0dc7",
            "logisticsLocation": "4735eda5-8fd4-47fe-882b-196e28538b18",
            "financialReportChargeLocation": "a630418e-9f18-4f7d-ada5-fc228330c655",
            "createdBy": createdBy,
            "Status": "Pending",
            "TenantId": selectedSite.id,
            "products": productList
        }
        const response = await mutation.mutateAsync(payload);
        if (response.status === 200) {
            removeItem('requisition-order-cart-items');
        }

    }

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        const filename = acceptedFiles[0].name;
        setUploadedFileName(filename);
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (event) => {
            const wb = XLSX.read(reader.result, {
                type: rABS ? "binary" : "array",
            });
            /* Get first worksheet */
            const worksheetName = wb.SheetNames[0];
            const ws = wb.Sheets[worksheetName];
            const jsonData = XLSX.utils.sheet_to_json(ws, {
                header: 1,
                blankrows: false,
                raw: false,
            });
            const [headers, ...rest] = jsonData;
            let zippedData = rest?.map(
                (row) => Object.fromEntries(headers.map((k, i) => [k, row[i]])));

            //value.w.replace(/(\d+)/(\d+)/(\d+)/, '20$3-$1-$2')
            validateSupplyPlanUploadData(zippedData);
            setSupplyPlanUploadData([...zippedData]);

        }
        reader.readAsArrayBuffer(file);

    }, [])

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({
        onDrop,
        multiple: false,
        accept: [
            ".csv", "text/csv",
            "application/vnd.ms-excel",
            "application/csv",
            "text/x-csv",
            "application/x-csv",
            "text/comma-separated-values",
            "text/x-comma-separated-values",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ]
    }
    );

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);

    const {
        data: locationsData,
        isLoading,
        isError,
    } = useQuery(["getLocations"], getLocations);

    const toCamelCase = (str) => {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    const toSnakeCase = (str) => {
        return str && str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map(s => s.toLowerCase())
            .join('_');
    }
    
    const validateSupplyPlanUploadData = (data) => {
        if(!data) return;

        data.map((item, index) => {
            let product = item["PRODUCT CODE"] 
            getProductSelected({queryKey: ["getProductSelected", product]}).then((response) => {
                if(response?.data?.identifier){
                    data[index]["Valid"] = true;
                }
            })
        })

    }


    return (
        <Grid container spacing={3} alignItems="stretch" xs={12} md={12}>
            <ToastContainer />
            <Grid item md={12} xs={12} style={{ display: "flex", width: "100%" }}>
                <Paper
                    square={true}
                    sx={{
                        borderTop: 5,
                        borderColor: "#000000",
                        px: 3,
                        py: 5,
                        width: "100%",
                    }}
                    elevation={8}
                >
                    <Grid
                        item
                        xs={12}
                        md={12}
                        sm={12}
                        sx={{ padding: "10px", textAlign: "left" }}
                    >
                        <form onSubmit="">
                            <Grid item xs={12} >
                                <Grid container style={headerTopGrid}>
                                    <Grid item xs={12} md={11} >
                                        <div style={orderHeaderCss} >Upload Supply Plan </div>
                                        <div style={orderHeaderCssSmall} ><small>Add new Supply Plan</small> </div>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <hr style={{ width: "98%", margin: "0 auto" }} />
                                    </Grid>
                                </Grid>

                                <Grid container direction="row"
                                    justifyContent="flex-start" alignItems="center"
                                    spacing={2}  >

                                    <Grid item xs={6}>
                                        <Card sx={{ boxShadow: 'none' }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 18, color: '#1570EF', fontWeight: 'bold' }}>
                                                    Country
                                                </Typography>
                                                <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                    <InputLabel id="country-label">Country</InputLabel>
                                                    <Select
                                                        labelId="country-label"
                                                        id="country"
                                                        value={destinationCountry}
                                                        error={!destinationCountry}
                                                        variant="standard"
                                                        onChange={(event) => {
                                                            setDestinationCountry(event.target.value) ;
                                                            let c = locationsData.data?.filter((loc) => loc.id == event.target.value).pop().name
                                                            setDestinationCountryName(c );
                                                         } }
                                                        label="Country"
                                                    >

                                                        {!isLoading && !isError
                                                            ? locationsData.data?.map(location => (
                                                                <MenuItem key={location.code} value={location.id}>{location.name}</MenuItem>
                                                            ))
                                                            : []}



                                                    </Select>
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Grid>


                                    <Grid item xs={6}>
                                        <Card sx={{ boxShadow: 'none' }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 18, color: '#845EBC', fontWeight: 'bold' }}>
                                                    Created Date
                                                </Typography>
                                                <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                    <DatePicker
                                                                                                            
                                                        value={createdDate}
                                                        inputFormat="yyyy-MM-dd"
                                                        error={createdDate}
                                                        onChange={(value) => setCreatedDate(dayjs(value).format('YYYY-MM-DD'))}
                                                        renderInput={(params) => <TextField id="created_date" variant="standard"{...params} />}
                                                    />
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card sx={{ boxShadow: 'none' }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 18, color: '#845EBC', fontWeight: 'bold' }}>
                                                    Created By
                                                </Typography>
                                                <FormControl fullWidth sx={{ marginTop: '10px' }}>
                                                    <TextField id="created_by"
                                                        variant="standard"
                                                        error={createdBy}
                                                        value={createdBy}
                                                        onChange={(e) => setCreatedBy(e.target.value)}
                                                    />
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card sx={{ boxShadow: 'none' }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 18, color: '#845EBC', fontWeight: 'bold' }}>
                                                    FY Start Date
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <DatePicker                                                        
                                                        value={fyStartDate}
                                                        inputFormat="yyyy-MM-dd"
                                                        error={fyStartDate}
                                                        onChange={(value) => setFyStartDate(dayjs(value).format('YYYY-MM-DD'))}
                                                        renderInput={(params) => <TextField id="fy_start_date" variant="standard"{...params} />}
                                                    />
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Card sx={{ boxShadow: 'none' }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 18, color: '#845EBC', fontWeight: 'bold' }}>
                                                    FY End Date
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <DatePicker                                                        
                                                        value={fyEndDate}
                                                        error={fyEndDate}
                                                        inputFormat="yyyy-MM-dd"
                                                        onChange={(value) => setFyEndDate(dayjs(value).format('YYYY-MM-DD'))}
                                                        renderInput={(params) => <TextField id="fy_end_date" variant="standard"{...params} />}
                                                    />
                                                </FormControl>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                                <Grid container direction="row">
                                    <Grid item xs={12}>
                                        <Card sx={{ boxShadow: 'none' }}>
                                            <CardContent>
                                                <Grid item
                                                    gutterBottom
                                                    style={{ ...orderHeaderCssSmall, fontSize: "1.2rem" }}
                                                >
                                                    Upload Files
                                                </Grid>
                                                <Grid item >
                                                    <div {...getRootProps({ style })}>
                                                        <input {...getInputProps()} />
                                                        {uploadedFileName
                                                            ? <p style={{ color: "green" }}>File: {uploadedFileName}</p>
                                                            : <p>Drag 'n' drop requisition xls or csv file, or click to select files</p>
                                                        }
                                                    </div>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                            </Grid>


                        </form>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item md={12} xs={12} style={{ display: "flex" }}>
                <Paper
                    square={true}
                    sx={{ borderTop: 1, borderColor: "#dedede", width: "100%", marginTop: "10px" }}
                    elevation={8}
                >
                    <Card>
                        <CardContent>
                            <Grid item >
                                <Box sx={{ width: "100%" }}>
                                    <Grid sx={{ marginBottom: 10, width: "100%", maxWidth: "100%" }}>
                                        {uploadedFileName && <Typography><b>Uploaded file: {uploadedFileName}</b></Typography>}
                                        {supplyPlanUploadData.length > 0 &&
                                            <MaterialReactTable
                                                columns={columns}
                                                data={supplyPlanUploadData}
                                                enableColumnActions={false}
                                                muiTableProps={{
                                                    sx: {
                                                        tableLayout: 'fixed',
                                                        width:"100%"
                                                    },
                                                }}
                                                muiTableHeadCellProps={{
                                                    sx: {
                                                        fontSize:"12px",
                                                        width:"auto"
                                                    },
                                                }}
                                                muiTableBodyCellProps= {({row}) => {
                                                    if(row?.original?.Valid !== true){
                                                        return {sx: {
                                                                borderColor: 'red ',
                                                                fontSize:"12px"
                                                            }
                                                        }
                                                    } else {
                                                        return  {sx: {
                                                            fontSize: '12px',
                                                           
                                                             }
                                                         }
                                                     
                                                    }
                                                }}
                                                initialState={{
                                                    pagination: {
                                                        pageSize: 5,
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

                                            />}
                                    </Grid>
                                    <Grid container direction="row" xs={12} md={12}>

                                        <Grid item xs={10} />
                                        <Grid item xs={1} >
                                            <Button variant="contained"
                                                style={{
                                                    backgroundColor: '#000',
                                                    color: "#ffffff",
                                                    fontSize: "18px"
                                                }}
                                                startIcon={<UploadIcon />}
                                                onClick={() => cancelSupplyPlanUpload()}>
                                                Cancel
                                            </Button>
                                        </Grid>
                                        <Grid item xs={1} >
                                            <Button variant="contained"
                                                style={{
                                                    backgroundColor: '#000',
                                                    color: "#ffffff",
                                                    fontSize: "18px",
                                                    textAlign: "right"
                                                }}
                                                startIcon={<UploadIcon />}
                                                disabled={supplyPlanUploadData?.length === 0}
                                                onClick={() => submitSupplyPlanUpload()}>
                                                Submit
                                            </Button>`
                                        </Grid>

                                    </Grid>
                                </Box>
                            </Grid>
                        </CardContent>
                    </Card>
                </Paper>
            </Grid>

        </Grid>
    );
}

export default SupplyPlanUploadPage;
