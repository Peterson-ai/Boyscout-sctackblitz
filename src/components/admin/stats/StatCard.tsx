import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
}

export const StatCard = ({ title, value, change, icon: Icon }: StatCardProps) => {
  return (
    <Card className="p-6 bg-[#1A2235] border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400">{title}</h3>
        <Icon className="text-[#6366F1] h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {change && (
        <p className={cn(
          "text-sm mt-2",
          change.trend === 'up' ? 'text-green-500' : 'text-red-500'
        )}>
          {change.trend === 'up' ? '+' : '-'}{Math.abs(change.value)}%
        </p>
      )}
    </Card>
  );
};