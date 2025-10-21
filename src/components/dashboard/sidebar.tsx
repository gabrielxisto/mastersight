import * as React from "react";
import { LayoutDashboard, Mail, ScrollText } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "../nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStore } from "@/stores/";

const data = {
  navMain: [
    {
      title: "Empresas",
      url: "/dashboard/",
      icon: LayoutDashboard,
    },
    {
      title: "Convites",
      url: "/dashboard/invites",
      icon: Mail,
    },
    {
      title: "Documentação",
      url: "/dashboard/docs",
      icon: ScrollText,
    },
  ],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { current: user } = useUserStore();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent cursor-default"
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <NavUser
        user={
          user || {
            name: "Gabriel Xisto",
            email: "gsxisto@gmail.com",
            image: "/avatars/shadcn.jpg",
          }
        }
      />
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
