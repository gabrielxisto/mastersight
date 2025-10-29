import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api.service";
import { useState } from "react";
import { messages } from "@/lib/texts";

export const Route = createFileRoute("/_auth/auth/")({
  component: AuthComponent,
});

function AuthComponent({ className, ...props }: React.ComponentProps<"form">) {
  const [errors, setErrors] = useState<{ [key: string]: false | string }>({});

  const signIn = (
    e: React.FormEvent<HTMLFormElement> | null,
    type: "credentials" | "google",
  ) => {
    if (type === "google") {
      window.location.href = `${import.meta.env.VITE_API_ENDPOINT}/auth/google`;
    } else {
      if (e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        api
          .post("/auth/credentials", { email, password, type: "users" })
          .then(() => {
            window.location.href = "/dashboard";
          })
          .catch((error) => {
            if (error.response?.data?.error) {
              const errorsMaps: Record<string, string> = {
                "invalid-credentials": "password",
                "user-not-exists": "email",
              };

              setErrors((prev) => ({
                ...prev,
                [errorsMaps[error.response?.data?.error]]:
                  messages.error[error.response?.data?.error],
              }));
            }
          });
      }
    }
  };

  return (
    <form
      onSubmit={(e) => signIn(e, "credentials")}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Entrar na sua conta
        </h1>
        <p className="text-muted-foreground text-sm text-balance">
          Insira seu email para entrar na sua conta.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email}</span>
          )}
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nome@exemplo.com"
            required
            onChange={() => setErrors((prev) => ({ ...prev, email: false }))}
          />
        </div>
        <div className="grid gap-3">
          {errors.password && (
            <span className="text-sm text-red-600">{errors.password}</span>
          )}
          <div className="flex items-center">
            <Label htmlFor="password" className="text-foreground">
              Senha
            </Label>
            <Link
              to="/auth/forgot"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            className="text-foreground placeholder:text-muted"
            required
            onChange={() => setErrors((prev) => ({ ...prev, password: false }))}
          />
        </div>
        <Button type="submit" className="w-full text-background bg-foreground">
          Entrar
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Ou continue com
          </span>
        </div>
        <Button
          onClick={() => signIn(null, "google")}
          variant="outline"
          className="w-full text-foreground"
        >
          <img src="/images/google.svg" className="size-4" />
          Entrar com Google
        </Button>
      </div>
      <div className="text-center text-sm text-foreground">
        Não possui uma conta?{" "}
        <Link to="/auth/register" className="underline underline-offset-4">
          Cadastre-se
        </Link>
      </div>
    </form>
  );
}
