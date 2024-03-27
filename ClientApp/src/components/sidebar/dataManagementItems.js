import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AppsIcon from '@mui/icons-material/Apps';



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
        title: "Data Management",
        pages: [
            {
                title: "Data Management",
                href: "/data-management",
                icon: AppsIcon,
                backgroundcolor: "#c5b32f",
                color: "#c5b32f",
                children: [
                    {
                        title: "Commcare",
                        href: "commcare",
                        backgroundcolor: "#9e965c",
                    },
                    {
                        title: "Data Import",
                        href: "data-import",
                        backgroundcolor: "#c5b32f",
                        color: "#c5b32f",
                        children: [
                            {
                                title: "Templates",
                                href: "data-import/templates",
                                backgroundcolor: "#9e965c",
                            },
                            {
                                title: "Uploads",
                                href: "data-import",
                                backgroundcolor: "#9e965c",
                            },
                        ]
                    },
                    {
                        title: "Data Export",
                        href: "data-export",
                        backgroundcolor: "#9e965c",
                    }
                ]
            }

        ]
    }
];


export default navItems;
