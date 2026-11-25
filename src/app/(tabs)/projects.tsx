import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { readAll } from "@/services/element-service";
import type { Element } from "@/types/element";

// READ ALL : liste les éléments enregistrés dans le module CRUD.
export default function ProjectsScreen() {
  const theme = useTheme();
  const [elements, setElements] = useState<Element[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useFocusEffect(
    useCallback(() => {
      let actif = true;
      setChargement(true);
      void readAll()
        .then((resultat) => {
          if (actif) {
            setElements(resultat);
            setErreur("");
          }
        })
        .catch((cause: unknown) => {
          if (actif) {
            setErreur(cause instanceof Error ? cause.message : "Erreur de lecture des éléments.");
          }
        })
        .finally(() => {
          if (actif) setChargement(false);
        });
      return () => { actif = false; };
    }, []),
  );

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.page}
    >
      <Text style={[styles.titre, { color: theme.text }]}>Mes projets</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>Cette liste correspond aux données locales du TP CRUD. Sélectionne un élément pour consulter sa fiche avec READ BY ID.</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push("/crud")}
        style={[styles.action, { backgroundColor: "#2563EB" }]}
      >
        <Text style={styles.texteAction}>Créer / modifier un élément (CRUD)</Text>
      </Pressable>

      {chargement && <ActivityIndicator color={theme.text} />}
      {!!erreur && <Text style={{ color: "#DC2626" }}>{erreur}</Text>}
      {!chargement && !erreur && elements.length === 0 && (
        <Text style={[styles.description, { color: theme.textSecondary }]}>Aucun projet pour le moment. Utilise l'onglet CRUD pour créer le premier.</Text>
      )}
      {!chargement && elements.map((element) => (
        <Pressable
          key={element.id}
          accessibilityRole="button"
          accessibilityLabel={`Voir le projet ${element.titre}`}
          onPress={() => router.push({ pathname: "/project", params: { id: element.id } })}
          style={({ pressed }) => [styles.carte, { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 }]}
        >
          <Text style={[styles.nom, { color: theme.text }]}>#{element.id} — {element.titre}</Text>
          <Text numberOfLines={2} style={{ color: theme.textSecondary }}>{element.description || "Sans description"}</Text>
          <Text style={styles.ouvrir}>Voir le détail</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingBottom: 125, gap: 14, width: "100%", maxWidth: 760, alignSelf: "center" },
  titre: { fontSize: 28, fontWeight: "800" },
  description: { fontSize: 15, lineHeight: 22 },
  action: { padding: 14, borderRadius: 10, alignItems: "center", marginVertical: 4 },
  texteAction: { color: "#FFFFFF", fontWeight: "700" },
  carte: { borderRadius: 14, padding: 18, gap: 8 },
  nom: { fontSize: 18, fontWeight: "700" },
  ouvrir: { color: "#2563EB", fontWeight: "700", marginTop: 4 },
});
