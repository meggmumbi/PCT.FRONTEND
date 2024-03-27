import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  MenuItem,
  Typography,
  Select,
  TextField,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import _ from "lodash";
import { toast } from "react-toastify";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { getLocations } from "../../../apis/location";
import { useQuery } from "@tanstack/react-query";
import {
  getFromLocalStorage,
  setLocalStorage,
} from "../../../../../common/utils/LocalStorage";
import { useNavigate } from "react-router-dom";
import { SiteContext, UserInformation } from "../../../../../index";

function RequisitionOrderGeneralDetails(props) {
  const [country, setCountry] = useState("");
  const [requisitionOrganisation, setRequisitionOrganisation] = useState(null);
  const [requisitionDate, setRequisitionDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [orderDescription, setOrderDescription] = useState(null);
  const [code, setCode] = useState(
    "REQ-" + Math.random().toString(36).substr(2, 9).toUpperCase()
  );
  const navigate = useNavigate();
  const siteContext = useContext(SiteContext);
  const selectedSite = siteContext.selectedSite;
  const userInfo = useContext(UserInformation);
  const user = userInfo.userInformation;

  useEffect(() => {
    let livePayload = getFromLocalStorage("requisition-general-details");
    if (livePayload) {
      setCountry(livePayload.destinationCountry);
      setRequisitionOrganisation(livePayload.destinationOrganisation);
      setRequisitionDate(livePayload.requisitionDate);
      setOrderDescription(livePayload.description);
      setCode(livePayload.code);
    }
  }, []);

  const {
    data: locationsData,
    isLoading,
    isError,
  } = useQuery(["getLocations"], getLocations);

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

  const submitRequisition = async () => {
    if (!requisitionOrganisation) {
      popError("Error, missing requisition organization");
      return false;
    }

    if (!orderDescription) {
      popError("Error, missing description of this order");
      return false;
    }

    let payload = {
      destinationCountry: country,
      destinationOrganisation: requisitionOrganisation,
      requisitionDate: requisitionDate,
      email: user.username,
      requisitionType: "Adhoc",
      isApproved: false,
      isRequisitioned: false,
      description: orderDescription,
      code: code,
      tenantId: selectedSite.id,
    };
    setLocalStorage("requisition-general-details", payload);
    navigate("/psa/requisition-product-list");
  };

  const getGeoInfo = () => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        let data = response.data;
        setCountry(data.country_name);
      })
      .catch((error) => {
        setCountry("Kenya");
      });
  };

  useEffect(() => {
    getGeoInfo();
  }, []);

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

  return (
    <>
      <Grid container>
        <Grid item xs={12} style={{ padding: "10px 5px", margin: "10px" }}>
          <Grid container style={headerTopGrid}>
            <Grid item xs={12} md={11}>
              <div style={orderHeaderCss}>Create New Order </div>
              {JSON.stringify(selectedSite.id)}
              {user.username}
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
            sx={{ marginTop: "10px" }}
          >
            <Grid item xs={6}>
              <Card sx={{ boxShadow: "none" }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 18, color: "#1570EF", fontWeight: "bold" }}
                  >
                    Country
                  </Typography>
                  <FormControl fullWidth sx={{ marginTop: "10px" }}>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                      labelId="country-label"
                      id="country"
                      value={country}
                      onChange={(event) => setCountry(event.target.value)}
                      label="Country"
                    >
                      {!isLoading && !isError
                        ? locationsData.data?.map((location) => (
                            <MenuItem key={location.code} value={location.name}>
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
                    sx={{ fontSize: 18, color: "#845EBC", fontWeight: "bold" }}
                  >
                    Organisation
                  </Typography>
                  <FormControl fullWidth sx={{ marginTop: "10px" }}>
                    <TextField
                      id="organisation"
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
                    sx={{ fontSize: 18, color: "#845EBC", fontWeight: "bold" }}
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
                    sx={{ fontSize: 18, color: "#845EBC", fontWeight: "bold" }}
                  >
                    Order Description
                  </Typography>
                  <FormControl fullWidth sx={{ marginTop: "10px" }}>
                    <TextareaAutosize
                      id="order_description"
                      label="Order Description"
                      minRows={3}
                      variant="outlined"
                      error={!requisitionOrganisation}
                      value={orderDescription}
                      onChange={(e) => setOrderDescription(e.target.value)}
                    />
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} sx={{ padding: "5px" }}>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="left"
            alignItems="left"
            sx={{ padding: "10px" }}
          >
            <Grid item>
              <Button
                gutterBottom
                display="inline"
                variant="contained"
                size="medium"
                disableElevation
                style={{
                  backgroundColor: "#000",
                  width: "250px",
                  color: "#23A295;",
                  marginLeft: "20px",
                  fontSize: "18px",
                }}
                endIcon={<ArrowRightIcon />}
                onClick={submitRequisition}
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default RequisitionOrderGeneralDetails;
