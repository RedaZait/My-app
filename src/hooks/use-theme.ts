import { Colors } from "@/constants/theme";
import { useAppThemeMode } from "@/contexts/theme-mode";

export function useTheme() {
  const { colorScheme } = useAppThemeMode();
  return Colors[colorScheme];
}
