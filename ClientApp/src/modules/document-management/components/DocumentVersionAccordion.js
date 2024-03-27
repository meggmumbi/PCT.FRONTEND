import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import {
    Box,
    Button as MuiButton,
    Card as MuiCard,
    CardContent as MuiCardContent, CircularProgress,
    Grid, InputLabel,
    Stack,
    TextField as MuiTextField,
    Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const TextField = styled(MuiTextField)(spacing);
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
export default function DocumentVersionAccordion({ version = 1, expanded, handleAccordionChange,handleFileChange,handleChange, action, values = [] }) {
    

    return (
        <Item elevation={3} sx={{ marginTop: '0.5rem' }}>
            <Accordion expanded={expanded === version} onChange={handleAccordionChange(version)}>

                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: '#595959', color: '#fff' }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Version - {version}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                            <InputLabel sx={{ marginRight: '10px', display: "flex", justifyContent: "right", alignItems: 'center', fontWeight: 700, width: '10rem', fontSize: '1rem', color: '#376fd0', }} >
                                Version
                            </InputLabel>
                            <TextField
                                name="version"
                                label="Version"
                                fullWidth
                                variant="outlined"                                
                                my={2}
                                
                                onChange={(event) => handleChange("version", event.target.value,{version})}
                            />

                        </Grid>
                        {/* <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                            <InputLabel sx={{ marginRight: '10px', display: "flex", justifyContent: "right", alignItems: 'center', fontWeight: 700, width: '10rem', fontSize: '1rem', color: '#376fd0', }} >
                                Link
                            </InputLabel>
                            <TextField
                                name="link"
                                label="Link"
                                fullWidth
                                variant="outlined"
                                
                                onChange={(event) => handleChange("filelink", event.target.value,{version})}
                                my={2}
                            />

                        </Grid> */}
                        <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                            <InputLabel sx={{ marginRight: '10px', display: "flex", justifyContent: "right", alignItems: 'center', fontWeight: 700, width: '10rem', fontSize: '1rem' }} >
                                Document
                            </InputLabel>
                            <Button component="label" variant="contained" startIcon={<CloudUploadIcon />} sx={{ width: '50rem', height: '15rem' }}>
                                Upload file
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                            </Button>

                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Item>
    );
}