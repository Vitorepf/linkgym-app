# Veredito: componentes (Stripe)

data: 21 ago 2026
julgamento: perdeu
na_barra: true
refutado: false
caminho_ref: docs/barra-proto/03-componentes-stripe.md (ausente no disco; critérios operacionais em docs/barra-proto/proxima-passada.md §3)
caminho_artefato: proto-aluno/src/ui/kit.tsx, proto-aluno/src/screens/serie.tsx, proto-aluno/src/screens/ficha.tsx, proto-aluno/src/screens/descanso.tsx, proto-aluno/src/components/bits.tsx, proto-aluno/src/styles.css, proto-aluno/src/ui/feed.tsx, proto-aluno/src/components/shell.tsx
medidor: `cd proto-aluno && node tools/medir.mjs tudo -v` — 0 fora. `preenchido` (proxy de B1) conta só `<Thumb>` / `className="thumb"` e `bg-(ink|stamp)`; não vê `bg-raised` nem `bg-fill`. `acento` pior cena 2. Contraste mute 5,73 / faint 5,01 / ghost 3,05.

afirmação: na Série, quatro HoldTick `bg-transparent` + um Thumb = um preenchido; na captura do Descanso com `fechaExercicio`, três botões `bg-fill`/`bg-raised` + Thumb = quatro massas; Montar, Oferecer e Descanso desligam o Thumb sem três portadores sob o culpado.

## O que o arquivo mostra

- HoldTick outline — verdadeiro. `bits.tsx` HoldTick é `border border-edge bg-transparent text-ink`. Sem face cheia. A Série tem um preenchido (o Thumb).
- Chip 3 portadores — verdadeiro no primitivo. `quiet` / `live` / `done` / `outline` levam fill + palavra + glifo. `outline` não tem call site. `live`, `done` e `quiet` usam o mesmo `bg-raised text-ink`; quem distingue é só o glifo.
- `.sheet` 35% × 25% — verdadeiro. `styles.css` crava `width/max-width: 35%` e `height/max-height: 25%`. Fecha o furo da folha social. `.sheet-card` (Como / FichaSessao) continua 55–70% × 100%; não é esta folha.
- disabled 2,2–3,0 — parcial. `.thumb:disabled` mistura ink 28–34% no bg, texto `color: bg`: face ~#4c–#5a, razão ~2,3–2,9:1, na faixa. `.quiet:disabled` é faint 5,01:1 e vira outro cinza. `Say` desligado é `disabled:border-ink disabled:text-ink` (~18:1) — o matiz fica e o contraste sobe.
- Erro com 3 portadores — parcial. `Escrever` (borda ink + `!` + frase) e Série vazia (`text-stamp` + `!` + «Carga sem peso.») têm os três no culpado. `Montar` é `disabled={!ready}`. `Oferecer` é `disabled={!pick || !obj}`. `Descanso` é `disabled={fechaExercicio && !effort}`. Três cenas ainda só apagam o Thumb.

## Brechas

1. Descanso: três retângulos `bg-fill` / `bg-raised` na mesma camada do Thumb. A barra pede 1 preenchido na captura. O medidor não conta raised/fill.
2. Erro com 3 portadores só existe em `Escrever` e na Série sem peso. `Montar`, `Oferecer` e `Descanso` continuam só desligando.
3. `Say` desligado ganha borda ink e texto ink (~18:1). A barra pede guardar o matiz e descer o contraste para 2,2–3,0. Aqui o desligado grita mais que o ligado.
4. `.quiet:disabled` é faint 5,01:1, fora da faixa, outro cinza.

## O que venceria

Uma captura do Descanso com um único preenchido (o Thumb); esforço sem face cheia. Disabled na faixa 2,2–3,0 em Thumb, Quiet e Say, sem virar outro cinza e sem o desligado ficar mais presente. Campo inválido com três portadores no culpado em 100% das cenas que hoje só desligam. Chip e folha social já estão no número da barra — não carregam o eixo.
