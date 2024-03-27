import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

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
    title: "about",
    pages: [
      {
        title: "About",
        href: "/global-spot-check/about",
        icon: SearchOutlinedIcon,
      },
    ],
  },
  // {
  //   title: "manage",
  //   pages: [
  //     {
  //       title: "Manage",
  //       href: "/global-spot-check/manage",
  //       icon: TrendingUpOutlinedIcon,
  //     },
  //   ],
  // },
  {
    title: "plan",
    pages: [
      {
        title: "Plan",
        href: "/global-spot-check/plan",
        icon: CalendarMonthOutlinedIcon,
      },
    ],
  },
  {
    title: "source",
    pages: [
      {
        title: "Source",
        href: "/global-spot-check/source",
        icon: ShoppingCartCheckoutOutlinedIcon,
        children: [
          {
            title: "OSA Resources",
            href: "/global-spot-check/source/osa-resources",
          },
          {
            title: "OSA Medical Stores",
            href: "/global-spot-check/source/osa-medical-stores",
          },
        ],
      },
    ],
  },
  {
    title: "store",
    pages: [
      {
        title: "Store",
        href: "/global-spot-check/store",
        icon: WarehouseOutlinedIcon,
        children: [
          {
            title: "SATP Resources",
            href: "/global-spot-check/store/satp-resources",
          },
          {
            title: "SATP Medical Stores",
            href: "/global-spot-check/store/satp-medical-stores",
          },
        ],
      },
    ],
  },
  {
    title: "deliver",
    pages: [
      {
        title: "Deliver",
        href: "/global-spot-check/deliver",
        icon: LocalShippingOutlinedIcon,
        children: [
          {
            title: "OTIF Resources",
            href: "/global-spot-check/deliver/otif-resources",
          },
          {
            title: "OTIF Medical Stores",
            href: "/global-spot-check/deliver/otif-medical-stores",
          },
        ],
      },
    ],
  },
  // {
  //   title: "enable",
  //   pages: [
  //     {
  //       title: "Enable",
  //       href: "/global-spot-check/enable",
  //       icon: CheckBoxOutlinedIcon,
  //     },
  //   ],
  // },
];

export default navItems;
