import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface DonorSegment {
  name: string;
  value: number;
  color: string;
}

interface DonorSegmentsProps {
  segments: DonorSegment[];
}

export const DonorSegments = ({ segments }: DonorSegmentsProps) => {
  return (
    <Card className="p-6 bg-[#1A2235] border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">Donor Segments</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {segments.map((segment, index) => (
                <Cell key={`cell-${index}`} fill={segment.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};