import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import MotDePasse from "@/components/mot-de-passe";
import { useTheme } from "@/hooks/use-theme";
import { useAppThemeMode, type ThemeMode } from "@/contexts/theme-mode";

// Écran de démonstration du mini TP (onglet « Mot de passe »).
export default function TestScreen() {
  const [message, setMessage] = useState("");
  const theme = useTheme();
  const { mode, colorScheme, setMode } = useAppThemeMode();
  const options: { value: ThemeMode; label: string }[] = [
    { value: "light", label: "Clair" },
    { value: "dark", label: "Sombre" },
    { value: "system", label: "Système" },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.conteneur}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.carte, { backgroundColor: theme.backgroundElement }]}>
        <Text style={[styles.titre, { color: theme.text }]}>Mini TP — Mot de passe</Text>
        <Text style={[styles.introduction, { color: theme.textSecondary }]}>
          Tape un mot de passe, puis appuie sur l’icône pour l’afficher ou le masquer.
          La limite est fixée à 12 caractères.
        </Text>

        <View style={styles.themeSection}>
          <Text style={[styles.themeTitle, { color: theme.text }]}>Thème de l'application</Text>
          <View style={styles.themeChoices} accessibilityRole="radiogroup">
            {options.map((option) => {
              const selected = mode === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setMode(option.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={`Thème ${option.label}`}
                  style={[
                    styles.themeChoice,
                    {
                      backgroundColor: selected ? (colorScheme === "dark" ? "#2563EB" : "#1D4ED8") : theme.background,
                      borderColor: selected ? "#60A5FA" : theme.textSecondary,
                    },
                  ]}
                >
                  <Text style={[styles.themeChoiceText, { color: selected ? "#FFFFFF" : theme.text }]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={[styles.themeHint, { color: theme.textSecondary }]}>
            Mode actif : {colorScheme === "dark" ? "sombre" : "clair"}
            {mode === "system" ? " (selon l'appareil)" : ""}
          </Text>
        </View>

        <MotDePasse
          maxLength={12}
          onChangeText={() => setMessage("")}
          onMaxLengthReached={() => setMessage("Limite atteinte : 12 caractères !")}
        />

        {message !== "" && (
          <Text accessibilityLiveRegion="polite" style={styles.message}>
            {message}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  carte: {
    width: "100%",
    maxWidth: 520,
    borderRadius: 18,
    padding: 24,
    gap: 18,
  },
  titre: {
    fontWeight: "700",
    fontSize: 26,
  },
  introduction: {
    lineHeight: 23,
    fontSize: 15,
  },
  themeSection: {
    gap: 10,
  },
  themeTitle: {
    fontWeight: "600",
    fontSize: 16,
  },
  themeChoices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  themeChoice: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
  },
  themeChoiceText: {
    fontSize: 14,
    fontWeight: "600",
  },
  themeHint: {
    fontSize: 13,
  },
  message: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    color: "#166534",
    backgroundColor: "#DCFCE7",
    fontSize: 14,
    fontWeight: "600",
  },
});
