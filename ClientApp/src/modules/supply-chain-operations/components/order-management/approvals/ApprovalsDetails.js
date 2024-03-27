import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import MaterialReactTable from "material-react-table";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";

import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Grid, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQuery } from "@tanstack/react-query";
import {
  getRequisitionsProducts,
} from "../../../apis/product-catalog";
import {
  getRequisitionApprovalStatus,
  postRequisitionApproveStatus,
} from "../../../apis/order";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { UserInformation } from "../../../../../index.js";
import AsyncImage from "../../AsyncImage";
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
function ApprovalsDetails() {

  const requisition = getFromLocalStorage("approval_data") || {}
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [approvalStatus, setApprovalStatus] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [approvalJustification, setApprovalJustification] = useState("");
  const approvalCommentRef = useRef();
  const tableInstanceRef = useRef(null);
  const [showApproveTab, setShowApproveTab] = useState(false);
  const [displayData, setDisplayData] = useState([]);
  const [activeStage, setActiveStage] = useState(null);
  const showStepper = false;

  const getItemRowRenderMarkup = (row, cell) => {
    return (
      <Grid container>
        <Grid xs={2}>
          <AsyncImage src={productImage(row.original)} height={50} />
        </Grid>
        <Grid xs={10} container orientation="row">
          <Grid
            xs={12}
            sx={{ color: "#586A84", fontSize: 8, wordWrap: "break-word" }}
            md={{ fontSize: 8 }}
          >
            {row.original.productName}
          </Grid>
          <Grid
            xs={12}
            sx={{
              mb: 1.5,
              fontSize: "0.8em",
              color: "#E47200",
              fontWeight: "bold",
            }}
          >
            {row.original.productCategory}
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const productImage = (item) => {
    return item.values &&
      item.values.IMAGE_ATTRIBUTE &&
      item.values.IMAGE_ATTRIBUTE.length > 0
      ? item.values.IMAGE_ATTRIBUTE[0]._links.download.href
      : "";
  };

  const user = useContext(UserInformation).userInformation;

  const [canApprove, setCanApprove] = useState(false);

  const { _ } = useQuery(
    ["getRequisitionsProducts", requisition.id],
    getRequisitionsProducts,
    {
      onSuccess: (data) => {
        setData(data.data);
        updateApprovalStatus();
      },
    }
  );

  const updateApprovalStatus = () => {
    getRequisitionApprovalStatus({ queryKey: [requisition.id] }).then(
      (data) => {
        setApprovalStatus(data?.data);
      }
    );
  };

  useEffect(() => {
    if (activeStep !== null) {
      setShowApproveTab(true);
    }
  }, [activeStep]);

  useEffect(() => {
    let _display_data = {};
    let alreadyApproved = [];
    if (approvalStatus) {
      approvalStatus?.map((stepdata) => {
        if (stepdata?.details?.approvedBy) {
          alreadyApproved.push(stepdata?.details?.approvedBy);
        }
        if (stepdata.status === "Open") {
          setActiveStep(
            stepdata.stage == "Stage 1"
              ? 0
              : stepdata.stage == "Stage 2"
                ? 1
                : 2
          );
          setActiveStage(stepdata.stage);
        }
        let st = data.map((it) => {
          let approveData = stepdata?.details?.products?.filter(
            (p) => p.productId === it.id
          );
          if (approveData) {
            return { ...it, ...approveData[0], ...{ status: stepdata.status } };
          } else {
            return { ...it, ...{ status: stepdata.status } };
          }
        });

        _display_data[stepdata.stage] = st;
      });
    }
    setDisplayData(_display_data);
    setCanApprove(!alreadyApproved.includes(user?.username));

  }, [approvalStatus]);

  const validateSubmitApproval = () => {
    let errors = null;
    let perror = displayData[activeStage].filter((item) => {
      return !item.approvalStatus;
    });
    if (perror.length > 0) {
      errors =
        "Error, all items in the list must be approved or rejected with a comment";
    }
    return errors;
  };

  const handleSubmitApproval = () => {
    let errors = validateSubmitApproval();

    if (errors) {
      popError(errors);
      return false;
    }

    let payload_data = displayData[activeStage].map((pd) => {
      const {
        id,
        quantity,
        unitPrice,
        total,
        estimatedLeadTime,
        estimatedDeliveryCost,
        transportMode,
        deliveryDate,
        ...rest
      } = pd;
      rest.comments = rest.comments ?? "No comment";
      return { ...rest, productId: id };
    });

    let request = {
      requisitionId: requisition.id,
      approvalUser: "user.username",
      approvalLevel: (activeStep + 1).toString(),
      approvalDate: new Date().toISOString().slice(0, 10),
      justification: approvalJustification,
      products: payload_data,
    };

    postRequisitionApproveStatus(request).then((response) => {
      popSuccess(
        "Requistion id " +
        requisition.id +
        " approved for Stage " +
        (activeStep + 1)
      );
      updateApprovalStatus();
    });
  };


  const handleSaveCell = (cell, value) => {
    let tableData = displayData;
    tableData[activeStage][cell.row.index][cell.column.id] = value;

    setDisplayData(tableData);
  };

  const tableTheme = createTheme({
    palette: {
      background: {
        default: "#fff",
      },
    },
  })


  const columns = useMemo(
    () => [
      {
        accessorKey: "productCategory", //simple recommended way to define a column
        width: 60,
        header: "Family",
        enableEditing: false,
        Cell: ({ row, cell }) => getItemRowRenderMarkup(row, cell),
      },
      {
        accessorKey: "quantity", //simple recommended way to define a column
        width: 50,
        header: "Quantity",
        enableEditing: false,
      },
      {
        accessorKey: "total", //simple recommended way to define a column
        width: 50,
        header: "Amount",
        enableEditing: false,
      },
      {
        accessorKey: "approvalStatus", //simple recommended way to define a column
        header: "Status",
        size: 100,
        editable: "always",
        enableEditing: (row) => row.original.status === "Open",
        editVariant: "select",
        editSelectOptions: ["Approve", "Reject", "Review"],
      },
      {
        accessorKey: "comments", //simple recommended way to define a column
        width: 50,
        header: "Comments",
        enableEditing: (row) => row.original.status === "Open",
        editable: "always",
      },
    ],
    []
  );

  const [displayTabValue, setDisplayTabValue] = useState(0);

  const handleDisplayTabChange = (event, newValue) => {
    setDisplayTabValue(newValue);
  };
  return (
    <Grid container alignItems="stretch" >

      <Grid item xs={showApproveTab ? 8 : 12} style={{ display: "flex" }}>

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
            sx={{ textAlign: "left" }}
          >
            <Typography
              gutterBottom
              sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
            >
              Requisition Details
            </Typography>
          </Grid>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: 14 }}>
                    Requisition Code: {requisition.code}
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
                    Requisition Date:{" "}
                    {requisition.requisitionDate !== null
                      ? new Date(requisition.requisitionDate)
                        .toISOString()
                        .slice(0, 10)
                      : ""}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Total Amount: {requisition.totalAmount}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Grid item xs={12} sm={12}>
            <Box sx={{ width: "100%" }}>
              {showApproveTab ? (

                <Stepper activeStep={activeStep} orientation="vertical">
                  {approvalStatus?.map((step, index) => (
                    <Step key={index}>
                      <StepContent>
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
                                    data={displayData[activeStage]}
                                    editingMode="table"
                                    onRowSelectionChange={setRowSelection} //hoist internal state to your own state (optional)
                                    state={{ rowSelection }}
                                    tableInstanceRef={tableInstanceRef}
                                    enableEditing
                                    enableColumnActions={false}
                                    enablePagination={false}
                                    enableFilters={false}
                                    enableFullScreenToggle={false}
                                    enableTopToolbar={false}
                                    muiTableBodyCellEditTextFieldProps={({
                                      cell,
                                    }) => ({
                                      onChange: (event) => {
                                        handleSaveCell(
                                          cell,
                                          event.target.value
                                        );
                                      },
                                      variant: "standard",
                                      // error:!cell.getValue(),
                                    })}
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
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={2}>
                            <InputLabel
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                fontWeight: 700,
                              }}
                            >
                              Approver
                            </InputLabel>
                          </Grid>
                          <Grid item xs={12} sm={10}>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#000",
                                fontWeight: "bold",
                              }}
                            >

                              {step?.detail?.approvedBy || user.username}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} sm={2}>
                            <InputLabel
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                fontWeight: 700,
                              }}
                            >
                              Justification
                            </InputLabel>
                          </Grid>
                          <Grid item xs={12} sm={10} sx={{ padding: "20px" }}>
                            {step.status === "Open" ? (
                              <FormControl fullWidth sx={{ marginTop: "10px" }}>
                                <TextField
                                  id="outlined-multiline-static"
                                  label=" Justification"
                                  multiline
                                  fullWidth
                                  rows={4}
                                  name="approval-comment"

                                  onClick={(e) =>
                                    setApprovalJustification(e.target.value)
                                  }
                                  ref={approvalCommentRef}
                                  placeholder="Reasons for you approval action"
                                />
                              </FormControl>
                            ) : (
                              <p>
                                {" "}
                                {
                                  approvalStatus?.[activeStep]?.justification
                                }{" "}
                              </p>
                            )}
                          </Grid>
                        </Grid>
                        <Box sx={{ mb: 2 }}>
                          <div>
                            {approvalStatus[activeStep].status === "Open" &&
                              canApprove && (
                                <Button
                                  variant="contained"
                                  onClick={handleSubmitApproval}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  {activeStep === approvalStatus.length - 1
                                    ? "Complete Approval"
                                    : "Submit"}
                                </Button>
                              )}

                            {approvalStatus[activeStep].status !== "Open" &&
                              approvalStatus[activeStep]?.length - 1 !==
                              activeStep && (
                                <Button
                                  onClick={() => {
                                    setActiveStep(activeStep + 1);
                                    setActiveStage(
                                      approvalStatus[activeStep + 1]?.stage
                                    );
                                  }}
                                  sx={{ mt: 1, mr: 1 }}
                                >
                                  Next
                                </Button>
                              )}
                            <Button
                              disabled={index === 0}
                              onClick={() => {
                                setActiveStep(activeStep - 1);
                                setActiveStage(
                                  approvalStatus[activeStep - 1]?.stage
                                );
                              }}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Back
                            </Button>
                          </div>
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              ) : (
                <Grid item xs={12} sm={12} sx={{ marginBottom: 10 }}>
                  <Item
                    sx={{
                      flexGrow: 1,
                      backgroundColor: "#fff",
                      padding: "5px 5px 10px 5px",
                    }}
                  >
                    <Grid item xs={12} sx={{ marginTop: "10px" }}>
                      <TabContext value={displayTabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                          <TabList
                            onChange={handleDisplayTabChange}
                            aria-label="Approval stages"
                            variant="secondary"
                          >
                            {Object.keys(displayData)?.map((key, index) => (
                              <Tab
                                label={key}
                                value={index}
                                id={`simple-tab-${index}`}
                                ariaControls={`simple-tabpanel-${index}`}
                              />
                            ))}
                          </TabList>
                        </Box>
                        {Object.keys(displayData).map((key, index) => (
                          <TabPanel value={index}>
                            <TableContainer component={Paper} >

                              <ThemeProvider theme={tableTheme}>
                                <MaterialReactTable
                                  columns={columns}
                                  data={displayData[key]}
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
                          </TabPanel>
                        ))}
                      </TabContext>
                    </Grid>
                  </Item>
                </Grid>
              )}{" "}

            </Box>
          </Grid>
        </Paper>
      </Grid>

      {showApproveTab && (<Grid item md={4} xs={12} style={{ display: "initial" }}>
        <Paper
          square={true}
          xs={12}
          sx={{ borderTop: 5, borderColor: "#000000" }}
          elevation={8}
        >
          <Card>
            <CardContent>
              <Grid item xs={12} sm={12}>
                <Box sx={{ width: "100%" }}>
                  {showApproveTab && (
                    <Stepper activeStep={activeStep} orientation="vertical">
                      {approvalStatus?.map((step, index) => (
                        <Step key={index}>
                          <StepLabel

                            onClick={() => {
                              if (activeStep === 0 || activeStep === 1) {

                                setActiveStep(activeStep + 1);
                                setActiveStage(approvalStatus[activeStep + 1]?.stage);
                              } else if (activeStep === 2) {

                                setActiveStep(activeStep - 1);
                                setActiveStage(approvalStatus[activeStep - 1]?.stage);
                              }

                            }}
                            optional={
                              index === 2 ? (
                                <Typography variant="caption">
                                  Last step
                                </Typography>
                              ) : null
                            }
                          >
                            <Typography
                              sx={{
                                display: "flex",
                                fontWeight: 700,
                                fontSize: 18,
                                margin: "10px 0",
                              }}
                            >
                              {" "}
                              {step.stage}{" "}
                            </Typography>
                          </StepLabel>
                          <StepContent>
                            <Grid container spacing={1}>
                              <Grid item xs={12}>
                                <Typography sx={{ fontSize: 18 }}>
                                  <span style={{ fontWeight: "bold" }}>Approver:</span> {step?.detail?.approvedBy || user.username}
                                </Typography>

                              </Grid>


                              <Grid item xs={12}>

                                <Typography sx={{ fontSize: 18 }}>
                                  <span style={{ fontWeight: "bold" }}>Status:</span> {approvalStatus[activeStep].status}
                                </Typography>


                              </Grid>
                              <Grid item xs={12}>

                                <Typography sx={{ fontSize: 18 }}>
                                  <span style={{ fontWeight: "bold" }}> Justification:</span>{approvalStatus?.[activeStep]?.justification}
                                </Typography>

                              </Grid>
                            </Grid>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  )}
                </Box>
              </Grid>
            </CardContent>
          </Card>
        </Paper>
      </Grid>
      )}
    </Grid>
  );
}

export default ApprovalsDetails;
