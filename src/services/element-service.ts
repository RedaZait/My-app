import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Element } from "@/types/element";

// Données conservées uniquement sur cet appareil / dans ce navigateur.
const STORAGE_KEY = "@my-app/elements-crud-v1";

type BaseLocale = {
  prochainId: number;
  elements: Element[];
};

async function lireBase(): Promise<BaseLocale> {
  const contenu = await AsyncStorage.getItem(STORAGE_KEY);
  if (!contenu) {
    return { prochainId: 1, elements: [] };
  }

  const base: unknown = JSON.parse(contenu);
  if (
    typeof base !== "object" ||
    base === null ||
    !("prochainId" in base) ||
    typeof base.prochainId !== "number" ||
    !("elements" in base) ||
    !Array.isArray(base.elements)
  ) {
    throw new Error("Les données locales sont invalides.");
  }

  // JSON.parse renvoie des valeurs non typées : nous vérifions la structure
  // minimale avant de manipuler cette base de démonstration.
  return base as BaseLocale;
}

async function enregistrerBase(base: BaseLocale): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(base));
}

// READ ALL : lire tous les éléments.
export async function readAll(): Promise<Element[]> {
  const base = await lireBase();
  return [...base.elements].sort((a, b) => Number(b.id) - Number(a.id));
}

// READ BY ID : lire un seul élément.
export async function readById(id: string): Promise<Element | null> {
  const base = await lireBase();
  return base.elements.find((element) => element.id === id.trim()) ?? null;
}

// CREATE : créer un élément et générer un ID unique dans cette base locale.
export async function createElement(
  titre: string,
  description: string,
): Promise<Element> {
  const titrePropre = titre.trim();
  if (!titrePropre) {
    throw new Error("Le titre est obligatoire.");
  }

  const base = await lireBase();
  const maintenant = new Date().toISOString();
  const element: Element = {
    id: String(base.prochainId),
    titre: titrePropre,
    description: description.trim(),
    createdAt: maintenant,
    updatedAt: maintenant,
  };

  base.elements.push(element);
  base.prochainId += 1;
  await enregistrerBase(base);
  return element;
}

// UPDATE : modifier un élément existant. null = ID inconnu.
export async function updateElement(
  id: string,
  titre: string,
  description: string,
): Promise<Element | null> {
  const titrePropre = titre.trim();
  if (!titrePropre) {
    throw new Error("Le titre est obligatoire.");
  }

  const base = await lireBase();
  const index = base.elements.findIndex((element) => element.id === id.trim());
  if (index === -1) return null;

  const element: Element = {
    ...base.elements[index],
    titre: titrePropre,
    description: description.trim(),
    updatedAt: new Date().toISOString(),
  };
  base.elements[index] = element;
  await enregistrerBase(base);
  return element;
}

// DELETE : supprimer par ID. false = ID inconnu.
export async function deleteById(id: string): Promise<boolean> {
  const base = await lireBase();
  const nombreAvant = base.elements.length;
  base.elements = base.elements.filter((element) => element.id !== id.trim());
  if (base.elements.length === nombreAvant) return false;

  await enregistrerBase(base);
  return true;
}
