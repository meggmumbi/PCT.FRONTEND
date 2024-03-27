import React from "react";
import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategoryById } from "../apis/analytics";

const UniversalComponent = () => {
  let { id } = useParams();
  const { isLoading, isError, data } = useQuery(
    ["getCategoryById", id],
    getCategoryById,
    { enabled: !!id }
  );
  if (isLoading) {
    return "...loading";
  }
  if (isError) {
    return "...error";
  }
  return (
    <Grid
      container
      justifyContent="center"
      spacing={1}
      alignItems={"stretch"}
      sx={{ minHeight: "800px" }}
    >
      <Grid item md={12} zeroMinWidth>
        <iframe
          title="Pathways Dashboard"
          width="100%"
          height="100%"
          src={data && data.data && data.data.url ? data.data.url : ""}
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </Grid>
    </Grid>
  );
};
export default UniversalComponent;
