import { useState } from "react";
import { useAppThemeMode } from "@/contexts/theme-mode";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Composant réutilisable : le parent définit la limite et reçoit le callback.
type MotDePasseProps = {
  maxLength: number;
  onMaxLengthReached?: () => void;
  onChangeText?: (texte: string) => void;
};

export default function MotDePasse({
  maxLength,
  onMaxLengthReached,
  onChangeText,
}: MotDePasseProps) {
  const [motDePasse, setMotDePasse] = useState("");
  const [visible, setVisible] = useState(false);
  const { colorScheme } = useAppThemeMode();
  const sombre = colorScheme === "dark";

  function changerTexte(texte: string) {
    const etaitComplet = motDePasse.length >= maxLength;
    setMotDePasse(texte);
    onChangeText?.(texte);

    // Appelé une seule fois au passage vers la longueur maximale.
    if (maxLength > 0 && !etaitComplet && texte.length === maxLength) {
      onMaxLengthReached?.();
    }
  }

  return (
    <View>
      <Text style={[styles.label, { color: sombre ? "#FFFFFF" : "#20252F" }]}>
        Mot de passe
      </Text>
      <View
        style={[
          styles.ligne,
          {
            backgroundColor: sombre ? "#20242B" : "#FFFFFF",
            borderColor: sombre ? "#59616D" : "#CBD5E1",
          },
        ]}
      >
        <TextInput
          style={[styles.saisie, { color: sombre ? "#FFFFFF" : "#20252F" }]}
          placeholder="Saisir le mot de passe"
          placeholderTextColor={sombre ? "#A0AAB7" : "#64748B"}
          value={motDePasse}
          onChangeText={changerTexte}
          maxLength={maxLength}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          underlineColorAndroid="transparent"
          accessibilityLabel="Mot de passe"
        />
        <Pressable
          onPress={() => setVisible(!visible)}
          accessibilityRole="button"
          accessibilityLabel={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          hitSlop={8}
          style={styles.bouton}
        >
          <Text style={styles.icone}>{visible ? "🙈" : "👁️"}</Text>
        </Pressable>
      </View>
      <Text style={[styles.compteur, { color: sombre ? "#A0AAB7" : "#64748B" }]}>
        {motDePasse.length} / {maxLength} caractères
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "600",
  },
  ligne: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 52,
  },
  saisie: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  bouton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  icone: {
    fontSize: 22,
  },
  compteur: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 13,
  },
});
