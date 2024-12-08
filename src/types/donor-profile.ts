export type EngagementLevel = 'High' | 'Medium' | 'Low';

export interface DonorProfile {
  id: string;
  userId: string;
  engagementScore: number;
  engagementLevel: EngagementLevel;
  donationFrequency: number;
  totalDonations: number;
  lastDonationDate: string;
  preferredCampaigns: string[];
  riskOfChurn: number;
  nextPredictedDonation: number;
  created_at?: string;
  updated_at?: string;
}

export interface DonorAnalytics {
  totalDonors: number;
  averageDonation: number;
  donorRetentionRate: number;
  newDonorsThisMonth: number;
  topDonors: Array<{
    id: string;
    name: string;
    total: number;
  }>;
  donationsByCategory: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    amount: number;
    donors: number;
  }>;
}