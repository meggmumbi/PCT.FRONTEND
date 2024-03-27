import React, { useState, useEffect, useContext } from 'react';

import Typography from '@mui/material/Typography';
import { Grid, Select, TextField } from "@mui/material";
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { styled } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { getRequisitionsList, getRequisitionsProducts } from "../../apis/product-catalog";
import {getPurchaseOrderList } from "../../apis/order";
import { getSalesQuoteList } from "../../apis/sales-quote";
import { useQuery } from "@tanstack/react-query";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { DatePicker } from "@mui/x-date-pickers";
import { apiRoutes } from "../../routes/apiRoutes";
import { SiteContext } from '../../../../index';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  minHeight: '250px',
  color: theme.palette.text.secondary,
  boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

const Simulations = () => {
  const [displayTabValue, setDisplayTabValue] = useState(1);
  const siteContext = useContext(SiteContext);

  const handleDisplayTabChange = (event, newValue) => {
    setDisplayTabValue(newValue);
  }

  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [selectedSalesQuote, setSelectedSalesQuote] = useState();

  const [requisitions, setRequisitions] = useState([]);


  const handleRequisitionSelectChange = (event) => {
    setSelectedRequisition(event.target.value);
  }

  const handleVendorSelectChange = (event) => {
    setVendor(event.target.value);
  }


  const handleSalesQuoteSelectChange = (event) => {
    setSelectedSalesQuote(event.target.value);
    let sq = salesQuotes.filter((sq) => sq.salesQuoteNumber === event.target.value)?.pop();
    let req = requisitions.filter((req) => req.code = sq.requisitionCode)?.pop()
    setRequisitionFromPo(req);

  }
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100, //customize the default page size
  });

  const [salesQuoteNumber, setSalesQuoteNumber] = useState("");
  const [vendor, setVendor] = useState("");
  const [vendors, setVendors] = useState();
  const [salesQuotes, setSalesQuotes] = useState();
  const [deliveryDate, setDeliveryDate] = useState();
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState();
  const [requisitionFromPo, setRequisitionFromPo] = useState();



  const ShipmentSimForm = () => {
    const [selectedPO, setSelectedPO] = useState();
    const [POs, setPOs] = useState();

    const [consignmentCode, setConsignmentCode] = useState("CNS-" + Math.random().toString(36).substring(2, 18));
    const [asnNumber, setASNNumber] = useState(Math.random().toString(36).substring(2, 18));
    const [originCountry, setOriginCountry] = useState("Kenya");
    const [originCountryCode, setOriginCountryCode] = useState("254");
    const [originCity, setOriginCity] = useState("Nairobi");
    const [originCityCode, setOriginCityCode] = useState("001");
    const [dateDepartOriginPort, setDateDepartOriginPort] = useState(new Date().toISOString().slice(0, 10));
    const [shippingMode, setShippingMode] = useState("SPN-" + Math.random().toString(36).substring(2, 18));
    const [originPortName, setOriginPortName] = useState("MOMBASA");
    const [originPortCode, setOriginPortCode] = useState("PTN-" + Math.random().toString(36).substring(2, 14));
    const [destinationPortCode, setDestinationPortCode] = useState(Math.random().toString(36).substring(2, 18));
    const [destinationPortName, setDestinationPortName] = useState(Math.random().toString(36).substring(2, 18));
    const [destinationCountry, setDestinationCountry] = useState(Math.random().toString(36).substring(2, 18));
    const [expectedDateArriveDestinationPort, setExpectedDateArriveDestinationPort] = useState(Math.random().toString(36).substring(2, 18));
    const [vesselId, setVesselId] = useState(Math.floor(Math.random() * (2000000 - 20000 + 1)) + 20000);
    const [srq2, setSrq2] = useState();

    const handleShipmentSimulation = () => {
      let payload = {
        consignmentCode: consignmentCode,
        asnNumber: asnNumber,
        originCountry: originCountry,
        originCountryCode: originCountryCode,
        originCity: originCity,
        originCityCode: originCityCode,
        dateDepartOriginPort: dateDepartOriginPort,
        shippingMode: shippingMode,
        originPortName: originPortName,
        originPortCode: originPortCode,
        destinationPortCode: destinationPortCode,
        destinationPortName: destinationPortName,
        destinationCountry: destinationCountry,
        expectedDateArrivDestinationPort: expectedDateArriveDestinationPort,
        vesselId: vesselId,
        TenantId: siteContext.selectedSite.id,
        shipmentProducts: srq2?.products
      }

      let rq_data = JSON.stringify(payload);

      let formData = new FormData();
      formData.append("JsonObject", rq_data);

      fetch(apiRoutes.shipment, {
        method: 'POST',
        headers: { 'accept': '*/*' },
        body: formData,
      }).then(res => {

        if (res.status == 200) {
          setSelectedRequisition(null);
          setVendor(null);
          setSalesQuoteNumber(null);
          toast.success("Shipment order  submitted", {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Could not submit shipment order kindly try again", {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
    }

    const handlePOSelectChange = (event) => {
      setPurchaseOrderNumber(event.target.value);
      setSelectedPO(event.target.value);
      let r = POs.filter((p) => p.poNumber == event.target.value)?.pop();
      let rq = requisitions.filter((rr) => rr.code === r.requisitionCode)?.pop();
      setSrq2(rq);
    }

    useEffect(() => {
      getPurchaseOrderList({ queryKey: ["getPurchaseOrderList", pagination, siteContext.selectedSite.id] }).then((resp) => {
        setPOs(resp.data.data);
      });


    }, [])

    return (<Grid >
      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <InputLabel id="shipment-select-label">Purchase Order</InputLabel>
        <Select
          labelId="shipment-select-label"
          id="shipment-select"
          value={selectedPO}
          label="Purchase Order"
          onChange={handlePOSelectChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {POs?.map((po) => (
            <MenuItem key={po.poNumber} value={po.poNumber}>{po.poNumber} - {po.requisitionCode}</MenuItem>
          ))}
        </Select>

      </FormControl>

      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="co-number-filed"
          labelId="co-number-label"
          label="Consignment Code"
          variant="outlined"
          value={consignmentCode}
          onChange={(e) => setConsignmentCode(e.target.value)}
        />
      </FormControl>


      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="asn-number-filed"
          labelId="asn-number-label"
          label="ASN Number"
          variant="outlined"
          value={asnNumber}
          onChange={(e) => setASNNumber(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="oc-number-filed"
          labelId="oc-number-label"
          label="Origin Country"
          variant="outlined"
          value={originCountry}
          onChange={(e) => setOriginCountry(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="occ-number-filed"
          labelId="occ-number-label"
          label="Origin Country Code"
          variant="outlined"
          value={originCountryCode}
          onChange={(e) => setOriginCountryCode(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="occc-number-filed"
          labelId="occc-number-label"
          label="Origin City"
          variant="outlined"
          value={originCity}
          onChange={(e) => setOriginCity(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="occcc-number-filed"
          labelId="occcc-number-label"
          label="Origin City Code"
          variant="outlined"
          value={originCityCode}
          onChange={(e) => setOriginCityCode(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>

        <DatePicker
          label="Departure Date"
          value={deliveryDate}
          onChange={(value) =>
            setDateDepartOriginPort(value)
          }
          renderInput={(params) => (
            <TextField
              margin="normal"
              name="deliveryDate"
              variant="outlined"
              my={2}
              {...params}
            />
          )}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="sm-number-filed"
          labelId="sm-number-label"
          label="Shipping Mode"
          variant="outlined"
          value={shippingMode}
          onChange={(e) => setShippingMode(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="oa-number-filed"
          labelId="oa-number-label"
          label="Origin Port Name"
          variant="outlined"
          value={originPortName}
          onChange={(e) => setOriginPortName(e.target.value)}
        />
      </FormControl>


      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="oac-number-filed"
          labelId="oac-number-label"
          label="Origin Port Code"
          variant="outlined"
          value={originPortCode}
          onChange={(e) => setOriginPortCode(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="dp-number-filed"
          labelId="dp-number-label"
          label="Destination Port Name"
          variant="outlined"
          value={destinationPortName}
          onChange={(e) => setDestinationPortName(e.target.value)}
        />
      </FormControl>


      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="dpc-number-filed"
          labelId="cpc-number-label"
          label="Destination Port Code"
          variant="outlined"
          value={destinationPortCode}
          onChange={(e) => setDestinationPortCode(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="dpcc-number-filed"
          labelId="cpcc-number-label"
          label="Destination Country"
          variant="outlined"
          value={destinationCountry}
          onChange={(e) => setDestinationCountry(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <TextField id="vid-number-filed"
          labelId="vid-number-label"
          label="Vessel ID"
          variant="outlined"
          value={vesselId}
          onChange={(e) => setVesselId(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>

        <DatePicker
          label="Departure Date"
          value={expectedDateArriveDestinationPort}
          onChange={(value) =>
            setExpectedDateArriveDestinationPort(value)
          }
          renderInput={(params) => (
            <TextField
              margin="normal"
              name="deliveryDate"
              variant="outlined"
              my={2}
              {...params}
            />
          )}
        />
      </FormControl>
      <FormControl fullWidth sx={{ marginTop: 10 }}>
        <Button variant="contained" onClick={handleShipmentSimulation}>Submit</Button>
      </FormControl>
    </Grid>
    )

  }


  const { isLoading, isError } = useQuery(
    ["getRequisitionsList", pagination, siteContext.selectedSite.id],
    getRequisitionsList,
    {
      onSuccess: (response) => {
        setRequisitions(response.data.data)
      }
    }
  );

  useEffect(() => {
    let _vendors = [
      { "vendorId": "IKJSKJSNS", "vendorCode": "12345", "vendorName": "Manna X" },
      { "vendorId": "IKXIOZNNZ", "vendorCode": "12346", "vendorName": "Parley X" },
      { "vendorId": "IKJUYIAHA", "vendorCode": "12347", "vendorName": "Monga" },
      { "vendorId": "IKMNJYUAA", "vendorCode": "12348", "vendorName": "Fabiav X" },
      { "vendorId": "IKJOYUUAN", "vendorCode": "12349", "vendorName": "Floarina DC" },
    ]
    setVendors(_vendors);

    getSalesQuoteList({ queryKey: ["getSalesQuoteList", pagination, siteContext.selectedSite.id] }).then((resp) => {
      setSalesQuotes(resp.data.data);
    })

  }, []);

  const handlePurchaseOrderSimulation = () => {
    let srq = requisitionFromPo;

    getRequisitionsProducts({ queryKey: ["getRequisitionsProducts", srq.id] }).then((data) => {
      let payload = {
        poNumber: purchaseOrderNumber,
        salesQuoteNumber: selectedSalesQuote,
        dateRequestCommodities: srq.requisitionDate.slice(0, 10),
        datePromisedDelivery: deliveryDate.toISOString().slice(0, 10),
        requisitionCode: srq.code,
        currency: "USD",
        TenantId: siteContext.selectedSite.id,
        purchaseOrderProducts: data.data.forEach(v => delete v.id)
      };
      let rq_data = JSON.stringify(payload);

      let formData = new FormData();
      if (selectedFile) {
        formData.append("Attachment", selectedFile)
      }
      formData.append("JsonObject", rq_data);

      fetch(apiRoutes.purchaseOrder, {
        method: 'POST',
        headers: { 'accept': '*/*' },
        body: formData,
      }).then(res => {

        if (res.status == 200) {
          setSelectedRequisition(null);
          setVendor(null);
          setSalesQuoteNumber(null);
          toast.success("Purchase order  submitted", {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Could not submit purchase order kindly try again", {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
    })


  }

  const [selectedFile, setSelectedFile] = useState();

  const handleSalesQuoteSimulation = () => {


    let srq = requisitions.filter((rq) => rq.id === selectedRequisition)?.pop();
    getRequisitionsProducts({ queryKey: ["getRequisitionsProducts", srq.id] }).then((data) => {
      let payload = {
        requisitionCode: srq.code,
        salesQuoteNumber: salesQuoteNumber,
        vendorId: vendor,
        dateSupplierIssuedQuote: new Date().toISOString().slice(0, 10),
        TenantId: siteContext.selectedSite.id,
        "products": data.data.forEach(v => delete v.id),
      };
      let rq_data = JSON.stringify(payload);
      let formData = new FormData();
      if (selectedFile) {
        formData.append("Attachment", selectedFile)
      }
      formData.append("JsonObject", rq_data);

      fetch(apiRoutes.salesQuote, {
        method: 'POST',
        headers: { 'accept': '*/*' },
        body: formData,
      }).then(res => {

        if (res.status == 200) {
          setSelectedRequisition(null);
          setVendor(null);
          setSalesQuoteNumber(null);
          toast.success("Sale Quote submitted", {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        } else {
          toast.error("Could not submit sales quote kindly try again", {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
    })

  }
  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };


  return (

    <Grid container justifyContent="flex-start" alignItems="center" spacing={2} sx={{ margin: "auto", width: "100%" }}>
      <ToastContainer />
      <Grid item xs={12} sm={12} sx={{ padding: '5px 10px', textAlign: 'left', color: '#840821' }}>
        <Typography gutterBottom sx={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#840821', margin: "5px 10px" }}>
          <div> GLOBIS ORDER PROCESS SIMULATIONS </div>
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} sx={{ marginBottom: 10 }}>

        <Item sx={{ flexGrow: 1, backgroundColor: '#fff', padding: '5px 5px 10px 5px' }}>
          <Grid item xs={12} sx={{ marginTop: '10px' }}>
            <TabContext value={displayTabValue}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleDisplayTabChange} aria-label="Approval stages" variant="secondary">
                  <Tab label="Sales Quote" value={1} id={`simple-tab-${1}`} ariaControls={`simple-tabpanel-${1}`} />
                  <Tab label="Purchase Order" value={2} id={`simple-tab-${2}`} ariaControls={`simple-tabpanel-${2}`} />
                  <Tab label="Shipment" value={3} id={`simple-tab-${3}`} ariaControls={`simple-tabpanel-${3}`} />
                </TabList>
              </Box>
              <TabPanel value={1}>

                <FormControl fullWidth sx={{ marginTop: 10 }}>
                  <InputLabel id="requisition-select-label">Requisition Order</InputLabel>
                  <Select
                    labelId="requisition-select-label"
                    id="requisition-select"
                    value={selectedRequisition}
                    label="Requisition"
                    onChange={handleRequisitionSelectChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {requisitions?.map((requisition) => (
                      <MenuItem key={requisition.id} value={requisition.id}>{requisition.code} - {requisition.description}</MenuItem>
                    ))}
                  </Select>

                </FormControl>
                <FormControl fullWidth sx={{ marginTop: 10 }}>
                  <TextField id="sale-quote-number-filed" labelId="sales-quote-number-label" label="Sale Quote Number" variant="outlined" onChange={(e) => setSalesQuoteNumber(e.target.value)} />
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: 10 }}>
                  <InputLabel id="vendor-select-label">Selected Vendor</InputLabel>
                  <Select
                    labelId="vendor-select-label"
                    id="vendor-select"
                    value={vendor}
                    label="Vendor"
                    onChange={handleVendorSelectChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {vendors?.map((vendor) => (
                      <MenuItem key={vendor.vendorId} value={vendor.vendorId}>{vendor.vendorCode} - {vendor.vendorName}</MenuItem>
                    ))}
                  </Select>
                  <FormControl fullWidth sx={{ marginTop: 10 }}>
                    <label htmlFor="file" className="sr-only">
                      Choose a file
                    </label>
                    <input
                      type="file"
                      name="salesquoteupload"
                      label="Sales Qoute"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </FormControl>

                </FormControl>
                <FormControl fullWidth sx={{ marginTop: 10 }}>
                  <Button variant="contained" onClick={handleSalesQuoteSimulation}>Submit</Button>
                </FormControl>
              </TabPanel>
              <TabPanel value={2}>

                <FormControl fullWidth sx={{ marginTop: 10 }}>
                  <InputLabel id="sales-quote-select-label">Sales Qoute</InputLabel>
                  <Select
                    labelId="sales-quote-select-label"
                    id="sales-quote-select"
                    value={selectedSalesQuote}
                    label="Sales Quote"
                    onChange={handleSalesQuoteSelectChange}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {salesQuotes?.map((sq) => (
                      <MenuItem key={sq.salesQuoteNumber} value={sq.salesQuoteNumber}>{sq.salesQuoteNumber} - {sq.requisitionCode}</MenuItem>
                    ))}
                  </Select>

                </FormControl>

                <FormControl fullWidth sx={{ marginTop: 10 }}>
                  <TextField id="purchase-order-number-filed"
                    labelId="purchase-order-number-label"
                    label="PO Number"
                    variant="outlined"
                    onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: 10 }}>

                  <DatePicker
                    label="Required Delivery Date"
                    value={deliveryDate}
                    onChange={(value) =>
                      setDeliveryDate(value)
                    }
                    renderInput={(params) => (
                      <TextField
                        margin="normal"
                        name="deliveryDate"
                        variant="outlined"
                        my={2}
                        {...params}
                      />
                    )}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: 10 }}>
                  <label htmlFor="file" className="sr-only">
                    Choose a file
                  </label>
                  <input
                    type="file"
                    name="purchaseorderupload"
                    label="Purchase 0rder"
                    onChange={(e) => handleFileChange(e)}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ marginTop: 10 }}>
                  <Button variant="contained" onClick={handlePurchaseOrderSimulation}>Submit</Button>
                </FormControl>

              </TabPanel>
              <TabPanel value={3}>
                <ShipmentSimForm />
              </TabPanel>
            </TabContext>
          </Grid>
        </Item>
      </Grid>
    </Grid>
  );

}


export default Simulations;
