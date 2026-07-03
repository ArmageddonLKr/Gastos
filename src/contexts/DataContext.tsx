import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Budget, Category, Transaction } from "../types";
import {
  deleteCategory as dbDeleteCategory,
  deleteTransaction as dbDeleteTransaction,
  getCategories,
  getSettings,
  getTransactions,
  saveCategory as dbSaveCategory,
  saveSettings,
  saveTransaction as dbSaveTransaction,
} from "../db/db";
import { genId } from "../utils/id";

interface DataContextValue {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  loading: boolean;
  addTransaction: (t: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTransaction: (id: string, patch: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addCategory: (c: Omit<Category, "id">) => Promise<Category>;
  removeCategory: (id: string) => Promise<void>;
  setBudget: (categoryId: string, monthlyLimit: number) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([getTransactions(), getCategories(), getSettings()]).then(([t, c, s]) => {
      if (!active) return;
      setTransactions(t);
      setCategories(c);
      setBudgets(s.budgets);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const addTransaction: DataContextValue["addTransaction"] = async (t) => {
    const now = Date.now();
    const full: Transaction = { ...t, id: genId(), createdAt: now, updatedAt: now };
    await dbSaveTransaction(full);
    setTransactions((prev) => [full, ...prev].sort((a, b) => (a.date < b.date ? 1 : -1)));
  };

  const updateTransaction: DataContextValue["updateTransaction"] = async (id, patch) => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return;
    const next = { ...existing, ...patch, updatedAt: Date.now() };
    await dbSaveTransaction(next);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? next : t)).sort((a, b) => (a.date < b.date ? 1 : -1)),
    );
  };

  const removeTransaction = async (id: string) => {
    await dbDeleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addCategory: DataContextValue["addCategory"] = async (c) => {
    const full: Category = { ...c, id: genId() };
    await dbSaveCategory(full);
    setCategories((prev) => [...prev, full]);
    return full;
  };

  const removeCategory = async (id: string) => {
    await dbDeleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const setBudget = async (categoryId: string, monthlyLimit: number) => {
    const settings = await getSettings();
    const nextBudgets = [
      ...settings.budgets.filter((b) => b.categoryId !== categoryId),
      ...(monthlyLimit > 0 ? [{ categoryId, monthlyLimit }] : []),
    ];
    await saveSettings({ ...settings, budgets: nextBudgets });
    setBudgets(nextBudgets);
  };

  const value = useMemo(
    () => ({
      transactions,
      categories,
      budgets,
      loading,
      addTransaction,
      updateTransaction,
      removeTransaction,
      addCategory,
      removeCategory,
      setBudget,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactions, categories, budgets, loading],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
