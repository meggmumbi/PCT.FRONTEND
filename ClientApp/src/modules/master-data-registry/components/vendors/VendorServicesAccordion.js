import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import CustomMenuTree from "../../../../components/MenuTree/CustomMenuTree";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { getCategoryByGroupId } from '../../apis/category';
import { getLocations } from '../../apis/location';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

export default function VendorServicesAccordion({ service, expanded, handleAccordionChange, action, values = [] }) {

    const [locations, setLocations] = useState([]);
    const [selected, setSelected] = useState([]);



    const {
        isLoadings,
        isErrors
    } = useQuery(["getLocationsList"], getLocations,
        {
            onSuccess: (response) => {
                let temp = [];
                response.data.forEach(i => {
                    temp.push({
                        id: i.id,
                        name: i.name,
                        parent_id: i.parent
                    });
                })
                setLocations(temp);
            }
        }
    );



    const handleSelect = (items) => {
        if (items.length > 0) {
            let temp = [];
            items.map(item => temp.push({ location: item, service: service.id }))
            action(service.id, temp);
        } else {
            action(service.id, []);
        }

    }

    return (
        <Item elevation={3} sx={{ marginTop: '0.5rem' }}>
            <Accordion expanded={expanded === `${service.id}`} onChange={handleAccordionChange(service.id)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    sx={{ backgroundColor: '#595959', color: '#fff' }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{service.name} - Services</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <CustomMenuTree
                        showTitle={false}
                        title={"Locations"}
                        menuTreeItems={locations}
                        orderField={'order_id'}
                        selectedItem={handleSelect}
                        selectLevels={[]}
                        defaultSelected={values}
                        numberOfItems={'multi'}
                    />
                </AccordionDetails>
            </Accordion>
        </Item>
    );
}
