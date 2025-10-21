import api from "@/services/api.service";
import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_dashboard/dashboard/invites")({
  component: InviteComponent,
});

function InviteComponent() {
  const [invites, setInvites] = useState([]);
  
  useEffect(() => {
    api.get("/users/invites").then((response) => {
      setInvites(response.data.invites);
    });

  }, []);

  return (
    <main className="w-full h-full">
      
      {invites.length === 0 && (
        <div className="flex items-center gap-2 absolute -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 text-muted-foreground">
          <Mail size={18} />
          <p>Nenhum convite encontrado</p>
        </div>
      )}
    </main>
  )
}
