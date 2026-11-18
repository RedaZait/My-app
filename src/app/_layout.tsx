import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { AppThemeProvider, useAppThemeMode } from "@/contexts/theme-mode";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { colorScheme } = useAppThemeMode();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <AppThemeProvider>
      <AppContent />
    </AppThemeProvider>
  );
}
