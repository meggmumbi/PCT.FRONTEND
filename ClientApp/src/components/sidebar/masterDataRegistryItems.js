import {
    Briefcase,
    Calendar,
    Grid,
    Sliders,
    Server,
} from "react-feather";
// import home from '@iconify/icons-dashicons/admin-home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BoyIcon from '@mui/icons-material/Boy';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const navItems = [
    {
        title: "",
        permission: ['View home'],
        pages: [
            {
                title: "Home",
                href: "/",
                icon: HomeOutlinedIcon,
            }
        ],
    },
    {
        title: "Locations",
        pages: [
            {
                href: "/master-data-registry/locations",
                icon: LocationOnIcon,
                title: "Locations"
            },
        ],
    },
    {
        title: "Products",
        pages: [
            {
                title: "Products",
                href: "/master-data-registry/products",
                icon: ShoppingCartCheckoutOutlinedIcon
            }
        ],
    },
    {
        title: "Vendor",
        pages: [
            {
                href: "/master-data-registry/vendors",
                icon: PeopleIcon,
                title: "Vendor",
                children: [
                    {
                        title: "Register",
                        path: "/master-data-registry/vendors",
                        href: "/master-data-registry/vendors",
                    },
                    {
                        title: "Manufactures",
                        path: ""
                    },
                    {
                        title: "Suppliers",
                        path: ""
                    },
                    {
                        title: "Warehousing",
                        path: ""
                    },
                    {
                        title: "Transporters",
                        path: ""
                    }
                ]
            }
        ],
    },
    {
        title: "Warehouses",
        pages: [
            {
                href: "/master-data-registry/warehouses",
                title: "Warehouses",
                icon: WarehouseOutlinedIcon
            }
        ],
    },
    {
        title: "Carriers",
        pages: [
            {
                title: "Carriers",
                href: "/master-data-registry/carriers",
                icon: LocalShippingOutlinedIcon
            }
        ],
    },
    {
        title: "Categories",
        pages: [
            {
                title: "Categories",
                href: "/master-data-registry/categories",
                icon: WarehouseOutlinedIcon
            }
        ],
    },
    {
        title: "Units",
        pages: [
            {
                title: "Units",
                href: "/master-data-registry/units",
                icon: WarehouseOutlinedIcon
            }
        ],
    }
];

export default navItems;

