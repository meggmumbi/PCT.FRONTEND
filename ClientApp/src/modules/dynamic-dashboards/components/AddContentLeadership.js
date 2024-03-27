import React from "react";
import { Avatar as MuiAvatar, Divider as MuiDivider, Grid, Typography } from "@mui/material";
import {NavLink} from "react-router-dom";
import styled from "@emotion/styled";
import {spacing} from "@mui/system";

const Divider = styled(MuiDivider)(spacing);

const Avatar = styled(MuiAvatar)`
  display: inline-block;
  height: 120px;
  width: 120px;
`;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        color: 'blue',
    },
}));

const AddContentLeadership = ({ isLoadingLeadershipByRol,  dataLeadershipByRol}) => {
    if (isLoadingLeadershipByRol) { return; }
    if (dataLeadershipByRol && dataLeadershipByRol.data) {
        return (
            <Grid container direction="row" alignItems="center" mb={2} spacing={12}>
                {dataLeadershipByRol.data.map((element, i) => {
                    return (
                        <React.Fragment key={i}>
                            <Grid item md={3}>
                                <Avatar alt="{element.name}" src={element.image} />
                            </Grid>
                            <Grid item md={8} mx={3}>
                                <Grid container direction="column" alignItems="left" mb={2}>                                    
                                     <StyledNavLink to='/home/leadership-profile' state={{id: element.id}}>
                                        <Grid item>
                                            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{element.name}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography sx={{ fontSize: 18 }}>{element.position}</Typography>
                                        </Grid>
                                    </StyledNavLink>
                                </Grid>
                            </Grid>
                            <Divider />
                        </React.Fragment>
                    );
                })}
            </Grid>
        );
    }
};
export default AddContentLeadership;
