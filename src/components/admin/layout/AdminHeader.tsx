import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AdminHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-[#0D1425] border-b border-gray-800">
      <div className="flex-1 max-w-xl">
        <Input
          type="search"
          placeholder="Search..."
          className="bg-[#1A2235] border-gray-700 text-white placeholder:text-gray-400"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-[#1A2235]">
          <Bell className="h-5 w-5 text-gray-400" />
        </button>
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};