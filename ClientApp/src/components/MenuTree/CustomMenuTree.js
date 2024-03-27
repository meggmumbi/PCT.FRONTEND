import Box from "@mui/material/Box";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { useEffect, useState } from "react";
import _ from "lodash";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


function CustomMenuTree({ showTitle = true, title = "Menu Tree", menuTreeItems = [], orderField, numberOfItems = 'single', selectedItem, defaultSelected = [], selectLevels = [], bgColor = "rgb(15, 105, 125)" }) {
    const [menuItems, setMenuItems] = useState([]);
    const [menuTree, setMenuTree] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setSelected(defaultSelected)
        setMenuItems(menuTreeItems);
        setMenuTree([..._.orderBy(transformToTree(menuTreeItems), orderField, 'asc')]);

    }, [menuTreeItems]);


    const transformToTree = (data) => {
        const grouped = _.groupBy(_.orderBy(data, orderField, 'asc'), (item) => item.parent_id);
        function childrenOf(parent_id, level = 0) {
            return (grouped[parent_id] || []).map((item) => ({
                id: item.id,
                name: item.name,
                parent_id: item.parent_id,
                [orderField]: item[orderField],
                level: level + 1,
                menu_type: item.menu_type,
                children: childrenOf(item.id, level + 1)
            }));
        }

        return childrenOf(null);
    }

    function getChildById(node, id, parent_level) {
        let array = [];
        function getAllChild(nodes = null) {
            if (nodes === null || nodes.level > parent_level + 1) return [];
            array.push(nodes.id);
            if (nodes.level <= parent_level + 1 && Array.isArray(nodes.children)) {
                nodes.children.forEach(node => {
                    array = [...array, ...getAllChild(node)];
                    array = array.filter((v, i) => array.indexOf(v) === i);
                });
            }
            return array;
        }

        function getNodeById(nodes, id) {
            if (nodes.id === id) {
                return nodes;
            } else if (nodes.level <= parent_level + 1 && Array.isArray(nodes.children)) {
                let result = null;
                nodes.children.forEach(node => {
                    if (!!getNodeById(node, id)) {
                        result = getNodeById(node, id);
                    }
                });
                return result;
            }

            return null;
        }

        // props.setOUParam(selected.length > 0?'&dimension=ou:'+_.join(selected ,';'):null);
        return getAllChild(getNodeById(node, id));
    }

    function getOnChange(checked, nodes) {
        const allNode = getChildById(nodes, nodes.id, nodes.level);
        let array = checked
            ? [...selected, ...allNode]
            : selected.filter(value => !allNode.includes(value));

        array = array.filter((v, i) => array.indexOf(v) === i);
        if (numberOfItems === 'single' && array.length >= 2) {
            array = [array[1]];
        }
        selectedItem(array);
        setSelected(array);
    }
    const menuIcons = (menu_type) => {
        if (['group', 'collapse'].includes(menu_type)) {
            return (
                <></>
            )
        }
        return (
            <ArrowForwardIcon fontSize="100px" />
        )
    }
    const treeLabel = (enabled, nodes) => {

        if (selectLevels.length >= 1 && !selectLevels.includes(nodes.menu_type)) {
            return (
                <FormControlLabel
                    control={menuIcons(nodes.menu_type)}
                    label={<>{nodes.name}</>}
                    key={nodes.id}
                    sx={{ marginTop: '7px', marginLeft: '1px' }}
                />
            )
        }
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={selected.some(item => item === nodes.id)}
                        onChange={event =>
                            getOnChange(event.currentTarget.checked, nodes)
                        }
                        onClick={e => e.stopPropagation()}
                    />
                }
                label={<>{nodes.name}</>}
                key={nodes.id}
            />
        )
    }

    const renderTree = (nodes, dd = false) => (
        <TreeItem
            key={nodes.id}
            nodeId={nodes.id}
            label={treeLabel(dd, nodes)}
        >
            {Array.isArray(nodes.children)
                ? nodes.children.map(n => {
                    if (selectLevels.length === 0) {
                        return renderTree(n, true)
                    }
                    return renderTree(n, (selectLevels.includes(n.menu_type) !== true))
                })
                : null}
        </TreeItem>


    );
    return (
        <>
            {showTitle &&
                <Typography id="demo-radio-buttons-group-label" style={{ color: '#fff', fontWeight: 'bold', marginTop: '10px', padding: '10px', backgroundColor: `${bgColor}`, fontSize: '18px', marginBottom: '5px' }}>{title}</Typography>
            }
            {menuTree.length > 0 &&
                <TreeView
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    {menuTree.map((node, i) => (
                        <>
                            {renderTree(node)}
                        </>

                    ))}

                </TreeView>
            }
        </>
    );
}

export default CustomMenuTree;
