# Veredito: motion (Duolingo)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/05-motion-duolingo.md D8 D10 D12 C8; docs/duelo-e-juiz.md §11; docs/ficha-de-atributos.md §7
caminho_artefato: proto-aluno/src/screens/feito.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/lib/store.ts
medidor: `cd proto-aluno && node tools/medir.mjs cerimonia -v` — 0 fora (proxy mentiroso: `overlay:\s*"feito"` não casa o ternário, então conta 0 telas). `movimento -v` — 0 fora (4 durações, 0 mortas, 1 loop). `tudo -v` — 0 fora. Afirmação do implementador: patamar é modo de feito; sessão sem marca nova publica e volta ao Hoje; MarkStrip 520 ms no Thumb. O que o arquivo faz: a ficha do dia já nasce PR (`62,5 > 60`), então o caminho padrão é descanso + esforço + Terminar + festa. D8 pede ≤ 2 telas e ≤ 1 toque; C8 é onde se ganha; §11.0 pede 0 e 0 no veredito; §7.2 pede 1 e 1 só no cruzar 25/50/75/100.

brechas:
- proto-aluno/src/lib/store.ts:349-372 — D12 / §7: `patamar = stats.pr`. Qualquer kg acima de `last_kg` toma a vaga de festa. §7 cortou «patamar em todo PR» porque PR é semanal e tela cheia semanal é pedágio. Não cruza 25/50/75/100. Não escreve `festaCheia`.
- proto-aluno/src/lib/seed.ts:302-306 — o proto entrega o pedágio: Supino `load_kg: 62.5` / `last_kg: 60`. Fechar a sessão do dia, sem tocar na carga, dispara festa. «Sessão sem marca nova volta ao Hoje» é o ramo morto.
- proto-aluno/src/screens/descanso.tsx:89-126 — D8/C8: depois da última série o descanso é tela cheia, o Thumb nasce `disabled` até o esforço, depois «Terminar sessão». Dois toques obrigatórios antes de Hoje ou do patamar. O orçamento de 1 toque morre aqui. O ato já acabou; isto é pedágio no caminho de volta ao aparelho.
- proto-aluno/src/screens/feito.tsx:26 e proto-aluno/src/styles.css:47 — D10/C9/C10, festa sem o número do ato: `--text-plate: 25px`, corpo 17 px. 25/17 = 1,47×. Piso da barra é 2,5× (42,5 px). §7.3 crava `t-plate` em 84 px (4,9×). O herói é um degrau de escada, 1 px acima de `t-score`. A arte não é maior que o número só porque não existe arte.
- proto-aluno/src/screens/feito.tsx:22-33 — §7.3: a peça central é um `.plate`. Não há `.plate`. Número, kicker, frase, data e trilha soltos no fundo. Sem háptico (grep `vibrate` = 0).
- proto-aluno/src/screens/serie.tsx:121-138 — D9 parcialmente: MarkStrip cobre o Thumb 520 ms e não empurra. O algarismo é `t-title` (21 px, kit.tsx:321) = 1,24× o corpo, igual ao kg que já estava na série. Não é a palavra «PERFECT» em 70% da largura. Depois `logSet()` navega ao descanso — inclusive na última série.
- proto-aluno/src/screens/social.tsx:181-190 e :288-294 — §11.0 / §11.3: os 520 ms do veredito rodam ao *abrir* a Prova, somem sozinhos e devolvem o ObjectBar. Superfície errada. A faixa deveria ficar. Hoje e Descanso não têm MarkStrip. 0 tela 0 toque sobre o vivo não existe.
- proto-aluno/src/app-root.tsx:93 e :144-157 — `feito` está no RACK e substitui a aba. TabBar agora fica (shell.tsx:191), mas a cerimônia ainda navega. §11.0: ela nunca saiu. Aqui ela sai.

o que o eixo já acerta e não basta:
- Modo `patamar` existe. O único alvo da festa é «É o meu.» (54 px, sem Quiet embaixo) — a falha nomeada em D12 do veredito anterior fechou.
- CSS caiu de 5 para 4 durações. MarkStrip no slot do Thumb é a mecânica certa de D1/D9, no tamanho errado e no fluxo errado.
- Sem PR o store zera o overlay e publica. No proto o PR é o default.

o que venceria:
- Caminho diário: última série fecha, publica, Hoje. 0 telas cheias, 0 toques depois do ato. Esforço e recibo moram depois, fora do rack.
- Patamar só no primeiro cruzar 25/50/75/100 da conta, 1 tela, 1 toque, algarismo ≥ 2,5× o corpo, `.plate`, «É o meu.» Feito-recibo pulado. Medidor que leia o ternário, não o literal.
- Veredito de duelo: 520 ms por cima do Hoje/Descanso/Feito vivo, faixa fica, 0 navega, 0 toque. MarkStrip de série no mesmo slot, com o algarismo à escala de D10, sem mandar ao descanso na última.
