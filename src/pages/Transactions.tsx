import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useProfile } from "../contexts/ProfileContext";
import { useTransactionModal } from "../contexts/TransactionModalContext";
import { TransactionListItem } from "../components/TransactionListItem";
import { IconRenderer } from "../components/IconRenderer";
import { formatDateLong } from "../utils/date";
import type { TransactionType } from "../types";

export function Transactions() {
  const { transactions, categories } = useData();
  const { profile } = useProfile();
  const { openEdit } = useTransactionModal();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const currency = profile?.currency ?? "BRL";

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (categoryFilter !== "all" && t.categoryId !== categoryFilter) return false;
      if (search.trim()) {
        const cat = categories.find((c) => c.id === t.categoryId);
        const haystack = `${t.description} ${cat?.name ?? ""}`.toLowerCase();
        if (!haystack.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [transactions, typeFilter, categoryFilter, search, categories]);

  const grouped = useMemo(() => {
    const groups = new Map<string, typeof filtered>();
    for (const t of filtered) {
      const arr = groups.get(t.date) ?? [];
      arr.push(t);
      groups.set(t.date, arr);
    }
    return [...groups.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filtered]);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Transações</h1>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
          style={{ borderColor: "var(--color-border)", color: showFilters ? "var(--color-accent)" : "inherit" }}
        >
          <SlidersHorizontal size={14} />
          Filtros
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-text-muted)" }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar transações..."
          className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm outline-none"
          style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
        />
      </div>

      {showFilters && (
        <div className="space-y-3 rounded-2xl border p-3" style={{ borderColor: "var(--color-border)", background: "var(--color-panel)" }}>
          <div className="flex gap-2">
            {(["all", "expense", "income"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="flex-1 rounded-xl py-2 text-xs font-semibold"
                style={{
                  background: typeFilter === t ? "var(--color-accent)" : "var(--color-panel-alt)",
                  color: typeFilter === t ? "#fff" : "var(--color-text-muted)",
                }}
              >
                {t === "all" ? "Todas" : t === "expense" ? "Despesas" : "Receitas"}
              </button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setCategoryFilter("all")}
              className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium"
              style={{
                borderColor: categoryFilter === "all" ? "var(--color-accent)" : "var(--color-border)",
                color: categoryFilter === "all" ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              Todas categorias
            </button>
            {categories
              .filter((c) => typeFilter === "all" || c.type === typeFilter)
              .map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
                  style={{
                    borderColor: categoryFilter === c.id ? c.color : "var(--color-border)",
                    color: categoryFilter === c.id ? c.color : "var(--color-text-muted)",
                  }}
                >
                  <IconRenderer name={c.icon} size={12} />
                  {c.name}
                </button>
              ))}
          </div>
        </div>
      )}

      {grouped.length === 0 ? (
        <div
          className="rounded-[var(--color-radius)] border border-dashed p-10 text-center text-sm"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        >
          Nenhuma transação encontrada.
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([date, items]) => (
            <div key={date}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                {formatDateLong(date)}
              </p>
              <div className="space-y-2">
                {items.map((t) => (
                  <TransactionListItem
                    key={t.id}
                    transaction={t}
                    category={categories.find((c) => c.id === t.categoryId)}
                    currency={currency}
                    onClick={() => openEdit(t)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
