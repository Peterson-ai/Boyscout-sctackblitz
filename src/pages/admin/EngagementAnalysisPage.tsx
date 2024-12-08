import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { DonorAnalytics } from "@/types/donor-profile";
import { formatCurrency } from "@/utils/formatters";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EngagementAnalysisPage = () => {
  const { data: analytics, isLoading } = useQuery<DonorAnalytics>({
    queryKey: ['donor-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donor_analytics')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Engagement Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Donors</h3>
          <p className="text-2xl font-bold mt-2">{analytics?.totalDonors}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Average Donation</h3>
          <p className="text-2xl font-bold mt-2">
            {formatCurrency(analytics?.averageDonation || 0)}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Retention Rate</h3>
          <p className="text-2xl font-bold mt-2">
            {(analytics?.donorRetentionRate || 0).toFixed(1)}%
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">New Donors (Month)</h3>
          <p className="text-2xl font-bold mt-2">{analytics?.newDonorsThisMonth}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Donors</h2>
          <div className="space-y-4">
            {analytics?.topDonors.map((donor, index) => (
              <div key={donor.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-lg font-medium mr-4">#{index + 1}</span>
                  <span>{donor.name}</span>
                </div>
                <span className="font-semibold">{formatCurrency(donor.total)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EngagementAnalysisPage;