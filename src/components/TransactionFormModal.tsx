import { useMemo, useState } from "react";
import { X, Trash2 } from "lucide-react";
import { useTransactionModal } from "../contexts/TransactionModalContext";
import { useData } from "../contexts/DataContext";
import { useProfile } from "../contexts/ProfileContext";
import { useToast } from "../contexts/ToastContext";
import { IconRenderer } from "./IconRenderer";
import { todayISO } from "../utils/date";
import type { TransactionType } from "../types";
import { formatCurrency } from "../utils/currency";

export function TransactionFormModal() {
  const { state, close } = useTransactionModal();
  const { editing, defaultType } = state;
  const { categories, addTransaction, updateTransaction, removeTransaction } = useData();
  const { profile } = useProfile();
  const toast = useToast();

  const [type, setType] = useState<TransactionType>(editing?.type ?? defaultType);
  const [amount, setAmount] = useState(editing ? String(editing.amount) : "");
  const [categoryId, setCategoryId] = useState(editing?.categoryId ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [date, setDate] = useState(editing?.date ?? todayISO());
  const [saving, setSaving] = useState(false);

  const filteredCategories = useMemo(() => categories.filter((c) => c.type === type), [categories, type]);
  const currency = profile?.currency ?? "BRL";

  const activeCategoryId = categoryId || filteredCategories[0]?.id || "";

  const parsedAmount = Number(amount.replace(",", "."));
  const isValid = parsedAmount > 0 && !!activeCategoryId && date;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSaving(true);
    try {
      if (editing) {
        await updateTransaction(editing.id, {
          type,
          amount: parsedAmount,
          categoryId: activeCategoryId,
          description: description.trim(),
          date,
        });
        toast.success("Transação atualizada");
      } else {
        await addTransaction({
          type,
          amount: parsedAmount,
          categoryId: activeCategoryId,
          description: description.trim(),
          date,
        });
        toast.success(type === "expense" ? "Despesa adicionada" : "Receita adicionada", formatCurrency(parsedAmount, currency));
      }
      close();
    } catch {
      toast.error("Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    await removeTransaction(editing.id);
    toast.info("Transação removida");
    close();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={close} />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full md:max-w-md rounded-t-[24px] md:rounded-[24px] border-t md:border p-5 pb-8 md:pb-6 max-h-[90vh] overflow-y-auto safe-bottom"
        style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{editing ? "Editar transação" : "Nova transação"}</h2>
          <button type="button" onClick={close} className="opacity-60 hover:opacity-100">
            <X size={20} />
          </button>
        </div>

        <div
          className="grid grid-cols-2 gap-2 rounded-2xl p-1 mb-5"
          style={{ background: "var(--color-panel-alt)" }}
        >
          {(["expense", "income"] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setType(t);
                setCategoryId("");
              }}
              className="rounded-xl py-2.5 text-sm font-semibold transition"
              style={{
                background: type === t ? (t === "expense" ? "var(--color-expense)" : "var(--color-income)") : "transparent",
                color: type === t ? "#fff" : "var(--color-text-muted)",
              }}
            >
              {t === "expense" ? "Despesa" : "Receita"}
            </button>
          ))}
        </div>

        <label className="block mb-4">
          <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Valor
          </span>
          <input
            autoFocus
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-3 text-2xl font-bold outline-none"
            style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
          />
        </label>

        <div className="mb-4">
          <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Categoria
          </span>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {filteredCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoryId(c.id)}
                className="flex flex-col items-center gap-1 rounded-xl border py-2.5 px-1 transition"
                style={{
                  borderColor: activeCategoryId === c.id ? c.color : "var(--color-border)",
                  background: activeCategoryId === c.id ? `color-mix(in srgb, ${c.color} 18%, transparent)` : "var(--color-panel-alt)",
                }}
              >
                <IconRenderer name={c.icon} size={18} color={c.color} />
                <span className="text-[10px] leading-tight text-center line-clamp-1" style={{ color: "var(--color-text-muted)" }}>
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <label className="block mb-4">
          <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Descrição (opcional)
          </span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Mercado, Uber, salário..."
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
          />
        </label>

        <label className="block mb-6">
          <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Data
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
          />
        </label>

        <div className="flex items-center gap-2">
          {editing && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center justify-center rounded-xl border px-4 py-3"
              style={{ borderColor: "var(--color-expense)", color: "var(--color-expense)" }}
              aria-label="Excluir"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button
            type="submit"
            disabled={!isValid || saving}
            className="flex-1 rounded-xl py-3 text-sm font-bold disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            {editing ? "Salvar alterações" : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}
