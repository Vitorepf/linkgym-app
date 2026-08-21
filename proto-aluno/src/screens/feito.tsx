import { NOW, fichaOf, YOU_ID } from "@/lib/seed";
import { useLink } from "@/lib/store";
import { dateShort } from "@/lib/format";
import { Shot } from "@/ui/photo";

/**
 * Overlay `feito` em modo `patamar` — a única festa de tela cheia.
 * Recibo diário publica sozinho e não abre esta cena.
 */
export function Feito() {
  const proof = useLink((s) => s.lastProof);
  const close = useLink((s) => s.closeFeito);
  const step = proof?.patamar;
  const ficha = fichaOf(YOU_ID);
  const feast = proof?.mode === "patamar" || Boolean(step);
  const sub = step?.sub ?? ficha.barras[0]?.rotulo ?? "—";
  const unidade = step?.unidade ?? "kg · Carga";
  const frase = step?.frase ?? ficha.leitura ?? "Carga. Uma marca nova.";
  const barra = step?.barra ?? ficha.barras[0]?.barra ?? 0;

  return (
    <div className="anim-rise flex min-h-0 flex-1 flex-col">
      {feast ? (
        <div className="flex min-h-0 flex-1 flex-col justify-center px-6">
          <div className="px-1 py-4">
            <p className="t-plate tabular-nums">{sub}</p>
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
          <Shot src="/feed/supino.jpg" still square />
          <p className="t-body mt-4">{proof?.title ?? "Sessão"}</p>
          <p className="t-small mt-2">
            {proof ? `${proof.sets} séries · ${proof.minutes} min · hoje` : "hoje"}
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
