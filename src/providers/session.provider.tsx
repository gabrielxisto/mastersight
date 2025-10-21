import { useEffect } from "react";
import { useUserStore } from "@/stores/";
import { useLocation, useRouter } from "@tanstack/react-router";
import { verifyAuthentication } from "@/lib/session";

export default function ({ children }: { children: React.ReactNode }) {
  const user = useUserStore();
  const router = useRouter();
  const location = useLocation();
  const pathname = location.pathname;

  const publicRoutes = [
    "/auth",
    "/auth/register",
    "/auth/forgot",
    "/auth/reset",
    "/admin/auth",
  ];

  useEffect(() => {
    verifyAuthentication().then(user.set);
  }, []);

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname);

    if (pathname === "/") {
      if (user.current) {
        if (user.current.admin) {
          router.navigate({ to: "/admin/dashboard" });
        } else {
          router.navigate({ to: "/dashboard" });
        }
      } else {
        router.navigate({ to: "/auth" });
      }
    } else {
      if (isPublicRoute) {
        if (user.current) {
          if (user.current.admin) {
            router.navigate({ to: "/admin/dashboard" });
          } else {
            router.navigate({ to: "/dashboard" });
          }
        }
      } else {
        if (!user.current) {
          if (pathname.includes("/admin")) {
            router.navigate({ to: "/admin/auth" });
          } else {
            router.navigate({ to: "/auth" });
          }
        }
      }
    }
  }, [pathname, user.current]);

  return <>{children}</>;
}
