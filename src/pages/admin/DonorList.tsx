import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Donor } from "@/types/donor";
import { formatCurrency } from "@/utils/formatters";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { useState } from "react";

const DonorList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: donors, isLoading } = useQuery({
    queryKey: ['donors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Donor[];
    },
  });

  const filteredDonors = donors?.filter(donor => 
    donor.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.last_org_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportDonors = () => {
    if (!donors) return;

    const csvContent = [
      ["First Name", "Last Name", "Email", "Amount", "Category", "Date"].join(","),
      ...donors.map(donor => [
        donor.first_name || "",
        donor.last_org_name,
        donor.email,
        donor.donation_amount,
        donor.giving_category,
        donor.created_at ? format(new Date(donor.created_at), 'MM/dd/yyyy') : ""
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `donors_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Donor List</h1>
        <Button 
          onClick={exportDonors}
          className="bg-[#6366F1] hover:bg-[#5558DD]"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search donors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#1A2235] border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="rounded-md border border-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Amount</TableHead>
              <TableHead className="text-gray-400">Location</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400">
                  Loading donors...
                </TableCell>
              </TableRow>
            ) : filteredDonors?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400">
                  No donors found
                </TableCell>
              </TableRow>
            ) : (
              filteredDonors?.map((donor) => (
                <TableRow key={donor.id} className="border-gray-800">
                  <TableCell className="text-white">
                    {donor.first_name} {donor.last_org_name}
                  </TableCell>
                  <TableCell className="text-gray-400">{donor.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      donor.giving_category === 'Major Donor'
                        ? 'bg-blue-500/10 text-blue-500'
                        : donor.giving_category === 'Regular Donor'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {donor.giving_category}
                    </span>
                  </TableCell>
                  <TableCell className="text-white">
                    {formatCurrency(donor.donation_amount)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {donor.city}, {donor.state}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {donor.created_at ? format(new Date(donor.created_at), 'MMM dd, yyyy') : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DonorList;