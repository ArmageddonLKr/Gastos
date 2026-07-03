import { useState } from "react";
import { Wallet } from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";
import { CURRENCIES } from "../utils/currency";
import { ACCENT_PRESETS } from "../utils/theme";

const AVATAR_EMOJIS = ["💰", "🐷", "💳", "📊", "🏦", "💵", "🪙", "📈"];

export function Onboarding() {
  const { createProfile } = useProfile();
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("BRL");
  const [avatarColor, setAvatarColor] = useState(ACCENT_PRESETS[0]);
  const [avatarEmoji, setAvatarEmoji] = useState(AVATAR_EMOJIS[0]);
  const [goal, setGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValid = name.trim().length >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    await createProfile({
      name: name.trim(),
      currency,
      avatarColor,
      avatarEmoji,
      monthlyIncomeGoal: goal ? Number(goal.replace(",", ".")) : undefined,
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-10"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl shadow-xl"
            style={{ background: "var(--color-accent)" }}
          >
            <Wallet size={30} color="#fff" />
          </div>
          <h1 className="text-2xl font-bold">Bem-vindo ao Gastos</h1>
          <p className="mt-1 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
            Crie seu perfil para começar a controlar suas finanças.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[var(--color-radius)] border p-5 space-y-5"
          style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
              style={{ background: avatarColor }}
            >
              {avatarEmoji}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {AVATAR_EMOJIS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setAvatarEmoji(e)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lg border"
                  style={{
                    borderColor: avatarEmoji === e ? avatarColor : "var(--color-border)",
                    background: "var(--color-panel-alt)",
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              {ACCENT_PRESETS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setAvatarColor(c)}
                  className="h-6 w-6 rounded-full border-2"
                  style={{ background: c, borderColor: avatarColor === c ? "#fff" : "transparent" }}
                  aria-label={`Cor ${c}`}
                />
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              Como podemos te chamar?
            </span>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              Moeda principal
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              Meta de renda mensal (opcional)
            </span>
            <input
              inputMode="decimal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="0,00"
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
            />
          </label>

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full rounded-xl py-3 text-sm font-bold disabled:opacity-50"
            style={{ background: "var(--color-accent)", color: "#fff" }}
          >
            Criar meu perfil
          </button>
        </form>

        <p className="mt-4 text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
          Seus dados ficam salvos só neste dispositivo.
        </p>
      </div>
    </div>
  );
}
