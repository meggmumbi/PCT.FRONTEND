import {
    Briefcase,
    Calendar,
    Grid,
    Sliders,
    Server,
} from "react-feather";
// import home from '@iconify/icons-dashicons/admin-home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AppsIcon from '@mui/icons-material/Apps';

const locationsSection = [
    {
        href: "/commcare/apps",
        icon: AppsIcon,
        title: "Apps"
    },
];



const navItems = [
    {
        title: "",
        pages: [
            {
                title: "Home",
                href: "/",
                icon: HomeOutlinedIcon,
            }
        ],
    },
    {
        title: "Apps",
        pages: locationsSection,
    }
];

export default navItems;
