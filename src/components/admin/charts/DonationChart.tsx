import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface DonationChartProps {
  data: Array<{
    month: string;
    amount: number;
  }>;
}

export const DonationChart = ({ data }: DonationChartProps) => {
  return (
    <Card className="p-6 bg-[#1A2235] border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-6">Donation Trends</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis 
              dataKey="month" 
              stroke="#718096"
              tick={{ fill: '#718096' }}
            />
            <YAxis 
              stroke="#718096"
              tick={{ fill: '#718096' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A2235',
                border: '1px solid #2D3748',
                borderRadius: '0.5rem'
              }}
            />
            <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};