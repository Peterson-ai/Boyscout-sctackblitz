import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createAdminUser } from "@/utils/adminUtils";
import { toast } from "sonner";

const CreateAdminPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await createAdminUser(email, password);
      
      if (result.success) {
        toast.success("Admin user created successfully!");
        navigate("/admin");
      } else {
        toast.error("Failed to create admin user");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred while creating admin user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C]">
      <Card className="w-full max-w-md p-8 bg-[#1A2235] border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-6">Create Admin User</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#0D1425] border-gray-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0D1425] border-gray-700 text-white"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#6366F1] hover:bg-[#5558DD] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Admin User"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateAdminPage;