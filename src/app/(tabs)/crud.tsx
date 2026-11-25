import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";
import {
  createElement,
  deleteById,
  readAll,
  readById,
  updateElement,
} from "@/services/element-service";
import type { Element } from "@/types/element";

type BoutonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  couleur?: "bleu" | "rouge" | "neutre";
};

function Bouton({ label, onPress, disabled, couleur = "bleu" }: BoutonProps) {
  const theme = useTheme();
  const fond =
    couleur === "rouge"
      ? "#BE123C"
      : couleur === "neutre"
        ? theme.backgroundSelected
        : "#2563EB";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.bouton,
        { backgroundColor: fond, opacity: disabled ? 0.5 : pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[styles.texteBouton, { color: couleur === "neutre" ? theme.text : "#FFFFFF" }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function CrudScreen() {
  const theme = useTheme();
  const [elements, setElements] = useState<Element[]>([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [idSaisi, setIdSaisi] = useState("");
  const [idEnModification, setIdEnModification] = useState<string | null>(null);
  const [resultatRecherche, setResultatRecherche] = useState<Element | null>(null);
  const [message, setMessage] = useState("Chargement des éléments...");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let actif = true;
    void readAll()
      .then((resultat) => {
        if (!actif) return;
        setElements(resultat);
        setMessage(`Base locale prête : ${resultat.length} élément(s).`);
      })
      .catch((erreur: unknown) => {
        if (actif) setMessage(messageErreur(erreur));
      })
      .finally(() => {
        if (actif) setChargement(false);
      });

    return () => {
      actif = false;
    };
  }, []);

  function messageErreur(erreur: unknown): string {
    return erreur instanceof Error ? erreur.message : "Une erreur inconnue est survenue.";
  }

  async function executer(action: () => Promise<void>) {
    if (chargement) return;
    setChargement(true);
    try {
      await action();
    } catch (erreur: unknown) {
      setMessage(`Erreur : ${messageErreur(erreur)}`);
    } finally {
      setChargement(false);
    }
  }

  async function recharger() {
    const resultat = await readAll();
    setElements(resultat);
  }

  function viderFormulaire() {
    setIdEnModification(null);
    setTitre("");
    setDescription("");
  }

  function creer() {
    void executer(async () => {
      const nouvelElement = await createElement(titre, description);
      await recharger();
      viderFormulaire();
      setIdSaisi(nouvelElement.id);
      setResultatRecherche(nouvelElement);
      setMessage(`CREATE : élément n°${nouvelElement.id} ajouté.`);
    });
  }

  function lireTous() {
    void executer(async () => {
      const resultat = await readAll();
      setElements(resultat);
      setMessage(`READ ALL : ${resultat.length} élément(s) récupéré(s).`);
    });
  }

  function lireUn() {
    void executer(async () => {
      if (!idSaisi.trim()) {
        setMessage("Saisis un ID pour effectuer READ BY ID.");
        return;
      }
      const element = await readById(idSaisi);
      setResultatRecherche(element);
      setMessage(element ? `READ BY ID : élément n°${element.id} trouvé.` : `Aucun élément avec l'ID ${idSaisi.trim()}.`);
    });
  }

  function commencerModification(element: Element) {
    setIdEnModification(element.id);
    setIdSaisi(element.id);
    setTitre(element.titre);
    setDescription(element.description);
    setMessage(`UPDATE : modifie le formulaire puis valide l'élément n°${element.id}.`);
  }

  function modifier() {
    if (!idEnModification) return;
    void executer(async () => {
      const element = await updateElement(idEnModification, titre, description);
      if (!element) {
        setMessage("Cet élément n'existe plus.");
        viderFormulaire();
        await recharger();
        return;
      }
      await recharger();
      viderFormulaire();
      setResultatRecherche(element);
      setMessage(`UPDATE : élément n°${element.id} modifié.`);
    });
  }

  function supprimer(id: string) {
    void executer(async () => {
      if (!id.trim()) {
        setMessage("Saisis un ID pour effectuer DELETE.");
        return;
      }
      const supprime = await deleteById(id);
      await recharger();
      if (resultatRecherche?.id === id.trim()) setResultatRecherche(null);
      if (idEnModification === id.trim()) viderFormulaire();
      setMessage(supprime ? `DELETE : élément n°${id.trim()} supprimé.` : `Aucun élément avec l'ID ${id.trim()}.`);
    });
  }

  const couleurBordure = theme.textSecondary;
  const couleurSaisie = theme.background;

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.enTete}>
        <Text style={[styles.titrePage, { color: theme.text }]}>Mini TP · CRUD</Text>
        <Text style={[styles.sousTitre, { color: theme.textSecondary }]}>Créer, lire, modifier et supprimer des éléments avec un ID. Les données restent sur cet appareil.</Text>
      </View>

      <View style={[styles.carte, { backgroundColor: theme.backgroundElement }]}>
        <Text style={[styles.titreSection, { color: theme.text }]}>
          {idEnModification ? `UPDATE · élément n°${idEnModification}` : "CREATE · nouvel élément"}
        </Text>
        <Text style={[styles.libelle, { color: theme.text }]}>Titre *</Text>
        <TextInput
          accessibilityLabel="Titre de l'élément"
          value={titre}
          onChangeText={setTitre}
          placeholder="Ex. : Mon premier élément"
          placeholderTextColor={theme.textSecondary}
          style={[styles.saisie, { color: theme.text, backgroundColor: couleurSaisie, borderColor: couleurBordure }]}
          maxLength={100}
        />
        <Text style={[styles.libelle, { color: theme.text }]}>Description</Text>
        <TextInput
          accessibilityLabel="Description de l'élément"
          value={description}
          onChangeText={setDescription}
          placeholder="Quelques détails (facultatif)"
          placeholderTextColor={theme.textSecondary}
          multiline
          style={[styles.saisie, styles.saisieMultiligne, { color: theme.text, backgroundColor: couleurSaisie, borderColor: couleurBordure }]}
          maxLength={500}
        />
        <View style={styles.actions}>
          {idEnModification ? (
            <>
              <Bouton label="Enregistrer la modification" onPress={modifier} disabled={chargement} />
              <Bouton label="Annuler" couleur="neutre" onPress={viderFormulaire} disabled={chargement} />
            </>
          ) : (
            <Bouton label="Créer un élément" onPress={creer} disabled={chargement} />
          )}
        </View>
      </View>

      <View style={[styles.carte, { backgroundColor: theme.backgroundElement }]}>
        <Text style={[styles.titreSection, { color: theme.text }]}>READ BY ID / DELETE</Text>
        <Text style={[styles.libelle, { color: theme.text }]}>Identifiant (ID)</Text>
        <TextInput
          accessibilityLabel="ID à rechercher ou supprimer"
          keyboardType="number-pad"
          value={idSaisi}
          onChangeText={setIdSaisi}
          placeholder="Ex. : 1"
          placeholderTextColor={theme.textSecondary}
          style={[styles.saisie, { color: theme.text, backgroundColor: couleurSaisie, borderColor: couleurBordure }]}
        />
        <View style={styles.actions}>
          <Bouton label="Lire par ID" onPress={lireUn} disabled={chargement} />
          <Bouton label="Supprimer cet ID" onPress={() => supprimer(idSaisi)} couleur="rouge" disabled={chargement} />
        </View>
        {resultatRecherche && (
          <View style={[styles.resultat, { borderColor: couleurBordure }]}>
            <Text style={[styles.resultatTitre, { color: theme.text }]}>Résultat : #{resultatRecherche.id} — {resultatRecherche.titre}</Text>
            <Text style={{ color: theme.textSecondary }}>{resultatRecherche.description || "Aucune description"}</Text>
            <Bouton label="Modifier ce résultat" couleur="neutre" onPress={() => commencerModification(resultatRecherche)} disabled={chargement} />
          </View>
        )}
      </View>

      <View style={[styles.carte, { backgroundColor: theme.backgroundElement }]}>
        <View style={styles.ligneTitre}>
          <Text style={[styles.titreSection, { color: theme.text }]}>READ ALL · liste ({elements.length})</Text>
          <Bouton label="Actualiser" couleur="neutre" onPress={lireTous} disabled={chargement} />
        </View>
        {elements.length === 0 ? (
          <Text style={[styles.vide, { color: theme.textSecondary }]}>Aucun élément pour le moment. Crée ton premier élément avec le formulaire ci-dessus.</Text>
        ) : (
          elements.map((element) => (
            <View key={element.id} style={[styles.element, { backgroundColor: theme.background, borderColor: couleurBordure }]}>
              <View style={styles.enteteElement}>
                <Text style={[styles.elementTitre, { color: theme.text }]}>#{element.id} · {element.titre}</Text>
              </View>
              <Text style={[styles.description, { color: theme.textSecondary }]}>{element.description || "Aucune description"}</Text>
              <View style={styles.actions}>
                <Bouton label="Lire" couleur="neutre" disabled={chargement} onPress={() => { setIdSaisi(element.id); setResultatRecherche(element); setMessage(`READ BY ID : élément n°${element.id} trouvé.`); }} />
                <Bouton label="Modifier" disabled={chargement} onPress={() => commencerModification(element)} />
                <Bouton label="Supprimer" couleur="rouge" disabled={chargement} onPress={() => supprimer(element.id)} />
              </View>
            </View>
          ))
        )}
      </View>

      <View style={[styles.message, { backgroundColor: theme.backgroundSelected }]}>
        {chargement && <ActivityIndicator color={theme.text} />}
        <Text accessibilityLiveRegion="polite" style={[styles.messageTexte, { color: theme.text }]}>{message}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 18, paddingBottom: 130, gap: 18, alignItems: "center" },
  enTete: { width: "100%", maxWidth: 680, gap: 6, paddingVertical: 8 },
  titrePage: { fontSize: 29, fontWeight: "800" },
  sousTitre: { fontSize: 14, lineHeight: 21 },
  carte: { width: "100%", maxWidth: 680, padding: 18, borderRadius: 16, gap: 12 },
  titreSection: { fontSize: 18, fontWeight: "700", flexShrink: 1 },
  libelle: { fontSize: 14, fontWeight: "600" },
  saisie: { minHeight: 48, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16 },
  saisieMultiligne: { minHeight: 84, textAlignVertical: "top" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  bouton: { minHeight: 42, paddingHorizontal: 13, paddingVertical: 11, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  texteBouton: { fontSize: 13, fontWeight: "700" },
  resultat: { padding: 12, gap: 10, borderWidth: 1, borderRadius: 10 },
  resultatTitre: { fontWeight: "700", fontSize: 15 },
  ligneTitre: { flexDirection: "row", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" },
  vide: { fontSize: 14, lineHeight: 21, paddingVertical: 8 },
  element: { borderWidth: 1, borderRadius: 12, padding: 12, gap: 10 },
  enteteElement: { flexDirection: "row", alignItems: "center" },
  elementTitre: { fontSize: 16, fontWeight: "700" },
  description: { fontSize: 14, lineHeight: 20 },
  message: { width: "100%", maxWidth: 680, minHeight: 50, borderRadius: 10, padding: 14, flexDirection: "row", gap: 10, alignItems: "center" },
  messageTexte: { fontSize: 14, flex: 1 },
});
