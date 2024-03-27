import {useEffect, useState, useMemo, useRef} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from 'react-toastify';
import Tenant from "./Tenant";
import SiteList from "./SiteList";
import 'react-toastify/dist/ReactToastify.min.css'

function Index(props) {
    const [reComp, setReComp] = useState()

    const pageSwitch = (action,row) =>{
        switch (action) {
            case 'add':
                setReComp(<Tenant row={row} pageSwitch={pageSwitch}/>)
                break;
            case 'list':
                setReComp(<SiteList pageSwitch={pageSwitch}/>)
                break;
            default:
                setReComp(<SiteList pageSwitch={pageSwitch}/>)
        }
    }
    useEffect(()=>{
        setReComp(<SiteList pageSwitch={pageSwitch}/>)
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
