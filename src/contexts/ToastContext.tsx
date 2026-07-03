import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckCircle2, Info, TriangleAlert, XCircle, X } from "lucide-react";

type ToastKind = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  leaving?: boolean;
}

interface ToastContextValue {
  show: (kind: ToastKind, title: string, description?: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
};

const VAR: Record<ToastKind, string> = {
  success: "var(--toast-success)",
  error: "var(--toast-error)",
  warning: "var(--toast-warning)",
  info: "var(--toast-info)",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 180);
  }, []);

  const show = useCallback(
    (kind: ToastKind, title: string, description?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, kind, title, description }]);
      const timer = setTimeout(() => dismiss(id), 4200);
      timers.current.set(id, timer);
    },
    [dismiss],
  );

  const value: ToastContextValue = {
    show,
    success: (t, d) => show("success", t, d),
    error: (t, d) => show("error", t, d),
    warning: (t, d) => show("warning", t, d),
    info: (t, d) => show("info", t, d),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-0 bottom-0 z-[200] flex flex-col items-center gap-2 px-4 pb-24 sm:pb-6 pointer-events-none sm:items-end sm:right-4 sm:left-auto">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--color-radius)] border px-4 py-3 shadow-lg backdrop-blur ${t.leaving ? "animate-toast-out" : "animate-toast-in"}`}
              style={{
                background: "var(--toast-bg)",
                color: "var(--toast-text)",
                borderColor: "color-mix(in srgb, var(--toast-text) 12%, transparent)",
              }}
              role="status"
            >
              <Icon size={20} style={{ color: VAR[t.kind] }} className="mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs opacity-80 leading-snug">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
