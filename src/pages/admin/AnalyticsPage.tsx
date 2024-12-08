import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BasicMetrics } from "@/components/analytics/BasicMetrics";
import { RFMAnalysis } from "@/components/analytics/RFMAnalysis";
import { DonorSegments } from "@/components/analytics/DonorSegments";
import { DateRange } from "@/components/ui/date-range";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donor_analytics')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const donorSegments = [
    { name: 'High Value', value: 30, color: '#4C51BF' },
    { name: 'Regular', value: 45, color: '#48BB78' },
    { name: 'Occasional', value: 25, color: '#ED8936' }
  ];

  const handleExport = () => {
    // Implement export functionality
  };

  if (isLoading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <DateRange value={dateRange} onChange={setDateRange} />
          <Button onClick={handleExport} className="bg-[#6366F1] hover:bg-[#5558DD]">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <BasicMetrics
          totalDonations={analyticsData?.total_donations || 0}
          averageDonation={analyticsData?.average_donation || 0}
          totalDonors={analyticsData?.total_donors || 0}
        />

        <div className="grid grid-cols-2 gap-6">
          <RFMAnalysis
            scores={{
              recency: analyticsData?.rfm_scores?.recency || 0,
              frequency: analyticsData?.rfm_scores?.frequency || 0,
              monetary: analyticsData?.rfm_scores?.monetary || 0
            }}
          />
          <DonorSegments segments={donorSegments} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;