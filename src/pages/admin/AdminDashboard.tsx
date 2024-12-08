import { DollarSign, Users, Flag, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/stats/StatCard";
import { DonationChart } from "@/components/admin/charts/DonationChart";
import { formatCurrency } from "@/utils/formatters";
import { Card } from "@/components/ui/card";

const mockChartData = [
  { month: "Jan", amount: 4000 },
  { month: "Feb", amount: 3000 },
  { month: "Mar", amount: 2000 },
  { month: "Apr", amount: 2780 },
  { month: "May", amount: 1890 },
  { month: "Jun", amount: 2390 },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Donations"
          value={formatCurrency(125000)}
          change={{ value: 14.5, trend: 'up' }}
          icon={DollarSign}
        />
        <StatCard
          title="Active Donors"
          value="1,234"
          change={{ value: 5.2, trend: 'up' }}
          icon={Users}
        />
        <StatCard
          title="Campaigns"
          value="12"
          change={{ value: 2, trend: 'up' }}
          icon={Flag}
        />
        <StatCard
          title="Monthly Growth"
          value="4%"
          change={{ value: 1.2, trend: 'up' }}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#1A2235] border-gray-800">
          <DonationChart data={mockChartData} />
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;