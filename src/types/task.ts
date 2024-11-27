export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  assignee: string;
  assigneeId: string;
  labels: string[];
  teamId?: string;
}

export interface AddTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  onTaskChange: (field: keyof Task, value: string) => void;
  onAdd: () => void;
  teamMembers: { id: string; name: string }[];
}
