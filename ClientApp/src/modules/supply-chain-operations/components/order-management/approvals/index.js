import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ApprovalList from "./ApprovalList";

const  Index = (props) => {

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
            <Paper elevation={0}>
                 <ApprovalList />
            </Paper>
        </Box>
    );
}

export default Index;
