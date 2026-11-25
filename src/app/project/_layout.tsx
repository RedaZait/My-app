import { Stack } from "expo-router";

// Une pile séparée : l'écran de détail s'ouvre au-dessus des onglets.
export default function ProjectLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Détail du projet" }} />
    </Stack>
  );
}
