import {useEffect, useState, useMemo, useRef} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import SalesQuotesList from "./SalesQuotesList";
import SalesQuote from "./SalesQuote";
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer, toast } from 'react-toastify';


function Index(props) {
    const [reComp, setReComp] = useState()


    const pageSwitch = (action,row) =>{
        switch (action) {
            case 'view':
                setReComp(<SalesQuote pageSwitch={pageSwitch} row={row}/>);
                break;
            default:
                setReComp(<SalesQuotesList pageSwitch={pageSwitch}/>)
        }
    }
    useEffect(()=>{
        setReComp(<SalesQuotesList pageSwitch={pageSwitch}/>)
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
                <ToastContainer />
                {reComp}
            </Paper>
        </Box>
    );
}

export default Index;
