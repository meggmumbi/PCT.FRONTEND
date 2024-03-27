import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import RequisitionsList from "./RequisitionsList";

const  Index = (props)  => {
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
                <RequisitionsList />
            </Paper>
        </Box>
    );
}

export default Index;
