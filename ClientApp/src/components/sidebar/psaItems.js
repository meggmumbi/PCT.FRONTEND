import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

const navItems = [
    {
        title: "",
        pages: [
            {
                title: "Home",
                href: "/",
                icon: HomeOutlinedIcon,
                backgroundcolor: "#333333",
                color: "#000000"
            }
        ],
    },
    {
        title: "ordermanagement",
        pages: [
            {
                title: "Order Management",
                href: "/psa",
                icon: Inventory2OutlinedIcon,
                backgroundcolor: "#E47201",
                children: [
                    {
                        title: "Planning & Forecasting",
                        href: "",
                        backgroundcolor: "#EA8E33",
                    },
                    {
                        title: "Supply Plan",
                        href: "supply-plan-requisition",
                        backgroundcolor: "#EA8E33",
                    },

                    {
                        title: "Requisitions",
                        href: "requisition-order-list",
                        backgroundcolor: "#EA8E33",
                    },
                    {
                        title: "Approval",
                        href: "/psa/approvals",
                        backgroundcolor: "#EA8E33",
                    },
                    {
                        title: "Sales Quotes",
                        href: "/psa/sales-quotes",
                        backgroundcolor: "#EA8E33",
                    },
                    {
                        title: "Purchase Orders",
                        href: "/psa/purchase-orders",
                        backgroundcolor: "#EA8E33",
                    },
                    {
                        title: "Shipments",
                        href: "/psa/shipping-list",
                        backgroundcolor: "#EA8E33",
                    },

                    {
                        title: "Simulations",
                        href: "/psa/simulations",
                        backgroundcolor: "#EA8E33",
                    },


                    /*                  {
                                            title: "Create New Order",
                                            href: "/psa/create-new-order",
                                            backgroundcolor: "#EA8E33",
                                        },
                                        {
                                            title: "Order Tracking",
                                            href: "",
                                            backgroundcolor: "#EA8E33",
                                        },
                                        {
                                            title: "Order Tracking List",
                                            href: "/psa/order-tracking-list",
                                            backgroundcolor: "#EA8E33",
                                        },
                                        {
                                            title: "Historical Orders",
                                            href: "/psa/historical-orders",
                                            backgroundcolor: "#EA8E33",
                                        },*/

                ],
            }
        ],
    }
];

export default navItems;
