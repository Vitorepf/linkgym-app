import { createContext, useContext, useMemo, type ReactNode } from "react";
import { APARENCIA_PADRAO, criarTema, type Aparencia, type Tema } from "../theme";

/** O TEMA EM TEMPO DE EXECUÇÃO — a peça que faltava para o white-label existir de verdade.
 *
 *  O defeito que isto conserta: `src/theme.ts` exporta constantes de MÓDULO, e cada tela
 *  faz `const styles = StyleSheet.create({ borderColor: T.divider })` no topo do arquivo.
 *  Esse valor é lido UMA vez, quando o bundle carrega — antes de existir personal, antes
 *  de existir escolha. Por isso o app inteiro só sabia trocar uma coisa: o acento, que era
 *  o único token que viajava como PROP. Trocar o chão, a forma ou a densidade exigiria
 *  reiniciar o app, e prévia ao vivo era impossível.
 *
 *  A troca é de duas linhas por arquivo, e o corpo do StyleSheet não muda uma vírgula:
 *
 *      const styles = StyleSheet.create({ ... })        // antes
 *      const usarEstilos = estilos(({ T, SPACE }) =>    // depois
 *        StyleSheet.create({ ... }))                    // corpo idêntico
 *
 *  e dentro do componente, `const styles = usarEstilos();`. O truque é o nome do
 *  parâmetro: a fábrica recebe `T`, `SPACE`, `TYPE`… — exatamente os nomes que hoje vêm
 *  do import — então cada referência dentro do corpo passa a apontar para o tema vivo sem
 *  ser editada. `StyleSheet.create` fica DENTRO da fábrica de propósito: é ele que dá ao
 *  TypeScript os tipos literais ("row", "center") que um objeto solto perderia.
 */
const Ctx = createContext<Tema>(criarTema(APARENCIA_PADRAO));

export function TemaDoTime({
  aparencia,
  children,
}: {
  aparencia?: Aparencia | null;
  children: ReactNode;
}) {
  // A chave é o documento serializado, e não o objeto: o /v1/me devolve um objeto NOVO a
  // cada volta, e memoizar por identidade recriaria todas as folhas de estilo do app a
  // cada refresh de sessão.
  const chave = JSON.stringify(aparencia ?? APARENCIA_PADRAO);
  const tema = useMemo(() => criarTema(JSON.parse(chave) as Aparencia), [chave]);
  return <Ctx.Provider value={tema}>{children}</Ctx.Provider>;
}

export const useTema = (): Tema => useContext(Ctx);

/** Uma folha de estilo POR TEMA, criada na primeira vez que aquele tema pisa na tela e
 *  guardada em WeakMap: trocar de aparência não vaza folha velha, e a identidade estável
 *  do objeto é o que impede o React de remontar a árvore a cada quadro. */
export function estilos<S>(fabrica: (t: Tema) => S): () => S {
  const cache = new WeakMap<Tema, S>();
  return function usarEstilos(): S {
    const tema = useTema();
    let folha = cache.get(tema);
    if (!folha) {
      folha = fabrica(tema);
      cache.set(tema, folha);
    }
    return folha;
  };
}
