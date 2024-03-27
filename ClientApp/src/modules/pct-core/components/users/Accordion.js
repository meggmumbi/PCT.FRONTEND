import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSites, getSite } from "../../apis/mis-endpoints";
import _ from "lodash";
import { InputLabel, Select, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

export default function BasicAccordion({ site, expanded, handleAccordionChange, userRoles, updateUserRoles, selectedRole }) {


    const [roled, setRole] = useState(0);
    const [temp, setTemp] = useState('');
    const [data, setData] = useState({
        id: null,
        name: null,
        description: null,
        locations: [],
        roles: []
    })

    const {
        isLoading,
        isError
    } = useQuery(["getSite", site.id], getSite,
        {
            onSuccess: (response) => {
                setData(response.data);
                setTemp('ok');
                if (selectedRole != null) {
                    setRole(selectedRole);

                }

            }
        }
    );

    const handleChange = (e) => {
        setRole(e.target.value)
        let temp = [];
        if (e.target.value !== 0) {
            temp.push({ roleId: e.target.value, tenantId: site.id })
        }
        updateUserRoles(temp, site.id);
    }

    const handleRadioChange = (e) => {
        setRole(e.target.value)
        let temp = [];
        if (e.target.value !== 0) {
            temp.push({ roleId: e.target.value, tenantId: site.id})
        }
        updateUserRoles(temp, site.id);
    }

    return (

        <Accordion expanded={true} onChange={handleAccordionChange(site.id)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <RadioGroup
                    onChange={(e)=>{handleRadioChange(e)}}
                >
                    {data?.roles.map((role) => (
                        <FormControlLabel
                            key={role.id}
                            value={role.id}
                            control={<Radio />}
                            label={role.name}
                            checked={roled===role.id}
                        />
                    ))}
                </RadioGroup>


                {/* <Typography  variant="h6" sx={{fontWeight:'bold'}}>{site.name}</Typography> */}
            </AccordionSummary>
            {/* <AccordionDetails>
                    <InputLabel id="demo-select-small-label">Role</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={role}
                        label="Role"
                        onChange={handleChange}
                        sx={{
                            width:'100%',
                        }}
                    >
                        <MenuItem value={0}>
                            <em>None</em>
                        </MenuItem>
                        {data?.roles.map(role => (
                            <MenuItem value={role.id} key={role.key}>{role.name}</MenuItem>
                            ))}

                    </Select>
                </AccordionDetails> */}
        </Accordion>

    );
}
