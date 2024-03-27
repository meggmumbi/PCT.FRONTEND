import React from "react";
import { Box, Grid, Paper, Typography } from '@mui/material';
import {NavLink} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {getFamilies} from "../../apis/product-catalog";

const ProductsTileTable = () => {
    const {
        isLoading: isLoadingFamilies,
        isError: isErrorFamilies,
        data: familiesData,
    } = useQuery(["getFamilies"], getFamilies);
    if (isLoadingFamilies) {
        return `...loading`;
    }
    if (isErrorFamilies) {
        return `...error`;
    }
    return (
        <Box mt={4}>
            <Grid container spacing={2}>
                {familiesData.data._embedded.items.map((item, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                        <Paper variant="outlined" sx={{ p: 2,height:200 }}>
                            <NavLink to={`/psa/products-list/${item.code}`}>
                                <Typography variant="h6">{item.code}</Typography>
                                {/*<Typography variant="body2">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Typography>*/}
                            </NavLink>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            {/*<Box mt={2} display="flex" justifyContent="center">*/}
            {/*    <Pagination*/}
            {/*        count={totalPages}*/}
            {/*        page={page}*/}
            {/*        onChange={handlePageChange}*/}
            {/*        color="primary"*/}
            {/*    />*/}
            {/*</Box>*/}
        </Box>
    );
};
export default ProductsTileTable;
