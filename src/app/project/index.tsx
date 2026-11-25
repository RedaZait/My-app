import { useCallback, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { readById } from "@/services/element-service";
import type { Element } from "@/types/element";

// READ BY ID : exemple de page de détail dans src/app/project/index.tsx.
export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const theme = useTheme();
  const [element, setElement] = useState<Element | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useFocusEffect(
    useCallback(() => {
      let actif = true;
      setChargement(true);
      void readById(id ?? "")
        .then((resultat) => {
          if (actif) {
            setElement(resultat);
            setErreur("");
          }
        })
        .catch((cause: unknown) => {
          if (actif) setErreur(cause instanceof Error ? cause.message : "Impossible de charger la fiche.");
        })
        .finally(() => {
          if (actif) setChargement(false);
        });
      return () => { actif = false; };
    }, [id]),
  );

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.page}>
      {chargement && <ActivityIndicator color={theme.text} />}
      {!!erreur && <Text style={styles.erreur}>{erreur}</Text>}
      {!chargement && !erreur && !element && (
        <Text style={{ color: theme.text }}>Aucun élément trouvé pour l'ID {id ?? "(absent)"}.</Text>
      )}
      {!chargement && element && (
        <View style={[styles.carte, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>READ BY ID — #{element.id}</Text>
          <Text style={[styles.titre, { color: theme.text }]}>{element.titre}</Text>
          <Text style={[styles.description, { color: theme.text }]}>{element.description || "Aucune description."}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Créé le {new Date(element.createdAt).toLocaleString()}</Text>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Modifié le {new Date(element.updatedAt).toLocaleString()}</Text>
        </View>
      )}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={[styles.bouton, { backgroundColor: "#2563EB" }]}
      >
        <Text style={styles.boutonTexte}>Retour à la liste</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { width: "100%", maxWidth: 720, alignSelf: "center", padding: 24, gap: 18 },
  carte: { borderRadius: 16, padding: 20, gap: 14 },
  titre: { fontSize: 26, fontWeight: "800" },
  label: { fontSize: 13 },
  description: { fontSize: 16, lineHeight: 24 },
  erreur: { color: "#DC2626", fontSize: 15 },
  bouton: { alignItems: "center", padding: 14, borderRadius: 12 },
  boutonTexte: { color: "#FFFFFF", fontWeight: "700" },
});
