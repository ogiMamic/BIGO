import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddColumnDialogProps } from "@/types/task";

export function AddColumnDialog({
  isOpen,
  onOpenChange,
  onAdd,
  title,
  onTitleChange,
}: AddColumnDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Column</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new column for your tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-300">
              Name
            </Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="col-span-3 bg-gray-700 border-gray-600 text-white rounded-xl"
              onKeyPress={(e) => e.key === "Enter" && onAdd()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={onAdd}
            className="bg-green-500 hover:bg-green-600 text-white rounded-full"
          >
            Add Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
