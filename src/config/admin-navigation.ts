import { 
  LayoutDashboard, 
  Users, 
  Flag,
  BarChart,
  UserCog,
  Settings
} from "lucide-react";

export const adminNavigationItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Donors",
    href: "/admin/donors",
    icon: Users
  },
  {
    title: "Campaigns",
    href: "/admin/campaigns",
    icon: Flag
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart
  },
  {
    title: "Donor Profiling",
    href: "/admin/donor-profiling",
    icon: UserCog
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
];