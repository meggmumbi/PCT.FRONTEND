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

const manageSection = [
  {
    href: "/manage",
    icon: TrendingUpOutlinedIcon,
    title: "Manage"
  },
];
const planSection = [
  {
    href: "/plan",
    icon: CalendarMonthOutlinedIcon,
    title: "Plan"
  }
];
const sourceSection = [
  {
    title: "Source",
    href: "/source",
    icon: ShoppingCartCheckoutOutlinedIcon
  },
];
const storeSection = [
  {
    href: "/store",
    title: "Store",
    icon: WarehouseOutlinedIcon
  }
];
const deliverSection = [
  {
    title: "Deliver",
    href: "/deliver",
    icon: LocalShippingOutlinedIcon
  },
];
const enableSection = [
  {
    title: "Enable",
    href: "/enable",
    icon: CheckBoxOutlinedIcon
  }
];
const MISAdministrationSection = [
  {
    title: "MIS Administration",
    href: "/MISAdministration",
    icon: ManageAccountsOutlinedIcon
  },
];
const AboutSection = [
  {
    title: "About",
    href: "/about",
    icon: InfoOutlinedIcon
  },
];

const pagesSection = [
  {
    href: "/dashboard",
    icon: Sliders,
    title: "Warehouse",
    children: [
      {
        href: "/dashboard/inbound",
        title: "Inbound",
      },
      {
        href: "/dashboard/outbound",
        title: "Outbound",
      },
      {
        href: "/dashboard/monitoring",
        title: "Monitoring",
      },
    ],
  },
];

const transportationPlanning = [
  {
    href: "/transportation",
    icon: Briefcase,
    title: "Transportation And Planning",
    children: [
      {
        href: "/dashboard/costing",
        title: "Costing",
      },
      {
        href: "/dashboard/tendering-contracting",
        title: "Tendering Contracting",
      },
      {
        href: "/dashboard/transportation-distribution",
        title: "Transportation And Distribution",
      },
      {
        href: "/dashboard/chain-of-custody",
        title: "Chain of Custody",
      },
    ],
  },
];

const deliveryStatus = [
  {
    href: "/dashboard",
    icon: Grid,
    title: "Delivery",
    children: [
      {
        href: "/dashboard/ePOD",
        title: "ePOD"
      },
      {
        href: "",
        title: "Returns",
      }
    ],
  },
];

const inventoryAnalysisAndPlanning = [
  {
    href: "/inventory",
    icon: Calendar,
    title: "Inventory Analysis And Planning",
    children: [
      {
        href: "/dashboard/",
        title: "Consumption Prediction"
      },
      {
        href: "/dashboard/",
        title: "Allocation Prediction"
      },
    ],
  },
];

const controlTower = [
  {
    href: "/control-tower",
    icon: Server,
    title: "Control Tower",
  }
];


const navItems = [
  {
    title: "",
    pages: [
      {
        title: "Home",
        href: "/",
        icon: HomeOutlinedIcon
      }
    ],
  },
  {
    title: "manage",
    pages: manageSection,
  },
  {
    title: "Plan",
    pages: planSection,
  },
  {
    title: "Source",
    pages: sourceSection,
  },
  {
    title: "Store",
    pages: storeSection,
  },
  {
    title: "Deliver",
    pages: deliverSection,
  },
  {
    title: "Enable",
    pages: enableSection,
  },
  //{
  //  title: "MIS",
  //  pages: MISAdministrationSection,
  //},
  {
    title: "About",
    pages: AboutSection,
  }
  // {
  //   title: "",
  //   pages: pagesSection,
  // },
  // {
  //   title: "Transportation And Planning",
  //   pages: transportationPlanning,
  // },
  // {
  //   title: "Delivery",
  //   pages: deliveryStatus,
  // },
  // {
  //   title: "Inventory Analysis and Planning",
  //   pages: inventoryAnalysisAndPlanning,
  // },
  // {
  //   title: "Control Tower",
  //   pages: controlTower,
  // },
];

export default navItems;
