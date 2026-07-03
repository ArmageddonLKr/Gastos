import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, ChartColumn, Settings, Plus, Wallet } from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";
import { useTransactionModal } from "../contexts/TransactionModalContext";
import { TransactionFormModal } from "./TransactionFormModal";

const NAV_ITEMS = [
  { to: "/", label: "Início", icon: LayoutDashboard, end: true },
  { to: "/transacoes", label: "Transações", icon: ArrowLeftRight, end: false },
  { to: "/estatisticas", label: "Estatísticas", icon: ChartColumn, end: false },
  { to: "/configuracoes", label: "Ajustes", icon: Settings, end: false },
];

export function Layout() {
  const { profile } = useProfile();
  const { openAdd, state } = useTransactionModal();

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-bg)", color: "var(--color-text)" }}>
      <aside
        className="hidden md:flex md:w-64 md:flex-col md:border-r md:px-4 md:py-6"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-2 px-2 mb-8">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ background: "var(--color-accent)" }}
          >
            <Wallet size={20} color="#fff" />
          </div>
          <div>
            <p className="font-bold leading-tight">Gastos</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {profile?.name ?? ""}
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "" : "opacity-70 hover:opacity-100"}`
              }
              style={({ isActive }) => ({
                background: isActive ? "var(--color-panel)" : "transparent",
                color: isActive ? "var(--color-accent)" : "inherit",
              })}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => openAdd()}
          className="mt-6 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold shadow-lg"
          style={{ background: "var(--color-accent)", color: "#fff" }}
        >
          <Plus size={18} />
          Nova transação
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-24 md:pb-8 safe-top">
          <Outlet />
        </main>

        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t safe-bottom"
          style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
        >
          <div className="relative flex items-center justify-around px-2 py-2">
            {NAV_ITEMS.slice(0, 2).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] font-medium"
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} color={isActive ? "var(--color-accent)" : "var(--color-text-muted)"} />
                    <span style={{ color: isActive ? "var(--color-accent)" : "var(--color-text-muted)" }}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}

            <button
              onClick={() => openAdd()}
              aria-label="Adicionar transação"
              className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full shadow-xl"
              style={{ background: "var(--color-accent)" }}
            >
              <Plus size={26} color="#fff" />
            </button>

            {NAV_ITEMS.slice(2).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-[11px] font-medium"
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={20} color={isActive ? "var(--color-accent)" : "var(--color-text-muted)"} />
                    <span style={{ color: isActive ? "var(--color-accent)" : "var(--color-text-muted)" }}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {state.open && <TransactionFormModal />}
    </div>
  );
}
