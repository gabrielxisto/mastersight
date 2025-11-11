import * as React from "react";
import { BookOpen, Settings2, Users } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "../nav-user";
import { CompanySwitcher } from "./company-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import { House } from "lucide-react";
import { useUserStore, useCompanyStore } from "@/stores/";
import { useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import api from "@/services/api.service";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [data, setData] = React.useState<any>([])
  const { state } = useSidebar();
  const { current: user } = useUserStore();
  const { current: company, set: setCompany } = useCompanyStore();
  const router = useRouter();

  React.useEffect(() => {
    if (company) {
      api.get(`/companies/team?companyId=${company?.id}`).then((response) => {
        const userData = response.data.team.find((member: any) => member.userId === user?.id);
      
        if (userData) {
          setCompany({
            ...company,
            permissions: userData.permissions
          });

          setData([
            {
              title: "Arquivo",
              url: "#",
              icon: BookOpen,
              isActive: true,
              items: [
                {
                  title: "Equipe",
                  url: "/company/archive/team",
                },
                userData.permissions.includes("viewDepartments") ? {
                  title: "Departamentos",
                  url: "/company/archive/departments",
                } : undefined,
                userData.permissions.includes("viewRoles") ? {
                  title: "Cargos",
                  url: "/company/archive/roles",
                } : undefined,
                {
                  title: "Benefícios",
                  url: "/company/archive/benefits",
                },
                {
                  title: "Premiações",
                  url: "/company/archive/rewards",
                },
                {
                  title: "Desempenho",
                  url: "/company/archive/performance",
                },
                {
                  title: "Manuais",
                  url: "/company/archive/manuals",
                },
                {
                  title: "Comunicação",
                  url: "/company/archive/communication",
                },
              ],
            }
          ])
        }
      });
    }
  }, [company?.id]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarMenuButton
        asChild
        className={cn(
          "mt-4 hover:bg-transparent active:bg-transparent cursor-default",
          state === "collapsed" ? "ml-2" : "ml-4",
        )}
      >
        <div className="flex items-center">
          <svg
            className="size-6 text-foreground"
            viewBox="0 0 242 241"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1V219H36.5V33L123 108.5L205.5 33.5V190C168.939 218.057 148.027 222.004 109.5 190V139L74 107.5V201C100.009 229.387 117.164 238 152.5 240C200.054 235.035 228.649 221.745 241 179V1H187L121.5 61L55 1H1Z"
              fill="currentColor"
              stroke="currentColor"
            />
          </svg>

          <span className="text-base font-semibold">MasterSight.</span>
        </div>
      </SidebarMenuButton>
      <SidebarHeader className="mt-3">
        <CompanySwitcher />
      </SidebarHeader>
      <SidebarContent className="mt-3 overflow-y-auto overflow-x-hidden scrollbar-hidden">
        <SidebarMenuButton
          onClick={() =>
            router.navigate({ to: "/company/", search: { id: company.id } })
          }
          className="ml-2.5"
          tooltip={"Início"}
        >
          <House />
          <span>Início</span>
        </SidebarMenuButton>
        <NavMain items={data} />
        <SidebarMenuButton
          onClick={() =>
            router.navigate({
              to: "/company/settings/",
              search: { id: company.id },
            })
          }
          className="ml-2.5"
          tooltip={"Início"}
        >
          <Settings2 />
          <span>Configurações</span>
        </SidebarMenuButton>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            user || {
              name: "Gabriel Xisto",
              email: "gsxisto@gmail.com",
              image: "/avatars/shadcn.jpg",
            }
          }
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
