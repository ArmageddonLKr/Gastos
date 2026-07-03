import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-5xl font-black" style={{ color: "var(--color-accent)" }}>
        404
      </p>
      <p style={{ color: "var(--color-text-muted)" }}>Página não encontrada.</p>
      <Link
        to="/"
        className="mt-2 rounded-xl px-4 py-2 text-sm font-semibold"
        style={{ background: "var(--color-accent)", color: "#fff" }}
      >
        Voltar ao início
      </Link>
    </div>
  );
}
