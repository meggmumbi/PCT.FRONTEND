import React, {useContext, useEffect, useState,useMemo, useRef} from "react";
import {toast, ToastContainer} from "react-toastify";
import {Helmet} from "react-helmet-async";
import {
    Box,
    Breadcrumbs,
    Button as MuiButton,
    Card as MuiCard,
    CardContent as MuiCardContent,
    CircularProgress,
    FormControl,
    FormLabel,
    Grid, InputLabel,
    Link,
    MenuItem,
    Paper, Select,
    Stack,
    TextField as MuiTextField,
    Typography,
    useTheme,
} from "@mui/material";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {SiteContext} from "../../../../index";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useFormik} from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import {spacing} from "@mui/system";
import MaterialReactTable from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplyIcon from "@mui/icons-material/Reply";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {getVersion,postVersion,updateVersion } from "../../apis/data-import";
import UploadIcon from "@mui/icons-material/Upload";
import CSVReader from "../data-upload/CSVUploadComponent";
import _ from "lodash";



const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);


const themeCustom = createTheme({
    palette: {
        custom_black: {
            main: "#000000",
            contrastText: "#FFFFFF",
        },
        custom_green: {
            main: "#23A295",
            contrastText: "#FFFFFF",
        },
    },
});

function TemplateVersion(props) {
    const [enableUpload,setEnableUpload] = useState(false);
    const siteContext = useContext(SiteContext);
    let { id } = useParams();

    const { data:version, isLoading, isError } = useQuery(
        ["getVersion", props.id],
        getVersion,
        {
            enabled: !!props.id,
            onSuccess: (response) => {
                //Replace to only update values needed
                templateFormik.setValues({
                    id:response.data.id,
                    versionName: response.data.versionName,
                    description: response.data.description,
                    templateId:id,
                    tenantId: siteContext.selectedSite.id,
                    fields:response.data.fields
                })
            }
        }
    );


    useEffect(()=>{
        if(props.versionData !== undefined){
            templateFormik.setFieldValue("tempId",props.versionData.tempid);
            templateFormik.setFieldValue("versionName",props.versionData.versionName);
            templateFormik.setFieldValue("description",props.versionData.description);
            templateFormik.setFieldValue("fields",props.versionData.fields);
        }
    },[props.versionData])

    const postMutation = useMutation({ mutationFn: postVersion });
    const updateMutation = useMutation({ mutationFn: updateVersion });

    const templateFormik = useFormik({

        initialValues: {
            versionName: "",
            description: "",
            templateId:id,
            tenantId: siteContext.selectedSite.id,
            fields:[]
        },
        validationSchema: Yup.object().shape({
            versionName: Yup.string().required("Required"),
            description: Yup.string().required("Required"),
            tenantId: Yup.string().required("Required")
        }),

        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                if (props.templateId) {
                    if(values.id){
                        await updateMutation.mutateAsync(values);
                    }else{
                        delete values.tempId;
                        await postMutation.mutateAsync(values);
                    }
                    props.action('','template')
                } else {
                    //await postMutation.mutateAsync(values);
                    props.versionUpdate(values)
                    props.action('','template')
                }
                toast.success("Version has been added", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });


            } catch (error) {
                toast.error(error.response.error, {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        },
    });


    const dataUpdate = (items)=>{
        let list = [];
        items.headers.map(header => list.push({ fieldName: header, fieldType: null}));
        templateFormik.setFieldValue("fields",list);
    }
    const updateFieldType = (e)=>{
        let findIndex = _.findIndex(templateFormik.values.fields, {fieldName:e.target.name});
        const fieldList = templateFormik.values.fields;
        let obj = templateFormik.values.fields[findIndex]
        obj.fieldType= e.target.value
        fieldList.splice(findIndex, 1, obj)
        templateFormik.setFieldValue("fields",fieldList);
    }
    return (
        <>
            <Grid container spacing={3} alignItems="stretch">
                <Grid item md={12} style={{ display: "flex", width: "100%" }}>
                    <Paper
                        square={true}
                        elevation={8}
                    >
                        <form onSubmit={templateFormik.handleSubmit}>
                            <Card mb={12}>
                                <CardContent>
                                    {templateFormik.isSubmitting ? (
                                        <Box display="flex" justifyContent="center" my={6}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <>
                                            <Box>
                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                >
                                                    <Grid item sx={6} md={6}>
                                                        <FormControl
                                                            sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                                                            size="medium"
                                                        >
                                                            <FormLabel
                                                                style={{fontSize: "16px", color: "#000", fontWeight: "bold",}}
                                                            >
                                                                Version Name*
                                                            </FormLabel>
                                                            <TextField
                                                                name="versionName"
                                                                label="Version Name"
                                                                value={templateFormik.values.versionName}
                                                                error={Boolean(
                                                                    templateFormik.touched.versionName && templateFormik.errors.versionName
                                                                )}
                                                                fullWidth
                                                                helperText={
                                                                    templateFormik.touched.versionName && templateFormik.errors.versionName
                                                                }
                                                                onBlur={templateFormik.handleBlur}
                                                                onChange={templateFormik.handleChange}
                                                                variant="outlined"
                                                                sx={{
                                                                    borderRadius: "10px",
                                                                    '& legend': { display: 'none' },
                                                                    '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                                                }}
                                                                my={2}
                                                            />
                                                        </FormControl>

                                                        <FormControl
                                                            sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                                                            size="medium"
                                                        >
                                                            <FormLabel
                                                                style={{
                                                                    fontSize: "16px",
                                                                    color: "#000",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                Description
                                                            </FormLabel>
                                                            <TextField
                                                                name="description"
                                                                label="Description"
                                                                value={templateFormik.values.description}
                                                                error={Boolean(
                                                                    templateFormik.touched.description &&
                                                                    templateFormik.errors.description
                                                                )}
                                                                fullWidth
                                                                helperText={
                                                                    templateFormik.touched.description &&
                                                                    templateFormik.errors.description
                                                                }
                                                                onBlur={templateFormik.handleBlur}
                                                                onChange={templateFormik.handleChange}
                                                                multiline
                                                                variant="outlined"
                                                                sx={{
                                                                    borderRadius: "10px",
                                                                    marginTop: 2,
                                                                    '& legend': { display: 'none' },
                                                                    '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                                                }}
                                                                rows={5}
                                                                my={2}
                                                            />
                                                        </FormControl>

                                                        {!props.id &&
                                                            <FormControl
                                                                sx={{ m: 1, width: "100%", marginBottom: "20px",paddingBottom:"30px" }}
                                                                size="medium"
                                                            >
                                                                <FormLabel
                                                                    style={{
                                                                        fontSize: "16px",
                                                                        color: "#000",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >
                                                                    Template Upload
                                                                </FormLabel>
                                                                <div style={{height:"70px", marginTop:"10px"}}>
                                                                    <CSVReader setData={dataUpdate} action={setEnableUpload}/>
                                                                </div>
                                                            </FormControl>
                                                        }

                                                    </Grid>
                                                    <Grid item sm={12}>
                                                        <Box>
                                                            <Paper square={true} elevation={8}>
                                                                <Grid
                                                                    container
                                                                >
                                                                    <Grid item xs={12} md={12} >
                                                                        <Grid container direction="row" justifyContent="space-between" alignItems="center" item p={2} sx={{borderBottom:'2px dotted #eee', paddingBottom:'5px'}}>
                                                                            <Grid item xs={12} md={8} >
                                                                                <Typography variant="h4" component="h2" sx={{fontWeight:'bold'}}>
                                                                                    Data Field Name
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={12} md={4} >
                                                                                <Typography variant="h4" component="h2" sx={{fontWeight:'bold'}}>
                                                                                    Data Type
                                                                                </Typography>
                                                                            </Grid>
                                                                        </Grid>

                                                                    </Grid>
                                                                    <Grid item xs={12} md={12} >
                                                                        <Grid
                                                                            container
                                                                            sx={{ borderRight:'1px solid #eee',borderLeft:'1px solid #eee',marginBottom:5}}
                                                                        >

                                                                            {templateFormik.values.fields.map(field=>(
                                                                                <Grid container direction="row" justifyContent="space-between" alignItems="center" item p={2} sx={{borderBottom:'1px solid #eee', paddingBottom:'5px'}}>
                                                                                    <Grid item xs={12} md={8} >
                                                                                        <InputLabel
                                                                                            sx={{
                                                                                                marginRight: '10px',
                                                                                                display: "flex",
                                                                                                justifyContent: "left",
                                                                                                alignItems: 'center',
                                                                                                fontWeight: 700,
                                                                                                fontSize: '1rem',
                                                                                                color: '#000',
                                                                                            }}
                                                                                        >
                                                                                            {field.fieldName}
                                                                                        </InputLabel>
                                                                                    </Grid>
                                                                                    <Grid item xs={12} md={4} >
                                                                                        <Select
                                                                                            name={field.fieldName}
                                                                                            id={field.id}
                                                                                            value={field.fieldType}
                                                                                            label={field.fieldName}
                                                                                            onChange={(e)=>updateFieldType(e)}
                                                                                            inputProps={{ 'aria-label': 'Without label' }}
                                                                                            sx={{
                                                                                                '& legend': { display: 'none' },
                                                                                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                                                                                width:'100%'
                                                                                            }}
                                                                                            displayEmpty
                                                                                        >
                                                                                            <MenuItem value={null}>Select</MenuItem>
                                                                                            <MenuItem value={'string'}>String</MenuItem>
                                                                                            <MenuItem value={'number'}>Number</MenuItem>
                                                                                            <MenuItem value={'date'}>Date</MenuItem>
                                                                                        </Select>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            ))}
                                                                        </Grid>
                                                                    </Grid>


                                                                </Grid>


                                                            </Paper>

                                                        </Box>
                                                    </Grid>

                                                </Grid>

                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <Button
                                                        variant="contained"
                                                        startIcon={<ReplyIcon />}
                                                        onClick={() =>props.action('','template') }
                                                        sx={{
                                                            fontWeight: 'bolder',
                                                            backgroundColor: '#333333',
                                                            "&:hover": {
                                                                background: "#333333",
                                                                color: "white"
                                                            }
                                                        }}
                                                    >
                                                        Back
                                                    </Button>

                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        startIcon={<UploadIcon />}
                                                        sx={{
                                                            fontWeight: 'bolder',
                                                            backgroundColor: '#333333',
                                                            "&:hover": {
                                                                background: "#333333",
                                                                color: "white"
                                                            }
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </form>
                    </Paper>
                </Grid>
            </Grid>


        </>
    );
}

export default TemplateVersion;
