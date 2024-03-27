import React from 'react';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from '@mui/material/Checkbox';
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { MenuItem, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import {useEffect, useState} from "react";
import {getAllProducts, getFamilies} from "../../../apis/product-catalog";
import _ from "lodash";
import {styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from 'react-toastify'; 
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import FormatListBulletedSharpIcon from '@mui/icons-material/FormatListBulletedSharp';
import AsyncImage from '../../AsyncImage';
import { getFromLocalStorage, setLocalStorage } from '../../../../../common/utils/LocalStorage';
import { useNavigate } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    minHeight:'50px',
    color: theme.palette.text.secondary,
    boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

const ImageItem = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight:'130px',
    color: theme.palette.text.secondary,
    display:'flex',
    justifyContent:'center',
    alignContent:'center',
    direction:'row'
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText('#845EBC'),
    backgroundColor: '#845EBC',
    '&:hover': {
        backgroundColor: '#E19133',
        color:'#fff'
    },
}));


const  RequisitionProductsList = (props) => {

    const {
        destinationCountry,
        destinationOrganisation,
        requisitionDate,
        email,
        requisitionType,
        isApproved,
        isRequisitioned,
        description,
        code
    }  = getFromLocalStorage('requisition-general-details') || {};
    
    const [productFamilies, setProductFamilies] = useState([]);
    const [selectedProductFamilies, setSelectedProductFamilies] = useState(["ARVs"]);
    const [products,setProducts]=useState();
    const [selectedItems, setSelectedItems] = useState([]);
    const [productSearchText, setProductSearchText] = useState();
    const [productsPerpage, setProductsPerPage] = useState();
    const [sortingOrder, setSortingOrder] = useState();

    const [cartItems, setCartItems] = useState([]);
        
    const navigate = useNavigate();

    const productImage = (item)=>{
        return item.values && item.values.IMAGE_ATTRIBUTE && item.values.IMAGE_ATTRIBUTE.length > 0 ? item.values.IMAGE_ATTRIBUTE[0]._links.download.href : "";
    }

    const handleProductSelected = (checked, item) => {

        if(!checked) {
            let newArray = selectedItems.filter((it) => {
               return it !== item.identifier
            })
            setSelectedItems(newArray);

            let index; 
            cartItems?.filter((it, _index) => {
               if(it.productName == item.identifier){
                   index = _index;
               }
            })
            cartItems?.splice(index, 1);
            toast.success(`Product ${item.identifier} removed from cart!`, {
                position: 'top-right',
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {

            cartItems?.push({
                productCode: item.identifier,
                productName: item.identifier,
                productCategory:item.family,
                quantity: parseInt(1),
                unitPrice:parseFloat(item.values.price_reference[0].data[0].amount),
                estimatedDeliveryCost:null,
                estimatedLeadTime:null,
                deliveryDate:null,
                transportMode:null,
                total: parseFloat(item.values.price_reference[0].data[0].amount),
            });

            setSelectedItems([item.identifier, ...selectedItems]);
            toast.success(`Product ${item.identifier} added to cart successfully!`, {
                position: 'top-right',
                autoClose: 3000, 
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        setCartItems(cartItems)
        setLocalStorage('requisition-order-cart-items', cartItems)
    }
    const orderHeaderCss = {
        fontSize:"34px",
        fontWeight:"bolder",
        textAlign:"left",
        margin:"10px 15px"
    }

    const headerTopGrid = {
        border:"none",
        mariginBotton:"10px",
        boxShadow:"5px"
    }
    const orderHeaderCssSmall = {
        fontSize:"24px",
        fontWeight:"normal",
        textAlign:"left",
        margin:"10px 15px"
    }

    useEffect(()=>{
        getFamilies({}).then((families)=>{
             setProductFamilies(_.map(families.data._embedded.items,(item)=>{
                 return {code:item.code,name:item.code}
             }));
         })
         
 
     },[]);

     useEffect(() => {
        let _items = getFromLocalStorage('requisition-order-cart-items');
        _items && setCartItems(_items);
     }, [])
 
    useEffect(() => {
        getAllProducts({queryKey:["getFamilyProducts",selectedProductFamilies,productSearchText]}).then((res)=>{
            setProducts(res.data.data);
        })
    }, [selectedProductFamilies, productSearchText])

    return (
                <>
                <ToastContainer />
                <Item style={{padding:"10px", width:"100%"}}>
                <Grid container style={headerTopGrid}>
                    <Grid item xs={6} >
                     <div style={orderHeaderCss} >Create New Order </div> 
                     <div style={orderHeaderCssSmall} ><small>Add Products to Cart </small> </div> 
                     <div style={orderHeaderCssSmall}  >
                        <b style={{textTransform:"uppercase", fontSize:"18px"}}>
                            {destinationCountry} . { destinationOrganisation} . {code} . {requisitionDate}
                        </b> </div> 
                    </Grid>
                   
                    <Grid item xs={6}  >    
                     <div style={{
                        fontSize:"12px", 
                        float:"right", 
                        marginRight:"24px",
                        marginTop:"5px", 
                        fontWeight:"bold", opacity:"0.8"}} >Showing 1-20 of {products?.length} </div>
                     
                    </Grid>
                    <Grid xs={12}><hr style={{width:"98%", margin:"0 auto"}} /></Grid>
                    <Grid xs={12}  container>
                            <Grid 
                                style={{margin:"10px"}}  
                                xs={!!cartItems?.length ? 1 : 2 } 
                                alignItems="top">
                                <AppsRoundedIcon fontSize="large"/>
                                <FormatListBulletedSharpIcon fontSize="large"/>
                            </Grid>

                            <Grid item xs={2}  >
                                <Card >
                                    <CardContent >
                                        <FormControl fullWidth sx={{marginTop:'10px'}}>
                                            <InputLabel id="product-family-select-label">Product Family</InputLabel>
                                            <Select
                                                labelId="product-family-select-label"
                                                id="product-family-select"
                                                value={selectedProductFamilies}
                                                label={'Product Family'}
                                                variant="standard"
                                                onChange={(event)=>{
                                                    setSelectedProductFamilies(event.target.value);
                                                }}
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem key={`product-family-select-00-default`}  value='0'>
                                                    Select Family
                                                </MenuItem>
                                                {productFamilies.map((item)=>(
                                                    <MenuItem key={`product-family-select-${item.code}`} value={item.code}>{item.code}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={2}style={{marginTop:"10px"}} >
                                <Card >
                                    <CardContent >
                                        <FormControl fullWidth sx={{marginTop:'10px', color:"#e5bc94"}}>
                                            <TextField
                                                labelId="product-search-label"
                                                id="product-search-text"
                                                value={null}
                                                label={'Search for Product by name'}
                                                variant="outlined"
                                                onChange={(event)=>  setProductSearchText(event.target.value)  }
                                                style={{borderRadius:"10px !important"}}
                                                InputProps={{
                                                    style: {
                                                      borderRadius: "30px",
                                                      color:"#e5bc94"
                                                    }
                                                }}
                                                InputLabelProps={{
                                                    style: { color: '#e5bc94' },
                                                  }}

                                            >
                                            </TextField>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={2}  >
                                <Card >
                                    <CardContent >
                                        <FormControl fullWidth sx={{marginTop:'10px'}}>
                                            <InputLabel id="product-sorting-label">Default Sorting</InputLabel>
                                            <Select
                                                labelId="product-sorting-label"
                                                id="product-sorting-select"
                                                value={null}
                                                label={'Default Sorting'}
                                                variant="standard"
                                                onChange={(event)=> setSortingOrder(event.target.value)}
                                                MenuProps={MenuProps}
                                            >
                                                {["Product Family", "Product Name", "Product Cost"].map((item)=>(
                                                    <MenuItem key={`product-sorting-select-${item}`} value={item}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={2}  >
                                <Card >
                                    <CardContent >
                                        <FormControl fullWidth sx={{marginTop:'10px'}}>
                                            <InputLabel id="product-perpage-label">20 Products/Page</InputLabel>
                                            <Select
                                                labelId="product-perpage-label"
                                                id="product-perpage-select"
                                                value={null}
                                                label={'Products Per Page'}
                                                variant="standard"
                                                onChange={(event)=>setProductsPerPage(event.target.value)}
                                                MenuProps={MenuProps}
                                            >
                                                {["20 Products/Page", "50 Products/Page", "100 Products/Page"].map((item)=>(
                                                    <MenuItem key={`product-perpage-select-${item}`}   value={item}>{item}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </Grid>
                            { !!cartItems?.length > 0 &&         
                            <Grid item xs={2} >
                                <Card sx={{boxShadow:'none'}}>
                                    <CardContent style={{textAlign:"right"}}>
                                        <Typography sx={{ fontSize: 1, color:'#845EBC',fontWeight:'bold' }}>
                                            Cart Items ( { cartItems.length } )
                                        </Typography>
                                        <Typography sx={{ mb: 1.5,fontSize: 16,color:'#1570EF',fontWeight:'bold' }}>
                                            Cost : ${_.sumBy(cartItems, 'total').toFixed(2)}
                                        </Typography>
                                    <ColorButton variant="contained" onClick={()=>
                                        {  navigate('/psa/requisition-order-cart'); }
                                    }>View Cart</ColorButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        }

                        </Grid>
                </Grid>
                </Item>
                <Grid item xs={12} style={{width:"100%", maxWidth:"100%", marginTop:10}} >
                        <Grid sx={{minHeight:'500px', border:"none"}} >
                            <Grid container direction="row">
                            {products?.map((item, index) => (
                               
                                <Grid item style={{ 
                                    width:"18.94%",
                                    margin: index % 5 === 0 ? "": "auto 10px",
                                    marginBottom:"40px"
                                    }} >  
                                    <ImageItem>
                                        <Card sx={{ 
                                            padding:'10px',
                                            boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important",
                                            width:"100%"
                                            }}>
                                            <Typography sx={{color:'#586A84',fontSize:8,  wordWrap: 'break-word'}}  md={{fontSize:8}}>
                                                <div className="row">
                                                   <div className="col-10" style={{padding:"0px 10px 0px"}}>
                                                      {item.identifier}
                                                   </div>
                                                   <div className="col-2" style={{padding:"0px"}}>
                                                    <Checkbox 
                                                       style={{padding:"0px"}}
                                                       onChange={(event) =>  handleProductSelected(event.target.checked, item)}  
                                                       color="warning"
                                                       checked={cartItems?.filter((it) => it.productName === item.identifier).length > 0}
                                                       size="small" />
                                                    </div>
                                                </div>
                                            </Typography>
                                            <Typography sx={{ mb: 1.5,fontSize: "0.8em",color:'#E47200',fontWeight:'bold' }}>
                                                {item.family}
                                            </Typography>
                                            <CardContent sx={{display:'flex', justifyContent:'center',alignContent:'center', direction:'row'}}>
                                                <AsyncImage src={productImage(item)} />
                                            </CardContent>
                                            <Grid container>
                                                <Grid xs={6} >Estimated Price </Grid>
                                                <Grid container spacing={1} xs={6} justify="flex-end" >
                                                    <Grid item style={{textAlign:"right", fontWeight:600}}>
                                                        {item?.values?.price_reference[0]?.data[0]?.currency}
                                                    </Grid>
                                                    <Grid item style={{textAlign:"left", fontWeight:600}}>
                                                        {item?.values?.price_reference[0]?.data[0]?.amount}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </ImageItem>
                                </Grid>
                            ))}

                    </Grid>
                    </Grid>
                </Grid>
        </>

    );
}

export default RequisitionProductsList;
