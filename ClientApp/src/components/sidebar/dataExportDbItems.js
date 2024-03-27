import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import DomainIcon from '@mui/icons-material/Domain';
import ConstructionIcon from '@mui/icons-material/Construction';
import AppsIcon from "@mui/icons-material/Apps";


const navItems = [
    {
        title: "",
        pages: [
            {
                title: "Home",
                href: "/data-export/data-export-db-configs",
                icon: HomeOutlinedIcon,
                backgroundcolor: "#333333",
                color: "#000000"
            }
        ],
    },
    {
        title: "Add Config",
        pages: [
            {
                title: "Add Config",
                href: "/data-export/data-export-db-configs/add-config",
                icon: DomainIcon,
            }
        ]
    },
    // {
    //     title: "Roles",
    //     pages: [
    //         {
    //             title: "Roles",
    //             href: "/MISAdministration/userroles-list",
    //             icon: ConstructionIcon,
    //         }
    //     ]
    // },
    // {
    //     title: "Users Management",
    //     pages: [
    //         {
    //             title: "User Management",
    //             href: "/MISAdministration/users-list",
    //             icon: ManageAccountsOutlinedIcon,
    //         }
    //     ]
    // },
    // {
    //     title: "Commcare",
    //     pages: [
    //         {
    //             title: "Commcare",
    //             href: "/commcare",
    //             icon: AppsIcon,
    //         }
    //     ]
    // },
    // {
    //     title: "Document Management",
    //     pages: [
    //         {
    //             title: "Document Management",
    //             href: "/MISAdministration/document-management",
    //             icon: AppsIcon
    //         }
    //     ]
    // },

];

export default navItems;
