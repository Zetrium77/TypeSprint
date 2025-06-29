import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage or preferred theme
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("theme");
            if (stored === "light" || stored === "dark") return stored;
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        }
        return "light";
    });

    useEffect(() => {
        // Add class for animation 
        document.documentElement.classList.add('theme-transition');
        
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
        
        // Remove class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    }, [theme]);

    const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
};