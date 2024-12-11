import Sidebar from "@/components/Sidebar";

export default function StorytellingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      {children}
    </div>
  );
}
