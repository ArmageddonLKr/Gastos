import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { AppSettings, Category, Profile, Transaction } from "../types";
import { DEFAULT_CATEGORIES } from "../utils/categories";
import { DARK_THEME } from "../utils/theme";

interface GastosDB extends DBSchema {
  profile: {
    key: string;
    value: Profile;
  };
  transactions: {
    key: string;
    value: Transaction;
    indexes: { "by-date": string };
  };
  categories: {
    key: string;
    value: Category;
  };
  settings: {
    key: string;
    value: AppSettings;
  };
}

const DB_NAME = "gastos-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<GastosDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<GastosDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("profile")) {
          db.createObjectStore("profile", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("transactions")) {
          const store = db.createObjectStore("transactions", { keyPath: "id" });
          store.createIndex("by-date", "date");
        }
        if (!db.objectStoreNames.contains("categories")) {
          db.createObjectStore("categories", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export async function getProfile(): Promise<Profile | undefined> {
  const db = await getDB();
  const all = await db.getAll("profile");
  return all[0];
}

export async function saveProfile(profile: Profile): Promise<void> {
  const db = await getDB();
  await db.put("profile", profile);
}

export async function clearProfile(): Promise<void> {
  const db = await getDB();
  await db.clear("profile");
}

export async function getSettings(): Promise<AppSettings> {
  const db = await getDB();
  const settings = await db.get("settings", "settings");
  if (settings) return settings;
  const fresh: AppSettings = { id: "settings", theme: DARK_THEME, budgets: [] };
  await db.put("settings", fresh);
  return fresh;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const db = await getDB();
  await db.put("settings", settings);
}

export async function getCategories(): Promise<Category[]> {
  const db = await getDB();
  const existing = await db.getAll("categories");
  if (existing.length > 0) return existing;
  const tx = db.transaction("categories", "readwrite");
  await Promise.all(DEFAULT_CATEGORIES.map((c) => tx.store.put(c)));
  await tx.done;
  return DEFAULT_CATEGORIES;
}

export async function saveCategory(category: Category): Promise<void> {
  const db = await getDB();
  await db.put("categories", category);
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("categories", id);
}

export async function getTransactions(): Promise<Transaction[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("transactions", "by-date");
  return all.reverse();
}

export async function saveTransaction(transaction: Transaction): Promise<void> {
  const db = await getDB();
  await db.put("transactions", transaction);
}

export async function deleteTransaction(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("transactions", id);
}

export async function wipeAllData(): Promise<void> {
  const db = await getDB();
  await Promise.all([
    db.clear("profile"),
    db.clear("transactions"),
    db.clear("categories"),
    db.clear("settings"),
  ]);
}

export async function exportAllData() {
  const db = await getDB();
  const [profile, transactions, categories, settings] = await Promise.all([
    db.getAll("profile"),
    db.getAll("transactions"),
    db.getAll("categories"),
    db.getAll("settings"),
  ]);
  return { profile: profile[0], transactions, categories, settings: settings[0], exportedAt: new Date().toISOString() };
}

export async function importAllData(data: {
  profile?: Profile;
  transactions?: Transaction[];
  categories?: Category[];
  settings?: AppSettings;
}) {
  const db = await getDB();
  await wipeAllData();
  const tasks: Promise<unknown>[] = [];
  if (data.profile) tasks.push(db.put("profile", data.profile));
  if (data.settings) tasks.push(db.put("settings", data.settings));
  for (const c of data.categories ?? []) tasks.push(db.put("categories", c));
  for (const t of data.transactions ?? []) tasks.push(db.put("transactions", t));
  await Promise.all(tasks);
}
