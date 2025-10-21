import { useEffect } from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { AppSidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { useCompanyStore } from "@/stores/";

export const Route = createFileRoute("/_dashboard/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const { current: company, set: setCompany } = useCompanyStore();

  useEffect(() => {
    if (company) setCompany(false);
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
