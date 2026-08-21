# A fábrica de aparência

O personal vende este app como se fosse dele. Isto é o que ele pode trocar, e é a razão de
cada trava.

## O que ele escolhe

| alavanca | cardápio | o que muda |
|---|---|---|
| **cor da marca** | livre (hex) + 10 sugestões | o botão do dia, a marca de canto, a aba ativa, o convite |
| **segunda cor** | derivada (padrão) ou livre | a segunda série de uma figura — nunca botão, nunca aba |
| **chão** | Carvão · Breu · Grafite · Tabaco · Papel · Neve · Linho — ou **qualquer hex** | os dez degraus: quatro fundos, dois neutros, três tintas. Claro e escuro moram aqui. Os sete nomeados são DADO medido; um hex livre passa por `escada()`, que resolve os outros nove degraus até bater os pisos |
| **voz** | Bloco · Neutra · Técnica · Editorial · Suave · Condensada | TRÊS faces por par: display (título), texto (corpo) e número. A escala é corrigida pela métrica lida do arquivo da fonte, então trocar a voz não muda o tamanho aparente do herói |
| **botão** | Linha · Centro · Caixa alta · Empilhado | a ANATOMIA da ação: onde o rótulo mora dentro da peça, e se há seta. Empilhado põe o custo na segunda linha e é o único em que a centralização é exata sem coluna fantasma |
| **segundo botão** | Só o principal · Os dois cheios · O segundo apagado | quanto a ação de recuar pesa ao lado da principal. O peso do primário NÃO é alavanca: o do PAR é, e o do segundo é derivado da presença do primeiro |
| **anel** | Só quando falta · Sempre | o contorno na cor da marca em volta da ação cheia. Hoje ele é loteria da marca (80 de 210 pares); aqui vira decisão |
| **números** | Empilhado · Em tabela · Cartaz | a anatomia de uma cifra. Nenhum inventa cor, canto ou degrau — é o mesmo par número/rótulo em três ordens |
| **força da tinta** | Normal · Alta | as seis tintas andam 20% mais longe do fundo. Só SOBE: o pior caso desta alavanca é o app de hoje |
| **canto** | Reto · Macio · Pílula | o raio de superfície e de ação — e o avatar vira círculo na pílula |
| **superfície** | Sólida · Contorno · Elevada · Vidro | como um bloco se separa do chão |
| **traço** | Fino · Médio · Grosso | a espessura de toda borda |
| **respiro** | Compacto · Normal · Arejado | o vão entre blocos — **nunca** a área de toque |
| **movimento** | Seco · Normal · Generoso | a duração das transições — **nunca** a resposta ao dedo |

São **11.757.312 aparências** fechadas (7 chãos × 6 vozes × 4 botões × 3 tamanhos de botão ×
3 segundos botões × 2 anéis × 3 números × 3 cantos × 8 materiais × 3 traços × 3 respiros ×
3 movimentos × 2 forças de tinta), cada uma com qualquer cor de marca — e o chão também aceita hex livre,
que é por onde a conta deixa de ser finita e passa a ser AMOSTRADA, como a cor da marca já
era. Mais seis **kits** prontos, que são só o documento já preenchido: Ferro (o app de
sempre), Clínica, Boutique, Vitrine, Garagem, Sereno.

## Por que não estraga

Customização total e resultado sempre premium brigam. As duas só cabem juntas com três
regras, e todas as três são verificáveis por comando:

1. **Cardápio fechado onde o olho humano erra.** Não existe slider de raio, de sombra, de
   espaço nem de fonte. Existe cardápio. O que sobra livre é a cor da marca, porque ela é
   do personal e ninguém escolhe por ele.
2. **Derivação onde a escolha certa é calculável.** A tinta que escreve sobre a marca, a
   segunda cor, o tom do toque, o véu do vidro, o fio de luz da superfície elevada: tudo
   sai de conta, contra o chão real, e nunca de um valor cravado.
3. **Medidor que percorre o produto cartesiano.** Antes de existir botão para escolher uma
   combinação, ela já passou pela régua.

```bash
node tools/aparencia.mjs   # 18.322 pares · 0 reprovam
node tools/kits.mjs        # monta o app REAL em cada kit: 216 montagens, 0 quebradas
node tools/contrast.mjs    # a régua de sempre, agora sobre a paleta gerada
```

O que o medidor exige, em toda paleta: texto 4,5:1 · elemento de UI 3:1 · a aba ativa
DOMINA a inativa (não empata) · a segunda cor se separa da marca **depois** do motor de
peça, e também do aviso · o aviso continua legível e não se confunde com a marca · o toque
muda o tom de verdade · **o botão guarda o matiz da marca** (quem garante existência é o
anel, não repintar a cor de alguém) · a superfície se **afasta** do chão em L\* — luz
perceptual, que é o que responde "dá para ver que são duas superfícies", coisa que razão de
contraste não responde · **duas células vizinhas de número se separam** em toda superfície,
seja por fio, por caixa ou por cartão · o alvo do dedo nunca desce de 44pt · o canto nunca passa da margem
· a borda nunca passa de um quarto do menor vão · e, por voz: o herói tem o mesmo tamanho
APARENTE em todas as faces, a entrelinha cabe a linha natural no texto e o acento no
display, o número usa face com dígito de largura fixa, e **número e unidade pousam na
mesma BASE** com uma folga proporcional ao corpo — nem encostada no algarismo, nem solta
ao lado dele.

## A marca fora da tela

A aparência pinta do pixel para dentro. O que SAI do app também é dele:

- **O convite** (`POST /v1/owner/invites` · `src/screens/owner/Convite.tsx`) é o primeiro
  artefato da marca do personal que vai para o WhatsApp. O código leva o prefixo do nome do
  time (`FRE-G9JXQC`), usa um alfabeto sem `0/O` e sem `1/I/L` porque alguém vai lê-lo em
  voz alta na porta da academia, vale quatro anos, e é **idempotente por telefone**: tocar
  duas vezes manda o mesmo código. A mensagem é escrita na voz dele — "Fred te chamou para
  treinar" — e o nome do produto não aparece nela.
- **A porta de entrada** (`/v1/auth/code`) devolve o logo e o documento de aparência junto
  com o convite: a primeira tela que o aluno vê já é a do personal, antes do login. Era a
  única tela que todo aluno de todo personal via igual.
- **O logo** aparece no canto do cabeçalho do dia e na porta. Até então ele renderizava em
  exatamente um lugar do app inteiro: a prévia dentro da tela do próprio personal.

O que ainda exige build próprio, e por isso não está aqui: nome e ícone do app na tela do
celular, splash nativa e link universal.

## Onde mexer

- **`src/theme.ts`** — o documento `Aparencia`, os sete chãos (dado verificado, não
  fórmula), as seis vozes, e `criarTema()`, que é a única porta. O arquivo não importa
  nada: as ferramentas o carregam em node puro e medem o mesmo código que a tela desenha.
- **`src/ui/tema.tsx`** — `TemaDoTime`, `useTema()` e `estilos()`. Toda folha de estilo do
  app passa por `estilos()`; nenhuma lê token de módulo.
- **`src/screens/owner/Aparencia.tsx`** — o editor, com prévia ao vivo feita das peças
  reais do app do aluno.
- **`internal/owner/config.go`** (API) — a whitelist. Valor fora do cardápio não grava, e a
  validação acontece **antes** de qualquer escrita.

### Acrescentar um chão

Dez hexes em `CHAOS`, na ordem `bg, dock, surface, raised, hairline, fill, divider, muted2,
muted, ink`. Rode `node tools/aparencia.mjs`: ele reprova o que raspar o piso. Depois
acrescente o nome em `NOMES_DO_CHAO` (editor) e no cardápio da API.

### Acrescentar uma voz

Um par em `VOZES`, os pacotes `@expo-google-fonts/*` no `package.json`, e as faces no
`useFonts` de `App.tsx` **e** de `tools/shotHost.tsx` — fotografar um kit com a fonte dele
ausente provaria outra coisa.

O par carrega três faces e três números, e os números são **lidos do arquivo da fonte**,
não estimados: `cap` (altura de caixa alta) e `x` (altura de x) do `OS/2`, e `linha`
(ascender − descender + gap) do `hhea`. São eles que corrigem a escala óptica — sem isso o
herói de 92pt muda de tamanho quando o personal troca a voz, porque a caixa alta varia 18%
entre as faces. A face de `numero` tem que ter a feature `tnum`: Playfair, Nunito e Oswald
não têm, e nelas o `tabular-nums` que o `Txt` pede desde sempre era um pedido no vazio —
cronômetro e recorde dançando a cada dígito. `node tools/aparencia.mjs` reprova o par que
entrar sem isso.

### O que fica de fora, e por quê

- **Fonte livre.** "Escolha a fonte" é o pedido que produz Comic Sans em produto sério.
- **Segundo picker de cor.** Duas cores escolhidas à mão por quem não é designer brigam. A
  segunda é derivada por harmonia — e o personal ainda pode cravá-la se quiser.
- **Slider de raio, sombra ou espaço.** Raio arrasta a grade junto: por isso ele é cardápio
  e vem com o recuo da superfície de brinde.
- **Cor semântica.** Matiz não significa "bom" neste produto. Cumprido é presença de tinta.
  A única cor com dono semântico é o vermelho do aviso — e ele ANDA quando a marca do
  personal chega perto dele.
