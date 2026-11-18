import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

type ThemeModeContextValue = {
  mode: ThemeMode;
  colorScheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  // Le choix "system" suit automatiquement le thème du téléphone ou du navigateur.
  const colorScheme: ResolvedTheme =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const value = useMemo(
    () => ({ mode, colorScheme, setMode }),
    [mode, colorScheme],
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useAppThemeMode() {
  const value = useContext(ThemeModeContext);
  if (!value) {
    throw new Error("useAppThemeMode doit être utilisé dans AppThemeProvider");
  }
  return value;
}
