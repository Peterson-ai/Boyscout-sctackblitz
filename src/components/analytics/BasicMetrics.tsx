import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface BasicMetricsProps {
  totalDonations: number;
  averageDonation: number;
  totalDonors: number;
}

export const BasicMetrics = ({ totalDonations, averageDonation, totalDonors }: BasicMetricsProps) => {
  return (
    <Card className="p-6 bg-[#1A2235] border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Basic Metrics</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0D1425] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Donations</span>
            <span className="text-blue-400">$</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(totalDonations)}</p>
        </div>
        <div className="bg-[#0D1425] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Average Donation</span>
            <span className="text-purple-400">$</span>
          </div>
          <p className="text-xl font-bold text-white">{formatCurrency(averageDonation)}</p>
        </div>
        <div className="bg-[#0D1425] p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Donors</span>
            <span className="text-green-400">#</span>
          </div>
          <p className="text-xl font-bold text-white">{totalDonors}</p>
        </div>
      </div>
    </Card>
  );
};