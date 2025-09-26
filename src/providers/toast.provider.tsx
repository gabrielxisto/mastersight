import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function ThemeToaster() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("mastersight-theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }

    const handleStorage = () => {
      const updatedTheme = localStorage.getItem("mastersight-theme");
      if (updatedTheme === "dark" || updatedTheme === "light") {
        setTheme(updatedTheme);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <Toaster
      key={theme}
      position="bottom-center"
      toastOptions={{
        style:
          theme === "dark"
            ? { background: "#333", color: "#fff" }
            : { background: "#fff", color: "#333" },
      }}
    />
  );
}
