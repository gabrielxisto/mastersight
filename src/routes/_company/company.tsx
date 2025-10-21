import { useEffect, useState } from "react";
import {
  createFileRoute,
  Outlet,
  useLocation,
  useRouter,
} from "@tanstack/react-router";
import { Sun, MoonStar } from "lucide-react";

import { AppSidebar } from "@/components/company/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useCompanyStore } from "@/stores/";
import { titles } from "@/lib/texts";

export const Route = createFileRoute("/_company/company")({
  component: CompanyComponent,
});

function CompanyComponent() {
  const { current: company } = useCompanyStore();
  const router = useRouter();
  const [theme, setTheme] = useState(
    localStorage.getItem("mastersight-theme") || "light",
  );
  const [title, setTitle] = useState(["Início"]);
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (!company) router.navigate({ to: "/dashboard" });
  }, []);

  useEffect(() => {
    let newTitle = ["Início"];

    titles.map((item) => {
      if (pathname.includes(item.path)) {
        newTitle = item.title;
      }
    });

    setTitle(newTitle);
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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {title.length > 1 && (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">{title[1]}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                )}
                <BreadcrumbItem>
                  <BreadcrumbPage>{title[0]}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
