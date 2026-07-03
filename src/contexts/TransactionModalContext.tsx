import { createContext, useContext, useState, type ReactNode } from "react";
import type { Transaction, TransactionType } from "../types";

interface ModalState {
  open: boolean;
  editing: Transaction | null;
  defaultType: TransactionType;
}

interface TransactionModalContextValue {
  state: ModalState;
  openAdd: (type?: TransactionType) => void;
  openEdit: (t: Transaction) => void;
  close: () => void;
}

const TransactionModalContext = createContext<TransactionModalContextValue | null>(null);

export function TransactionModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ open: false, editing: null, defaultType: "expense" });

  const openAdd = (type: TransactionType = "expense") =>
    setState({ open: true, editing: null, defaultType: type });
  const openEdit = (t: Transaction) => setState({ open: true, editing: t, defaultType: t.type });
  const close = () => setState((s) => ({ ...s, open: false }));

  return (
    <TransactionModalContext.Provider value={{ state, openAdd, openEdit, close }}>
      {children}
    </TransactionModalContext.Provider>
  );
}

export function useTransactionModal() {
  const ctx = useContext(TransactionModalContext);
  if (!ctx) throw new Error("useTransactionModal must be used within TransactionModalProvider");
  return ctx;
}
