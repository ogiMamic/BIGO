import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Team {
  id: string;
  name: string;
}

interface TeamSelectorProps {
  teams: Team[];
  currentTeamId: string | null;
  onTeamChange: (teamId: string) => void;
}

export default function TeamSelector({
  teams,
  currentTeamId,
  onTeamChange,
}: TeamSelectorProps) {
  return (
    <Select value={currentTeamId || undefined} onValueChange={onTeamChange}>
      <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 mb-4">
        <SelectValue placeholder="Select a team" />
      </SelectTrigger>
      <SelectContent className="bg-gray-700 text-white border-gray-600 rounded-lg">
        {teams.map((team) => (
          <SelectItem
            key={team.id}
            value={team.id}
            className="hover:bg-gray-600 rounded-lg"
          >
            {team.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
