import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";
import { Palette, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_company/company/_settings/settings")({
  component: SettingsComponent,
});

const sidebarNavItems = [
  {
    title: "Informações",
    href: "/company/settings",
    icon: <Wrench size={18} />,
  },
  {
    title: "Aparência",
    href: "/company/settings/appearance",
    icon: <Palette size={18} />,
  },
];

function SettingsComponent() {
  return (
    <main className={cn("flex flex-col justify-center px-17 py-14")}>
      <div className="space-y-0.5 w-full">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da empresa e defina as suas preferências.
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="top-0 lg:sticky lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex w-full overflow-y-scroll max-h-[32rem] p-1">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
