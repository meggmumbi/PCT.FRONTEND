import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import { ReactComponent as Logo } from "../vendor/logo.svg";
import ResetPasswordComponent from "../../components/auth/ResetPassword";
import { useTranslation } from 'react-i18next';
const Brand = styled(Logo)`
  fill: ${(props) => props.theme.palette.primary.main};
  width: 64px;
  height: 64px;
  margin-bottom: 32px;
`;

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function ResetPassword() {
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Brand />
      <Wrapper>
        <Helmet title="Reset Password" />

        <Typography component="h1" variant="h4" align="center" gutterBottom>
          {t('Reset Password')}
        </Typography>
        <Typography component="h2" variant="body1" align="center">
          {t('Enter your email to reset your password')}
        </Typography>

        <ResetPasswordComponent />
      </Wrapper>
    </React.Fragment>
  );
}

export default ResetPassword;
