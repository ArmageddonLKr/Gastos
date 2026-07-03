import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useData } from "../contexts/DataContext";
import { useProfile } from "../contexts/ProfileContext";
import { formatCurrency } from "../utils/currency";
import { monthKey, shiftMonthKey, todayISO, isSameMonth, monthLabel } from "../utils/date";
import { IconRenderer } from "../components/IconRenderer";

export function Stats() {
  const { transactions, categories, budgets } = useData();
  const { profile } = useProfile();
  const currency = profile?.currency ?? "BRL";
  const [selectedMonth, setSelectedMonth] = useState(monthKey(todayISO()));

  const trend = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => shiftMonthKey(monthKey(todayISO()), i - 5));
    return months.map((key) => {
      const monthTx = transactions.filter((t) => isSameMonth(t.date, key));
      const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      return { key, label: monthLabel(key).split(" ")[0].slice(0, 3), income, expense };
    });
  }, [transactions]);

  const monthTransactions = useMemo(
    () => transactions.filter((t) => isSameMonth(t.date, selectedMonth)),
    [transactions, selectedMonth],
  );

  const categorySpend = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of monthTransactions) {
      if (t.type !== "expense") continue;
      map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount);
    }
    return map;
  }, [monthTransactions]);

  const totalExpense = [...categorySpend.values()].reduce((s, v) => s + v, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-8 space-y-6">
      <h1 className="text-xl font-bold">Estatísticas</h1>

      <div
        className="rounded-[var(--color-radius)] border p-5"
        style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
      >
        <p className="text-sm font-semibold mb-4">Receitas x Despesas (6 meses)</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-text-muted)" fontSize={11} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                formatter={(v) => formatCurrency(Number(v), currency)}
                contentStyle={{ background: "var(--color-panel-alt)", border: "none", borderRadius: 12, fontSize: 12 }}
                cursor={{ fill: "var(--color-panel-alt)" }}
              />
              <Bar dataKey="income" fill="var(--color-income)" radius={[6, 6, 0, 0]} name="Receitas" />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={[6, 6, 0, 0]} name="Despesas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="rounded-[var(--color-radius)] border p-5"
        style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold">Orçamento por categoria</p>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border px-2 py-1 text-xs outline-none"
            style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
          >
            {trend.map((m) => (
              <option key={m.key} value={m.key}>
                {monthLabel(m.key)}
              </option>
            ))}
          </select>
        </div>

        {budgets.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Defina limites mensais por categoria nos Ajustes para acompanhar seu orçamento aqui.
          </p>
        ) : (
          <div className="space-y-4">
            {budgets.map((b) => {
              const cat = categories.find((c) => c.id === b.categoryId);
              const spent = categorySpend.get(b.categoryId) ?? 0;
              const pct = Math.min(100, (spent / b.monthlyLimit) * 100);
              const over = spent > b.monthlyLimit;
              return (
                <div key={b.categoryId}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-medium">
                      <IconRenderer name={cat?.icon ?? "MoreHorizontal"} size={14} color={cat?.color} />
                      {cat?.name}
                    </span>
                    <span style={{ color: over ? "var(--color-expense)" : "var(--color-text-muted)" }}>
                      {formatCurrency(spent, currency)} / {formatCurrency(b.monthlyLimit, currency)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-panel-alt)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: over ? "var(--color-expense)" : cat?.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="rounded-[var(--color-radius)] border p-5"
        style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
      >
        <p className="text-sm font-semibold mb-4">Distribuição de gastos - {monthLabel(selectedMonth)}</p>
        {totalExpense === 0 ? (
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Sem despesas registradas neste mês.
          </p>
        ) : (
          <div className="space-y-3">
            {[...categorySpend.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([categoryId, value]) => {
                const cat = categories.find((c) => c.id === categoryId);
                const pct = (value / totalExpense) * 100;
                return (
                  <div key={categoryId}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <IconRenderer name={cat?.icon ?? "MoreHorizontal"} size={14} color={cat?.color} />
                        {cat?.name}
                      </span>
                      <span style={{ color: "var(--color-text-muted)" }}>
                        {formatCurrency(value, currency)} ({pct.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--color-panel-alt)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat?.color }} />
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
