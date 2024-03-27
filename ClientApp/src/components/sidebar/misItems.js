import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import DomainIcon from '@mui/icons-material/Domain';
import ConstructionIcon from '@mui/icons-material/Construction';
import AppsIcon from "@mui/icons-material/Apps";
import TuneIcon from "@mui/icons-material/Tune";
import CorporateFareIcon from '@mui/icons-material/CorporateFare';

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
    title: "Configurations",
    pages: [
      {
        title: "System Configurations",
        href: "/MISAdministration/application-configuration",
        icon: TuneIcon,
        children: [
          {
            href: "/MISAdministration/application-configuration",
            title: "Module Configuration",
          },
        ],
      },
    ],
  },
  {
    title: "Tenants",
    pages: [
      {
        title: "Tenants",
        href: "/MISAdministration/tenants",
        icon: DomainIcon,
      }
    ]
  },
  {
    title: "Roles",
    pages: [
      {
        title: "Roles",
        href: "/MISAdministration/roles",
        icon: ConstructionIcon,
      }
    ]
  },
  {
    title: "Organization",
    pages: [
      {
        title: "Organization",
        href: "/MISAdministration/organization",
        icon: CorporateFareIcon,
      }
    ]
  },
  {
    title: "Users Management",
    pages: [
      {
        title: "User Management",
        href: "/MISAdministration/users",
        icon: ManageAccountsOutlinedIcon,
      }
    ]
  },
  {
    title: "Commcare",
    pages: [
      {
        title: "Commcare",
        href: "/MISAdministration/commcare",
        icon: AppsIcon,
      }
    ]
  },
  {
    title: "Document Management",
    pages: [
      {
        title: "Document Management",
        href: "/MISAdministration/document-management",
        icon: AppsIcon
      }
    ]
  },
  {
    title: "",
    pages: [
      {
        title: "Data Export",
        href: "/data-export/data-export-db-configs",
        icon: HomeOutlinedIcon,
        backgroundcolor: "#333333",
        color: "#000000"
      }
    ],
  },
  {
    title: "Data Import",
    pages: [
      {
        title: "Data Imports",
        href: "/data-import",
        icon: TuneIcon,
        children: [
          {
            href: "/data-import",
            title: "Data Uploads",
          },
          {
            href: "/data-import/templates",
            title: "Templates",
          }
        ],
      },
    ],
  },

];

export default navItems;
