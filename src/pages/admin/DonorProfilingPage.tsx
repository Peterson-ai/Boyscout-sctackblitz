import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";
import { DonorProfile } from "@/types/donor-profile";

const DonorProfilingPage = () => {
  const { data: donorProfiles, isLoading } = useQuery({
    queryKey: ['donor-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donor_profiles')
        .select(`
          *,
          donors (
            first_name,
            last_org_name,
            email
          )
        `);
      
      if (error) throw error;
      return data as DonorProfile[];
    },
  });

  if (isLoading) {
    return <div>Loading donor profiles...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Donor Profiling Analysis</h1>

      <div className="grid gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Donor Engagement Overview</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Engagement Level</TableHead>
                <TableHead>Total Donations</TableHead>
                <TableHead>Risk of Churn</TableHead>
                <TableHead>Next Predicted Donation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donorProfiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.donors?.first_name} {profile.donors?.last_org_name}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      profile.engagementLevel === 'High' 
                        ? 'bg-green-100 text-green-800'
                        : profile.engagementLevel === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {profile.engagementLevel}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(profile.totalDonations)}</TableCell>
                  <TableCell>
                    <span className={`${
                      profile.riskOfChurn > 0.7 
                        ? 'text-red-500' 
                        : profile.riskOfChurn > 0.3 
                        ? 'text-yellow-500' 
                        : 'text-green-500'
                    }`}>
                      {(profile.riskOfChurn * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(profile.nextPredictedDonation)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default DonorProfilingPage;