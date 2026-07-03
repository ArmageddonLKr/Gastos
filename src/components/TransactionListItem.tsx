import type { Category, Transaction } from "../types";
import { IconRenderer } from "./IconRenderer";
import { formatCurrency } from "../utils/currency";
import { formatDateShort } from "../utils/date";

export function TransactionListItem({
  transaction,
  category,
  currency,
  onClick,
}: {
  transaction: Transaction;
  category?: Category;
  currency: string;
  onClick?: () => void;
}) {
  const isExpense = transaction.type === "expense";
  const color = category?.color ?? "#9aa3c2";

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition active:scale-[0.99]"
      style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `color-mix(in srgb, ${color} 20%, transparent)` }}
      >
        <IconRenderer name={category?.icon ?? "MoreHorizontal"} size={18} color={color} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{transaction.description || category?.name || "Transação"}</p>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {category?.name} · {formatDateShort(transaction.date)}
        </p>
      </div>
      <p
        className="shrink-0 text-sm font-bold"
        style={{ color: isExpense ? "var(--color-expense)" : "var(--color-income)" }}
      >
        {isExpense ? "-" : "+"}
        {formatCurrency(transaction.amount, currency)}
      </p>
    </button>
  );
}
