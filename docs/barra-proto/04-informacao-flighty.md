# Barra do eixo 4: INFORMAÇÃO VIVA. Referência: Flighty (ios)

Fonte: acervo Mobbin, plataforma ios. Toda tela citada abaixo foi aberta e descrita a partir da imagem, não do metadado. As medidas de tipo foram estimadas sobre a captura servida pelo Mobbin (299 px de largura) e convertidas para 430 px pelo fator 1,44. Onde a medida é frágil, o critério da seção B está escrito em razão e não em pixel, para sobreviver ao erro de leitura.

Registro honesto de limite da fonte: o Mobbin serve quadro estático. Nada nesta barra afirma duração de animação do Flighty. Onde o documento fala de valor que muda, a evidência é o **rastro que o Flighty deixa no quadro parado**, ou seja, o valor antigo ainda presente na tela. Isso é observação, não inferência.

Buscas feitas: tela de detalhe de voo, tela de atraso e status, lista de voos, previsão de chegada, timetable detalhado, estado vazio, passaporte e estatísticas, atividade ao vivo em tela de bloqueio. Todas devolveram Flighty. Nenhuma busca do lote precisou ser descartada.

---

## A. O que a referência faz, tela por tela

### A1. Detalhe de voo no caso bom, tudo no horário
https://mobbin.com/screens/0f1d7f88-cd0a-4921-ada2-0df15f4cd6cd

A folha sobe sobre o mapa e mostra, de cima para baixo: uma linha de identificação em cinza pequeno ("AA 6294 · FRI, 26 JUN") com o logo da companhia à esquerda, o par de cidades em duas linhas de peso forte ("San Francisco to Los Angeles"), e um "✕" em botão circular no canto.

Depois vem a faixa de estado, com fundo um passo acima da folha: **"Gate Departure in 7h 35m"**, onde a duração está em negrito dentro da mesma frase e no mesmo tamanho do resto. Abaixo, duas linhas de prosa explicando a causa: "Inbound aircraft is in air from Los Angeles, with enough time for 6:00 AM departure ›". A frase termina em chevron, ou seja, a causa é navegável.

O bloco de partida tem quatro camadas de informação em três linhas:

1. linha de aeroporto: glifo de decolagem, "SFO • San Francisco Intl. ›"
2. o herói: **"6:00 AM" em verde**, o maior tipo da folha inteira
3. subtítulo em cinza: "On Time · Departs in 7h 35m"
4. à direita, na mesma altura do herói: pílula amarela preenchida **"↗ B22"**, e sob ela "Terminal 1" em cinza

Entre partida e chegada existe **uma** régua horizontal, e sobre ela, centralizado, o tamanho mais apagado da tela: "🕐 1h 42m • 544 km".

O bloco de chegada repete a estrutura e acrescenta a coisa mais importante do app inteiro: o herói "7:42 AM" em verde tem, **encostado à sua direita, o valor antigo "7:43 AM" em cinza e riscado**, em cerca de 40% da altura do herói. O subtítulo é "1m Early · Arrives in 9h 17m". À direita, duas pílulas amarelas lado a lado, **"🧳 T4C3"** e **"↘ 52G"**, e sob elas "Terminal 4".

Contagem de números na dobra visível: 2 horas herói, 2 durações relativas, 1 duração de voo, 1 distância, 3 códigos de posição física, 1 número de terminal por ponta. O herói é sempre o horário do relógio. A cor cromática aparece em 5 lugares: 2 verdes de texto e 3 amarelos de pílula.

### A2. Detalhe de voo com horário remarcado, ainda no futuro
https://mobbin.com/screens/7d735eb7-a810-453d-ab90-c184fc6b2695
https://mobbin.com/screens/09e08a95-1063-4e78-baeb-a68dddb6136a
https://mobbin.com/screens/f642c78d-91ab-484f-b782-692aef2c174a

Mesmo voo (DL 1421) em três capturas com a folha em alturas diferentes de arraste. A faixa de estado diz, em duas linhas: **"Departure changed to 10:15 AM"** em peso forte, e sob ela, em cinza, **"Flight now departs 1h 20m later"**. Ou seja, o novo valor absoluto vem na primeira linha e o desvio vem na segunda, escrito em palavra, com a direção ("later") no lugar de um sinal.

O detalhe que mais ensina: **os dois horários herói estão em preto, não em verde nem em vermelho**, e o subtítulo de cada um é a palavra "Scheduled". O voo foi remarcado, o novo horário virou o plano, e portanto não existe desvio a mostrar. Sem desvio, sem cor. As pílulas amarelas de portão ("↗ C5", "↘ 23A") e os terminais continuam presentes e continuam amarelos, porque posição física não é desvio: é coordenada.

A folha carrega uma faixa de chips roláveis logo abaixo do título ("Get PRO", "Share", "My Flight ⌄", "Alternatives", "Live Activity", "Open In Maps"). O mapa atrás mostra a rota como uma linha azul entre dois pontos rotulados.

### A3. Detalhe em voo, com uma ponta boa e a outra ruim na mesma tela
https://mobbin.com/screens/d2a15492-9519-4965-826f-649edbfc3521

Este é o caso que prova a regra de cor. O mapa mostra o avião sobre a rota e uma pílula flutuante de HUD com dois dados de máquina: **"768 KM/H"** e a altitude, separados por uma régua vertical fininha, dentro da mesma pílula.

Na folha, a faixa de estado tem fundo levemente tingido de vermelho e diz: **"Landing in 40m"**, com o "40m" em vermelho, seguido de "Arrives at gate 1h 8m late. SFO arrivals are running 56m late ›". A segunda frase é contexto sistêmico: o atraso do aeroporto inteiro, não do voo, e é navegável.

Partida: herói **"8:31 PM" em verde** com **"8:35 PM" riscado em cinza ao lado**, subtítulo "4m Early · 1h 54m ago", pílula "↗ 52E", Terminal 4.
Chegada: herói **"11:14 PM" em vermelho** com **"10:06 PM" riscado em cinza ao lado**, subtítulo "1h 8m Late · Arrives in 48m", pílulas "🧳 5" e "↘ B22", Terminal 1.

Verde e vermelho convivem na mesma folha porque cada um se refere a um evento diferente do mesmo voo. Cada herói carrega seu próprio fantasma. O texto do subtítulo repete o desvio em palavra ("4m Early", "1h 8m Late") na mesma cor do herói, em tamanho de corpo.

### A4. A lista, onde o herói troca de natureza
https://mobbin.com/screens/548c26d4-5004-4343-8e7e-eecbfe4bccb5

Título "My Flights" em tipo grande. Uma linha de voo, dividida em duas colunas:

- coluna esquerda estreita: **"31"** em peso forte e, sob ele, **"MINUTES"** em versalete cinza minúsculo
- coluna direita: "✈ AA 6294" em cinza, "Departs **On Time**" com as duas palavras em verde, o par de cidades em peso forte, e uma última linha com dois pares: "🟢 SFO 6:00 AM" e "🟢 LAX 7:10 AM"

Na lista o herói é **tempo relativo** (quantos minutos faltam). No detalhe o herói é **tempo absoluto** (a hora do relógio). O mesmo voo, dois heróis diferentes, escolhidos pela pergunta que a tela responde. Na lista a pergunta é "preciso sair agora?". No detalhe é "a que horas?".

Barra de abas com três destinos (My Flights, Friends, Passport) mais um botão circular de busca solto ao lado.

### A5. Previsão de chegada: histograma que não é gráfico
https://mobbin.com/screens/a41bd380-ffe6-42a3-963b-8d088bb0045a

Cartão "Arrival Forecast" com um distintivo roxo "PRO" no canto e subtítulo "AA 6294 performance over the last 60 days". Três colunas de resumo, cada uma com rótulo em cima e ícone mais valor embaixo: "Late 🕐 0%", "Average of Late ⏱ 0m", "Observed ✈ 35".

Abaixo, sete linhas de distribuição, cada uma com rótulo à esquerda, trilha de barra no meio e percentual à direita: Early 89%, On Time 11%, 15m late 0%, 30m late 0%, 45m+ late 0%, Canceled 0%, Diverted 0%. **As cinco linhas de valor zero ocupam a mesma altura das outras, com trilha vazia e "0%" impresso.** Nada é escondido por ser zero. O percentual está numa coluna alinhada à direita, então a vírgula decimal e o sinal de porcentagem não dançam entre linhas.

No mesmo rolo, o cartão "Where's My Plane?": "Embraer 175 · N510SY", "First Flight: Sep 30, 2021 · 4 years old", foto da fuselagem real com a pintura da companhia, e uma pílula verde **"✓ NO ISSUE"**.

### A6. Timetable detalhado: a grade densa que não virou tabela
https://mobbin.com/screens/f642c78d-91ab-484f-b782-692aef2c174a

Cartão "Detailed Timetable" com subtítulo que declara as quatro fontes de verdade: "Scheduled, Estimated, Predicted, and Actual".

Três seções em versalete cinza: DEPART, ARRIVE, TOTALS. Cada linha tem o nome do evento à esquerda em preto ("Gate Departure", "Taxi", "Take Off", "Land", "Taxi", "Gate Arrival", "Air Time") e duas colunas de valor, cada uma com um micro rótulo em cinza acima do número:

| evento | Scheduled | Estimated |
| --- | --- | --- |
| Gate Departure | 6:00 AM | 6:00 AM verde |
| Taxi | 10m | **24m vermelho** |
| Take Off | 6:10 AM | **6:24 AM vermelho** |
| Land | 7:33 AM | 7:32 AM verde |
| Taxi | 10m | 10m verde |
| Gate Arrival | 7:43 AM | 7:42 AM verde |
| Air Time | 1h 23m | 1h 8m verde |

O que faz isso não virar planilha: **zero réguas verticais, zero listras alternadas, zero linha de cabeçalho repetida**. O rótulo da coluna é repetido dentro de cada linha, em cinza minúsculo, o que custa 7 repetições de "Scheduled" e 7 de "Estimated" e compra a leitura de qualquer linha isolada sem subir os olhos. O plano fica em cinza, a realidade fica colorida. A coluna de nome do evento nunca recebe cor.

Aqui a granularidade é a coisa: o app não mostra "atrasado 14 minutos". Mostra **onde** os 14 minutos foram perdidos, e a resposta é a linha "Taxi", 10m previstos contra 24m reais.

### A7. Atividade ao vivo na tela de bloqueio, voo em curso e adiantado
https://mobbin.com/screens/068a8ac5-0520-4d38-a542-32d3b4d96de5

Widget escuro sobre a tela de bloqueio. Linha de cabeçalho: "AA6294" à esquerda, "🎙 15A" à direita (o assento). Linha central: **"SFO" branco + "5:54 AM" verde**, uma trilha pontilhada com o glifo de avião a cerca de 55% do caminho, **"7:34 AM" verde + "LAX" branco**. Sob as pontas, o desvio de cada uma: "6m early" à esquerda, "9m early" à direita, ambos em verde.

Embaixo, uma faixa interna mais escura com uma linha de tendência verde subindo do canto esquerdo e, centralizado, **"1 hr, 18 min"** em branco forte, com **"UNTIL GATE ARRIVAL"** em versalete cinza minúsculo abaixo. O herói do widget é a contagem regressiva, e o rótulo mora sob o número, não ao lado.

### A8. Atividade ao vivo, voo chegou atrasado, e o dado que não existe
https://mobbin.com/screens/74651d77-b387-4af4-8f3f-0bd555cf37e3

Mesmo widget no caso ruim. **"MCO" + "8:46 AM" vermelho**, trilha pontilhada com o avião na ponta direita, **"11:36 AM" vermelho + "SJU"**. Sob as pontas: "TA · 6m late" e "1m late · TB". A trilha tem um brilho vermelho difuso sob ela, na mesma cor do desvio.

A faixa interna traz **"✓ Arrived 1m Late"** em branco forte com "Terminal B · Gate B7" em cinza abaixo. À direita dessa faixa, uma pílula amarela: **"🧳 --"**.

Esse "--" é o critério inteiro. A esteira de bagagem ainda não foi divulgada. O Flighty **não esconde a pílula, não mostra spinner, não mostra "carregando"**. Ele reserva o espaço, mantém a cor amarela do tipo de dado e imprime dois hifens no lugar do valor. A ausência é tipográfica e ocupa exatamente a mesma largura que o valor ocuparia.

### A9. Estado vazio da lista
https://mobbin.com/screens/eac62771-f8b7-4208-ab92-2f44aa030608
https://mobbin.com/screens/a0c0bdd2-0f45-41a0-bb0c-c4bc6ff990cb

A folha "My Flights" sem voo nenhum é branca e vazia. No centro vertical, duas linhas de texto cinza: **"Let's Fly Somewhere"** e, menor, **"Tap 🔍 Search to add your next flight"**, com o glifo da lupa desenhado dentro da frase, no tamanho do texto. Zero ilustração, zero botão preenchido, zero card de sugestão. A frase nomeia o controle exato e desenha o ícone dele.

Na segunda captura, a mesma folha vazia com um balão escuro ancorado no botão de busca: "Welcome! Get a Free Upgrade 🎁 / Add your next flight to receive a free upgrade to Flighty Pro." O balão aponta para o controle, com bico.

### A10. Passaporte com dado, e o mesmo cartão sem dado
https://mobbin.com/screens/51e0b005-a575-4212-8054-80e05f798816
https://mobbin.com/screens/113f04a0-16ca-4147-81f8-2fdeebe56c7d

O cartão "Most flown aircraft" existe em dois estados, com **layout idêntico**:

- com dado: "B787-9" em tipo grande, "5 flights" em cinza abaixo, **fotografia colorida do avião**, e um botão de linha "All Aircraft Stats ›"
- sem dado: **"Papercraft 747"** em tipo grande, **"No flights with a real plane yet."** em cinza abaixo, e no lugar da foto um **desenho de contorno branco do 747, sem preenchimento**, como planta técnica

O app inventa um valor de mentira nomeado, declara em uma frase que ele é de mentira, e troca a arte cheia por arte de contorno. O cartão não encolhe, não sai da tela e não vira um convite. Continua sendo o cartão daquele dado.

Na mesma tela, um cartão vermelho escuro sobre atrasos ("minutes lost from delays / Delayed flights averaged 0m late / All Delay Stats ›") e uma linha "PRO Complete Your Map & Stats / Upgrade to add flights older than 12 months."

A lista "Past Flights" tem uma faixa de filtros como chips de texto ("Date ↓ | From | To | Airline | Aircraft"), um cabeçalho de seção com o ano à esquerda e **"27 FLIGHTS"** em versalete cinza à direita, e dois botões de densidade de lista no topo. A linha de voo: "QF 3215 LAX → MCO" em cinza pequeno, "Jun 26, 2026" em cinza à direita, e o par de cidades em peso forte abaixo.

### A11. Passaporte aberto: onde a unidade encolhe
https://mobbin.com/screens/1efa3d22-9367-4216-8619-2aac650f05c4

Fundo roxo escuro no topo com "ALL-TIME" e "2026" como duas abas. Primeiro bloco, "Flight Time":

**"169h 25m"**, onde "169" e "25" estão em preto, peso forte, tipo grande, e **o "h" e o "m" estão em cinza, em cerca de 60% da altura do algarismo**, na mesma linha de base.

Abaixo, uma grade de seis pares rótulo mais valor, com o rótulo em cinza pequeno acima do número: "Days 7.1", "Weeks 1.0", "Months 0.2", "Years 0.02", "Avg. Flight Time 6h 16m", "In Air 145h 55m", "Taxiing 9h 26m". O mesmo número aparece em quatro unidades diferentes, porque o app não decide para você qual escala importa.

Depois, dois registros de extremo, cada um com rótulo, companhia, par de aeroportos com um glifo entre eles, código de voo, data, e o valor alinhado à direita: "Shortest flight / Dallas ⊙ Dallas / CX 7613 · 24 Jun 2026 / **4m**" e "Longest flight / San Francisco ⊙ Dubai / EK 226 · 26 Apr 2026 / **16h 20m**". Cada um com um botão de texto "Show More".

### A12. Passaporte: contagem com zero impresso
https://mobbin.com/screens/9efbdee8-7194-4837-a08a-b810062aad05

Bloco "Countries & Territories": **"14"** em tipo enorme preto seguido de **"total"** em cinza a cerca de 55% da altura. Três linhas com bandeira, nome do país e contagem à direita em cinza ("United States 17 flights", "South Africa 3 flights", "Australia 3 flights"), mais "Show More".

Abaixo, uma grade de nove células, três por linha, cada uma com nome da região em cinza minúsculo e, na linha de baixo, o número à esquerda e o percentual à direita: Asia 4 / 11%, Europe 3 / 6%, N. America 2 / 33%, Oceania 2 / 8%, Middle East 1 / 7%, S. America 1 / 7%, Africa 1 / 2%, **C. America 0 / 0%**, **Caribbean 0 / 0%**.

As duas células de zero têm a mesma moldura, a mesma altura e a mesma tipografia das outras. Zero é um valor, não uma ausência. Acima, o bloco de rotas mostra barras roxas de comprimento idêntico para rotas com contagem 1 ("DFW-SFO 1", "DXB-CPT 1", "GRU-LAX 1"), ou seja, a barra não desaparece no valor mínimo.

---

## B. A BARRA, em número

Cada critério é conferível contando pixels, amostrando cor ou contando ocorrências numa captura de 430x844.

**B1. Um herói por bloco, e nenhum a mais.** Cada bloco de informação tem **exatamente 1** número em tamanho de herói. O herói mede **2,4x a 2,7x** a altura de tipo do corpo do mesmo bloco. Numa tela de detalhe com 2 blocos (partida e chegada, ou série anterior e série atual), existem **exatamente 2** heróis e nada entre eles compete: o valor mais alto entre os dois blocos é o texto da régua central, que fica em **no máximo 0,8x** o corpo. Dois números do mesmo tamanho na mesma tela sem serem heróis pares conta como falha.

**B2. O herói responde a pergunta da tela, e troca de natureza entre lista e detalhe.** Na lista, o herói é **tempo relativo ou contagem regressiva**. No detalhe, o herói é **valor absoluto**. Conferível: o herói da linha de lista e o herói da tela de detalhe do mesmo objeto têm **unidades diferentes** em 100% dos casos. Se lista e detalhe repetem o mesmo herói, a lista está desperdiçando seu maior tipo.

**B3. Unidade, duas regras e nenhuma terceira.** Sufixo que faz parte da leitura do valor (o "AM" de um horário, o "%" de um percentual) fica em **100%** da altura e no mesmo tom do algarismo. Unidade física atrelada a magnitude ("h", "m", "kg", "min") fica entre **55% e 65%** da altura do algarismo e num tom de contraste **menor**, entre 2,5:1 e 4,5:1 contra o fundo, enquanto o algarismo fica acima de 13:1. Unidade **nunca** recebe cor cromática. Um terceiro tratamento de unidade no app conta como falha.

**B4. Todo número que muda mantém o fantasma.** Quando um valor é substituído, o valor antigo permanece na tela, **na mesma linha, à direita do novo**, riscado, em cinza, medindo **38% a 48%** da altura do herói. O fantasma não pode ir para outra linha, nem para tooltip, nem para histórico. Cobertura exigida: **100%** dos valores que mudaram desde a última vez que a pessoa viu a tela. Zero valores trocados por corte seco.

**B5. O desvio vem em palavra, junto do novo absoluto, e nunca sozinho.** O desvio aparece como frase com a direção escrita ("1h 20m later", "4m Early", "1m Late"), no tamanho do corpo, na cor semântica do estado, e **imediatamente sob** o valor absoluto que ele qualifica. Proibido: distintivo isolado com sinal ("+14"), desvio numa aba separada, desvio sem o absoluto ao lado. Conferível: para cada desvio na tela, existe o absoluto correspondente a **menos de 1 altura de linha** de distância.

**B6. Três cores semânticas no app inteiro, e um significado por cor.** Exatamente **3**: verde para melhor ou igual ao plano, vermelho para pior que o plano, e **1** cor de coordenada física (o amarelo de portão, esteira e assento no Flighty). Cada cor tem **1** significado no app inteiro, verificável abrindo todas as telas e listando ocorrências. A cor de coordenada **nunca** significa qualidade, e a cor de qualidade **nunca** marca posição.

**B7. Sem comparação, sem cor.** Quando não existe plano contra o qual medir, o valor é impresso no tom de texto primário neutro e o subtítulo nomeia o estado em palavra ("Scheduled"). Conferível: numa tela de voo remarcado, **0** algarismos coloridos de qualidade e as pílulas de coordenada continuam presentes. Colorir um valor que não tem referência conta como falha, porque queima o vocabulário.

**B8. Orçamento de cor por tela.** No máximo **6** ocorrências de cor cromática por tela, somando texto colorido e pílulas, sendo no máximo **2** heróis coloridos. A soma da área cromática fica em **no máximo 4%** dos pixels da tela. A faixa de estado, quando tinge o fundo, usa a cor semântica com opacidade tal que o contraste do texto sobre ela permaneça acima de **7:1**, e é **1** região por tela, nunca duas.

**B9. Grade densa sem virar tabela.** A grade de plano contra realidade tem **2** colunas de valor, **0** réguas verticais, **0** listras alternadas e **0** linha de cabeçalho no topo. O rótulo da coluna é repetido em versalete cinza dentro de **100%** das linhas, em **no máximo 0,7x** o corpo, de modo que qualquer linha isolada seja legível sem subir os olhos. A coluna de nome do evento recebe **0** cor. Densidade mínima: **7** linhas de dado dentro de um cartão sem rolagem interna.

**B10. Granularidade em vez de resumo.** Quando um número agregado piora, a tela oferece a decomposição que nomeia **onde** piorou, com granularidade de **pelo menos 3** etapas por perna do processo. Conferível: para todo desvio de total exibido no app, existe uma tela a **no máximo 1 toque** onde o mesmo desvio aparece atribuído a uma etapa nomeada.

**B11. Pílula de coordenada física.** Posição física fica em pílula preenchida, **no máximo 2** por bloco, alinhada à direita na mesma altura do herói, com **1** glifo de direção e **1** valor, e o número de terminal como texto cinza sob a pílula. Valor desconhecido imprime **"--"** dentro da pílula: a pílula **não** desaparece, **não** vira esqueleto animado e **não** muda de largura mais que **1** caractere. Cobertura: **100%** dos estados de desconhecido.

**B12. Zero é impresso.** Linha, célula ou barra de valor zero mantém **100%** da altura, da moldura e da tipografia da versão com valor, com o algarismo "0" visível e a trilha vazia desenhada. Cobertura exigida: **100%** das listas de distribuição. Esconder linha por ser zero, ou colapsar seção por estar vazia, conta como falha.

**B13. Cartão sem dado mantém o cartão.** Quando um cartão não tem dado, ele conserva **posição, altura e título**, troca a arte cheia por **contorno sem preenchimento**, e declara a ausência em **1** frase de no máximo 8 palavras. Proibido: sumir com o cartão, trocar o cartão por um convite de cadastro, ou usar bloco cinza pulsante. Conferível comparando as duas capturas: a caixa do cartão tem a mesma altura em ambos os estados, com tolerância de **5%**.

**B14. Estado vazio nomeia o controle.** O estado vazio da lista principal ocupa **no máximo 12%** da altura útil, gasta **0** ilustrações e **0** botões preenchidos, e sua segunda linha **nomeia o controle exato** que resolve o vazio, com o glifo desse controle desenhado dentro da frase no tamanho do texto.

**B15. Face tabular e coluna que não dança.** Todo algarismo em contexto de lista, grade ou contagem regressiva usa avanço tabular. Conferível: em duas capturas do mesmo bloco com valores diferentes, a borda direita da coluna de números e a posição do sinal de porcentagem são **idênticas ao pixel**. Contagem regressiva que muda de 10 para 9 **não** pode encolher a caixa nem mover o rótulo.

**B16. Absoluto e relativo sempre em par.** Todo valor absoluto de tempo carrega, no subtítulo, sua versão relativa ("Departs in 7h 35m", "1h 54m ago", "Arrives in 48m"). Cobertura: **100%** dos horários de detalhe. O relativo fica em tamanho de corpo, na mesma linha do estado em palavra, separado por um ponto médio.

**B17. Causa a um toque.** Todo número em estado ruim tem, na mesma faixa, **1** frase de causa terminando em chevron. A frase nomeia um agente externo ao número ("Inbound aircraft is in air from Los Angeles", "SFO arrivals are running 56m late"). Cobertura exigida: **100%** dos estados ruins. Número ruim sem causa navegável conta como falha.

**B18. Rótulo sob o número no widget, e versalete apagado.** Em superfície reduzida, o herói vem primeiro e o rótulo vem **abaixo**, em versalete, em **no máximo 0,45x** a altura do herói, com contraste entre 2,5:1 e 4:1. Nenhum rótulo à esquerda do número em superfície reduzida.

---

## C. O que contaria como SUPERAR

**C1 (um herói por bloco).** O Flighty entrega 1 herói por bloco porque a pergunta do voo é única: a que horas. Um app de academia tem duas perguntas simultâneas no rack, quanto peso e quantas repetições, e a tentação é dois heróis do mesmo tamanho. **Superar é resolver a série com 1 herói só**, escolhendo o número que o dedo vai mudar agora e rebaixando o outro a corpo, e ainda assim manter a série executável sem erro. Empatar aqui é fácil, superar é escolher.

**C2 (herói troca de natureza).** Ganho disponível e o Flighty não pode reivindicá-lo por inteiro. Ele tem 2 contextos, lista e detalhe. Um app de academia tem 4 superfícies olhando o mesmo objeto: hoje, ficha, execução, recibo. **Superar é provar que o herói é diferente em cada uma das 4**, cada um respondendo a pergunta daquela superfície, sem repetir unidade. Isso é 4 escolhas certas contra 2, e é ganho real.

**C3 (unidade).** O Flighty já opera 2 regras limpas e nenhuma terceira. **Superar é difícil e o caminho é volume de unidades**: um app de academia carrega kg, repetição, série, minuto, segundo, percentual e data na mesma tela, o dobro do vocabulário do Flighty. Ficar acima é manter as **mesmas 2 regras** com **7 unidades**, sem inventar exceção. Se aparecer uma terceira regra, perdemos com mais dados do que o adversário, o que é a pior forma de perder.

**C4 (fantasma do valor antigo).** É aqui que o Flighty pode ser batido de longe, e é o maior ganho do eixo. No Flighty o fantasma é **exceção**: só aparece quando a companhia aérea remarcou algo. Na academia, **todo número tem um antecessor legítimo**, a série da semana passada, e o antecessor não é uma exceção, é o motivo de existir o app. **Superar é transformar o fantasma em padrão**: 100% dos campos de execução mostram o valor da sessão anterior no mesmo lugar, riscado ou apagado, antes de a pessoa tocar. O Flighty mostra o passado quando o mundo muda; nós mostramos o passado sempre, porque o passado é a barra a bater. Cobertura de 100% contra cobertura de exceção é vitória mensurável.

**C5 (desvio em palavra).** Empate provável e vale empatar. O ganho fica em uma coisa que o Flighty não tem: o desvio dele é sempre contra um plano de terceiro (a companhia). **Superar é o desvio contra o próprio corpo da pessoa**, escrito na mesma gramática ("2 repetições acima de terça"), com o mesmo compromisso de nunca aparecer sem o absoluto ao lado. Mesma forma, referência mais forte.

**C6 (três cores, um significado).** O Flighty é teto neste critério. **Superar por contagem é impossível**, 3 cores com 1 significado cada é o piso do vocabulário útil. Onde ganhar: o Flighty precisa das 3 porque tem dois tipos de fato (qualidade e coordenada). Um app de academia em modo escuro pode tentar **2 cores mais luminância**, usando o próprio nível de brilho do algarismo como terceiro canal, e aí fica acima com menos vocabulário. Risco alto, e se falhar volta a empatar em 3.

**C7 (sem comparação, sem cor).** Critério mais fácil de perder e mais barato de ganhar. Quase todo app de academia pinta de verde qualquer coisa concluída, inclusive a primeira série da vida da pessoa, quando não existe nada com que comparar. **Superar é a regra dura: primeira execução de um exercício sai neutra, sem verde, com a palavra "primeira" no subtítulo.** O Flighty já faz isso. Ficar acima exige aplicar em um caso que o Flighty não tem, o do valor que nasce, e resistir à vontade de comemorar.

**C8 (orçamento de cor).** Modo escuro dá vantagem estrutural: cor cromática sobre fundo escuro rende mais contraste por área, então o mesmo recado cabe em menos pixels. **Superar é entregar o mesmo recado com no máximo 4 ocorrências e 2% da área**, contra 6 e 4% do Flighty. Verificável por amostragem de pixel.

**C9 (grade densa).** O Flighty é muito bom aqui, e o teto real não é dele, é do tamanho da tela. A grade dele tem 7 linhas e 2 colunas de valor. **Superar é 3 colunas de valor** (plano, sessão anterior, agora) mantendo 0 réguas, 0 listras e 0 cabeçalho, dentro de 430 px. Se as 3 colunas não couberem sem régua vertical, **é melhor empatar em 2** do que ganhar densidade e perder a regra. Declarado aqui para não haver dúvida na hora.

**C10 (granularidade).** Ganho grande e disponível. O Flighty decompõe atraso em 3 a 4 etapas porque é o que a fonte de dados dele permite. Um app de academia é dono da própria telemetria: **superar é decompor a sessão em série a série**, com o desvio atribuído à série exata, o que é uma granularidade uma ordem de grandeza acima. A barra: para qualquer total pior, existe a série nomeada que causou, a 1 toque.

**C11 (pílula de coordenada e o "--").** O Flighty é teto no tratamento do desconhecido. **Superar é impossível em elegância**, dois hifens numa pílula que não muda de largura é o fim da linha. Onde ganhar em vez disso: o Flighty tem **1** tipo de dado desconhecido (esteira de bagagem). Nós temos vários (equipamento ocupado, carga não registrada, treino sem ficha). Ficar acima é aplicar a **mesma** regra do "--" em 100% desses casos, sem nunca cair em esqueleto pulsante nem em "carregando". Vitória por cobertura, não por invenção.

**C12 (zero impresso).** Empate exigido, com uma agravante nossa. No Flighty, zero é neutro: zero voo cancelado é boa notícia. Na academia, zero costuma ser má notícia, e a tentação de esconder é maior. **Superar é imprimir o zero exatamente com a mesma tipografia do valor cheio, sem cor de alarme e sem frase de consolo.** Zero em vermelho conta como falha, porque zero não é desvio, é fato.

**C13 (cartão sem dado).** O "Papercraft 747" é a melhor solução de estado vazio do lote e é copiável em mecanismo, não em piada. **Superar é entregar contorno em vez de arte cheia para 100% dos cartões sem dado**, com a frase de ausência em até 8 palavras, e sem nenhum convite de cadastro no lugar. Nós temos mais cartões vazios que o Flighty no primeiro dia de uso, então cobertura total aqui é ganho.

**C14 (estado vazio nomeia o controle).** Empate provável e barato. Para ficar acima: a frase do Flighty nomeia um controle de busca, que é genérico. Nossa frase pode nomear **o controle e o objeto que falta** em 8 palavras, com o glifo dentro da frase, e ainda caber em 12% da altura. Verificável por contagem de palavras.

**C15 (face tabular).** O Flighty é teto e o critério é binário. **Superar é impossível**, ou a coluna não dança ou dança. Onde ganhar: o Flighty não tem número que muda a cada décimo de segundo. Nós temos cronômetro de descanso. Ficar acima é entregar **avanço tabular num valor que muda 10 vezes por segundo** sem um pixel de deslocamento, o que é o mesmo critério num caso mais difícil.

**C16 (absoluto e relativo em par).** Ganho disponível. O Flighty faz o par em horários. Um app de academia pode fazer o par em **carga** ("80 kg · 2,5 kg acima") e em **volume**, o que o Flighty não tem oportunidade de fazer. Superar é cobertura de 100% do par em duas dimensões, tempo e magnitude, contra uma dimensão do Flighty.

**C17 (causa a um toque).** Aqui está o segundo grande ganho do eixo, e ele é estrutural. A causa do atraso do Flighty é **externa e não acionável**: o aeroporto está lento, e a pessoa não pode fazer nada. A causa de um número pior na academia é **do próprio corpo e acionável**. **Superar é a frase de causa nomear algo que a pessoa controla** ("terça você dormiu menos", "você pulou o descanso de 90s"), mantendo a mesma disciplina de 1 frase e 1 chevron. Mesma forma, causa acionável: isso é ficar acima, não empatar.

**C18 (rótulo sob o número).** Empate, e vale copiar tal e qual. O ganho aqui não é de forma, é de latência, e por isso vira o critério transversal abaixo.

**C19 (o critério que o Flighty não pode ter).** O dado do Flighty nasce em terceiro (companhia, aeroporto, radar) e chega ao app com atraso de segundos a minutos. Nenhum critério da seção B mede isso, porque o Flighty não tem como competir. **A informação da academia nasce no dedo da pessoa.** O ganho que nenhuma tela do Flighty pode igualar é **latência entre o fato e a exibição abaixo de 100 ms, com o fantasma do valor anterior ainda na tela no momento da troca**. Ou seja: aplicar a disciplina de dado vivo do Flighty num dado que é vivo de verdade. É aqui que o eixo 4 se ganha, e não em nenhuma sofisticação de layout.
