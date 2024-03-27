import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import TransferList from "../../../../components/TransferList";
import ReplyIcon from "@mui/icons-material/Reply";
import { useEffect } from "react";
import _ from "lodash";
import {
  getAllSites, getRole, getTenantPermissions, saveRole, updateRole,
} from "../../apis/mis-endpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import UploadIcon from "@mui/icons-material/Upload";
import Autocomplete from '@mui/material/Autocomplete';
import {useNavigate, useParams} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  minHeight: "20rem",

  // boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Name is a required field";
  } else if (values.name.length > 255) {
    errors.name = "Name length is limited to 255 characters";
  }
  if (values.description !== null && values.description.length > 255) {
    errors.description = "Max length for description is 255 characters";
  }
  if (values.permissions.length <= 0) {
    errors.permissions = "Add at least 1 permission to the role";
  }
  return errors;
};

function Role(props) {
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [temp, setTemp] = useState("");
  const [expanded, setExpanded] = React.useState(true);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantName,setTenantName] = useState(null)
  let { id } = useParams();
  let { id:urlId } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState({
    id: null,
    name: null,
    category: null,
    description: null,
    permissions: [],
    tenantId:null,
  });


  const { data, isLoading, isError } = useQuery(
      ["getRole", urlId],
      getRole,
      {
        enabled: !!urlId,
        onSuccess: (response) => {
          //Replace to only update values needed
          formik.setValues({
            id:response.data.id,
            name: response.data.name,
            description: response.data.description ? response.data.description : "",
            tenantId: response.data.tenantId,
            permissions: response.data.permissions
          });
          setSelectedTenant({id:response.data.tenantId})
        }
      }

  );





  const { isLoading:tenantIsLoading, isError:tenantIsError,refetch,data:tenants } = useQuery(["getAllSitesList"], getAllSites);

  useEffect(()=>{
    if(!!id && !isLoading && !isError && !tenantIsLoading && !tenantIsError){
      try {
        setTenantName( _.find(tenants.data,{id:data.data.tenantId}).name)
      }catch (e) {
        console.log("set tenant name error",e)
      }
    }
  },[tenants,data])

  /*  const {permIsLoading, permIsError,data:tenantPermissions}=useQuery(["getTenantPermission",selectedTenant], getTenantPermissions,
        {
          enabled:!!selectedTenant
        }
    );*/

  useEffect(() => {
    if (props.row) {
      console.log("Props row full of tenants ", props.row);
      const permissionItems = permissions.filter((item) =>
          props.row.permissions.some(
              (permission) => permission.permissionId === item.id
          )
      );
      const permissionItemsIds = permissionItems.map((item) => item.id);
      setSelectedPermissions(
          permissionItems.length === 0 ? [] : permissionItems
      );

      const sitesItems = tenants.filter((item) =>
          props.row.roleTenants.some((tenant) => tenant.tenantId === item.id)
      );
      const sitesItemsIds = sitesItems.map((item) => item.id);
      setSelectedSites(sitesItemsIds.length === 0 ? [] : sitesItemsIds);
      console.log("sites loaded");

      setRole({
        id: props.row.id,
        name: props.row.name,
        category: props.row.category,
        description: props.row.description,
        permissions: permissionItemsIds,
        sites: sitesItemsIds,
      });
    }
  }, [permissions]);

  useEffect(() => {
    if(selectedTenant!=null){
      getTenantPermissions({ queryKey: ['getTenantPermission',selectedTenant] }).then((res) => {
        const sortedPermissions = _.map(res.data, (item) => {
          const sortOrder = item.name.split(" ").slice(1).join(" ");
          return {
            code: item.code,
            name: item.name,
            id: item.id,
            sortOrder: sortOrder,
          };
        }).sort((a, b) => a.sortOrder.localeCompare(b.sortOrder));

        let temp = [];
        formik.values.permissions.map(permission =>{
          try {
            let perm = _.find(sortedPermissions,{id:permission.permissionId});
            temp.push({
              code: perm.code,
              id:permission.permissionId,
              name:perm.name
            })
          }catch (e) {
            console.log(e)
          }
        });
        setSelectedPermissions(temp)

        setPermissions(sortedPermissions);
      });
    }
  }, [selectedTenant]);

  const handleChange = (e) => {
    e.preventDefault();
    role[e.target.id] = e.target.value === "" ? null : e.target.value;
    setRole(role);
    //setEnableSubmit(_.isEmpty(validate(data)));
    setTemp(e.target.value);
  };



  const updateRolePermissions = (items) => {
    setSelectedPermissions(items.length === 0 ? [] : items);
    role.permissions = items.length === 0 ? [] : items.map((item) => item.id);
    setRole(role);
  };






  const saveRoleMutation = useMutation({ mutationFn: saveRole });
  const updateRoleMutation = useMutation({ mutationFn: updateRole });
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      permissions: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required")
    }),
    onSubmit: async (values) => {
      try {
        if(urlId !== undefined){
          values.id = urlId;
          values.tenantId=selectedTenant.id;
          values.permissions = selectedPermissions.map((p)=>p.id);
          await saveRoleMutation.mutateAsync(values);//replace with
        }else{
          values.tenantId=selectedTenant.id;
          values.permissions = selectedPermissions.map((p)=>p.id);
          await saveRoleMutation.mutateAsync(values);
        }
        navigate("/MISAdministration/roles");
        toast.success(`Successfully saved tenant`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (e) {
        toast.error("Error adding tenant", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    },
  });


  return (
      <Box>
        <Box>
          <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
            <Card mb={6} square={true} sx={{ py: 5, pl: 2 }}>
              <Grid container spacing={12}>
                <Grid item md={12} sx>
                  <Typography
                      variant="h1"
                      gutterBottom
                      display="inline"
                      sx={{ fontSize: "2rem" }}
                  >
                    {!!urlId?'Update Role Details':'Add Role'}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Enter role details below
                  </Typography>
                </Grid>
              </Grid>
            </Card>
            <Divider />
          </Paper>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Item elevation={3}>
            <Grid container spacing={1} sx={{ padding: "10px", display: "flex" }}>
              <Grid item xs={12} sm={6}>
                <Item elevation={3}>
                  <Grid
                      container
                      spacing={3}
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                  >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        sx={{ justifyContent: "left", alignItems: "center" }}
                    >
                      <InputLabel
                          sx={{
                            marginRight: "10px",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            fontWeight: 700,
                            width: "10rem",
                            fontSize: "1rem",
                            color: "#000",
                          }}
                      >
                        Name
                      </InputLabel>
                      <TextField
                          required
                          name="name"
                          id="name"
                          label="Name"
                          fullWidth
                          value={formik.values.name}
                          error={Boolean(formik.touched.name && formik.errors.name)}
                          helperText={formik.touched.name && formik.errors.name}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          sx={{
                            "& legend": { display: "none" },
                            "& .MuiInputLabel-shrink": {
                              opacity: 0,
                              transition: "all 0.2s ease-in",
                            },
                            marginTop: 2,
                          }}
                      />
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={12}
                        sx={{ justifyContent: "left", alignItems: "center" }}
                    >
                      <InputLabel
                          sx={{
                            marginRight: "10px",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            fontWeight: 700,
                            width: "10rem",
                            fontSize: "1rem",
                            color: "#000",
                          }}
                      >
                        Description
                      </InputLabel>
                      <TextField
                          id="description"
                          name="description"
                          label="Description"
                          fullWidth
                          multiline={true}
                          rows={5}
                          value={formik.values.description}
                          error={Boolean(formik.touched.description && formik.errors.description)}
                          helperText={formik.touched.description && formik.errors.description}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          sx={{
                            "& legend": { display: "none" },
                            "& .MuiInputLabel-shrink": {
                              opacity: 0,
                              transition: "all 0.2s ease-in",
                            },
                            marginTop: 2,
                          }}
                      />
                    </Grid>

                    <Grid item sm={12}>
                      <Typography variant="h1" gutterBottom display="inline" sx={{ fontSize: '1rem', color: '#000' }}>
                        Tenants
                      </Typography>

                      {!tenantIsLoading && !tenantIsError && tenants!== undefined ?(
                          <>
                            <Autocomplete
                                disablePortal
                                id="tenant-select"
                                options={tenants.data.map(t=>({label:t.name,name:t.name, id:t.id}))}
                                value={tenantName||selectedTenant}
                                renderInput={(params) => <TextField {...params} label={`Select Tenant`} />}
                                onChange={(e,value)=>setSelectedTenant(value)}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                }}
                                disabled={!!urlId}
                            />
                          </>

                      ):(
                          <>
                          </>
                      )}

                    </Grid>
                  </Grid>
                </Item>
              </Grid>
            </Grid>
          </Item>
          <Item elevation={3}>
            <Grid container spacing={1} sx={{ padding: "10px", display: "flex" }}>
              <Grid item xs={12} sm={6}>
                <Item elevation={3}>
                  <Grid
                      container
                      spacing={3}
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                  >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                    >
                      <Typography variant="h1" gutterBottom display="inline" sx={{ fontSize: '1rem', color: '#000' }}>
                        Permissions
                      </Typography>
                      <Typography variant="caption" display="block" gutterBottom>
                        Select the permissions that apply to the role
                      </Typography>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        sm={12}
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "center",
                        }}
                    >
                      {selectedTenant!=null && permissions ?(
                              <>
                                <TransferList
                                    allItems={_.orderBy(permissions, ["name"], ["asc"])}
                                    selectedItems={_.orderBy(
                                        selectedPermissions,
                                        ["name"],
                                        ["asc"]
                                    )}
                                    action={updateRolePermissions}
                                />
                              </>
                          )
                          :
                          <Item
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width:'100%'
                              }}>
                            <Typography variant="h3" gutterBottom>
                              Select tenant to list permissions
                            </Typography>
                          </Item>
                      }

                    </Grid>
                    <Grid item xl={12} xs={12} md={12}>
                      <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                      >
                        <Button
                            variant="contained"
                            sx={{
                              fontSize: '14px',
                              fontWeight: 'bolder',
                              backgroundColor: '#333333',
                            }}
                            startIcon={<ReplyIcon />}
                            onClick={() =>navigate(
                                `/MISAdministration/roles`
                            )}
                        >
                          Back
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                              fontSize: "14px",
                              fontWeight: "bolder",
                              backgroundColor: "#333333",
                              "&:hover": {
                                background: "#E19133",
                                color: "white",
                              },
                            }}
                            startIcon={<UploadIcon />}
                            type="submit"
                        >
                          Submit
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Item>
              </Grid>
            </Grid>
          </Item>
        </form>

      </Box>
  );
}

export default Role;
