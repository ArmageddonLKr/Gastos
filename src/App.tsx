import { Navigate, Route, Routes } from "react-router-dom";
import { Wallet } from "lucide-react";
import { useProfile } from "./contexts/ProfileContext";
import { Layout } from "./components/Layout";
import { UpdatePrompt } from "./components/UpdatePrompt";
import { TransactionModalProvider } from "./contexts/TransactionModalContext";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Stats } from "./pages/Stats";
import { SettingsPage } from "./pages/Settings";
import { NotFound } from "./pages/NotFound";

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--color-accent)" }}>
          <Wallet size={26} color="#fff" />
        </div>
        <p style={{ color: "var(--color-text-muted)" }} className="text-sm">
          Carregando...
        </p>
      </div>
    </div>
  );
}

function App() {
  const { profile, loading } = useProfile();

  if (loading) return <Splash />;

  if (!profile) {
    return (
      <>
        <UpdatePrompt />
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <TransactionModalProvider>
      <UpdatePrompt />
      <Routes>
        <Route path="/onboarding" element={<Navigate to="/" replace />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transacoes" element={<Transactions />} />
          <Route path="/estatisticas" element={<Stats />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TransactionModalProvider>
  );
}

export default App;
