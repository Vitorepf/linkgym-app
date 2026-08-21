# Veredito: oficio-things

data: 21 ago 2026 (jurado cego, instância nova — não é cbaa77de)
julgamento: empatou
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/00-defeitos-e-linha-de-base.md (Arbitragem 21 ago 2026 §§1–3, «O que isto deixa de ser falha», «O que ainda é falha») + docs/barra-proto/02-oficio-things.md B1 B3 B20 C-final
caminho_artefato: proto-aluno/src/app-root.tsx, proto-aluno/src/screens/hoje.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/feito.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/components/shell.tsx, proto-aluno/src/styles.css
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. escala 10 degraus, 0 avulsos, maior salto 1,24; extremos do sistema 25/11 = 2,27. tipos pior=4. O medidor não lê dono de `RACK`/`CARDS` nem Face na dobra.

Afirmação falsificável: `RACK` contém exatamente `serie`, `descanso`, `feito`, `como`, `fichaSessao`; `CARDS` é o conjunto vazio; com overlay nesses cinco, `isSheet` e `isCard` são falsos e a cena monta em `LiveScene` — zero `<Sheet>` e zero `.sheet-card`. Face na dobra do Hoje é 22, não maior. `Segment` não pinta trilho. Isto é verdadeiro no arquivo.

## O que o arquivo mostra

`app-root.tsx:96-97`: `RACK = new Set(["serie", "descanso", "feito", "como", "fichaSessao"])`. `CARDS = new Set()`. `app-root.tsx:150-182`: `rackUnder` devolve o overlay se ele está em `RACK`; `LiveScene` é `RackScene` nesse caso. `isCard` exige `CARDS.has` — sempre falso. `isSheet` exige `!RACK.has(overlay)` — falso para os cinco. O bloco `(isSheet || isCard) && OverlayScene` portanto não monta `Sheet` quando o overlay é um dos cinco. `ComoFazer` e `FichaSessao` (`serie.tsx:168-245`) são coluna `flex-1` com `Dock`, sem classe `sheet`.

`.sheet` (`styles.css:240-256`) continua 35% × 25% — orçamento da folha social (00 arb. 3). `.sheet-card` 55% existe no CSS (`styles.css:258-269`) e `Sheet` ainda aceita `tall`, mas `tall={isCard}` nunca acende enquanto `CARDS` estiver vazio.

Dobra do Hoje (`hoje.tsx` + chrome `shell.tsx:33-35`): corpos `t-body` 17 e `t-small` 15. Chrome 17. Título da ficha 17. Começar 17 + min 15. Razão visível 17/15 = 1,13 ≤ 1,40. Zero `t-display` / `t-hero` / `t-title` / 84 px nesta dobra. `t-kicker` do Raid está depois de `min-h-[36vh]` — fora da primeira dobra.

Face na dobra: `hoje.tsx:168` e `hoje.tsx:216` passam `size={22}`. 22 não é >22. B3 (ícone de linha 18–22 pt) fecha no tamanho.

`Segment` (`bits.tsx:485-511`): `flex gap-5`, rótulo `t-body`, selecionado `text-ink`, o resto `text-mute`. Zero fundo, zero régua, zero trilho. Nenhum outro arquivo importa `Segment`.

Feito patamar (`feito.tsx:31-42`): `t-body` 17 + `t-display` 25. 25/17 = 1,47 ≤ 2,3. Dois degraus. Zero `t-micro` / `t-kicker` no prato.

## Arbitragem (00 vence 02)

- Extremos Things B1 2,0–2,3× na primeira dobra do Hoje: 00 arb. 2 dispensa. Lá vale Linear ≤ 1,40. 15+17 = 1,13. **Não é falha.**
- Rack full-bleed vs Things B20 40–70%: 00 arb. 3. O rack (`serie` / `descanso` / `feito` / `como` / `fichaSessao`) É a cena. B20 e sheet não se aplicam a esses cinco. Full-bleed **não** é falha.
- Como / Ficha da sessão como folha ou cartão: 00 «O que ainda é falha». No arquivo atual os dois ids estão em `RACK` e sobem `LiveScene`. **Não dispara.**
- Face >22 na dobra do Hoje: 22 não é.
- Segment com trilho: o arquivo não tem trilho.
- Feito 25/17 = 1,47: 00 arb. 1 autoriza dois degraus e numeral ≤ 2,3× no patamar. **Não é falha.**
- Medidor `tudo` 0 fora: 00 «O que ainda é falha» não dispara por número.

## O que 02 ainda mede e não supera

C-final do 02 ganha o eixo em C8 (três cores de estado com prova em cinza), C5 (vão ≥ 3,0× constante entre telas) e C16 (centros de alvo ≥ 48 pt). Nenhum dos três foi medido neste artefato como ganho sobre a referência. B3 no tamanho empata (22 é o teto, não acima). C7 (régua eliminada no `Segment`) é um sítio, não os três do C-final.

A linha do Bora (`hoje.tsx:213`) centra a Face na altura da linha com subtítulo — B3 pede âncora na caixa alta, não no miolo da linha. Isso está abaixo da dobra (`min-h-[36vh]`) e fora do default desta rodada (Face >22 na dobra). Não vira perdeu sob o 00 desta data; também não é C3 superado.

## Por que empatou (não venceu, não perdeu)

O default desta rodada é perdeu só se `como` / `fichaSessao` ainda subirem sheet ou cartão, se Face >22 na dobra do Hoje, ou se `Segment` tiver trilho. Os três são falsos no arquivo. A frase do 00 que derrubou o laudo antigo (Como / Ficha como cartão) deixou de ser verdadeira: os dois ids saíram de `CARDS` e entraram em `RACK`. B20 (cartão 40–70%) e B1 (extremos 2,0–2,3× no Hoje) continuam dispensados — sozinhos não sustentam perdeu. Os números da barra que restam (dobra ≤ 1,40, Face ≤ 22, rack = cena, tipos ≤ 5, medidor 0) estão reproduzidos, não ultrapassados nos três sítios do C-final. Isso é o teto do ofício nesta arbitragem, não ficar acima do Things.

Para eu estar errado: `como` ou `fichaSessao` teriam de voltar a montar `Sheet` / `.sheet-card` (sair de `RACK` ou entrar em `CARDS` com `tall`), ou Face na dobra do Hoje ter de ser >22, ou `Segment` ter de ganhar trilho, ou a dobra do Hoje ter de passar de 1,40. C8 / C5 / C16 medidos acima da referência trocariam empatou por venceu; não foram.
