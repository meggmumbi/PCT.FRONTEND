import React from 'react';


import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {FormHelperText, Grid, Select, TextField} from "@mui/material";
import { Input } from '@mui/material';
import {styled} from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    minHeight:'250px',
    color: theme.palette.text.secondary,
    boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));


const steps = [
    {
        approver:'Felix',
        label: 'Level 1',
        description: `For each ad campaign that you create, you can control how much you're willing to spend on clicks and conversions, which networks and geographical locations you want your ads to show on, and more.`,

    },
    {
        approver:'Fredrick',
        label: 'Level 2',
        description:
            'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
        approver:'Teddy',
        label: 'Level 3',
        description: `Try out different ad text to see what brings in the most customers,and learn how to enhance your ads using features like ad extensions. If you run into any problems with your ads, find out how to tell if they're running and how to resolve approval issues.`,
    },
];

function createData(family,product,quantity,cost,total) {
    return { family,product,quantity,cost,total};
}

const rows = [
    createData('Malaria',  'Hydroxychloroquine','200','$0.2','$40'),
    createData('COVID-19',  'COVAX','8000','$10','$80000'),
    createData('MCH',  '0RS-Zinc','2000','$0.15','$300')
];



function StockPlan({pageSwitch,requisition}) {
    const [approvalStatus, setApprovalStatus] = React.useState("");

    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const approvalCategories = [
        "Approve",
        "Reject"
    ];
    const handleChange = (event) => {
        setApprovalStatus(event.target.value);
    };

    return (
        <Box >
            <Item elevation={3}>
                {JSON.stringify(requisition)}
                <Grid container spacing={3}>
                    <Grid item xs={6} sm={6}>
                        <Box sx={{ width: '100%' }}>
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {steps.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel
                                            optional={
                                                index === 2 ? (
                                                    <Typography variant="caption">Last step</Typography>
                                                ) : null
                                            }
                                        >
                                            {step.label}
                                        </StepLabel>
                                        <StepContent>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={2}>
                                                    <InputLabel
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        Approver
                                                    </InputLabel>
                                                </Grid>
                                                <Grid item xs={12} sm={10}>
                                                    <Typography sx={{ fontSize: 14, color:'#000',fontWeight:'bold' }}>
                                                        {step.approver}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12} sm={2}>
                                                    <InputLabel
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        Status
                                                    </InputLabel>
                                                </Grid>
                                                <Grid item xs={12} sm={10} sx={{padding:'20px'}}>
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={approvalStatus}
                                                            label="Status"
                                                            onChange={handleChange}
                                                        >
                                                            {approvalCategories.map((item) => (
                                                                <MenuItem value={item}>{item}</MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12} sm={2}>
                                                    <InputLabel
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            fontWeight: 700
                                                        }}
                                                    >
                                                        Justification
                                                    </InputLabel>
                                                </Grid>
                                                <Grid item xs={12} sm={10} sx={{padding:'20px'}}>
                                                    <TextField
                                                        id="outlined-multiline-static"
                                                        label="Justification"
                                                        multiline
                                                        fullWidth
                                                        rows={4}
                                                        defaultValue={step.description}
                                                    />
                                                </Grid>

                                            </Grid>

                                            <Box sx={{ mb: 2 }}>
                                                <div>
                                                    <Button
                                                        variant="contained"
                                                        onClick={handleNext}
                                                        sx={{ mt: 1, mr: 1 }}
                                                    >
                                                        {index === steps.length - 1 ? 'Complete Approval' : 'Continue'}
                                                    </Button>
                                                    <Button
                                                        disabled={index === 0}
                                                        onClick={handleBack}
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
                            {activeStep === steps.length && (
                                <Paper square elevation={0} sx={{ p: 3 }}>
                                    <Typography>All steps completed - you&apos;re finished</Typography>
                                    <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                                        Reset
                                    </Button>
                                </Paper>
                            )}
                        </Box>

                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <Item>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={12} sx={{padding:'10px',textAlign:'center'}}>
                                    <Typography variant="h6" gutterBottom>
                                        Requisition Details {requisition.id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputLabel
                                        sx={{
                                            display: "flex",
                                            justifyContent: "right",
                                            fontWeight: 700
                                        }}
                                    >
                                        Requisition Code
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={9} sx={{padding:'5px',textAlign:'left'}}>
                                    <Typography>
                                        {requisition.code}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputLabel
                                        sx={{
                                            display: "flex",
                                            justifyContent: "right",
                                            fontWeight: 700
                                        }}
                                    >
                                        Requisition Type
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={9} sx={{padding:'5px',textAlign:'left'}}>
                                    <Typography>
                                        {requisition.requisitionType}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputLabel
                                        sx={{
                                            display: "flex",
                                            justifyContent: "right",
                                            fontWeight: 700
                                        }}
                                    >
                                        Destination Country
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={9} sx={{padding:'5px'}}>
                                    <Typography>
                                        {requisition.destinationCountry}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <InputLabel
                                        sx={{
                                            display: "flex",
                                            justifyContent: "right",
                                            fontWeight: 700
                                        }}
                                    >
                                        Requisition Date
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={9} sx={{padding:'5px'}}>
                                    <Typography>
                                        {requisition.requisitionDate !== null ?new Date(requisition.requisitionDate).toISOString().slice(0, 10):""}
                                    </Typography>
                                </Grid>



                                <Grid item xs={12} sm={3}>
                                    <InputLabel
                                        sx={{
                                            display: "flex",
                                            justifyContent: "right",
                                            fontWeight: 700
                                        }}
                                    >
                                        Expected Delivery Date
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={9} sx={{padding:'5px'}}>
                                    <Typography>
                                        {requisition.expectedDeliveryDate}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    <InputLabel
                                        sx={{
                                            display: "flex",
                                            justifyContent: "right",
                                            fontWeight: 700
                                        }}
                                    >
                                        Total Cost
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={9} sx={{padding:'5px 5px 0px 5px'}}>
                                    <Typography>
                                        ${requisition.totalAmount}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <InputLabel
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            fontWeight: 700
                                        }}
                                    >
                                        Products
                                    </InputLabel>
                                </Grid>
                                <Grid item xs={12} sm={12} sx={{padding:'0px 5px 5px 5px'}}>
                                    <Box sx={{ flexGrow: 1,backgroundColor:'#fff',padding:'5px 5px 10px 5px' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sx={{marginTop:'10px'}}>
                                                <Item elevation={1}>
                                                    <TableContainer component={Paper}>
                                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">Family</TableCell>
                                                                    <TableCell align="left">Product</TableCell>
                                                                    <TableCell align="left">Quantity</TableCell>
                                                                    <TableCell align="left">Cost</TableCell>
                                                                    <TableCell align="left">Total</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {rows.map((row) => (
                                                                    <TableRow
                                                                        key={row.code}
                                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                    >
                                                                        <TableCell component="th" scope="row">
                                                                            {row.family}
                                                                        </TableCell>
                                                                        <TableCell align="left">{row.product}</TableCell>
                                                                        <TableCell align="left">{row.quantity}</TableCell>
                                                                        <TableCell align="left">{row.cost}</TableCell>
                                                                        <TableCell align="left">{row.total}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Item>
                                            </Grid>
                                        </Grid>
                                    </Box>


                                </Grid>


                            </Grid>

                        </Item>
                    </Grid>

                </Grid>
            </Item>

        </Box>




);
}

export default StockPlan;
