import { useEffect, useState } from "react";
import { ChevronsUpDown, House, GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCompanyStore, useCompaniesStore } from "@/stores/";
import { useRouter } from "@tanstack/react-router";
import api from "@/services/api.service";

export function CompanySwitcher() {
  const router = useRouter();
  const { current: companies } = useCompaniesStore();
  const { current: currentCompany, set: setCurrentCompany } = useCompanyStore();
  const { isMobile } = useSidebar();
  const [activeCompany, setActiveCompany] = useState(
    companies[
      companies.findIndex((company) => company.id === currentCompany?.id)
    ],
  );

  useEffect(() => {
    setActiveCompany(
      companies[
        companies.findIndex((company) => company.id === currentCompany?.id)
      ],
    );
  }, [companies]);

  if (!activeCompany) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                style={{ backgroundColor: activeCompany.color }}
                className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
              >
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeCompany.name}
                </span>
                {/* <span className="truncate text-xs">{activeCompany.plan}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Empresas
            </DropdownMenuLabel>
            {companies.map((company, index) => (
              <DropdownMenuItem
                key={company.name}
                onClick={() => {
                  setActiveCompany(company);
                  api.get(`/companies?id=${company.id}`).then((response) => {
                    setCurrentCompany(response.data.company);
                    api.post("/users/companies/last-access", {
                      companyId: company.id,
                    });
                  });
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <GalleryVerticalEnd className="size-3.5 shrink-0" />
                </div>
                {company.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.navigate({ to: "/dashboard" })}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <House className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Voltar ao início
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
