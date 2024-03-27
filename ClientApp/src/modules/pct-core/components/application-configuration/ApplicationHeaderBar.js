import React from "react";
import {
  Box,
  Card,
  Typography,
  Paper,
  Grid,
  CardContent,
  CardHeader,
  Button,
  Switch,
  TextField,
} from "@mui/material";

function ApplicationHeaderBar(props) {
  return (
    <Box>
      <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
        <Card mb={6} square={true} sx={{ py: 5, pl: 2 }}>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Typography
                variant="h1"
                gutterBottom
                display="inline"
                sx={{ fontSize: "2rem" }}
              >
                Application Management
              </Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Manage your preferred application as needed
              </Typography>
            </Grid>
            {/* <Grid item md={4}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <Button
                    mr={6}
                    variant="contained"
                    onClick={() =>
                      navigate(
                        "/MISAdministration/application-configuration/new-application"
                      )
                    }
                  >
                    <AddIcon /> New Application
                  </Button>
                </Box>
              </Grid> */}
          </Grid>
        </Card>
      </Paper>
    </Box>
  );
}

export default ApplicationHeaderBar;
