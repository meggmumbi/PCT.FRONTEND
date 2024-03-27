import React, {useEffect, useState}  from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import _ from 'lodash';



function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function Index({allItems, selectedItems, action}) {
    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);
    const [right, setRight] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    useEffect(()=>{
        setLeft(_.differenceBy(allItems,selectedItems,'id'))
        setRight(selectedItems===null?[]:selectedItems);
    },[allItems,selectedItems])


    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
        action(right.concat(left))
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
        action(right.concat(leftChecked))
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
        action(not(right, rightChecked))
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
        action([])
    };



    const handleColorChange = (labelId) => {

        let element = document.getElementById(labelId)
        console.log(labelId)
        console.log(element.style.backgroundColor)
        element.style.backgroundColor = element.style.backgroundColor === "rgb(251, 251, 251)" ||  element.style.backgroundColor === "" ?"rgb(15, 105, 125)":"rgb(251, 251, 251)";
        element.style.color = element.style.backgroundColor === "rgb(251, 251, 251)" ||  element.style.backgroundColor === "red" ?"":"white";

    }

    const customList = (items) => (
        <Paper sx={{ width: '100%', height: 430, overflow: 'auto',padding:'10px' }}>
            <List dense component="div" role="list" disablePadding sx={{boxShadow:'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;',minHeight:"100%","padding":"1px","margin":"1px"}}>


                {items.map((value) => {
                    const labelId = `transfer-list-item-${value.id}-label`;

                    return (
                        <ListItem
                            key={value.id}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon sx={{"padding":"1px","height":"35px","width":"100%", "margin":"0px"}}>
                                <ListItemText  primaryTypographyProps={{fontSize: '14px'}}   id={labelId} primary={`${value.name}`} sx={{ color: value.textColor || 'rgba(0, 0, 0, 0.54)', margin:"0px", backgroundColor:"rgb(251, 251, 251)", width:'100%',padding:"5px",}} onClick={()=>handleColorChange(labelId)} />
                            </ListItemIcon>

                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={5}>{customList(left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={5} >{customList(right)}</Grid>
        </Grid>
    );
}
export default Index;
