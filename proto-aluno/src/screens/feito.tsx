import { NOW } from "@/lib/seed";
import { useLink } from "@/lib/store";
import { dateShort } from "@/lib/format";
import { Roll } from "@/ui/kit";
import { Shot } from "@/ui/photo";

/**
 * Overlay `feito` em modo `patamar` — a única festa de tela cheia.
 * Recibo diário publica sozinho e não abre esta cena.
 */
export function Feito() {
  const proof = useLink((s) => s.lastProof);
  const close = useLink((s) => s.closeFeito);
  const step = proof?.patamar;
  const feast = proof?.mode === "patamar" || Boolean(step);
  const sub = step?.sub ?? proof?.pr?.kg ?? "—";
  const unidade = step?.unidade ?? "Carga";
  const frase = step?.frase ?? "Uma marca nova.";
  const barra = step?.barra ?? 0;
  const was = proof?.pr?.before != null ? String(proof.pr.before).replace(".", ",") : undefined;
  const mark = typeof sub === "number" ? String(sub).replace(".", ",") : String(sub);

  return (
    <div className="anim-rise flex min-h-0 flex-1 flex-col">
      {feast ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center px-6">
          <div className="plate px-5 py-6">
            <p className="t-display tabular-nums">
              <Roll value={mark} was={was} />
            </p>
            <p className="t-kicker mt-2">{unidade}</p>
            <p className="t-body mt-5">{frase}</p>
            <p className="t-small mt-3">{dateShort(NOW)} 2026</p>
            <span className="mt-6 block h-1 overflow-hidden rounded-full bg-line">
              <span className="block h-full rounded-full bg-fill" style={{ width: `${barra}%` }} />
            </span>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col px-5 pt-2">
          <Shot src={proof?.image ?? "/feed/supino.jpg"} still square />
          <p className="t-body mt-4">{proof?.title ?? "Sessão"}</p>
          <p className="t-small mt-2">
            {proof
              ? `${proof.sets} séries · ${proof.minutes} min · ${proof.lead ?? proof.title}`
              : "hoje"}
          </p>
        </div>
      )}
      <div className="px-6 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
        <button type="button" onClick={close} className="thumb">
          É o meu.
        </button>
      </div>
    </div>
  );
}
