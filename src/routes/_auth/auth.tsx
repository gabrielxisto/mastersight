import { useEffect } from "react";
import {
  Outlet,
  createFileRoute,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import api from "@/services/api.service";

export const Route = createFileRoute("/_auth/auth")({
  component: AuthComponent,
  validateSearch: (search) => {
    return {
      token: typeof search.token === "string" ? search.token : undefined,
    };
  },
});

function AuthComponent() {
  const router = useRouter();
  const { token } = useSearch({ from: Route.id });

  useEffect(() => {
    console.log(token)
    if (token) {
      api
        .get(`/auth/validate-token?token=${token}`)
        .then(() => {
          router.navigate({
            to: "/auth/reset",
            search: (old) => ({ ...old, token }),
          });
        })
        .catch(() => {
          router.navigate({
            to: "/auth",
            search: (old) => ({ ...old, token: undefined }),
          });
        });
    }
  }, [token]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-background">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="https://mastersight.com"
            className="flex items-center gap-2 font-medium text-foreground"
          >
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
            MasterSight.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <Outlet />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Placeholder"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
