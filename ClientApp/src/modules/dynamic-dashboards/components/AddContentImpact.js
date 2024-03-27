import React from "react";
import {
    Avatar as MuiAvatar,
    Box,
    Card as MuiCard, CardContent as MuiCardContent,
    CardMedia,
    Divider as MuiDivider,
    Grid,
    Typography
} from "@mui/material";
import {NavLink} from "react-router-dom";
import styled from "@emotion/styled";
import {spacing} from "@mui/system";

const Divider = styled(MuiDivider)(spacing);
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const Avatar = styled(MuiAvatar)`
  display: inline-block;
  height: 80px;
  width: 80px;
`;

const AddContentImpact = ({ isLoadingImpactByRol, dataImpactByRol }) => {
    if (isLoadingImpactByRol) { return; }
    if (dataImpactByRol && dataImpactByRol.data) {
        return dataImpactByRol.data.map((element, i) => (
            <Box sx={{ p: 2 }} border={1} borderColor="lightgrey" key={i}>
                <Card sx={{ display: 'flex' }}>
                    <CardMedia component="img" sx={{ width: 300 }} image={element.image} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {element.title}
                            </Typography>
                            <Typography variant="body2" component="div">
                                {element.description}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
            </Box>
        ))
    }
};
export default AddContentImpact;
