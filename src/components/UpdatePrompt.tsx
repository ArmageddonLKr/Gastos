import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { RefreshCw, X } from "lucide-react";

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      setInterval(() => {
        registration.update().catch(() => {});
      }, 60 * 60 * 1000);
    },
  });

  const [showOfflineToast, setShowOfflineToast] = useState(false);

  useEffect(() => {
    if (offlineReady) {
      setShowOfflineToast(true);
      const t = setTimeout(() => {
        setShowOfflineToast(false);
        setOfflineReady(false);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [offlineReady, setOfflineReady]);

  if (!needRefresh && !showOfflineToast) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[300] flex justify-center px-3 pt-3 safe-top pointer-events-none">
      {needRefresh && (
        <div
          className="pointer-events-auto flex items-center gap-3 rounded-[var(--color-radius)] border px-4 py-3 shadow-xl"
          style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
        >
          <RefreshCw size={18} style={{ color: "var(--color-accent)" }} />
          <div className="text-sm">
            <p className="font-semibold">Nova versão disponível</p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Atualize para pegar as últimas novidades.
            </p>
          </div>
          <button
            onClick={() => updateServiceWorker(true)}
            className="ml-2 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{ background: "var(--color-accent)", color: "var(--color-accent-contrast, #fff)" }}
          >
            Atualizar
          </button>
          <button
            onClick={() => setNeedRefresh(false)}
            className="opacity-60 hover:opacity-100"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {!needRefresh && showOfflineToast && (
        <div
          className="pointer-events-auto rounded-[var(--color-radius)] border px-4 py-2 text-xs shadow-xl"
          style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
        >
          App pronto para uso offline.
        </div>
      )}
    </div>
  );
}
