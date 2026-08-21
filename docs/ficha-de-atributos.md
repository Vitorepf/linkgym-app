# Ficha de atributos

21 ago 2026. Documento de projeto. Implementável sem me perguntar nada.

A ficha de atributos é o dossiê do corpo: quatro eixos que só sobem com ato testemunhado e que recuam quando o ato para. Não é painel de fantasia. Não é a aba Ficha.

Modelo do mundo travado: sem academia, sem unidade, sem armário. Território é **setor** e **cidade**. Clã é aberto, com tipo e teto. Duas escadas: pessoa na arena, clã contra clã. Conta só do aluno. Companheiros: `docs/duelo-e-juiz.md` (contrato §8 e vaga §11.5), `docs/barra-proto/05-motion-duolingo.md` (D8, D10, D12, C8), `.cursor/rules/link-produto.mdc`.

A aba **Ficha** é o programa de treino. Esta ficha mora no **Perfil**. Quem misturar as duas no código errou o produto.

---

## 1. Em uma frase

Quatro barras, cada uma um eixo do corpo, cada uma com a marca que a sustenta. A pessoa abre o perfil para ver se o corpo ainda está onde ela o deixou.

Para quem: qualquer conta com uma sessão fechada. Não precisa de personal, de clã, nem de amigo.

Por que a pessoa mexe: porque a barra é o jogo do corpo dela, e o corpo não é permanente. Subir pede o rack. Parar é visível. Não tem atalho.

O que une powerlifting, CrossFit, corrida e luta não é uma tabela de conversão. É o corpo mais blindado, lido em quatro eixos, nunca numa soma.

---

## 2. Os quatro eixos

Quatro. Não cinco. A quinta vira soma, e soma vira RPG.

| | **Carga** | **Motor** | **Fundo** | **Frequência** |
|---|---|---|---|---|
| O que é | Força testemunhada | Trabalho por tempo | Duração que o corpo segura | Sessões por semana |
| Unidade da marca | `kg` | `s` (prova ≤ 20 min) ou `reps` em janela | `s` (prova > 20 min) ou `m` | `sessoes` — e a janela de 28 dias |
| Quem alimenta | Série ao vivo com kg; prova de carga com vídeo firme | Relógio curto; volume na janela | Relógio longo; distância; corrida | Toda sessão fechada no app |
| Quem não alimenta | Kg digitado depois, sem sessão aberta | Número declarado | Número declarado | Sessão que não fechou |
| Meia-vida após a graça | 28 dias | 14 dias | 21 dias | Não tem. É a janela |
| Graça sem ato | 7 dias | 3 dias | 5 dias | — |
| Barra 100 | A capacidade estimada iguala o pico de 90 dias | Idem | Idem | `cadencia28 >= 4` |

Não existem vida, mana, sorte, carisma, stamina, power. Não existe o quinto eixo "blindagem" como soma dos quatro.

**Sub** é o nome de produto para a marca testemunha impressa ao lado da barra: `140 kg`, `4:12`, `12 km`, `4 / semana`. A barra é a condição. O sub é o fato. Quem compara pessoas lê o sub. Quem compara consigo mesmo lê a barra.

A barra é 0 a 100 e é **auto-referente**: capacidade estimada hoje contra o pico dos últimos 90 dias daquela pessoa naquele eixo. Dois corpos no mesmo 80 não são iguais. Os subs é que dizem 140 kg contra 90 kg.

O **mapa do corpo** é outro objeto, no Progresso e debaixo da placa: um radar de seis pontas (peito, ombro, braço, perna, posterior, costas). O app infere a zona pelo exercício. Duas áreas no mesmo desenho: o começo e o agora. Quem lê vê o que cresceu e o que ainda não tem marca. Não é um sexto eixo e não soma com Carga.

Sensor de pulso (Getrace e similares) entra no futuro como testemunha de **Motor** e **Fundo**, nunca como eixo novo e nunca como soma. Batimento sem sessão aberta não sobe barra.

---

## 3. Como se ganha

Nunca concedido. Nunca por like, Tá pago, fala, vitória de duelo, ofensiva, raid, guerra, clã ou dia de calendário. O único input é ato com testemunha.

Três portas de escrita. Nenhuma delas é a UI.

```ts
ficha.registrarSessao({ personId, sessionId, quando, minutos, sets, provaId? })
ficha.registrarMarca({ personId, provaId, valor, unidade, quando, arbitro, firme, duelId? })
ficha.registrarDuelo({ personId, duelId, provaId, papel, quando })
```

`registrarSessao` vem do rack, no instante em que a sessão fecha. `registrarMarca` e `registrarDuelo` vêm do duelo, contrato de `docs/duelo-e-juiz.md` §8. A ficha **nunca chama** o duelo.

### 3.1 O que cada porta faz

| Porta | Frequência | Carga / Motor / Fundo | Contagem de duelo |
|---|---|---|---|
| `registrarSessao` | Recalcula `cadencia28` | Cada set com `load_kg > 0` vira marca `kg`, `arbitro: "janela"`, `firme: true`. Se a sessão trouxer `provaId` cronometrada, vira marca na unidade da prova | Nada |
| `registrarMarca` | Nada | Entra no caderno do eixo da unidade, se `firme`. Vídeo com `firme: false` guarda e **não sobe barra** | Nada |
| `registrarDuelo` | Nada | Nada | `venceu` / `empatou` / `perdeu` incrementam o placar do Perfil. `faltou` a ficha **ignora**. `sem_prova` não incrementa |

Derrota não decrementa. Empate não decrementa. Recusa não existe como campo. O duelo já prometeu que nunca escreve valor negativo; a ficha cumpre do lado de cá: **nenhuma função deste documento subtrai ponto de atributo por resultado**.

### 3.2 Para qual eixo vai a marca

```
eixoDaMarca(unidade, valor):
  kg                         -> carga
  sessoes                    -> (não sobe barra; frequência é janela)
  m                          -> fundo
  reps                       -> motor
  s e valor <= 20 * 60       -> motor
  s e valor  > 20 * 60       -> fundo
```

`declarado` não é árbitro desta ficha. Número digitado depois, sem sessão aberta e sem vídeo, fica no caderno pessoal do aluno e **não entra** em `registrarMarca`. Se o implementador aceitar um campo livre de kg para subir Carga, ele errou o mesmo erro que o duelo já proibiu.

### 3.3 A barra, em fórmula

Tudo é função de leitura. A barra não é um inteiro persistido que se incrementa. Persistido é o caderno de marcas e o caderno de sessões. A barra sai na hora.

```
cadencia28(pessoa) =
  (sessões fechadas nos últimos 28 dias) / 4

barraFrequencia =
  min(100, round(100 * cadencia28 / 4))
```

4 sessões por semana, média de 4 semanas, é 100. É o mesmo número que o duelo lê para parear. Uma semana com 4 sessões numa conta nova dá `cadencia28 = 1` e barra 25: o primeiro patamar cabe na primeira semana que a pessoa mostrou up.

```
pico90(eixo)        = max(valor) das marcas firmes daquele eixo nos últimos 90 dias
                      se vazio: 0

ultima(eixo)        = marca firme mais recente daquele eixo
dias                = agora - ultima.quando, em dias cheios
excesso             = max(0, dias - graca(eixo))
estimado            = ultima.valor * 2^(-excesso / meiaVida(eixo))
                      se existir marca firme nos últimos 7 dias,
                      estimado = max(estimado, max dessas)

barra(eixo)         = 0 se pico90 == 0
                      senão min(100, round(100 * estimado / pico90))
```

`graca` e `meiaVida` são a tabela da seção 2. Recorde recente: estimado = pico, barra = 100. Semana parada: a graça segura. Depois disso a barra recua, o sub não.

Arredonda para inteiro. Empate de arredondamento arredonda para longe de zero, sempre para cima no ganho e para baixo no recuo, para a barra não oscilar 1 ponto por ruído de relógio.

### 3.4 O que o duelo lê, e o que ele não lê

Herdado, sem negociar:

```
ficha.cadencia28
ficha.novato                 // conta < 14 dias OU < 6 sessões fechadas
ficha.disciplinas            // DisciplinaId[] derivadas do histórico
ficha.marcaDe(provaId)       // melhor firme daquela prova; null se não há
ficha.distancia(outroId)     // 0 a 1, só desempate de pareamento, nunca impresso
```

O duelo **não lê** barra, degrau, leitura, soma, nem patamar. Se um dia ler, o convite passa a dizer "você é fraco demais", e isso é o oposto do produto.

```
distancia(outroId) =
  clamp(0, 1,
    0.6 * abs(cadencia28 - outro.cadencia28) / 6
    + 0.4 * (1 - overlap(disciplinas, outro.disciplinas))
  )

overlap(a, b) = 0 se a∪b é vazio;
              senão |a∩b| / |a∪b|
```

`distancia` não usa barra. O duelo não lê barra por cima, nem por baixo.

`disciplinas`: `ClanKind` que teve pelo menos 3 sessões fechadas nos últimos 90 dias. Conta nova: array vazio, e o duelo já sabe o que fazer com isso.

`marcaDe(provaId)` devolve a melhor marca firme no sentido da prova (`menor` ou `maior`). Vídeo mole não entra. Marca de quem perdeu o duelo entra, se for a melhor dela.

---

## 4. Como decai

O corpo não é permanente. Decair é o produto funcionando, não uma punição.

A barra recua pela fórmula da seção 3.3. Não existe evento `decae`. Não existe write negativo. Quem implementa um cron que "tira 2 de Carga todo domingo" inventou uma economia e quebrou o contrato com o duelo.

| O que muda | O que não muda |
|---|---|
| A extensão da barra | O sub. `140 kg` continua `140 kg` |
| A data ao lado do sub, quando o recuo passa de 5 pontos desde a última vista | A tinta. Mesma ink da barra cheia |
| Nada mais | A leitura, enquanto o eixo dominante e o sub dele não mudarem |

O que a pessoa vê quando decai: a barra mais curta, e o sub ganhando idade. `140 kg · há 23 dias`. Sem vermelho. Sem "você perdeu". Sem faixa de consolo. Sem háptico. Sem tela. Decair não é festa e não é alarme. Vermelho neste app é estado do rack (vivo, carimbo, recorde, ofensiva em risco), nunca recuo de dossiê.

Frequência não "decai": a sessão da semana 5 sai da janela de 28 dias e o número cai sozinho. É o mesmo mecanismo da cadência que o duelo já usa.

Piso da barra é 0. Nunca negativa. Pico de 90 dias que sai da janela sem marca nova: `pico90` cai para o que restar; se não restar nada, barra 0 e o sub fica com a data da última marca, agora fora da janela, até uma marca nova existir.

---

## 5. A leitura — não a classe

Não existe classe. Não existe título. Não existe "guerreiro", "tanque", "lenda", "elite", "avançado", "intermediário".

Existe a **leitura**: uma frase de fato, derivada, que a pessoa não edita.

```
leitura(pessoa):
  se nenhuma barra > 0:
    null
  eixo = o de maior barra entre carga, motor, fundo
          (frequência não disputa o substantivo; ela é o predicado)
  se o segundo eixo dessas três estiver a 5 pontos ou menos:
    dois substantivos
  frase = sub(eixo) + ". " + frequenciaEmPalavra + "."
```

Frases canônicas, e só estas formas:

| Situação | Leitura |
|---|---|
| Carga manda | `140 kg no terra. 4 sessões por semana.` |
| Motor manda | `Fran 4:12. 5 sessões por semana.` |
| Fundo manda | `12 km. 3 sessões por semana.` |
| Empate de dois eixos | `140 kg no terra · Fran 4:12.` |
| Barra existe, frequência ainda 0 | o sub sozinho. Sem a segunda sentença |
| Tudo zerado | sem leitura. O buraco é o estado |

A prova do sub entra pelo `nome` da `Prova` quando a marca tem `provaId`. Sem prova nomeada, Carga usa o nome do exercício do melhor set (`terra`, `supino`, `agachamento`). Sem nome, fica `140 kg`. Fundo em metros imprime em km se `valor >= 1000`, senão em m.

Teto da leitura: fato + número, nenhuma palavra de elogio. Proibidas na leitura, sem exceção: parabéns, incrível, mandou bem, lenda, monstro, beast, guerreiro, elite, avançado, novato (este último é campo do duelo, invisível aqui), quase lá.

A leitura **não** mora no `ObjectHead`. O cabeçalho já tem nome, setor, clã. A leitura é o título da placa da seção 6. Sem sessão, não se inventa "iniciante" para tapar o buraco.

`docs/rede/04-identidade.md` ainda fala unidade e headline `{língua} · {unidade}`. Neste documento isso está morto. A leitura substitui qualquer headline de classe. O clã continua no sub do `ObjectHead`, como já está.

---

## 6. Onde mora no Perfil

Zero aba nova. Zero overlay novo.

Ordem de leitura do Perfil, e ela é fixa:

| # | Peça | Já existe? | O que muda |
|---|---|---|---|
| 1 | `ObjectHead` — cara, setor, nome, clã | Sim | Nada. Sem leitura aqui |
| 2 | `Duo` — arena e clã | Sim | Nada. São as duas escadas |
| 3 | `WinPlate` — rostos à esquerda, N vitórias à direita, toque abre `duelos` | Sim | Nada. A ficha **não compete e não substitui** |
| 4 | `Thumb` Publicar | Sim | Continua o único preenchido da cena do Perfil |
| 5 | **`AtributoPlate`** | Não | Entra aqui. Primeiro objeto da segunda dobra |
| 6 | Ofensiva, mídia, diário, 1 contra 1, clãs, conta | Sim | Nada |

A primeira dobra continua respondendo "quem é esta pessoa na arena". Cara, duas escadas, cartel de vitórias, o toque de publicar. A ficha de atributos é o dossiê que se abre no primeiro scroll. Quem quiser classificação na primeira dobra empurra o Publicar para baixo da dobra e perde o único preenchido da cena: não faça isso.

`WinPlate` continua com o contrato que já tem: rostos de quem ela já encarou à esquerda, o algarismo de vitórias à direita, toque abre o histórico. A `AtributoPlate` não mostra vitória, não mostra face de rival, não mostra `12 aceitos · 5 vencidos`. Esse número é do cartel, não do dossiê.

No overlay `pessoa`, a mesma `AtributoPlate` entra na mesma posição relativa: depois da identidade e depois de qualquer cartel de vitórias daquela pessoa. Sem linha "você contra ela". Quem compara lê os subs.

### 6.1 Anatomia da `AtributoPlate`

Um `.plate`. Quatro linhas. Cada linha:

```
Carga                         140 kg
[====================        ]
```

Nome do eixo à esquerda, sub à direita, barra abaixo na largura total da placa. Se o recuo passou de 5 pontos desde a última vista desta conta, o sub ganha a idade: `140 kg · há 23 dias`.

Toque na linha: se existe marca firme, abre o overlay `prova` dessa marca. Se não existe, a linha não é alvo.

Estado vazio: as quatro linhas existem, barras em 0, subs em travessão `—`. Sem leitura em cima. Uma linha `t-small` abaixo: `Feche uma sessão. O dossiê começa no rack.` Zero botão. O preenchido da cena já é o Publicar. Desenhar o vazio é obrigatório; omitir as quatro trilhas e deixar um vazio de página é o defeito que D19 nomeia.

Não há `SectionHead` "atributos". A leitura, quando existe, é o título da placa, em `t-body`. Sem leitura, não há título.

### 6.2 Orçamento da fundação

Uma cena é um componente exportado (`docs/barra-proto/00-defeitos-e-linha-de-base.md`). `AtributoPlate` é cena própria. `Patamar` (modo do overlay `feito`) é outra.

| Cena | Tipos | Réguas | Preenchido | Acento |
|---|---|---|---|---|
| Teto | 5 | 4 | 1 | 4 |
| `AtributoPlate` | 4: `t-body` leitura, `t-kicker` eixo, `t-mono` sub, `t-small` idade | 4 — as barras | 0 | 0 |
| `Patamar` | 5: `t-plate` número, `t-kicker` eixo e unidade, `t-body` frase, `t-small` data, rótulo do thumb | 0 | 1 — o `.thumb` | 0 |
| `Perfil` (já existia) | não cresce: a placa nova é outra cena | as 4 réguas novas não moram aqui | o Publicar continua o único | sem acento novo |

Vermelho não entra em nenhuma das duas cenas. Recuo não é alarme. Recorde desta ficha não pinta o número; o recorde do rack continua vermelho onde já era, no aparelho.

---

## 7. A cerimônia de patamar

Patamar é a primeira vez que um eixo cruza 25, 50, 75 ou 100 nesta conta. Dezesseis eventos possíveis na vida da conta. Cada par `(eixo, degrau)` dispara **uma vez**. Recuperar 100 depois de um recuo não é patamar. Decair não é patamar. Vitória de duelo não é patamar.

O primeiro 25 de Frequência cabe numa semana de 4 sessões. É o "consegui" cedo que a retenção pede, sem inventar um selo de estreia.

### 7.1 Eu tomo a vaga

D12 dá uma festa de tela cheia por sessão. O duelo cedeu para sempre, mesmo com a vaga livre (`docs/duelo-e-juiz.md` §11.5). **Eu não cedo.**

Se a ficha também ceder, ninguém comemora, e isso é falha. Patamar não deixa recibo e não tem plateia: se não acontecer no instante, evapora. Tela cheia é para o que evapora.

```ts
sessao.festaCheia: { dono: "ficha"; quando: number } | null
```

A ficha **escreve**. O duelo lê e nunca escreve. Escrever acontece **antes** de abrir a tela, no mesmo instante em que o ato que cruzou o degrau fecha.

Se `festaCheia` já estiver ocupado nesta sessão (dois eixos cruzaram no mesmo ato): o primeiro leva a tela; o segundo vira objeto datado na `AtributoPlate` e não abre segunda festa. D18: a data fica no rosto da linha. Zero segunda tela.

### 7.2 A conta contra D8

D8: do fim do ato até a pessoa de volta onde ela decide, no máximo **2 telas cheias e 1 toque obrigatório**. C8 é onde se ganha o eixo. Gastamos metade.

| Passo | Tela cheia | Toque obrigatório |
|---|---|---|
| Fim do ato: última série, sessão fecha, ou marca firme trava | 0 | 0 |
| Patamar: overlay `feito` em modo `patamar`, tela cheia | 1 | 1 — o `.thumb` |
| Volta ao Hoje, onde ela decide | 0 | 0 |
| Veredito de duelo, se cair na mesma sessão: 520 ms por cima do card, sem navegar | 0 | 0 |
| **Total no pior caso** | **1** | **1** |

Sobra 1 tela e 0 toques do orçamento. Não gaste. Não acrescente "Continuar" extra, não abra o Feito-recibo depois, não peça para publicar.

O Feito-recibo da sessão, quando o patamar dispara no fechamento, **não aparece**. O post da sessão publica sozinho, como o recibo do duelo já faz. O consentimento é ter fechado a sessão. A informação que o Feito carregaria vai para o post, que é onde se olha depois (C8).

Reuso, não overlay novo: `feito` ganha modo `patamar`. As sobreposições existentes cobrem. Quem criar `patamar` como overlay separado errou a lista travada.

Quando o patamar nasce de um Relógio: o cronômetro se dissolve sozinho em 260 ms (já é contrato do duelo, e aquilo é o ato, não a cerimônia). Em seguida abre `feito` modo `patamar`. Depois do toque, Hoje. Depois, se houver veredito, 520 ms no card.

### 7.3 O que está na tela

Fundo da página, sem scrim novo. A peça central é um `.plate`. O alvo de sair é um `.thumb`. Nenhuma outra física de luz.

De cima para baixo:

1. **O algarismo do sub que subiu**, em `t-plate` (84 px). Corpo da cena é `t-body` (17 px). 84 / 17 = 4,9×, acima do piso de 2,5× de D10. O maior objeto da tela é esse número. Nenhuma arte, nenhum selo, nenhum ícone maior que ele — e não existe arte nenhuma.
2. Unidade e eixo em `t-kicker`, na linha de baixo do número. `KG · CARGA`. `SESSÕES / SEMANA · FREQUÊNCIA`.
3. A frase, teto de D5: no máximo 6 palavras, pelo menos 1 número do próprio ato, 0 elogio.

| Eixo | Frase | Palavras |
|---|---|---|
| Carga | `Carga. 140 kg no terra.` | 5 |
| Motor | `Motor. Fran em 4:12.` | 4 |
| Fundo | `Fundo. 12 km.` | 3 |
| Frequência | `Frequência. 4 sessões por semana.` | 5 |

4. A data no rosto, `t-small`, distintivo sem cromo: `21 ago 2026`. D18: marco sem data é efeito, não objeto.
5. O `.thumb`, largura total, 54 px de altura, acima do piso de 44 pt de D12. Rótulo em primeira pessoa, 3 palavras, 0 exclamação: **`É o meu.`** É o único alvo da tela. Não existe secundário disfarçado de texto puro embaixo. Essa é a falha nomeada em D12, e nós não a copiamos.

Fora da tela, de propósito: as outras três barras, o `WinPlate`, o clã, a arena, o recibo, o adversário, a palavra patamar, a palavra recorde, a palavra nível, qualquer soma.

O número **não conta**. Ele está formado quando a tela abre. Contar até o valor é linguagem de ponto ganho.

Háptico único na abertura, vocabulário fechado de D4: intensidade de **recorde** se a marca que cruzou o degrau é a melhor firme daquele eixo; senão intensidade de **série confirmada**. Zero som. Zero confete.

Entrada do overlay: `--dur-enter` (320 ms). Saída no toque: `--dur-move` (240 ms) de volta ao Hoje. Sem duração nova.

---

## 8. Superfície

A física já existe. Não se inventa outra.

| Peça | Classe | Por quê |
|---|---|---|
| Placa no Perfil e placa da cerimônia | `.plate` | Face recebe luz de cima, fio no lábio, derrame na página. É card, não botão |
| Alvo de dispensar o patamar | `.thumb` | Face emite. Apertado, a luz achata e a peça afunda 1 px |
| Trilha da barra | fundo `line`, preenchimento `ink`, altura 4 px, ponta redonda | A mesma família do `WeekStrip` (3 px). Um passo maior porque aqui a barra *é* o dado, não textura |
| Recuo | a mesma ink, mais curta | Sem terceira tinta, sem tracejado de alarme |

Proibido na placa e na festa: barra verde/amarela/vermelha de jogo, glow, partícula, mascote, gema, moeda, estrela, coroa, anel de XP, wordmark de nível. Se um adulto de 40 anos teria de explicar a tela, a tela está errada.

Tipos: só a escada já nomeada. Cerimônia usa `t-plate` no número, não um 84 avulso. Placa usa `t-mono` no sub porque o número é instrumento, e numeral tabular já mora nessa escada.

---

## 9. Modelo TypeScript

Especificação. Não é arquivo. Nada disso vai para `proto-aluno/src/` neste turno. O implementador costura depois.

```ts
type EixoId = "carga" | "motor" | "fundo" | "frequencia";
type Degrau = 25 | 50 | 75 | 100;
type Arbitro = "relogio" | "janela" | "video";
type UnidadeMarca = "s" | "kg" | "reps" | "sessoes" | "m";
type DisciplinaId =
  | "geral"
  | "powerlifting"
  | "crossfit"
  | "hipertrofia"
  | "corrida"
  | "calistenia"
  | "luta";

type Marca = {
  id: string;
  personId: string;
  provaId?: string;
  exerciseId?: string;
  eixo: EixoId;
  valor: number;
  unidade: UnidadeMarca;
  quando: number;
  arbitro: Arbitro;
  firme: boolean;
  sessionId?: string;
  duelId?: string;
  proofId?: string;
};

type SessaoFecha = {
  id: string;
  personId: string;
  quando: number;
  minutos: number;
  sets: { exerciseId: string; load_kg: number; reps: number }[];
  provaId?: string;
};

type Patamar = {
  eixo: EixoId;
  degrau: Degrau;
  quando: number;
  valorSub: number;
  unidade: UnidadeMarca;
  provaNome: string | null;
  visto: boolean;
};

type Leitura = {
  texto: string;
  eixo: EixoId | [EixoId, EixoId];
};

type Barra = {
  eixo: EixoId;
  barra: number;          // 0..100, derivado
  sub: {
    valor: number;
    unidade: UnidadeMarca;
    rotulo: string;       // "140 kg", "4:12", "12 km", "4 / semana"
    quando: number | null;
    idadeDias: number | null;
  } | null;
};

type FestaCheia = { dono: "ficha"; quando: number };

type Ficha = {
  personId: string;
  marcas: Marca[];
  sessoes: SessaoFecha[];
  patamares: Patamar[];   // no máximo 16. Cada (eixo, degrau) uma vez
};

// Derivados. Não persistir, exceto cache de cadencia28 se o pareamento precisar.
type FichaLeitura = {
  cadencia28: number;
  novato: boolean;
  disciplinas: DisciplinaId[];
  barras: Record<EixoId, Barra>;
  leitura: Leitura | null;
  marcaDe(provaId: string): {
    valor: number;
    unidade: UnidadeMarca;
    quando: number;
    arbitro: Arbitro;
  } | null;
  distancia(outroId: string): number;
};

type Sessao = {
  // campos que o rack já tiver
  festaCheia: FestaCheia | null;
};
```

### API que o duelo e o rack chamam

```ts
registrarSessao(input: Omit<SessaoFecha, "id"> & { id: string }): Patamar | null
registrarMarca(input: {
  personId: string;
  provaId: string;
  valor: number;
  unidade: UnidadeMarca;
  quando: number;
  arbitro: Arbitro;
  firme: boolean;
  duelId?: string;
}): Patamar | null
registrarDuelo(input: {
  personId: string;
  duelId: string;
  provaId: string;
  papel: "venceu" | "empatou" | "perdeu" | "faltou" | "sem_prova";
  quando: number;
}): void
```

`registrarSessao` e `registrarMarca` devolvem o `Patamar` se o ato cruzou um degrau inédito **e** `sessao.festaCheia` estava livre. Se cruzou e a vaga estava ocupada, persistem o `Patamar` com `visto: false` e devolvem `null`; a placa mostra a data, a tela não abre. Se `firme === false`, devolvem `null` e não tocam barra.

`registrarDuelo` com `papel: "faltou"` é no-op. Os outros três papéis incrementam `Person.duelos` e param. Nenhum deles devolve patamar.

### O que muda em `Person`

```ts
desde: number;             // já pedido pelo duelo. novato lê daqui
cadencia28: number;        // cache derivado, o duelo lê
disciplinas: DisciplinaId[];
// duelos.venceu / empatou / perdeu já existem
// duelos.faltou já existe e continua invisível
```

Não entra em `Person`: `nivel`, `xp`, `classe`, `soma`, `power`, `vida`. Se o implementador achar que precisa de um inteiro único para "quão blindado", ele está escrevendo a soma que este documento proíbe.

`locker` continua proibido. Armário era academia, e academia não existe.

### Constantes

```ts
const DEGRAUS: Degrau[] = [25, 50, 75, 100];

const GRACA_DIAS: Record<Exclude<EixoId, "frequencia">, number> = {
  carga: 7,
  motor: 3,
  fundo: 5,
};

const MEIA_VIDA_DIAS: Record<Exclude<EixoId, "frequencia">, number> = {
  carga: 28,
  motor: 14,
  fundo: 21,
};

const ALVO_CADENCIA = 4;   // sessões/semana = barra 100
const JANELA_CADENCIA_DIAS = 28;
const JANELA_PICO_DIAS = 90;
const RECENTE_DIAS = 7;
const EMPATE_EIXO = 5;     // pontos de barra para leitura com dois substantivos
const IDADE_VISIVEL = 5;   // pontos de recuo para imprimir "há N dias"
```

---

## 10. Interlock

### 10.1 Com o duelo

Mão única. O duelo empurra evento cru. A ficha decide. A ficha não importa função de duelo, não abre overlay `desafio`, não escreve `veredito`, não publica recibo de duelo.

| Campo | Dono da escrita | Dono da leitura |
|---|---|---|
| `cadencia28`, `novato`, `disciplinas`, `marcaDe`, `distancia` | Ficha | Duelo |
| `registrarMarca`, `registrarDuelo` | Duelo chama, ficha executa | — |
| `registrarSessao` | Rack chama, ficha executa | — |
| Barra, degrau, leitura, patamar | Ficha | Ninguém fora do Perfil e do `feito` modo `patamar` |
| `Person.duelos.venceu` etc. | Ficha, via `registrarDuelo` | `WinPlate` e overlay `duelos` |
| `Person.duelos.faltou` | Duelo já incrementa no próprio modelo de pareamento. A ficha ignora o `registrarDuelo` deste papel | Duelo, invisível |

Vídeo mole: a marca existe, `firme: false`. Recalcular barras ignora. Quando a contestação fecha e o duelo reescrever a mesma marca com `firme: true` (ou confirmar), `registrarMarca` roda de novo e aí a barra pode subir. A ficha não observa contestação; ela reage ao segundo write.

### 10.2 Com `sessao.festaCheia`

A ficha é o único escritor. Algoritmo no instante do ato:

```
se o ato cruzou (eixo, degrau) inédito:
  persiste Patamar
  se sessao.festaCheia == null:
    sessao.festaCheia = { dono: "ficha", quando: agora }
    abre feito modo patamar
  senão:
    Patamar.visto = false
    não abre tela
```

Se não houver sessão aberta (caso degenerado: marca que chega fora do rack), a ficha cria o campo na sessão do dia — o objeto que o Hoje já trata como "hoje" — e segue a mesma regra. Não inventa overlay para cobrir o buraco.

O duelo, no veredito, lê o campo e não muda de comportamento: o dele já é 520 ms por cima, 0 telas, 0 toques.

### 10.3 Com o `WinPlate`

Três regras, curtas:

1. O cartel não se move, não encolhe, não perde o toque, não perde os rostos.
2. A `AtributoPlate` não repete vitórias, não pede os rostos emprestados, não vira um segundo cartel.
3. Toque no cartel continua abrindo `duelos`. Toque na placa abre `prova` da marca, ou nada.

Quem no futuro fundir os dois num "card de poder" quebra as duas escadas e o dossiê ao mesmo tempo.

### 10.4 Com a ofensiva que já está no Perfil

Ofensiva é a semana. Frequência é a média de 4 semanas. Não se fundem. A `AtributoPlate` não carrega `WeekStrip`. A carta de ofensiva não carrega barra de Carga.

---

## 11. Vocabulário no teto

Fato + número. Sem adjetivo de elogio. Sem a palavra que um adulto esconderia.

| Pode | Não pode |
|---|---|
| Carga, Motor, Fundo, Frequência | Força (como classe), Stamina, Power, XP, nível |
| `140 kg no terra` | `mandou bem no terra` |
| `4 sessões por semana` | `disciplina de ferro` |
| `há 23 dias` | `você está caindo`, `atrophied`, `enferrujado` |
| `É o meu.` | `PARABÉNS`, `LEVEL UP`, `CLAIM` |
| dossiê, exame, placa, marca, barra | ficha (sozinha — colide com a aba), classe, lenda (como título), gema |

Na interface, esta coisa se chama pelo que está escrito: a leitura, ou os quatro nomes. Nunca o rótulo `Ficha de atributos`. Esse nome é deste documento e do código. Na boca da tela ele compete com a aba Ficha e perde os dois.

---

## 12. O que mata isso

Sendo adversário do meu próprio projeto.

**1. Soma.** Um inteiro de "corpo blindado" vira ranking e o duelo passa a ler pela porta dos fundos.
Defesa: quatro eixos, zero soma, `distancia` sem barra. Se aparecer `power` em `Person`, este documento falhou.

**2. Vitória que sobe barra.** O duelo vira fazenda. Quem aceita só para pintar Carga destrói a ética da derrota.
Defesa: `registrarDuelo` não toca eixo. `registrarMarca` toca, e o perdedor também registra. A marca é o ato, o placar é o cartel.

**3. Infantilização.** Barra colorida, mascote, XP, "nível 12". O adulto fecha o app no vestiário.
Defesa: ink em trilha de 4 px, `.plate` / `.thumb`, leitura de fato, festa com um número e um toque. A lista da seção 11 é recusa, não estilo.

**4. Punir o recuo.** Vermelho, push, "você perdeu 12 de Carga". A categoria já sabe que hard reset e vergonha esvaziam o app.
Defesa: recuo é barra mais curta e data no sub. Sem push de decaimento. Sem háptico. Sem festa invertida.

**5. Pedágio de cerimônia.** Duas telas, dois toques, Feito + patamar + "Continuar".
Defesa: a conta da seção 7.2. 1 tela, 1 toque, Feito-recibo pulado, veredito por cima. Conferível contando quadros.

**6. Ceder a vaga.** Duelo já cedeu. Se a ficha ceder, a sessão fica sem festa e o patamar evapora.
Defesa: este documento escreve `festaCheia` e abre a tela. Não é educação. É o único instante em que o dossiê existe como cena.

**7. Mentira no kg.** A Carga é o eixo mais fácil de forjar.
Defesa: herdada do duelo. Sem janela e sem vídeo firme, o número não sobe. Declarado não entra.

**8. Comer o `WinPlate` ou a ofensiva.** Um card único "você" que mistura vitória, semana e corpo. Ninguém lê nada.
Defesa: ordem fixa da seção 6, três objetos, três jobs.

---

## 13. O que eu cortei

O cemitério, com o motivo.

1. **Soma e "nível".** Cortei porque vira ranking mundial com outro nome, e porque o duelo proibiu ler soma.
2. **Classe de MMORPG.** Guerreiro, tanque, support. Cortei porque é adjetivo, e adjetivo aqui é mentira. Sobrou a leitura.
3. **Quinto eixo.** Blindagem, resiliência, "offício". Cortei porque a quarta régua já é o teto da fundação, e a quinta é soma disfarçada.
4. **Barra absoluta contra tabela mundial.** Wilks, coeficiente CrossFit, VO2 estimado. Cortei porque é conversão entre esportes, e o duelo já enterrou isso. A comparação entre pessoas é o sub; a barra é a pessoa contra ela mesma.
5. **Ganho por vitória, perda por derrota.** Cortei contra o contrato §8 e contra a ética da seção 6.1 do duelo. Perder custa zero.
6. **Decaimento teatral.** Push, vermelho, tela de "você caiu". Cortei porque punição por parar ensina a não abrir o app no dia que ele mais precisa ser aberto.
7. **Patamar em todo PR.** Cortei porque PR pode ser semanal e tela cheia semanal vira pedágio. Sobrou cruzar 25/50/75/100 uma vez por eixo.
8. **Segunda festa na mesma sessão.** Cortei contra D12. O segundo degrau do mesmo dia vira data na placa.
9. **Overlay novo.** Cortei contra a lista travada. É o modo `patamar` de `feito`.
10. **Leitura no `ObjectHead`.** Cortei porque a primeira dobra já tem cara, clã, arena e vitórias. Empilhar mais uma frase ali é cromo em cima de identidade.
11. **Fundir com `WinPlate`.** Cortei porque cartel é disputa com nome; dossiê é corpo no tempo. São dois objetos.
12. **Fundir Frequência com ofensiva.** Cortei porque semana e média de 28 dias respondem perguntas diferentes. A ofensiva já tem carta.
13. **Contador animado na festa.** Cortei porque contar até o número é XP. O número está formado.
14. **Selo de estreia, 4 semanas, retomada.** `docs/rede/04-identidade.md` lista quatro selos. Não entram nesta placa. Se um dia existirem, não moram aqui e não gastam a vaga de festa.
15. **Headline `{língua} · {unidade}`.** Unidade morreu. Língua do clã já está no sub do cabeçalho. A leitura é outra frase, e ela precisa de ato, não de join.
16. **Ceder a vaga de festa ao silêncio.** Cortei antes de ceder. Ver 7.1.

---

## Frase

O app não vê o músculo. Ele vê a sessão, a carga na janela, o relógio e o vídeo firme. Onde ele vê, a barra sobe. Onde ele não vê, a barra não mexe, e o dossiê não mente.

Quatro eixos, zero soma. A vitória não escreve. A derrota não apaga. O tempo recua a barra e deixa a marca com data.

A vaga de festa da sessão é desta ficha. O duelo já cedeu. Eu tomo: uma tela cheia, um toque, o algarismo do atributo que subiu. Se eu também ceder, ninguém comemora, e isso é falha.
