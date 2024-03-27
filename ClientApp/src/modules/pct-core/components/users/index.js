import {useEffect, useState, useMemo, useRef} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { ToastContainer, toast } from 'react-toastify';
import User from "./User";
import UserList from "./UserList";
import 'react-toastify/dist/ReactToastify.min.css'


function Index(props) {
    const [reComp, setReComp] = useState()

    const pageSwitch = (action,rowData) =>{
        switch (action) {
            case 'add':
                setReComp(<User row={rowData} pageSwitch={pageSwitch}/>)
                break;
            case 'list':
                setReComp(<UserList pageSwitch={pageSwitch}/>)
                break;
            default:
                setReComp(<UserList pageSwitch={pageSwitch}/>)
        }
    }
    useEffect(()=>{
        setReComp(<UserList pageSwitch={pageSwitch}/>)
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
