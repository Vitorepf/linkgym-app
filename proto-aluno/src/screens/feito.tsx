import { NOW } from "@/lib/seed";
import { useLink } from "@/lib/store";
import { dateShort } from "@/lib/format";
import { vibrate } from "@/lib/tap";
import { Roll } from "@/ui/kit";
import { Shot } from "@/ui/photo";

/**
 * Festa de patamar — só no primeiro cruzar 25/50/75/100. Tela cheia. Dois
 * degraus: corpo 17 + numeral 25 (1,47× ≤ 2,3). Zero t-micro / t-kicker.
 */
export function Feito() {
  const proof = useLink((s) => s.lastProof);
  const close = useLink((s) => s.closeFeito);
  const onFeast = () => {
    vibrate("feast");
    close();
  };
  const step = proof?.patamar;
  const feast = proof?.mode === "patamar" || Boolean(step);
  const sub = step?.sub ?? proof?.pr?.kg ?? "—";
  const unidade = step?.unidade ?? "Carga";
  const frase = step?.frase ?? "Uma marca nova.";
  const barra = step?.barra ?? 0;
  const was = proof?.pr?.before != null ? String(proof.pr.before).replace(".", ",") : undefined;
  const mark = typeof sub === "number" ? String(sub).replace(".", ",") : String(sub);
  const serie = proof?.lead ?? proof?.title ?? "Sessão";

  return (
    <div className="anim-rise flex min-h-0 flex-1 flex-col justify-end px-5 pb-4 pt-3">
      {feast ? (
        <div className="plate px-5 py-6">
          <p className="t-body">{serie}</p>
          <p className="t-display mt-2 tabular-nums">
            <Roll value={mark} was={was} />
          </p>
          <p className="t-body mt-2">{unidade}</p>
          <p className="t-body mt-5">{frase}</p>
          <p className="t-body mt-3">{dateShort(NOW)} 2026</p>
          <span className="mt-6 block h-1 overflow-hidden rounded-full bg-line">
            <span className="block h-full rounded-full bg-fill" style={{ width: `${barra}%` }} />
          </span>
        </div>
      ) : (
        <div>
          <Shot src={proof?.image ?? "/feed/supino.jpg"} still square />
          <p className="t-body mt-4">{serie}</p>
          <p className="t-body mt-2">
            {proof
              ? `${proof.sets} ${proof.sets === 1 ? "série" : "séries"} · ${proof.minutes || 1} min · ${proof.title}`
              : "hoje"}
          </p>
        </div>
      )}
      <div className="mt-4">
        <button type="button" onClick={onFeast} className="thumb">
          É o meu.
        </button>
      </div>
    </div>
  );
}
