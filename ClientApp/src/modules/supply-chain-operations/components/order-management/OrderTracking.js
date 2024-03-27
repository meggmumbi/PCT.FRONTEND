import React, { useState } from "react";
import { Box, Breadcrumbs, Card, CardContent, Divider, Grid, Link, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const steps = [
        'First Approval',
        'Second Approval',
        'Third Approval',
        'Requisition Submitted',
       
    ];

    const [activeStep, setActiveStep] = useState(0);

    const handleStepClick = (stepIndex) => {
        if (stepIndex === activeStep) {
            return;
        }

        setActiveStep(stepIndex);

        if (stepIndex === steps.length - 1) { 
            // Delay the redirection by 5 seconds
            setTimeout(() => {
                navigate("/psa/historical-orders"); 
            }, 1000); 
        }
    };

    return (
        <React.Fragment>
            <Helmet title="Order Tracking" />

            <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                <Link component={NavLink} to="/">
                    PCT
                </Link>
                <Link component={NavLink} to="/">
                    Supply Chain Operations
                </Link>
                <Link component={NavLink} to="/">
                    Home
                </Link>
                <Typography>Order Tracking</Typography>
            </Breadcrumbs>
            <Box mt={4}>
                <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                {/* ... (other Grid items) */}
                            </Grid>
                            <Divider />
                            <Grid container spacing={2} mt={5}>
                                <Grid item md={12}>
                                    <Stepper alternativeLabel activeStep={activeStep}>
                                        {steps.map((label, index) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                                {index < steps.length - 1 && (
                                                    <ArrowForwardIcon
                                                        style={{
                                                            cursor: "pointer",
                                                            fontSize: "1.5rem", // Adjust the arrow size
                                                            color: "#007bff", // Change arrow color
                                                            marginLeft: "0.5rem", // Add some spacing
                                                        }}
                                                        onClick={() => handleStepClick(index + 1)}
                                                    />
                                                )}
                                            </Step>
                                        ))}
                                    </Stepper>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Paper>
            </Box>
        </React.Fragment>
    );
};

export default OrderTracking;
