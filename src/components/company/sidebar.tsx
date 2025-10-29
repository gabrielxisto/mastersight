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

const data = {
  navMain: [
    {
      title: "Arquivo",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Departamentos",
          url: "/company/archive/departments",
        },
        {
          title: "Cargos",
          url: "/company/archive/roles",
        },
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
    },
    {
      title: "Equipe",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Cadastro Geral",
          url: "/company/team/general-register",
        },
        {
          title: "Feedbacks",
          url: "/company/team/feedbacks",
        },
        {
          title: "Aba de Avaliações",
          url: "/company/team/evaluations",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { current: user } = useUserStore();
  const { current: company } = useCompanyStore();
  const router = useRouter();

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
        <NavMain items={data.navMain} />
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
