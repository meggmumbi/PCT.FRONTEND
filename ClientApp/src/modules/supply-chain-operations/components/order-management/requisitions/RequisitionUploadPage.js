import React, { useState, useMemo, useContext, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { ToastContainer, toast } from "react-toastify";
import { SiteContext, UserInformation } from "../../../../../index.js";
import FormControl from "@mui/material/FormControl";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLocations } from "../../../apis/location.js";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import MaterialReactTable from "material-react-table";
import { Button } from "react-bootstrap";
import UploadIcon from "@mui/icons-material/Upload";
import { removeItem } from "../../../../../common/utils/LocalStorage.js";
import { saveRequisition } from "../../../apis/order.js";
import "react-toastify/dist/ReactToastify.min.css";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
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
  margin: "10px 15px",
};

const headerTopGrid = {
  border: "none",
  mariginBotton: "10px",
  boxShadow: "5px",
};
const orderHeaderCssSmall = {
  fontSize: "24px",
  fontWeight: "normal",
  textAlign: "left",
  margin: "10px 15px",
};
const RequisitionUploadPage = () => {
  const [requisitionUploadData, setRequisitionUploadData] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isApproved] = useState(false);
  const [isRequisitioned] = useState(false);
  const [destinationCountry, setDestinationCountry] = useState("");
  const [requisitionOrganisation, setRequisitionOrganisation] = useState(null);
  const [requisitionDate] = useState(new Date().toISOString().slice(0, 10));
  const [orderDescription, setOrderDescription] = useState(null);
  const [code, setCode] = useState(
    "REQ-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  );
  const navigate = useNavigate();

  const siteContext = useContext(SiteContext);
  const selectedSite = siteContext.selectedSite;

  const user = useContext(UserInformation);

  const columns = [
    //accessorKey as first argument, rest of column options as second argument
    {
      accessorKey: "Product Category",
      header: "Product Category",
      id: "Product Category",
    },
    {
      accessorKey: "Product Code",
      header: "Product Code",
      id: "Product Code",
    },
    {
      accessorKey: "Product Name",
      header: "Product",
      id: "Quantity",
    },
    //accessorFn as first argument, rest of column options as second argument
    {
      accessorKey: "Quantity",
      header: "Quantity",
      id: "Quantity",
    },
    //accessorFn as first argument, rest of column options as second argument
    {
      accessorKey: "Delivery Date",
      header: "Delivery Date",
      id: "delivery-date",
    },
    //accessorFn as first argument, rest of column options as second argument
    {
      accessorKey: "Transport Mode",
      header: "Mode of Transport",
      id: "mode-of-transport",
    },
    //accessorFn as first argument, rest of column options as second argument
    {
      accessorKey: "Lead Time",
      header: "Lead Time",
      id: "lead-time",
    },
    //accessorFn as first argument, rest of column options as second argument
    {
      accessorKey: "Cost of Delivery",
      header: "Cost of Delivery",
      id: "cost-of-delivery",
    },
  ];

  const mutation = useMutation({
    mutationFn: saveRequisition,
    onError: (error, variables, context) => {
      // An error happened!
      toast.error("Error occurred while saving requisition", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("Requisition saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setUploadedFileName(null);
      setRequisitionUploadData([]);
      setCode("REQ-" + Math.random().toString(36).substr(2, 9).toUpperCase());
    },
  });

  const submitRequisition = async () => {
    if (!requisitionUploadData) {
      popError("Error, Could not submit empty list of products");
      return false;
    }

    let productError;
    let productList = [];
    requisitionUploadData.map((item, index) => {
      if (!item?.["Product Name"]) {
        productError =
          "Error, missing estimated delivery date for " +
          item?.["Product Name"] +
          " on line " +
          (index + 1);
      } else if (!item?.["Product Category"]) {
        productError =
          "Error, missing product category for " +
          item?.["Product Name"] +
          " on line " +
          (index + 1);
      } else if (!item?.["Product Code"]) {
        productError =
          "Error, missing product code for " +
          item?.["Product Name"] +
          " on line " +
          (index + 1);
      } else if (!item?.["Quantity"]) {
        productError =
          "Error, quantity for " +
          item?.["Product Name"] +
          " on line " +
          (index + 1);
      } else if (!item?.["Total"]) {
        productError =
          "Error, total cost for " +
          item?.["Product Name"] +
          " on line " +
          (index + 1);
      } else if (!item?.["Transport Mode"]) {
        productError =
          "Error, Transport mode for " +
          item?.["Product Name"] +
          " on line " +
          (index + 1);
      }
      productList.push(
        Object.fromEntries(
          Object.keys(item).map((k, i) => [
            toCamelCase(k),
            item[k].replace(/(\d+)\/(\d+)\/(\d+)/, "20$3-$1-$2"),
          ])
        )
      );
    });

    if (productError) {
      popError(productError);
      return;
    }
    console.log("This is the use logged in", user);

    let payload = {
      code: code,
      TenantId: selectedSite.id,
      destinationCountry: destinationCountry,
      destinationOrganisation: requisitionOrganisation,
      requisitionDate: requisitionDate,
      email: user?.userInformation?.username,
      requisitionType: "Requisition Upload",
      totalAmount: requisitionUploadData.reduce(
        (n, { Total }) => n + parseInt(Total),
        0
      ),
      isApproved: isApproved,
      isRequisitioned: isRequisitioned,
      description: orderDescription,
      products: productList,
    };
    console.log("payloadpayload1", payload);
    const response = await mutation.mutateAsync(payload);
    if (response.status === 200) {
      removeItem("requisition-order-cart-items");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Filed droped here ", acceptedFiles);
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
      console.log("Upload raw data", rest);
      let zippedData = rest?.map((row) =>
        Object.fromEntries(headers.map((k, i) => [k, row[i]]))
      );

      //value.w.replace(/(\d+)/(\d+)/(\d+)/, '20$3-$1-$2')
      setRequisitionUploadData(zippedData);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: [
        ".csv",
        "text/csv",
        "application/vnd.ms-excel",
        "application/csv",
        "text/x-csv",
        "application/x-csv",
        "text/comma-separated-values",
        "text/x-comma-separated-values",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const {
    data: locationsData,
    isLoading,
    isError,
  } = useQuery(["getLocations"], getLocations);

  const toCamelCase = (str) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  };

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
              <Grid item xs={12}>
                <Grid container style={headerTopGrid}>
                  <Grid item xs={12} md={11}>
                    <div style={orderHeaderCss}>Create New Order </div>
                    <div style={orderHeaderCssSmall}>
                      <small>Add Requisition Details</small>{" "}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <hr style={{ width: "98%", margin: "0 auto" }} />
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <Card sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Typography
                          sx={{
                            fontSize: 18,
                            color: "#1570EF",
                            fontWeight: "bold",
                          }}
                        >
                          Country
                        </Typography>
                        <FormControl fullWidth sx={{ marginTop: "10px" }}>
                          <InputLabel id="country-label">Country</InputLabel>
                          <Select
                            labelId="country-label"
                            id="country"
                            value={destinationCountry}
                            onChange={(event) =>
                              setDestinationCountry(event.target.value)
                            }
                            label="Country"
                          >
                            {!isLoading && !isError
                              ? locationsData.data?.map((location) => (
                                  <MenuItem
                                    key={location.code}
                                    value={location.name}
                                  >
                                    {location.name}
                                  </MenuItem>
                                ))
                              : []}
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Typography
                          sx={{
                            fontSize: 18,
                            color: "#845EBC",
                            fontWeight: "bold",
                          }}
                        >
                          Organisation
                        </Typography>
                        <FormControl fullWidth sx={{ marginTop: "10px" }}>
                          <TextField
                            id="organization"
                            label="Organisation"
                            variant="outlined"
                            error={!requisitionOrganisation}
                            value={requisitionOrganisation}
                            onChange={(e) =>
                              setRequisitionOrganisation(e.target.value)
                            }
                          />
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Typography
                          sx={{
                            fontSize: 18,
                            color: "#845EBC",
                            fontWeight: "bold",
                          }}
                        >
                          Requisition Code
                        </Typography>
                        <FormControl fullWidth sx={{ marginTop: "10px" }}>
                          <TextField
                            id="requisition_code"
                            label="Requisition Code"
                            variant="outlined"
                            error={!code}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                          />
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Typography
                          sx={{
                            fontSize: 18,
                            color: "#845EBC",
                            fontWeight: "bold",
                          }}
                        >
                          Order Description
                        </Typography>
                        <FormControl fullWidth>
                          <TextareaAutosize
                            id="order_description"
                            label="Order Description"
                            minRows={3}
                            variant="outlined"
                            error={!requisitionOrganisation}
                            value={orderDescription}
                            onChange={(e) =>
                              setOrderDescription(e.target.value)
                            }
                          />
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container direction="row">
                  <Grid item xs={12}>
                    <Card sx={{ boxShadow: "none" }}>
                      <CardContent>
                        <Grid
                          item
                          gutterBottom
                          style={{ ...orderHeaderCssSmall, fontSize: "1.2rem" }}
                        >
                          Upload Files
                        </Grid>
                        <Grid item>
                          <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            {uploadedFileName ? (
                              <p style={{ color: "green" }}>
                                File: {uploadedFileName}
                              </p>
                            ) : (
                              <p>
                                Drag 'n' drop requisition xls or csv file, or
                                click to select files
                              </p>
                            )}
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
          sx={{
            borderTop: 1,
            borderColor: "#dedede",
            width: "100%",
            marginTop: "10px",
          }}
          elevation={8}
        >
          <Card>
            <CardContent>
              <Grid item>
                <Box sx={{ width: "100%" }}>
                  <Grid
                    sx={{ marginBottom: 10, width: "100%", maxWidth: "100%" }}
                  >
                    {uploadedFileName && (
                      <Typography>
                        <b>Uploaded file: {uploadedFileName}</b>
                      </Typography>
                    )}
                    {requisitionUploadData.length > 0 && (
                      <MaterialReactTable
                        columns={columns}
                        data={requisitionUploadData}
                        enableColumnActions={false}
                        muiTableProps={{
                          sx: {
                            tableLayout: "fixed",
                          },
                        }}
                        muiTableHeadCellProps={{
                          sx: {
                            "& .Mui-TableHeadCell-Content": {
                              fontSize: "12px",
                              color: "#667085",
                            },
                          },
                        }}
                        initialState={{
                          pagination: {
                            pageSize: 5,
                            pageIndex: 0,
                          },
                          columnVisibility: { id: false },
                        }}
                        muiTablePaginationProps={{
                          rowsPerPageOptions: [5, 10, 20],
                          showFirstButton: false,
                          showLastButton: false,
                          SelectProps: {
                            native: true,
                          },
                          labelRowsPerPage: "Number of rows visible",
                        }}
                      />
                    )}
                  </Grid>
                  <Grid container direction="row" xs={12} md={12}>
                    <Grid item xs={12} sx={{ marginLeft: 5 }}>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#000",
                          color: "#ffffff",
                          fontSize: "18px",
                        }}
                        startIcon={<UploadIcon />}
                        disabled={requisitionUploadData?.length === 0}
                        onClick={() => submitRequisition()}
                      >
                        Complete Requisition
                      </Button>
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
};

export default RequisitionUploadPage;
