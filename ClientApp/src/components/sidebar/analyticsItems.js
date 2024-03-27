import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import SupervisedUserCircleOutlinedIcon from "@mui/icons-material/SupervisedUserCircleOutlined";

const navItems = [
  {
    title: "",
    pages: [
      {
        title: "Home",
        href: "/",
        icon: HomeOutlinedIcon,
      },
    ],
  },
  {
    title: "config",
    pages: [
      {
        title: "Config",
        href: "/analytics/config",
        icon: SettingsApplicationsOutlinedIcon,
      },
      {
        title: "Role Permissions",
        href: "/analytics/role_permissions",
        icon: SupervisedUserCircleOutlinedIcon,
      },
    ],
  },
];

export default navItems;
