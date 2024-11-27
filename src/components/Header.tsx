import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Notifications from "./Notifications";

export default function Header() {
  return (
    <header className="bg-white border-b p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Bigo</h1>
      <div className="flex items-center space-x-4">
        <Notifications />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
