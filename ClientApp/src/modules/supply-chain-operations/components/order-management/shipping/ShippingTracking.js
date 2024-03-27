import React from "react";
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
    Input, OutlinedInput

} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {ToastContainer} from "react-toastify";
import {Helmet} from "react-helmet-async";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import UndoIcon from '@mui/icons-material/Undo';
import ReplyIcon from '@mui/icons-material/Reply';
import { useNavigate, useLocation } from 'react-router-dom';


function ShippingTracking() {
    const navigate = useNavigate();
    const navigateToShippingList = () => navigate('/psa/shipping-list');

    return (
        <div>
            <ToastContainer />
            <Helmet title="Order Tracking" />

            
                <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                    <Link component={NavLink} to="/">
                        PCT
                    </Link>
                    <Link component={NavLink} to="/">
                        Supply Chain Operations
                    </Link>                 
                    <Typography>Shipment Tracking</Typography>
                </Breadcrumbs>

            <Box mt={4} sx={{ borderTop: 5, width: "100%", height: "100%" }} >
                <Card sx={{ width: "100%" }}>
                    <CardContent>
                    <Grid container justifyContent="flex-end" spacing={2}>
                            <Grid item xs={12} container justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    startIcon={<ReplyIcon />}
                                    onClick={() => {
                                        navigateToShippingList();
                                    }}
                                    sx={{
                                        fontWeight:'bolder',
                                        "&:hover": {
                                            background: "rgb(153, 46, 98)",
                                            color: "white"
                                        }
                                    }}
                                    >
                                        Back
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4} sx={{ flex: '1 0 auto' }}>
                                <Typography variant="h3" sx={{ marginTop: "3rem" }}>
                                    Tracking List
                                </Typography>
                                <Typography gutterBottom variant="h5" component="div" sx={{ color: "silver", marginBottom:"30px" }}>
                                    Track our shipment
                                </Typography>

                                <Card variant="outlined" sx={{width:"90%", backgroundColor:"#eef4fa"}}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={9} sx={{ flex: '1 0 auto' }}>
                                                <Typography color="text.secondary" gutterBottom>
                                                    Order ID:
                                                </Typography>
                                                <Typography variant="h4" gutterBottom>
                                                    <b>BA92123</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3} sx={{ flex: '1 0 auto'}}>
                                                <Box sx={{backgroundColor:"#96DED1"}}>
                                                    <Typography align="center" sx={{fontSize: 10, color:"blue"}}>On Delivery</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Typography variant="h6" component="div" color="text.secondary"><LocationOnIcon/> From</Typography>
                                        <Typography variant="h5" component="div" sx={{marginLeft:"30px"}}><b>Dr Soetembo Jember</b></Typography>
                                        <Typography variant="h6" component="div" color="text.secondary"><LocationOnIcon/> To</Typography>
                                        <Typography variant="h5" component="div" sx={{marginLeft:"30px"}}><b>Dr Manau Maninjau</b></Typography>
                                        <Divider sx={{width: '100%', margin:"20px"}}/>
                                        <Typography variant="h6" component="div" color="text.secondary">Customer</Typography>
                                        <Typography variant="h5" component="div">Cheryl Arema </Typography>

                                    </CardContent>
                                </Card>
                                <Card variant="outlined" sx={{width:"90%"}}>
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={9} sx={{ flex: '1 0 auto' }}>
                                                <Typography color="text.secondary" gutterBottom>
                                                    Order ID: 
                                                </Typography>
                                                <Typography variant="h4" gutterBottom>
                                                   <b>SD92129</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3} sx={{ flex: '1 0 auto'}}>
                                                <Box sx={{backgroundColor:"#96DED1"}}>
                                                    <Typography align="center" sx={{fontSize: 10, color:"blue"}}>On Delivery</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>                                        
                                        <Typography variant="h6" component="div" color="text.secondary"><LocationOnIcon/> From</Typography>
                                        <Typography variant="h5" component="div" sx={{marginLeft:"30px"}}><b>Hataa Malang</b></Typography>
                                        <Typography variant="h6" component="div" color="text.secondary"><LocationOnIcon/> To</Typography>
                                        <Typography variant="h5" component="div" sx={{marginLeft:"30px"}}><b>Mayjen Sungkono</b></Typography>
                                        <Divider sx={{width: '100%', margin:"20px"}}/>
                                        <Typography variant="h6" component="div" color="text.secondary">Customer</Typography>
                                        <Typography variant="h5" component="div">Lina Punk Asili </Typography>

                                    </CardContent>
                                </Card>
                                <Card variant="outlined" sx={{width:"90%"}}>
                                    <CardContent>                                        
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={9} sx={{ flex: '1 0 auto' }}>
                                                <Typography color="text.secondary" gutterBottom>
                                                    Order ID:
                                                </Typography>
                                                <Typography variant="h4" gutterBottom>
                                                    <b>QD55129</b>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} md={3} sx={{ flex: '1 0 auto'}}>
                                                <Box sx={{backgroundColor:"#96DED1"}}>
                                                    <Typography align="center" sx={{fontSize: 10, color:"blue"}}>On Delivery</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Typography variant="h6" component="div" color="text.secondary"><LocationOnIcon/> From</Typography>
                                        <Typography variant="h5" component="div" sx={{marginLeft:"30px"}}><b>Dr Wairimu Jemberli</b></Typography>
                                        <Typography variant="h6" component="div" color="text.secondary"><LocationOnIcon/> To</Typography>
                                        <Typography variant="h5" component="div" sx={{marginLeft:"30px"}}><b>Dr Ron Maninjau</b></Typography>
                                        <Divider sx={{width: '100%', margin:"20px"}}/>
                                        <Typography variant="h6" component="div" color="text.secondary">Customer</Typography>
                                        <Typography variant="h5" component="div">Aruba Mare </Typography>

                                    </CardContent>
                                </Card>
                                
                            </Grid>
    
                            <Grid item xs={12} md={8} sx={{ flex: '1 0 auto', marginBottom:"30px" }}>
                                <Typography variant="h3" sx={{ marginTop: "3rem" }}>
                                    Order ID: <b>SD92129</b>
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4} sx={{ flex: '1 0 auto' }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    <PersonIcon/> Customer
                                                </Typography>
                                                <Typography variant="h5" component="div">
                                                    Global Warehouse
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ flex: '1 0 auto' }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    <PhoneIcon/> Phone Number
                                                </Typography>
                                                <Typography variant="h5" component="div">
                                                     +254999174674774
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ flex: '1 0 auto' }}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                    <LocationOnIcon/> Address
                                                </Typography>
                                                <Typography variant="h5" component="div">
                                                    Kenya, Mombasa
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>

                                <iframe src="https://maps.google.com/maps?q=mombasa,whitesands+hotel&output=embed" width="100%"
                                        height="350"></iframe>

                                <Card variant="outlined" sx={{width:"100%"}}>
                                    <CardContent>
                                        <span sx={{color:"blue", backgroundColor:"cyan", marginLeft:"auto"}}>View more details <ArrowForwardIcon/></span>
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            Item List 
                                        </Typography>
                                   

                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell></TableCell>
                                                        <TableCell align="right"></TableCell>
                                                        <TableCell align="right"></TableCell>
                                                        <TableCell align="right"></TableCell>
                                                        <TableCell align="right"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>                                                   
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                        <TableCell align="left">Antiretroviral Drugs</TableCell>
                                                        <TableCell align="left">Global Warehouse</TableCell>
                                                        <TableCell align="left">50,000,000</TableCell>
                                                        <TableCell align="left">23/08/2023</TableCell>
                                                        <TableCell align="left"><PictureAsPdfIcon/><b>PDF</b></TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                        <TableCell align="left">Covid Vaccination</TableCell>
                                                        <TableCell align="left">Global Warehouse</TableCell>
                                                        <TableCell align="left">30,000,000</TableCell>
                                                        <TableCell align="left">27/08/2023</TableCell>
                                                        <TableCell align="left"><PictureAsPdfIcon/><b>PDF</b></TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                        <TableCell align="left">Condoms</TableCell>
                                                        <TableCell align="left">Global Warehouse</TableCell>
                                                        <TableCell align="left">37,000,000</TableCell>
                                                        <TableCell align="left">27/08/2023</TableCell>
                                                        <TableCell align="left"><PictureAsPdfIcon/><b>PDF</b></TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                        <TableCell align="left">HIV Testing Kits</TableCell>
                                                        <TableCell align="left">Global Warehouse</TableCell>
                                                        <TableCell align="left">45,000,000</TableCell>
                                                        <TableCell align="left">27/08/2023</TableCell>
                                                        <TableCell align="left"><PictureAsPdfIcon/><b>PDF</b></TableCell>
                                                    </TableRow>
                                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                                        <TableCell align="left">UID Kits</TableCell>
                                                        <TableCell align="left">Global Warehouse</TableCell>
                                                        <TableCell align="left">32,000,000</TableCell>
                                                        <TableCell align="left">27/08/2023</TableCell>
                                                        <TableCell align="left"><PictureAsPdfIcon/><b>PDF</b></TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                    </CardContent>
                                </Card>

                            </Grid>  {/* end of main grid for the 2 sections */}
                        </Grid>
                    </CardContent>
                </Card>
            </Box>
            
        </div>
    );
}

export default ShippingTracking;
