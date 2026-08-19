# PLANO DO CICLO 2

Base verificada hoje: `node tools/aparencia.mjs` → **11.971 pares, 0 reprovam**. Já entregue e fora deste plano: recorte dos 3 chãos claros (ΔL* de `surface`/`raised` agora idêntico ao carvão), `divider` claro despesado, `press` sem multiplicador de movimento, `massa()` com anel (o matiz da marca sobrevive), `TemaDoTime` nos 3 ramos do `shotHost`, logo do time em Access e Hoje, escala óptica por voz (`theme.ts:886`), `secundaria` com leitor real (`Baseline.tsx:44`).

---

## 1. CONSERTOS

Em ordem de gravidade. Nada de aparência nova antes do C1 — sem ele os outros são gosto.

### C1 · A régua que falta: `separacao` em ΔL*
`tools/aparencia.mjs` mede piso de tinta (4,5) e piso de UI (3) e **nada mede quanto uma superfície se afasta do fundo em que pousou**. Por isso 0 reprovas com defeito real na tela.
- **Onde:** `tools/aparencia.mjs` (editável; `contrast.mjs` é protegido — não tocar).
- **Conserto:** reusar `luminance` de `theme.ts`, derivar L*, e dois pares novos por chão × superfície: `par(onde,"separação","a superfície se afasta do chão", |ΔL*(veuComposto, bg)|, 5)` e `par(onde,"separação","o traço não vira tinta", 34 - |ΔL*(divider,bg)|, 0)`.
- **Prova:** `node tools/aparencia.mjs` — reprova **3 linhas hoje** (item C2).

### C2 · `vidro` não existe nos três chãos claros
Medido: ΔL*(veuComposto, bg) = **-1,40** em papel, neve e linho; **+6,6 a +7,7** nos quatro escuros. O véu ESCUREVE 1,4 no claro — a superfície mais cara do cardápio é invisível em 3 de 7 chãos, e `elevacao` é 0 no vidro.
- **Onde:** `src/theme.ts:1037-1082` (ramo `ehVidro`), `src/ui/Screen.tsx:246`.
- **Conserto:** no claro o véu inverte o sentido (véu de tinta → véu de luz sobre um chão já claro não levanta): usar `alfaDoVeu` contra `raised` em vez de `ink` quando `luminance(bg) > 0.5`, ou dar ao vidro claro a `elevacao` que hoje só a `elevada` recebe. O par do C1 decide qual passa.
- **Prova:** `node tools/aparencia.mjs` (0 reprovas) + `node tools/kits.mjs --kits=Vitrine,Boutique --check`.

### C3 · A escolha de superfície não alcança 60% das telas
`FORMA.superficie` é lido em **um** lugar: `styles.raised` da Band. Contagem: **39 `raised` para 88 `<Band>`**. E em `contorno`, `raised + grow` (`Screen.tsx:246,265`) pinta borda de `FORMA.borda` em volta de `transparent` — moldura vazia que cresce com a sobra.
- **Onde:** `src/ui/Screen.tsx:144-165, 246-265`.
- **Conserto:** duas linhas. `raised = true` vira o padrão da Band (quem quer fio sangrado declara `rule`); e `borderWidth: superficie === "contorno" && grow ? 0 : ...`.
- **Prova:** `node tools/kits.mjs --kits=Clinica,Boutique --screens=Hoje,Painel,Serie,Recorde,Estreia` + `node tools/medir.mjs telas`.

### C4 · Peças que pousam em `raised` pintando token calibrado contra `bg`
`contrast(fill, raised)` = **1,23** nos quatro chãos escuros; `contrast(hairline, raised)` = **1,07**. Três peças caem nisso: `Descanso.tsx:265` (calha do cronômetro), `Perfil.tsx:373` (selos), `Baseline.tsx:87` (o eixo 0–100, que usa `hairline`: **1,23:1** contra bg — é elemento de UI, piso 3).
- **Conserto:** um helper `neutroSobre(fundo)` em `theme.ts` que devolve o degrau relativo ao fundo REAL; o eixo da Baseline passa a `T.divider` na espessura `FORMA.fio`.
- **Prova:** par do C1 aplicado aos pares (peça, fundo real) + `node tools/medir.mjs contraste`.

### C5 · Os quatro selos são o mesmo objeto
`Perfil.tsx:373-374`: `seloOn: {backgroundColor: T.fill}` e `seloOff: {borderColor: T.fill}` — mesma cor nos dois estados. Não dá para dizer qual foi conquistado.
- **Conserto:** ganho = `acento().piece` (fill + ink); não ganho = anel de `hairline`. Presença da marca marca a conquista.
- **Prova:** `node tools/kits.mjs --screens=Perfil` + par de C1.

### C6 · O seletor de cor mostra uma cor que o app nunca pinta
`src/screens/student/Perfil.tsx:220`: `{ backgroundColor: c }` — hex cru. O avatar que ele produz pinta `acento(c).piece.fill`. Única peça do app que pinta fora do motor de tinta.
- **Conserto:** `{ backgroundColor: acento(c).piece.fill }`. Uma linha.
- **Prova:** `node tools/medir.mjs soltos` (continua 0) + `node tools/kits.mjs --screens=Perfil`.

### C7 · O rosto sem cor e a foto sem fronteira
`Avatar.tsx:70` e `Initials.tsx:24` caem em `T.fill` (1,23 contra `raised`, 1,40 contra `bg`); e a `<Image>` de `Avatar.tsx:36` não tem anel nenhum — logo PNG de fundo branco dissolve no chão claro.
- **Conserto:** o caso sem cor usa `acento(accent).piece` (o motor garante o piso nos quatro fundos); toda superfície de foto ganha anel fixo `withAlpha(T.ink, 0.12)`.
- **Prova:** `par(chao,"marca","anel do rosto existe", ratio(compor(ink,0.12,bg), bg), 1.06)` nos 7 chãos.

### C8 · O gráfico não carrega a marca de ninguém
`Progresso.tsx:172` e `Painel.tsx:230`: hoje = `T.ink`, resto = `T.divider`, vazio = `T.fill`. Preto puro é a única codificação que não sobrevive à inversão de chão, e o dado — a razão de o aluno abrir Progresso — não é do personal.
- **Conserto:** série toma `acento().mark`, segunda série `acento(secundaria).mark`, não-preenchido toma o neutro de C4.
- **Prova:** `node tools/aparencia.mjs` (o par "segunda série risca" já existe) + `node tools/kits.mjs --screens=Progresso,Painel`.

### C9 · A última linha é fatiada pelo dock
`Hoje.tsx:572` (`paddingBottom: 28`), `Painel.tsx:380` (8), `Progresso.tsx:253` (8) — literais, nenhum ligado à altura do dock.
- **Conserto:** `useBottomTabBarHeight()` (react-navigation, já instalado). Uma linha por tela.
- **Prova:** `node tools/kits.mjs --kits=Garagem,Sereno --screens=Hoje,Painel,Progresso,Perfil` (o corte aparece nos claros).

### C10 · Chip duplicado no white-label
`PerfilTime.tsx:395,411` tem `usarChipEstilos` local marcando seleção com `T.fill` + borda que salta de `fio` para `borda` (rótulo desloca 1-3px). `src/ui/Choice.tsx` já resolve certo com `acento().piece`.
- **Conserto:** apagar o chip local, usar `Choice`. Diff negativo.
- **Prova:** `npx tsc --noEmit` + `node tools/kits.mjs --screens=PerfilTime`.

---

## 2. LOTES NOVOS

Em ordem de valor por custo.

### L1 · O ícone entra no sistema — `FORMA.traco` e `FORMA.ponta` (P)
`grep traco src/theme.ts` → vazio. `src/ui/Icons.tsx` crava `strokeWidth={2}` (2,5 nos de ação) e `strokeLinecap="square"` no arquivo inteiro. Em Boutique (fino/macia) o traço do ícone é o dobro do traço da tela; em Garagem (grosso) nada engrossa.
- **Entrega:** `peso` e `forma`, as duas alavancas vendidas, alcançam o ícone — 6 kits deixam de compartilhar a mesma silhueta.
- **Arquivos:** `src/theme.ts` (`FORMA.traco` 1,5/2/2,5 por peso; `FORMA.ponta` square/round por forma), `src/ui/Icons.tsx` (replace).
- **Prova:** `node tools/aparencia.mjs` com `par(peso,"geometria","o traço do ícone acompanha a borda", FORMA.traco, BORDAS[peso] - 0.5)` + `node tools/kits.mjs --check`.

### L2 · `acao` — o oitavo campo, o pedido literal do dono (M)
Um campo, 3 valores, 2.268 → **6.804** combinações. `seta` (hoje), `centro` (rótulo centrado, sem chevron, meta na segunda linha), `caixa` (caixa alta na face de texto, tracking de `TRACK.label`).
- **Entrega:** "estilo dos botões", a peça que ele aponta ao demonstrar. E conserta de graça a quebra de `AccentCTA` (`label: {flex:1}` em `AccentCTA.tsx:120` espreme o rótulo até quebrar linha na densidade arejada) reservando a coluna de `meta`+ícone antes do rótulo.
- **Arquivos:** `src/theme.ts` (`forma()`), `src/ui/AccentCTA.tsx`, `src/ui/GhostCTA.tsx` (que hoje é `alignItems:"flex-start"` cravado e por isso desalinha do vizinho), `src/screens/owner/Aparencia.tsx`, whitelist da API.
- **Prova:** `par(\`${densidade}/${acao}\`,"botão","largura útil do rótulo", 402 - 2*T.pad - metaW - iconW, 168)` × 3 densidades × 3 anatomias = 18 pares em `tools/aparencia.mjs`; `node tools/kits.mjs --screens=Serie,Painel`.

### L3 · Métrica e linha de lista derivadas da superfície (M)
Nenhum campo novo. `Metric.tsx` passa a ler `superficie`: `solida` → grade de fios (hoje), `contorno` → célula em caixa, `elevada`/`vidro` → o fio some e a divisão vira vão de `SPACE.block`. E a linha de `Painel.tsx` (hoje `paddingVertical:14` + `borderBottomWidth:1` reimplementada em cada tela) sai para `src/ui/Linha.tsx`, sangrada no chão e cartão dentro de superfície — nunca caixa dentro de caixa.
- **Entrega:** a superfície escolhida aparece nas telas de número e de lista, que é onde o app vive.
- **Arquivos:** `src/ui/Metric.tsx`, `src/ui/Figure.tsx`, novo `src/ui/Linha.tsx`, `Painel/Turma/Atencao/Revisao/Ficha/Aluna`.
- **Prova:** `par(\`${forma}/${superficie}\`,"métrica","separador único", (fio+caixa+vão)===1, 1)` (24 pares) + amostragem de pixel em `tools/kits.mjs`: o fundo dentro de uma linha tem que ser exatamente um dos quatro fundos de `criarTema(ap)`.

### L4 · A porta pinta o chão do estúdio (M)
`App.tsx:104` monta `TemaDoTime` com `session?.time`; na Access a sessão é null → `APARENCIA_PADRAO`, carvão, para todo mundo. E `styles.boot` usa `productTheme.bg` cravado.
- **Entrega:** a primeira tela do aluno e o vão entre telas param de contradizer o que o personal comprou.
- **Arquivos:** `App.tsx`, `src/session.ts` (guardar a aparência ao lado do token, AsyncStorage já é dependência), `SystemUI.setBackgroundColorAsync` (expo-system-ui já instalado). Exige a API devolver `config` no `verify` (`internal/auth/service.go:89` traz 3 colunas).
- **Prova:** `tools/kits.mjs` ganha a tela Access e compara o pixel (2, h/2) contra `criarTema(ap).T.bg` — hoje passa em 1 de 7 chãos.

### L5 · O convite: rota, tela, `Share` e deep link (G)
`grep -rn "Share" src/` → zero. Nenhuma das 45 rotas da API cria convite; `invites` só é escrita pelo seed. `Turma.tsx:98` promete "o convite é a porta de entrada" e não há porta.
- **Entrega:** o funil. O primeiro artefato da marca do personal que SAI do app — e `linkgym://convite/ABC` (o `scheme` já existe no `app.json`, falta `linking` no `NavigationContainer`) prefila o código.
- **Prova:** o eixo `toques_convite` já é a régua e já está registrado — base **32**. `node tools/medir.mjs toques_convite` tem que cair. Mais dois tetos: o texto compartilhado nomeia o estúdio (≥1) e não contém "LinkGym" (`node tools/medir.mjs proibidas` continua 0).

### L6 · `neutra` — a sétima voz que sai de graça (P)
`@expo-google-fonts/inter` **já está instalado**. Inter é a melhor face medida do repo (cap 0,728, x 0,546, `tnum` presente). A régua da voz já existe (`aparencia.mjs` seção 7: tamanho aparente ±3%, entrelinha, acento, dígito fixo).
- **Arquivos:** `VOZES` em `src/theme.ts`, `VOZES_DO_CARDAPIO` em `Aparencia.tsx`, whitelist em `linkgym-api/internal/owner/config.go:55` — **sem o terceiro a API recusa o save**.
- **Prova:** `node tools/aparencia.mjs` (a voz nova entra pelos pares que já existem) + par novo `par("cardápio","voz","whitelist da API cobre o cardápio", vozesNaAPI ∩ VOZES, |VOZES|)`.

---

## 3. O QUE FICA DE FORA

- **Nome, ícone, splash nativa, universal link `https`, loja por estúdio.** Exige `app.config.ts` por estúdio + EAS build + bundle id próprio, e a guideline 4.3 (apps-clone) da Apple como risco real. Em Expo Go nenhum é alcançável. Vale escrever a fronteira na SPEC — *o documento Aparencia alcança do primeiro pixel de JS para dentro* — em vez de deixar `app.json` parecer alavanca.
- **Capa com foto atrás de texto.** Contraste sobre imagem arbitrária não é derivável: exige scrim medido no pior pixel do shot. A versão barata (marca AO LADO do texto) já é o L4/C7.
- **Dock só-ícone e pílula flutuante do dock.** O primeiro mata o rótulo que o crítico cego precisa ler; o segundo paga o inset de 6 telas antes do primeiro pixel de valor.
- **Slider por componente / fonte livre / gradiente.** Porta de saída do cardápio fechado — é o que transforma "premium em qualquer combinação" em "premium se o personal tiver bom gosto".
- **Multiplicadores ópticos e `leadK` por voz.** Já está feito: `theme.ts:886-911` escala TYPE e LEAD por `cap`/`x` da face, e os pares "mesmo tamanho aparente" passam a 0,97.
- **`secundaria` sem leitor.** Já tem: `Baseline.tsx:44` pinta a segunda série com ela.
- **Registrar `separacao` como 14º eixo de `.gate/base.json`.** É ato do humano. O ciclo constrói o medidor, roda, põe o número no `motivo` e segue nas 13 catracas existentes.
---

## Registro do ciclo 3 (o que foi implementado deste plano)

- **C1 · régua de separação em L\*** — feito. `tools/aparencia.mjs` mede
  `|ΔL*(superfície, chão)| ≥ 5`, com a sombra contando como separação onde a luz não
  alcança. Foi ela que expôs o C2 no mesmo minuto.
- **C2 · vidro nos chãos claros** — feito. O véu pintava na direção errada (tinta escura
  sobre chão claro): separava 1,4 de L\* contra os 6,6 do escuro. Agora ele pinta **na
  direção de `raised`** — tinta clara no escuro, branco no claro —, com teto de opacidade
  em 0,62 para o desfoque não morrer, e o claro ganha sombra, que é a separação que sobra
  quando o curso de luz acaba.
- **C4/C5/C7 · peça calibrada contra o chão errado** — feito, com um helper só
  (`neutroSobre`). Um dos achados foi **refutado com número** pelo agente: `T.fill` se
  afasta de todos os quatro fundos acima do piso nos sete chãos, então "o rosto sem cor
  some no claro" não se sustentava.
- **C6 · o seletor que mentia** — feito, uma linha.
- **C9 · a última linha fatiada pelo dock** — **refutado com medição**: no
  `BottomTabView` da react-navigation 7.18 o scroller termina exatamente onde o dock
  começa (807/807 no build web de 402×874). Não havia sobreposição. O agente consertou de
  brinde um inset pago em dobro na aba Semana.
- **C10 · chip que pulava no toque** — feito: espessura constante, estado por tinta e
  preenchimento.
- **L1 · o ícone entra no sistema** — feito: `FORMA.traco` e `FORMA.ponta`, 20 sítios.
- **L2 · `acao`** — feito: linha/centro/caixa alta, no documento, no editor e na whitelist.
- **L3 · célula de número derivada da superfície** — feito: `FORMA.celula`
  (fio/caixa/cartão), sem campo novo.
- **L5 · o convite** — feito: rota, tela, `Share` e código com prefixo do time. Falta o
  deep link.
- **L6 · a sétima voz** — feita (`neutra`, Inter), com o par novo que prova que a
  **whitelist da API cobre o cardápio do app** — a divergência que já quebrou o save duas
  vezes agora é medida.

Aberto e registrado em `.gate/estado.json → defeitos_abertos`: C3 (a Band `raised` como
padrão) e C8 (a marca no gráfico) são decisões de gosto do dono, não conserto mecânico.
