import { useRef, useState } from "react";
import {
  User, Palette, Bell, Database, Info, ChevronDown, Plus, Trash2, Download, Upload,
  AlertTriangle, LogOut, Type,
} from "lucide-react";
import { useProfile } from "../contexts/ProfileContext";
import { useTheme } from "../contexts/ThemeContext";
import { useData } from "../contexts/DataContext";
import { useToast } from "../contexts/ToastContext";
import { ColorField } from "../components/ColorField";
import { IconRenderer } from "../components/IconRenderer";
import { CURRENCIES, formatCurrency } from "../utils/currency";
import { ACCENT_PRESETS, FONT_OPTIONS, PANEL_PRESETS_DARK, PANEL_PRESETS_LIGHT } from "../utils/theme";
import { CATEGORY_COLOR_CHOICES, CATEGORY_ICON_CHOICES } from "../utils/categories";
import { exportAllData, importAllData, wipeAllData } from "../db/db";
import type { TransactionType } from "../types";

function Section({
  title,
  icon: Icon,
  defaultOpen,
  children,
}: {
  title: string;
  icon: typeof User;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-[var(--color-radius)] border overflow-hidden" style={{ background: "var(--color-panel)", borderColor: "var(--color-border)" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <Icon size={18} style={{ color: "var(--color-accent)" }} />
        <span className="flex-1 text-sm font-semibold">{title}</span>
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "var(--color-text-muted)" }} />
      </button>
      {open && <div className="px-5 pb-5 border-t" style={{ borderColor: "var(--color-border)" }}>{children}</div>}
    </div>
  );
}

export function SettingsPage() {
  const { profile, updateProfile, deleteAccount } = useProfile();
  const { theme, updateTheme, resetTheme } = useTheme();
  const { categories, budgets, addCategory, removeCategory, setBudget } = useData();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile?.name ?? "");
  const [newCatName, setNewCatName] = useState("");
  const [newCatType, setNewCatType] = useState<TransactionType>("expense");
  const [newCatIcon, setNewCatIcon] = useState(CATEGORY_ICON_CHOICES[0]);
  const [newCatColor, setNewCatColor] = useState(CATEGORY_COLOR_CHOICES[0]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!profile) return null;

  const handleSaveName = () => {
    if (name.trim().length < 2) return;
    updateProfile({ name: name.trim() });
    toast.success("Perfil atualizado");
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    await addCategory({ name: newCatName.trim(), icon: newCatIcon, color: newCatColor, type: newCatType });
    setNewCatName("");
    toast.success("Categoria criada");
  };

  const handleExport = async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gastos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Backup exportado");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importAllData(data);
      toast.success("Dados importados", "Recarregando o app...");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      toast.error("Arquivo inválido");
    } finally {
      e.target.value = "";
    }
  };

  const handleReset = async () => {
    await wipeAllData();
    toast.info("Dados apagados");
    window.location.reload();
  };

  const panelPresets = theme.mode === "dark" ? PANEL_PRESETS_DARK : PANEL_PRESETS_LIGHT;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 md:pt-8 pb-10 space-y-4">
      <h1 className="text-xl font-bold mb-2">Ajustes</h1>

      <Section title="Perfil" icon={User} defaultOpen>
        <div className="pt-4 space-y-4">
          <label className="block">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Nome</span>
            <div className="mt-1 flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 rounded-xl border px-3 py-2.5 text-sm outline-none"
                style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
              />
              <button onClick={handleSaveName} className="rounded-xl px-4 text-sm font-semibold" style={{ background: "var(--color-accent)", color: "#fff" }}>
                Salvar
              </button>
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Moeda</span>
            <select
              value={profile.currency}
              onChange={(e) => updateProfile({ currency: e.target.value })}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Meta de renda mensal</span>
            <input
              inputMode="decimal"
              defaultValue={profile.monthlyIncomeGoal ?? ""}
              onBlur={(e) => updateProfile({ monthlyIncomeGoal: e.target.value ? Number(e.target.value.replace(",", ".")) : undefined })}
              placeholder="0,00"
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
            />
          </label>

          <div>
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Cor do avatar</span>
            <div className="mt-2 flex gap-2 flex-wrap">
              {ACCENT_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => updateProfile({ avatarColor: c })}
                  className="h-7 w-7 rounded-full border-2"
                  style={{ background: c, borderColor: profile.avatarColor === c ? "var(--color-text)" : "transparent" }}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Aparência e tema" icon={Palette}>
        <div className="pt-4 space-y-1">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => resetTheme("dark")}
              className="rounded-xl py-2.5 text-sm font-semibold border"
              style={{ borderColor: theme.mode === "dark" ? "var(--color-accent)" : "var(--color-border)", color: theme.mode === "dark" ? "var(--color-accent)" : "inherit" }}
            >
              Modo escuro
            </button>
            <button
              onClick={() => resetTheme("light")}
              className="rounded-xl py-2.5 text-sm font-semibold border"
              style={{ borderColor: theme.mode === "light" ? "var(--color-accent)" : "var(--color-border)", color: theme.mode === "light" ? "var(--color-accent)" : "inherit" }}
            >
              Modo claro
            </button>
          </div>

          <div className="py-2">
            <span className="text-sm flex items-center gap-2 mb-2"><Type size={15} /> Fonte do app</span>
            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => updateTheme({ fontFamily: f.key })}
                  className="rounded-xl border px-3 py-2.5 text-left text-sm"
                  style={{
                    borderColor: theme.fontFamily === f.key ? "var(--color-accent)" : "var(--color-border)",
                    background: "var(--color-panel-alt)",
                    fontFamily: f.stack,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            <ColorField label="Cor da fonte" value={theme.fontColor} onChange={(v) => updateTheme({ fontColor: v })} />
            <ColorField label="Cor do texto secundário" value={theme.mutedColor} onChange={(v) => updateTheme({ mutedColor: v })} />
            <ColorField label="Cor de fundo" value={theme.bgColor} onChange={(v) => updateTheme({ bgColor: v })} />
            <ColorField label="Cor dos painéis/cards" value={theme.panelColor} onChange={(v) => updateTheme({ panelColor: v })} />
            <ColorField label="Cor dos painéis internos" value={theme.panelAltColor} onChange={(v) => updateTheme({ panelAltColor: v })} />
            <ColorField label="Cor das bordas" value={theme.borderColor} onChange={(v) => updateTheme({ borderColor: v })} />
            <ColorField label="Cor de destaque (botões)" value={theme.accentColor} onChange={(v) => updateTheme({ accentColor: v })} />
            <ColorField label="Cor de receitas" value={theme.incomeColor} onChange={(v) => updateTheme({ incomeColor: v })} />
            <ColorField label="Cor de despesas" value={theme.expenseColor} onChange={(v) => updateTheme({ expenseColor: v })} />
          </div>

          <div className="py-2">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Paletas rápidas de painel</span>
            <div className="mt-2 flex gap-2 flex-wrap">
              {panelPresets.map((c) => (
                <button
                  key={c}
                  onClick={() => updateTheme({ panelColor: c })}
                  className="h-7 w-7 rounded-full border-2"
                  style={{ background: c, borderColor: theme.panelColor === c ? "var(--color-accent)" : "var(--color-border)" }}
                />
              ))}
            </div>
          </div>

          <label className="block py-3">
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
              Arredondamento dos cantos ({theme.radius}px)
            </span>
            <input
              type="range"
              min={0}
              max={32}
              value={theme.radius}
              onChange={(e) => updateTheme({ radius: Number(e.target.value) })}
              className="mt-2 w-full"
            />
          </label>
        </div>
      </Section>

      <Section title="Notificações (toasts)" icon={Bell}>
        <div className="pt-4">
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            <ColorField label="Fundo do toast" value={theme.toastBg} onChange={(v) => updateTheme({ toastBg: v })} />
            <ColorField label="Texto do toast" value={theme.toastText} onChange={(v) => updateTheme({ toastText: v })} />
            <ColorField label="Cor de sucesso" value={theme.toastSuccess} onChange={(v) => updateTheme({ toastSuccess: v })} />
            <ColorField label="Cor de erro" value={theme.toastError} onChange={(v) => updateTheme({ toastError: v })} />
            <ColorField label="Cor de alerta" value={theme.toastWarning} onChange={(v) => updateTheme({ toastWarning: v })} />
            <ColorField label="Cor de informação" value={theme.toastInfo} onChange={(v) => updateTheme({ toastInfo: v })} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => toast.success("Tudo certo!", "Assim fica um toast de sucesso.")} className="rounded-xl py-2 text-xs font-semibold border" style={{ borderColor: "var(--color-border)" }}>
              Testar sucesso
            </button>
            <button onClick={() => toast.error("Algo deu errado", "Assim fica um toast de erro.")} className="rounded-xl py-2 text-xs font-semibold border" style={{ borderColor: "var(--color-border)" }}>
              Testar erro
            </button>
            <button onClick={() => toast.warning("Atenção", "Assim fica um toast de alerta.")} className="rounded-xl py-2 text-xs font-semibold border" style={{ borderColor: "var(--color-border)" }}>
              Testar alerta
            </button>
            <button onClick={() => toast.info("Só um aviso", "Assim fica um toast informativo.")} className="rounded-xl py-2 text-xs font-semibold border" style={{ borderColor: "var(--color-border)" }}>
              Testar informação
            </button>
          </div>
        </div>
      </Section>

      <Section title="Categorias e orçamento" icon={Plus}>
        <div className="pt-4 space-y-4">
          <div>
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Suas categorias</span>
            <div className="mt-2 space-y-2 max-h-64 overflow-y-auto pr-1">
              {categories.map((c) => {
                const budget = budgets.find((b) => b.categoryId === c.id);
                return (
                  <div key={c.id} className="flex items-center gap-2 rounded-xl border px-3 py-2" style={{ borderColor: "var(--color-border)" }}>
                    <IconRenderer name={c.icon} size={16} color={c.color} />
                    <span className="flex-1 text-sm truncate">{c.name}</span>
                    <span className="text-[10px] rounded-full px-2 py-0.5" style={{ background: "var(--color-panel-alt)", color: "var(--color-text-muted)" }}>
                      {c.type === "expense" ? "Despesa" : "Receita"}
                    </span>
                    {c.type === "expense" && (
                      <input
                        type="number"
                        placeholder="Limite"
                        defaultValue={budget?.monthlyLimit ?? ""}
                        onBlur={(e) => setBudget(c.id, Number(e.target.value) || 0)}
                        className="w-20 rounded-lg border px-2 py-1 text-xs outline-none"
                        style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
                      />
                    )}
                    {!c.isDefault && (
                      <button onClick={() => removeCategory(c.id)} aria-label="Remover categoria">
                        <Trash2 size={15} style={{ color: "var(--color-expense)" }} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border p-3 space-y-3" style={{ borderColor: "var(--color-border)" }}>
            <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>Nova categoria</span>
            <div className="flex gap-2">
              {(["expense", "income"] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setNewCatType(t)}
                  className="flex-1 rounded-lg py-1.5 text-xs font-semibold"
                  style={{ background: newCatType === t ? "var(--color-accent)" : "var(--color-panel-alt)", color: newCatType === t ? "#fff" : "var(--color-text-muted)" }}
                >
                  {t === "expense" ? "Despesa" : "Receita"}
                </button>
              ))}
            </div>
            <input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Nome da categoria"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ background: "var(--color-panel-alt)", borderColor: "var(--color-border)" }}
            />
            <div className="flex gap-1.5 flex-wrap max-h-20 overflow-y-auto">
              {CATEGORY_ICON_CHOICES.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewCatIcon(icon)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border"
                  style={{ borderColor: newCatIcon === icon ? newCatColor : "var(--color-border)", background: "var(--color-panel-alt)" }}
                >
                  <IconRenderer name={icon} size={14} />
                </button>
              ))}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORY_COLOR_CHOICES.map((c) => (
                <button
                  key={c}
                  onClick={() => setNewCatColor(c)}
                  className="h-6 w-6 rounded-full border-2"
                  style={{ background: c, borderColor: newCatColor === c ? "var(--color-text)" : "transparent" }}
                />
              ))}
            </div>
            <button
              onClick={handleAddCategory}
              disabled={!newCatName.trim()}
              className="w-full rounded-lg py-2 text-sm font-semibold disabled:opacity-50"
              style={{ background: "var(--color-accent)", color: "#fff" }}
            >
              Adicionar categoria
            </button>
          </div>
        </div>
      </Section>

      <Section title="Dados" icon={Database}>
        <div className="pt-4 space-y-3">
          <button onClick={handleExport} className="flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium" style={{ borderColor: "var(--color-border)" }}>
            <Download size={16} /> Exportar backup (.json)
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium" style={{ borderColor: "var(--color-border)" }}>
            <Upload size={16} /> Importar backup
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />

          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)} className="flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium" style={{ borderColor: "var(--color-expense)", color: "var(--color-expense)" }}>
              <AlertTriangle size={16} /> Apagar todos os dados
            </button>
          ) : (
            <div className="rounded-xl border p-3 text-sm" style={{ borderColor: "var(--color-expense)" }}>
              <p className="mb-2">Isso apaga transações, categorias e perfil. Não pode ser desfeito. Confirma?</p>
              <div className="flex gap-2">
                <button onClick={handleReset} className="flex-1 rounded-lg py-2 font-semibold" style={{ background: "var(--color-expense)", color: "#fff" }}>
                  Sim, apagar tudo
                </button>
                <button onClick={() => setShowResetConfirm(false)} className="flex-1 rounded-lg border py-2" style={{ borderColor: "var(--color-border)" }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section title="Sobre o app" icon={Info}>
        <div className="pt-4 space-y-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
          <p>Gastos é um app instalável (PWA) para controle de finanças pessoais. Seus dados ficam salvos localmente no seu dispositivo.</p>
          <p>Renda mensal configurada: {profile.monthlyIncomeGoal ? formatCurrency(profile.monthlyIncomeGoal, profile.currency) : "não definida"}</p>

          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--color-expense)" }}>
              <LogOut size={15} /> Excluir perfil e sair
            </button>
          ) : (
            <div className="rounded-xl border p-3" style={{ borderColor: "var(--color-expense)" }}>
              <p className="mb-2">Isso remove seu perfil e todos os dados deste dispositivo.</p>
              <div className="flex gap-2">
                <button onClick={deleteAccount} className="flex-1 rounded-lg py-2 font-semibold" style={{ background: "var(--color-expense)", color: "#fff" }}>
                  Confirmar exclusão
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-lg border py-2" style={{ borderColor: "var(--color-border)" }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
