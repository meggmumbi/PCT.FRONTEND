import React, { useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from "material-react-table";
import { Button, MenuItem, Container } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from '@mui/icons-material/Check';
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import DownloadIcon from "@mui/icons-material/Download";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useQuery } from "@tanstack/react-query";
import { getDocumentSelected } from "../apis/document-management";
import _ from "lodash"
import { useNavigate, useParams } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight: '130px',
    color: theme.palette.text.secondary,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

function DocumentDetails(props) {
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const [rowCount, setRowCount] = useState(0);
    let { id } = useParams();
    const globalTheme = useTheme();

    const navigate = useNavigate();

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });
    const { } = useQuery(["getDocumentSelected", id], getDocumentSelected, {
        onSuccess: (response) => {
            setData(response.data);
            console.log(response.data.files);
        },
    });
    const downloadFile = (file, fileName) => {
        const byteCharacters = atob(file);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/octet-stream' });

        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `${fileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };


    const columns = useMemo(
        () => [
            {
                accessorKey: 'fileName',
                header: 'File Name'
            },
            {
                accessorKey: 'version',
                header: 'File Version'
            }

        ],
        [],
    );
    const tableTheme = useMemo(

        () =>

            createTheme({

                palette: {
                    background: {
                        default: '#fff'
                    }
                }
            })
    );

    return (
        <div>
            <Box sx={{ flexGrow: 1, backgroundColor: '#fff', padding: '5px 5px 10px 5px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={0}>
                            <Grid item xs={4}>
                                <Card sx={{ boxShadow: 'none' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 18, color: '#1570EF', fontWeight: 'bold' }}>
                                            Document Name
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                            {data.documentName || ''}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                            <Divider orientation="vertical" variant="middle" flexItem>
                                -
                            </Divider>
                            <Grid item xs={4}>
                                <Card sx={{ boxShadow: 'none' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 18, color: '#44710A', fontWeight: 'bold' }}>
                                            Document Description
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                            {data.description || ''}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>
                            <Divider orientation="vertical" variant="middle" flexItem>
                                -
                            </Divider>
                            <Grid item xs={3}>
                                <Card sx={{ boxShadow: 'none' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 18, color: '#840821', fontWeight: 'bold' }}>
                                            Document Category
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                            {data.category?.name || ''}
                                        </Typography>

                                    </CardContent>
                                </Card>
                            </Grid>



                        </Grid>

                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '10px' }}>
                        <Item elevation={3}>
                            <ThemeProvider theme={tableTheme}>
                                <MaterialReactTable
                                    columns={columns}
                                    data={data.files || []}
                                    enableRowActions
                                    positionActionsColumn="last"
                                    renderRowActions={({ row, table }) => {
                                        return (
                                            <>
                                                <Button
                                                    startIcon={<DownloadIcon />}
                                                    size='large'
                                                    onClick={() => downloadFile(row.original.file, row.original.fileName)}
                                                >Download File</Button>

                                            </>
                                        )
                                    }}

                                />
                            </ThemeProvider>

                        </Item>


                    </Grid>
                </Grid>
            </Box>


        </div>



    );
}

export default DocumentDetails;
