import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import SupplyPlanList from "./SupplyPlanList";

const  SupplyPlanRequisition = (props)  => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                    m: 1,
                    width: '100%'
                },
            }}
        >
            <Paper elevation={0} >       
                <SupplyPlanList />
            </Paper>
        </Box>
    );
}
export default SupplyPlanRequisition;
