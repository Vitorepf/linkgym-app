import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles.css";
import { useLink } from "@/lib/store";
import { PostCard } from "@/screens/post-card";
import { Perfil } from "@/screens/perfil";
import { Bora, Composer, Pessoa, Prova, Zap } from "@/screens/social";

/* Banca temporária: só as cenas desta fatia, fora do app-root, para conferir
   o desenho enquanto rede.tsx e grupos.tsx ainda não compilam. */

useLink.setState({
  hydrated: true,
  overlay: null,
  selectedProofId: "p1",
  selectedPersonId: "marina",
  selectedBoraId: "r-parque",
});

function Frame({ title, tone, children }: { title: string; tone?: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: 12 }}>
      <p style={{ color: "gray", font: "600 12px system-ui", margin: "0 0 6px" }}>{title}</p>
      <div
        className={`relative flex h-[844px] w-[430px] flex-col overflow-hidden bg-bg text-ink ${tone ?? ""}`}
      >
        {children}
      </div>
    </div>
  );
}

function Feed() {
  const proofs = useLink((s) => s.proofs);
  return <div className="scroll flex min-h-0 flex-1 flex-col pt-3">{proofs.slice(0, 4).map((p) => <PostCard key={p.id} post={p} />)}</div>;
}

function Banca() {
  const person = useLink((s) => s.selectedPersonId);
  const proof = useLink((s) => s.selectedProofId);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: 12, font: "600 12px system-ui" }}>
        {["marina", "ana", "diego"].map((id) => (
          <button key={id} type="button" className="h-12" onClick={() => useLink.setState({ selectedPersonId: id })}>
            pessoa: {id} {person === id ? "•" : ""}
          </button>
        ))}
        {["p1", "p-vid-bia", "p-txt-fred"].map((id) => (
          <button key={id} type="button" className="h-12" onClick={() => useLink.setState({ selectedProofId: id })}>
            prova: {id} {proof === id ? "•" : ""}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Frame title="Perfil"><Perfil /></Frame>
        <Frame title="Feed (PostCard)"><Feed /></Frame>
        <Frame title="Prova"><Prova /></Frame>
        <Frame title="Pessoa"><Pessoa /></Frame>
        <Frame title="Bora"><Bora /></Frame>
        <Frame title="Zap" tone="tone-zap"><Zap /></Frame>
        <Frame title="Composer"><Composer /></Frame>
      </div>
    </div>
  );
}

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Banca />
  </StrictMode>,
);
