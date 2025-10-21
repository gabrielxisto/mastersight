import { useState, type JSX } from "react";
import { useLocation, useNavigate, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SidebarNavProps = React.HTMLAttributes<HTMLElement> & {
  items: {
    id?: string;
    href?: string;
    title: string;
    icon: JSX.Element;
  }[];
};

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [val, setVal] = useState(pathname ?? "/settings");

  const handleSelect = (e: string) => {
    setVal(e);
    navigate({ to: e });
  };

  return (
    <>
      <div className="p-1 md:hidden">
        <Select value={val} onValueChange={handleSelect}>
          <SelectTrigger className="h-12 sm:w-48">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {items.map((item) => {
              return (
                <SelectItem
                  key={item.href}
                  value={item.href}
                  className={cn(
                    pathname.includes(item.href)
                      ? "bg-muted hover:bg-accent"
                      : "hover:bg-accent hover:underline",
                  )}
                >
                  <div className="flex gap-x-4 px-2 py-1">
                    <span className="scale-125">{item.icon}</span>
                    <span className="text-md">{item.title}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <ScrollArea
        orientation="horizontal"
        type="always"
        className="bg-background hidden w-full min-w-40 px-1 py-2 md:block"
      >
        <nav
          className={cn(
            "flex space-x-2 py-1 lg:flex-col lg:space-y-1 lg:space-x-0",
            className,
          )}
          {...props}
        >
          {items.map((item) => (
            <button
              type="button"
              key={item.href}
              onClick={() => navigate({ to: item.href || item.id })}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "justify-start",
                pathname === item.href
                  ? "bg-muted hover:bg-accent"
                  : "hover:bg-accent hover:underline",
              )}
            >
              <span className="me-2">{item.icon}</span>
              {item.title}
            </button>
          ))}
        </nav>
      </ScrollArea>
    </>
  );
}
