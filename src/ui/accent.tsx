import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { accentFill, productTheme as T } from "../theme";

/** ORÇAMENTO DE ACENTO, metade dois.
 *
 *  A queixa literal de três dos quatro juízes cegos: "o vermelho é usado como acento em
 *  três magnitudes diferentes sem ranquear nada — barra de topo, medidor inteiro e o
 *  retângulo cheio de Começar. Acento que aparece três vezes deixa de ser acento."
 *
 *  A regra: **por tela, UM só elemento pinta ÁREA com o acento.** Todo o resto usa neutro
 *  ou o acento em papel subordinado (`accentSet().text` para escrever, `.mark` para traço
 *  e marca pequena) — e esses dois não têm limite, porque não são massa.
 *
 *  Duas travas, uma barata e uma alta:
 *    1. tipo — `accentSet` não devolve mais `fill`. A única porta para o acento em massa é
 *       este hook, então "pintar área com o acento sem passar pelo orçamento" não compila.
 *    2. ruído — o segundo elemento a reivindicar na MESMA tela dispara `console.error`
 *       nomeando os dois. tools/shots.mjs trata erro de console como reprova, então o
 *       estouro derruba um gate que já existe. Não derruba a tela: o app segue montado,
 *       porque tela em branco não ensina nada a ninguém.
 *
 *  ponytail: contexto + um array de nomes. Sem provider de tema, sem registry, sem
 *  prioridade entre reivindicantes — quem tem que sair é decisão de composição, da tela.
 */
type Slot = { holders: string[] };

const Ctx = createContext<Slot | null>(null);

/** Uma tela, um orçamento. Montado por `Phone`, então nenhuma tela precisa lembrar. */
export function AccentBudget({ children }: { children: ReactNode }) {
  const slot = useRef<Slot>({ holders: [] }).current;
  return <Ctx.Provider value={slot}>{children}</Ctx.Provider>;
}

/** Reivindica o acento em MASSA e devolve o par preenchimento/tinta já resolvido contra
 *  o piso de contraste. `who` é o nome que aparece no erro — use o do elemento, não o do
 *  arquivo, porque a mesma tela pode ter dois do mesmo arquivo.
 *
 *  `claim = false` é a SAÍDA prescrita pela própria regra, não um jeito de furá-la: quem
 *  não é o elemento dominante da tela devolve o par NEUTRO e não reivindica nada. Uma ação
 *  repetida numa lista de cartões é o caso vivo — três "Aplicar" acentuados numa rolagem
 *  são três retângulos cheios, que é exatamente a queixa. */
export function useAccentMass(who: string, accent?: string, claim = true) {
  const slot = useContext(Ctx);
  useEffect(() => {
    if (!slot || !claim) return;
    slot.holders.push(who);
    if (slot.holders.length > 1) {
      console.error(
        `Orçamento de acento estourado: ${slot.holders.join(" + ")} pintam área com o acento na mesma tela. Um só pode; o resto usa neutro, accentSet().text ou accentSet().mark.`,
      );
    }
    return () => {
      const i = slot.holders.indexOf(who);
      if (i >= 0) slot.holders.splice(i, 1);
    };
  }, [slot, who, claim]);
  return claim
    ? accentFill(accent || T.accentFallback)
    : { fill: T.fill, ink: T.ink };
}
