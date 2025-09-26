import { useEffect } from 'react';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { useUserStore } from '@/stores/';
import { verifyAuthentication } from '@/lib/session';
import SessionProvider from '@/providers/session.provider';
import ToastProvider from '@/providers/toast.provider';

export const Route = createRootRoute({
  component: () => {
    const user = useUserStore();

    useEffect(() => {
      verifyAuthentication().then(user.set);
    }, [])
    
    useEffect(() => {
      const theme = localStorage.getItem("mastersight-theme");

      if (theme) {
        document.body.classList.toggle("dark", theme === "dark");
      } else {
        localStorage.setItem("mastersight-theme", "light");
      }
    }, [])

    return (
      <SessionProvider>
        <ToastProvider />
        <Outlet />
      </SessionProvider>
    )
  }
})
