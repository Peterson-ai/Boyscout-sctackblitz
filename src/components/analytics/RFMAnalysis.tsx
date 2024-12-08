import { Card } from "@/components/ui/card";

interface RFMScore {
  recency: number;
  frequency: number;
  monetary: number;
}

interface RFMAnalysisProps {
  scores: RFMScore;
}

export const RFMAnalysis = ({ scores }: RFMAnalysisProps) => {
  return (
    <Card className="p-6 bg-[#1A2235] border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">RFM Analysis</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#0D1425] p-4 rounded-lg">
          <p className="text-2xl font-bold text-center text-blue-400 mb-2">
            {scores.recency || 'N/A'}
          </p>
          <p className="text-sm text-center text-gray-400">Recency Score</p>
        </div>
        <div className="bg-[#0D1425] p-4 rounded-lg">
          <p className="text-2xl font-bold text-center text-green-400 mb-2">
            {scores.frequency || 'N/A'}
          </p>
          <p className="text-sm text-center text-gray-400">Frequency Score</p>
        </div>
        <div className="bg-[#0D1425] p-4 rounded-lg">
          <p className="text-2xl font-bold text-center text-purple-400 mb-2">
            {scores.monetary || 'N/A'}
          </p>
          <p className="text-sm text-center text-gray-400">Monetary Score</p>
        </div>
      </div>
    </Card>
  );
};