import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

interface TaskFiltersProps {
  filterLabel: string;
  filterUser: string;
  onFilterLabel: (value: string) => void;
  onFilterUser: (value: string) => void;
  labelOptions: string[];
  userOptions: string[];
  onAddColumnClick: () => void;
}

export function TaskFilters({
  filterLabel,
  filterUser,
  onFilterLabel,
  onFilterUser,
  labelOptions,
  userOptions,
  onAddColumnClick,
}: TaskFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <Select value={filterLabel} onValueChange={onFilterLabel}>
        <SelectTrigger className="w-[180px] bg-gray-700 text-white border-gray-600 rounded-full">
          <SelectValue placeholder="Filter by label" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white border-gray-600 rounded-xl">
          <SelectItem value="all">All Labels</SelectItem>
          {labelOptions.map((label) => (
            <SelectItem key={label} value={label}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filterUser} onValueChange={onFilterUser}>
        <SelectTrigger className="w-[180px] bg-gray-700 text-white border-gray-600 rounded-full">
          <SelectValue placeholder="Filter by user" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 text-white border-gray-600 rounded-xl">
          <SelectItem value="all">All Users</SelectItem>
          {userOptions.map((user) => (
            <SelectItem key={user} value={user}>
              {user}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={onAddColumnClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Column
      </Button>
    </div>
  );
}
