import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddTaskDialogProps } from "@/types/task";

export function AddTaskDialog({
  isOpen,
  onOpenChange,
  task,
  onTaskChange,
  onAdd,
  teamMembers,
}: AddTaskDialogProps) {
  const handleAdd = () => {
    if (task.title.trim() !== "") {
      onAdd();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white rounded-2xl border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Task
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => onTaskChange("title", e.target.value)}
              className="col-span-3 bg-gray-700 text-white rounded-xl border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) => onTaskChange("description", e.target.value)}
              className="col-span-3 bg-gray-700 text-white rounded-xl border-gray-600 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">
              Assignee
            </Label>
            <Select
              value={task.assigneeId}
              onValueChange={(value) => {
                const selectedMember = teamMembers.find(
                  (member) => member.id === value
                );
                onTaskChange("assigneeId", value);
                onTaskChange(
                  "assignee",
                  selectedMember ? selectedMember.name : ""
                );
              }}
            >
              <SelectTrigger className="col-span-3 bg-gray-700 text-white rounded-xl border-gray-600 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white rounded-xl border-gray-600">
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={task.status}
              onValueChange={(value) => onTaskChange("status", value)}
            >
              <SelectTrigger className="col-span-3 bg-gray-700 text-white rounded-xl border-gray-600 focus:border-green-500 focus:ring-green-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white rounded-xl border-gray-600">
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAdd}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
