import { useEffect, useState } from "react";
import {
  createFileRoute,
  useRouter,
  useSearch,
  Link,
} from "@tanstack/react-router";
import { Route as RootRoute } from "./auth.index";
import api from "@/services/api.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_auth/auth/reset")({
  component: ResetPassword,
});

function ResetPassword() {
  const router = useRouter();
  const { token } = useSearch({ from: RootRoute.id });
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      api
        .get(`/auth/validate-token?token=${token}`)
        .then((response) => {
          setEmail(response.data.email);
        })
        .catch(() => {
          router.navigate({
            to: "/auth",
            search: (old) => ({ ...old, token: undefined }),
          });
        });
    }
  }, [token]);

  const reset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError(true);
      return;
    }

    api.post("/auth/reset-password", { token, password }).then(() => {
      router.navigate({
        to: "/auth",
        search: (old) => ({ ...old, token: undefined }),
      });
    });
  };

  return (
    <form onSubmit={reset} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">Redefinir senha</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Insira sua nova senha e depois a confirme.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            disabled
            className="opacity-50"
          />
        </div>
        <div className="grid gap-3">
          {error && <p className="text-red-500">* Senhas não coincidem</p>}
          <Label htmlFor="password" className="text-foreground">
            Senha
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            className="opacity-50"
            onChange={() => setError(false)}
          />
        </div>
        <div className="grid gap-3">
          {error && <p className="text-red-500">* Senhas não coincidem</p>}
          <Label htmlFor="confirmPassword" className="text-foreground">
            Confirme a Senha
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="opacity-50"
            onChange={() => setError(false)}
          />
        </div>
        <Button
          type="submit"
          className={cn(
            "w-full text-background bg-foreground",
            "hover:bg-foreground/90",
          )}
        >
          Redefinir
        </Button>
      </div>
      <div className="text-center text-sm text-foreground">
        Voltar para o{" "}
        <Link to="/auth" className="underline underline-offset-4">
          login
        </Link>
      </div>
    </form>
  );
}
