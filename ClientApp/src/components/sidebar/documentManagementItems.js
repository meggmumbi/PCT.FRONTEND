
// import home from '@iconify/icons-dashicons/admin-home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AppsIcon from '@mui/icons-material/Apps';

const locationsSection = [
    {
        href: "/document-management/list",
        icon: AppsIcon,
        title: "Documents"
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
        title: "Documents",
        pages: locationsSection,
    }
];

export default navItems;
