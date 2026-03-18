"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  if (!mounted) return null; // 🚫 prevents hydration error

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      className="w-10 h-10 rounded-full overflow-hidden"
    >
      <div
        className={`w-full h-full bg-[url('/theme-toggle.png')] bg-no-repeat bg-cover transition-all duration-300 ${
          theme === "light"
            ? "bg-left"
            : "bg-right"
        }`}
        style={{
          backgroundSize: "200% 100%",
        }}
      />
    </button>
  );
}
