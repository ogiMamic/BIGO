"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, BookOpen, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Storytelling",
    href: "/storytelling",
    icon: BookOpen,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] pr-0">
          <div className="flex flex-col space-y-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <div className="hidden lg:flex">
        <div className="flex w-[240px] flex-col border-r bg-card">
          <div className="p-6">
            <h1 className="text-2xl font-bold tracking-tight">BIGO</h1>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col space-y-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href && "bg-accent text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <div className="flex h-[64px] items-center border-b px-6">
          <div className="lg:hidden">
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
          <div className="flex-1" />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
