'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { usePathname, useSearchParams } from 'next/navigation'

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme") as Theme;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!mounted)
    return null;

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div className="w-full h-full flex flex-col gap-3 px-3 pb-3 relative">
        {children}
        {loading && (
        <>
            <BarLoader className="w-full top-0 left-0 absolute" color={theme === "light" ? "#FFF" : "#000"} />
            <BarLoader className="w-full bottom-0 left-0 absolute" color={theme === "light" ? "#FFF" : "#000"} />
        </>
        )}
    </div>
    </ThemeContext.Provider>
  )
}