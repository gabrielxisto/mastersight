import { useEffect, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { Sun, MoonStar } from "lucide-react";
import { titles } from "@/lib/texts";

export function Header() {
  const [theme, setTheme] = useState(
    localStorage.getItem("mastersight-theme") || "light",
  );
  const [title, setTitle] = useState("MasterSight");
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    titles.map((item) => {
      if (pathname.includes(item.path)) {
        setTitle(item.title[0]);
      }
    });
  }, [pathname]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("mastersight-theme", "light");
      document.body.classList.remove("dark");
    } else {
      setTheme("dark");
      localStorage.setItem("mastersight-theme", "dark");
      document.body.classList.add("dark");
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-foreground cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium text-foreground">{title}</h1>
      </div>

      <button
        type="button"
        className="cursor-pointer mr-6 hover-opacity-90"
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <Sun className="size-5" />
        ) : (
          <MoonStar className="size-5" />
        )}
      </button>
    </header>
  );
}
