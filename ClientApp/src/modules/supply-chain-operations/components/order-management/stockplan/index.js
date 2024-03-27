import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import StockPlanList from "./StockPlanList";
import StockPlan from "./StockPlan";



function Index(props) {
    const [reComp, setReComp] = useState()


    const pageSwitch = (action,requisition) =>{
        switch (action) {
            case 'approval':
                setReComp(<StockPlan pageSwitch={pageSwitch} requisition={requisition}/>);
                break;
            default:
                setReComp(<StockPlanList pageSwitch={pageSwitch}/>)
        }
    }
    useEffect(()=>{
        setReComp(<StockPlanList pageSwitch={pageSwitch}/>)
    },[])
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
                {reComp}
            </Paper>
        </Box>
    );
}

export default Index;
