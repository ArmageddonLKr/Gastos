import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useData } from "../contexts/DataContext";
import { useProfile } from "../contexts/ProfileContext";
import { useTransactionModal } from "../contexts/TransactionModalContext";
import { formatCurrency } from "../utils/currency";
import { isSameMonth, monthLabel, shiftMonthKey, todayISO, monthKey } from "../utils/date";
import { TransactionListItem } from "../components/TransactionListItem";

export function Dashboard() {
  const { transactions, categories } = useData();
  const { profile } = useProfile();
  const { openEdit } = useTransactionModal();
  const [currentMonth, setCurrentMonth] = useState(monthKey(todayISO()));

  const currency = profile?.currency ?? "BRL";

  const monthTransactions = useMemo(
    () => transactions.filter((t) => isSameMonth(t.date, currentMonth)),
    [transactions, currentMonth],
  );

  const income = monthTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = monthTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of monthTransactions) {
      if (t.type !== "expense") continue;
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    }
    return [...map.entries()]
      .map(([categoryId, value]) => {
        const cat = categories.find((c) => c.id === categoryId);
        return { name: cat?.name ?? "Outros", value, color: cat?.color ?? "#9aa3c2" };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthTransactions, categories]);

  const recent = [...monthTransactions].slice(0, 6);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {greeting}
          </p>
          <h1 className="text-xl font-bold flex items-center gap-2">
            {profile?.avatarEmoji} {profile?.name}
          </h1>
        </div>
        <div
          className="flex items-center gap-1 rounded-full border px-1 py-1"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button onClick={() => setCurrentMonth((m) => shiftMonthKey(m, -1))} className="p-1.5" aria-label="Mês anterior">
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-medium px-1 min-w-[92px] text-center capitalize">
            {monthLabel(currentMonth)}
          </span>
          <button onClick={() => setCurrentMonth((m) => shiftMonthKey(m, 1))} className="p-1.5" aria-label="Próximo mês">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="rounded-[var(--color-radius)] border p-5"
        style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={16} style={{ color: "var(--color-text-muted)" }} />
          <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Saldo do mês
          </p>
        </div>
        <p className="text-3xl font-black" style={{ color: balance >= 0 ? "var(--color-income)" : "var(--color-expense)" }}>
          {formatCurrency(balance, currency)}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-3" style={{ background: "var(--color-panel-alt)" }}>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} style={{ color: "var(--color-income)" }} />
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Receitas
              </span>
            </div>
            <p className="mt-1 font-bold" style={{ color: "var(--color-income)" }}>
              {formatCurrency(income, currency)}
            </p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: "var(--color-panel-alt)" }}>
            <div className="flex items-center gap-1.5">
              <TrendingDown size={14} style={{ color: "var(--color-expense)" }} />
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Despesas
              </span>
            </div>
            <p className="mt-1 font-bold" style={{ color: "var(--color-expense)" }}>
              {formatCurrency(expense, currency)}
            </p>
          </div>
        </div>
      </div>

      {byCategory.length > 0 && (
        <div
          className="rounded-[var(--color-radius)] border p-5"
          style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
        >
          <p className="text-sm font-semibold mb-2">Gastos por categoria</p>
          <div className="flex items-center gap-4">
            <div className="h-40 w-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                    {byCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="var(--color-panel)" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatCurrency(Number(v), currency)}
                    contentStyle={{ background: "var(--color-panel-alt)", border: "none", borderRadius: 12, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              {byCategory.slice(0, 5).map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="flex-1 truncate" style={{ color: "var(--color-text-muted)" }}>
                    {c.name}
                  </span>
                  <span className="font-semibold shrink-0">{formatCurrency(c.value, currency)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold mb-2">Transações recentes</p>
        {recent.length === 0 ? (
          <div
            className="rounded-[var(--color-radius)] border border-dashed p-8 text-center text-sm"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
          >
            Nenhuma transação neste mês ainda.
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((t) => (
              <TransactionListItem
                key={t.id}
                transaction={t}
                category={categories.find((c) => c.id === t.categoryId)}
                currency={currency}
                onClick={() => openEdit(t)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
