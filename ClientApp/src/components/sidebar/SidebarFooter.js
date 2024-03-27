import React, { useState, useEffect, useContext } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import { Badge, Grid, Avatar, Typography } from "@mui/material";
//import {useMsal} from "@azure/msal-react";

// import useAuth from "../../hooks/useAuth";
import { UserInformation } from "../../index.js";

const Footer = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}
    ${(props) => props.theme.spacing(4)};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const FooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`;

const FooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.7rem;
  display: block;
  padding: 1px;
`;

const FooterBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)};
  span {
    background-color: ${(props) =>
      props.theme.sidebar.footer.online.background};
    border: 1.5px solid ${(props) => props.theme.palette.common.white};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

const SidebarFooter = ({ ...rest }) => {
  //const { accounts } = useMsal();
  //const user = accounts.length > 0 && accounts[0];
  const user = useContext(UserInformation);
  let userRole;
  if (user && user.idTokenClaims && user.idTokenClaims.roles && user.idTokenClaims.roles.length > 0) {
    userRole = user.idTokenClaims.roles[0];
  }

  const [ipAddress, setIpAddress] = useState("");
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
          // const response = await axios.get("https://api64.ipify.org/?format=json");
          // setIpAddress(response.data.ip.trim());
      } catch (error) {
          console.error("An error occurred on getPermissionsForUser:", error.message," Name:",error.name," Code: ",error.code);
      }
    };
    fetchIpAddress();
  }, [user]);

  return (
    <Footer {...rest}>
      <Grid container spacing={2}>
        <Grid item>
          <FooterBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            {!!user && <Avatar alt={user.name} />}
          </FooterBadge>
        </Grid>
        <Grid item>
          {!!user && (
            <div>
                <FooterText  variant="body2">{user.name}</FooterText>
                <FooterText id="user-username-footer" variant="body2" style={{ display: "none" }}>{user.username}</FooterText>
                {/*<FooterText id="user-id-footer" variant="body2" style={{ display: "none" }}>{user.localAccountId}</FooterText>*/} {/*disabled for security*/}
                {ipAddress && <FooterText id="user-ip-footer" variant="body2" style={{ display: "none" }}>{ipAddress}</FooterText>}
            </div>
          )}
          {<FooterSubText variant="caption">{userRole}</FooterSubText>}
        </Grid>
      </Grid>
    </Footer>
  );
};

export default SidebarFooter;
