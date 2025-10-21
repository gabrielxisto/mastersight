import { useEffect } from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import SessionProvider from "@/providers/session.provider";
import ToastProvider from "@/providers/toast.provider";

export const Route = createRootRoute({
  component: () => {
    useEffect(() => {
      const theme = localStorage.getItem("mastersight-theme");

      if (theme) {
        document.body.classList.toggle("dark", theme === "dark");
      } else {
        localStorage.setItem("mastersight-theme", "light");
      }
    }, []);

    return (
      <SessionProvider>
        <ToastProvider />
        <Outlet />
      </SessionProvider>
    );
  },
});
