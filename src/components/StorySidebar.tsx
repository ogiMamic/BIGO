import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function StorySidebar() {
  return (
    <div className="w-64 border-r border-gray-700 flex flex-col bg-gray-800 rounded-l-2xl">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-lg font-semibold text-green-500">
            #Storytelling
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-full w-full"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {/* You can add a list of story categories or filters here */}
      </ScrollArea>
    </div>
  );
}
