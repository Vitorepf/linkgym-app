# Barra do eixo 1: DENSIDADE. Referência: Linear (web)

Fonte: acervo Mobbin, plataforma web. Toda tela citada abaixo foi aberta e descrita a partir da imagem, não do metadado.

Duas buscas do lote não devolveram Linear e ficam registradas aqui em vez de virarem observação falsa:

- busca por menu suspenso de troca de estado do Linear com ícones coloridos: devolveu Height, Fabric, Attio, Salesforce, Hex, Productboard, Heidi e HubSpot. Nenhuma tela de Linear. Portanto o comportamento do seletor de estado em popover não entra nesta barra.
- não apareceu nenhum aviso transitório (toast) do Linear em modo escuro. O único toast observado está em modo claro. O critério B10 abaixo trata isso explicitamente e converte a medida para razão, que sobrevive à troca de tema.

---

## A. O que a referência faz, tela por tela

### A1. Lista de issues agrupada, modo escuro
https://mobbin.com/screens/e142df2a-3527-499c-8f81-1b715947ac0c

A tela inteira roda em **um único tamanho de tipo**. Título de linha, nome do grupo, item da barra lateral, data, contagem, rótulo de projeto: tudo na mesma altura de caractere. A hierarquia não vem de tamanho, vem de duas coisas: **peso** (o título da linha é o único texto com peso médio, todo o resto é regular) e **luminância** (título quase branco, texto de projeto em cinza médio, data em cinza mais apagado).

Não existe divisória entre linhas. A tela tem **uma** régua horizontal, embaixo da barra de abas "All issues / Active / Backlog", e **uma** régua vertical, separando a barra lateral do painel de conteúdo. Nada mais é separado por linha. O que separa linha de linha é espaço em branco e a mudança de fundo no hover.

O cabeçalho de grupo ("In Progress 4", "Todo 4", "Backlog 4", "Done 17") ocupa **exatamente um slot de linha**. O passo vertical do cabeçalho para a primeira linha do grupo é igual ao passo de linha para linha. Não há respiro extra antes nem depois do cabeçalho. É por isso que a lista tem densidade de planilha sem ter cara de planilha: o agrupamento não custa altura.

A palavra do estado aparece **uma vez por grupo**, no cabeçalho. Dentro da linha, o estado é só um glifo circular com arco de progresso. Numa lista com cerca de 25 linhas visíveis, a palavra "In Progress" aparece 1 vez, não 25.

A linha se organiza em dois blocos separados por um vão vazio contínuo no meio: bloco esquerdo (alça de arrastar, ícone de prioridade, identificador AS-11, glifo de estado, título) ancorado à esquerda e irregular; bloco direito (rótulos com ponto colorido, projeto com ícone de pasta, avatar, data) ancorado à direita e alinhado em colunas. O vão do meio nunca fecha.

Cor cromática aparece só em elementos que **carregam dado**: os pontos de 6 a 8 px dos rótulos (verde, roxo, azul), o glifo de prioridade, o glifo de estado, os avatares. **Zero botões preenchidos na tela.** O "+" à direita de cada cabeçalho de grupo é glifo fantasma. Não existe cor de marca no cromo.

Barra lateral: 16% da largura da janela, cerca de 15 itens, 3 rótulos de grupo ("Workspace", "Your teams", "Try"), **zero divisórias entre grupos**. O que separa grupo de grupo é uma linha em branco mais o rótulo em cinza apagado. O item ativo ("Issues") é marcado por um fundo levemente mais claro e pelo texto mais claro. Não há barra lateral de acento, não há cor.

### A2. Lista com sub-issues, barra de seleção múltipla flutuante
https://mobbin.com/screens/c61980d9-a5a7-4ccf-aac8-b3ba125e299a

Mesma lista, agora com linhas que carregam um caminho pai ("Support system-based theme detection › Add dark mode toggle in user settings"). O pai fica no mesmo tamanho do filho, em cinza mais apagado, e o separador é um chevron de texto. Nenhum recuo, nenhuma árvore, nenhuma linha de conexão.

Com 6 itens selecionados, aparece uma **pílula flutuante no rodapé central**: "6 selected · ⚠6 · ✕ · ⌘ Actions". Altura de uma linha. Fundo um passo acima do painel, borda de 1 px, sombra suave. **Não escurece a página atrás.** Ela flutua sobre a lista e a lista continua legível.

Os cabeçalhos de grupo carregam um triângulo de aviso com contagem ("Todo ⚠5", "Backlog ⚠21"). Aviso é glifo mais número, nunca banner.

### A3. Popover de configuração de notificação sobre a lista
https://mobbin.com/screens/980af8d9-c125-4164-90ed-727692cd6946

O popover de notificação abre ancorado no sino, ocupando cerca de 22% da largura. É uma superfície **um passo de luminância acima** do painel, com borda de 1 px quase imperceptível e sombra. Cinco linhas de texto com caixa de seleção alinhada à direita, mais uma linha de integração com um botão de texto ("Connect"). Nenhuma véu escuro sobre a página. A lista atrás continua com contraste total.

### A4. Lista com painel de detalhe à direita, e o aviso transitório
https://mobbin.com/screens/b9104519-abc8-4638-a2fc-206bea260188

Modo claro. O toast fica no **canto inferior direito**, medindo cerca de 25% da largura e 6,5% da altura da janela. Conteúdo: um círculo verde com check, cinco palavras ("Your view was successfully created."), um link de ação numa segunda linha ("Open view") e um "✕". Fica sobre área vazia, não cobre conteúdo primário. Some sozinho.

O painel de detalhe à direita usa o mesmo tamanho de tipo do resto. Rótulo de propriedade em cinza médio à esquerda, valor à direita. Abas internas ("Assignees / Labels / Projects") viram um controle segmentado de fundo levemente mais claro, sem borda.

### A5. Lista com painel de propriedades, marcos e gráfico de progresso
https://mobbin.com/screens/937fc32e-04c6-4c39-bcd6-17a42b4fe83c

A tela mais cheia do conjunto: lista à esquerda, painel de propriedades à direita com Status, Priority, Lead, Members, Dates, Teams, Slack, Labels, depois Milestones com percentuais, depois Progress com legenda e gráfico. Continua em **um tamanho de tipo**. O percentual de marco ("77% of") não é maior que o nome do marco. O único elemento com preenchimento cromático em toda a tela é o gráfico de progresso no rodapé do painel.

### A6. Quadro (kanban)
https://mobbin.com/screens/410846e7-09d4-4ed8-baf2-ec94d96c29f4

Colunas separadas por uma régua vertical fininha e por espaço. Cada cartão: título, depois uma faixa de metadado (prioridade, rótulo com ponto, data), depois "Created Mar 31" em cinza mais apagado. O cartão tem fundo um passo acima da coluna, **sem borda**. Cabeçalho de coluna com glifo de estado, nome e contagem ("Todo 2 / 3"). À direita, "Hidden columns" lista Backlog, Cancelled, Duplicate como itens de uma linha, sem caixa.

### A7. Quadro com painel de propriedades aberto
https://mobbin.com/screens/a6f3c2e2-cbe0-4559-bda7-54ee9d405692

O painel direito **empurra** as colunas em vez de flutuar sobre elas. A coluna "Done" fica cortada pela metade e o Linear não faz nada a respeito: aceita o corte em vez de encolher tudo. Densidade é preservada por truncamento, não por reflow.

### A8. Busca, que não é modal
https://mobbin.com/screens/a2f96ae5-202c-4747-a959-d33d7e5c0f72

A busca **toma a barra de topo**, não abre diálogo. Não há caixa flutuante, não há sombra, não há véu. Os resultados substituem a lista no lugar. Cada linha de resultado tem uma calha esquerda com o tipo em cinza apagado ("Initiative", "Project", "AS-6", "Document"), depois o ícone, depois o título com o termo em negrito, e a idade alinhada à direita ("1d", "17h", "9d"). Zero divisórias entre resultados. Um tamanho de tipo.

### A9. Busca vazia
https://mobbin.com/screens/dba91946-d147-4b2f-ad92-4195eae017fc

O painel de resultados vazio é **literalmente vazio**: campo, quatro abas, e nada. Sem ilustração, sem texto de ajuda, sem sugestão. Zero pixels gastos.

### A10. Painel flutuante de agente sobre a tela de boas-vindas
https://mobbin.com/screens/51c2bd60-f22d-4879-8c28-c5800ac1f4b6

O estado vazio do produto é uma frase ("Welcome to Linear / Ask anything or tell Linear what you ne...") e **o campo que executa a ação**, nada mais. O painel de agente é ancorado no canto inferior direito, com barra de título de uma linha e três glifos (minimizar, expandir, fechar). Ocupa cerca de 25% da largura e 60% da altura. A página atrás não é escurecida.

### A11. Editor de visão com chip de filtro
https://mobbin.com/screens/b230cf2f-37bf-4621-8aab-e50003d63813

O chip de filtro é "▮▮ Priority is ▮ High ✕": ícone, nome do campo, operador em cinza apagado, valor, e o "✕" que remove. O operador ("is") tem contraste mais baixo que o campo e o valor. O chip tem fundo um passo acima, sem borda. Ao lado, um "+" fantasma adiciona outro. "Cancel" e "Save" no topo direito são texto puro, sem caixa, sem preenchimento.

### A12. Onboarding do menu de comando
https://mobbin.com/screens/1e783aca-8b8e-4ae5-994d-284a8ddae491

A tela de ensino tem **dois tamanhos** de tipo (título e corpo), um retângulo de contorno leve contendo duas teclas desenhadas, e "Continue" como texto puro sem caixa. Nenhum botão preenchido. Nenhuma ilustração. Sete pontinhos de paginação no rodapé.

---

## B. A BARRA, em número

Cada critério é conferível contando pixels ou amostrando cor numa captura de 430x844.

**B1. Tamanhos de tipo.** No máximo **2** tamanhos distintos por tela, e a tela mais densa do app precisa rodar em **1**. Quando houver 2, a razão entre eles fica entre **1,15 e 1,30**. Qualquer razão acima de 1,4 conta como falha.

**B2. Pesos de fonte.** Exatamente **2** pesos na tela inteira, com diferença nominal de **50 a 110** unidades (por exemplo 400 e 510). Peso 700 ou acima em tela densa conta como falha. O peso mais forte cobre no máximo **12%** dos glifos da tela.

**B3. Níveis de cinza de texto.** Exatamente **4** níveis de luminância de texto, com estes contrastes contra o fundo do painel: primário **13:1 a 18:1**, secundário **4,5:1 a 6,5:1**, terciário **3:1 a 4:1**, apagado **2:1 a 2,6:1**. A razão entre primário e secundário fica em **pelo menos 2,4**. Um quinto nível conta como falha.

**B4. Divisórias.** No máximo **2** réguas horizontais e **2** verticais na tela inteira, independentemente de quantas linhas de lista existam. A divisória mede **1,10:1 a 1,45:1** de contraste contra o fundo, enquanto o texto de corpo mede no mínimo 13:1: a razão entre os dois é de **pelo menos 9**. Zero divisórias entre linhas de lista, zero listras alternadas, zero réguas verticais dentro da lista, zero linha de cabeçalho de coluna.

**B5. Passo de linha.** O passo vertical de linha fica entre **1,9x e 2,2x** a altura de linha do texto da linha. O cabeçalho de grupo ocupa **exatamente 1 slot de linha**: o passo cabeçalho para primeira linha é igual ao passo linha para linha, com tolerância de **5%**. Agrupar não pode custar altura.

**B6. Anatomia da linha.** A linha tem **exatamente 2 blocos**: esquerdo ancorado à esquerda e irregular, direito ancorado à direita e alinhado em colunas. Entre eles, um vão vazio contínuo de **pelo menos 15%** da largura da linha, presente em **100%** das linhas. No máximo **9** tokens de informação por linha.

**B7. Chip de estado.** A palavra do estado aparece **no máximo 1 vez por grupo**, nunca por linha. Dentro da linha, estado custa **1 glifo** de no máximo 1,0x a altura de linha. Numa lista de 20 linhas em 4 grupos, a palavra do estado aparece **4 vezes**, não 20. Razão exigida entre linhas e ocorrências da palavra: **pelo menos 5:1**.

**B8. Superfícies.** **3 a 4** superfícies distintas, com separação de luminância L* de **3 a 8** entre vizinhas, e amplitude total entre a mais escura e a mais clara de **no máximo 20 pontos de L***. O app inteiro vive numa faixa estreita.

**B9. Sobreposição flutuante.** No máximo **1** superfície flutuante por vez. Ela fica **exatamente 1 passo** de luminância acima do painel (ΔL* de 4 a 10), carrega borda de 1 px a no máximo **1,6:1** de contraste e sombra. O véu sobre a página tem opacidade **0%**: o conteúdo atrás mantém contraste integral. A superfície de busca ou comando não é flutuante: ela substitui a barra de topo e o painel no lugar, com **0** sombra e **0** borda de diálogo.

**B10. Aviso transitório.** Ancorado num canto, ocupando **no máximo 30%** da largura e **no máximo 8%** da altura da tela. Conteúdo: no máximo **8 palavras**, no máximo **1** link de ação, no máximo **1** glifo de estado, no máximo **1** dispensa. **0%** de sobreposição com o conteúdo primário do momento. Some sozinho.

**B11. Navegação lateral.** No mínimo **12** itens visíveis sem rolagem, com no máximo **3** rótulos de grupo e **0** divisórias entre grupos. **100%** dos itens ocupam 1 linha e 1 tamanho. O item ativo é marcado só por **fundo (ΔL* de 3 a 6) e luminância de texto**: 0 barras de acento, 0 cor cromática, 0 borda. A lateral consome **no máximo 18%** da largura útil.

**B12. Cor.** Na tela mais densa: **0** botões preenchidos, **0** superfícies cromáticas, **0** cor de marca no cromo. Cor cromática só em tokens que carregam dado, cada um com área **no máximo 1,5x** a altura de linha ao quadrado. Soma da área cromática: **no máximo 2%** dos pixels da tela.

**B13. Estado vazio.** Ocupa **no máximo 12%** da altura do painel, gasta **0** ilustrações, e ou é totalmente vazio ou contém **o próprio campo que executa a ação**. Nunca uma ilustração mais um parágrafo mais um botão.

**B14. Hover.** O hover muda **apenas** o fundo, em **1** passo (ΔL* de 3 a 6). **0** borda nova, **0** sombra nova, **0** mudança de escala, **0** mudança de tipo.

**B15. Corte em vez de reflow.** Quando um painel lateral abre, o conteúdo é **empurrado e truncado**, não reencaixado. Zero mudança de tamanho de tipo, zero mudança de passo de linha, zero reordenação entre os dois estados. Conferível comparando duas capturas: o passo de linha é idêntico com e sem painel.

---

## C. O que contaria como SUPERAR

**C1 (tipos).** O Linear já entrega 1 tamanho na tela densa. **Superar é impossível por contagem**, o piso é 1. Onde dá para ganhar: o Linear precisa de 2 tamanhos nas telas de ensino e no painel de detalhe. Um app de academia que mantenha **1 tamanho em 100% das telas, inclusive na tela de execução da série e no recibo**, fica acima. Isso exige resolver o número grande da carga sem aumentar o tamanho do tipo, por exemplo com tabular numerals no mesmo tamanho e peso mais forte.

**C2 (pesos).** Empate provável. Para ficar acima, o app precisa entregar 2 pesos com o peso forte cobrindo **menos de 6%** dos glifos, metade do teto do Linear. O caminho é usar cor em vez de peso para o segundo nível.

**C3 (cinzas).** O Linear opera 4 níveis em tema claro e escuro. Ganho possível: um app de academia é usado sob luz de teto de ginásio e com o braço suado sobre a tela. Superar aqui é entregar os **mesmos 4 níveis com o secundário nunca abaixo de 5,5:1**, ou seja, comprimir a faixa por baixo sem perder a separação de 2,4x. O Linear tolera secundário em 4,5:1 porque é usado em monitor em ambiente controlado. O app não pode.

**C4 (divisórias).** Superar é entregar **0 réguas horizontais na tela densa**, contra 1 do Linear. O Linear ainda usa uma régua embaixo da barra de abas. Um app mobile pode matar essa também, marcando a aba ativa só por luminância de texto e deixando a separação por espaço.

**C5 (passo de linha).** Teto do Linear e limite físico do dedo brigam aqui. O Linear roda passo de linha de 2,0x porque o alvo é o mouse. No celular, alvo de toque não pode ficar abaixo de **44 pt**, então o passo mínimo é maior. **Superar em densidade pura é impossível.** O que conta como superar é outra coisa: entregar **o mesmo número de tokens por linha do Linear (até 9) dentro de um alvo de 44 pt**, ou seja, densidade de informação igual com alvo de toque maior. Isso é ganho real, não empate.

**C6 (anatomia da linha).** Superar é manter o vão do meio em **pelo menos 20%** da largura em 100% das linhas, contra 15% do Linear, mesmo com o nome do exercício longo. Exige truncar o título antes de o vão fechar, e nunca deixar o metadado invadir o vão.

**C7 (chip de estado).** O Linear já resolveu: palavra 1 vez por grupo. Superar é fazer o glifo carregar **dois dados de uma vez** sem virar dois glifos: por exemplo o mesmo arco circular que hoje diz "em progresso" também dizendo quanto da série foi cumprido. Razão exigida: 2 informações por 1 glifo, contra 1 por 1 do Linear.

**C8 (superfícies).** Empate difícil, ganho possível. Modo escuro numa faixa de 20 pontos de L* é confortável no monitor e frágil no celular sob luz forte. Superar é entregar **3 superfícies dentro de uma faixa de 14 pontos** e ainda assim manter a separação de 3 a 8 entre vizinhas, o que só fecha com 3 superfícies, não 4. Menos superfícies em faixa mais estreita é o ganho.

**C9 (sobreposição).** O Linear é teto no véu de 0%. **Superar é impossível**, não existe menos que zero. Onde ganhar em vez disso: o Linear ainda tem 3 tipos diferentes de superfície flutuante (popover ancorado, pílula de seleção, painel dockado). Um app de academia que resolva tudo com **1 gramática única de flutuante**, sempre no mesmo canto, sempre com o mesmo passo de luminância, fica acima por consistência mesmo empatado no véu.

**C10 (aviso transitório).** Superar é o toast que **nunca precisa de link de ação**, porque a ação já aconteceu e é reversível pelo mesmo gesto que a causou. Meta: no máximo 6 palavras, 0 links, 0 dispensa, e some em tempo fixo. O Linear ainda coloca um link ("Open view") porque a criação de visão te tira do contexto. Numa academia, confirmar série não pode tirar ninguém de lugar nenhum.

**C11 (navegação lateral).** Não se aplica direto: um app mobile de 430 px não tem barra lateral com 15 itens. **A comparação justa é a barra de abas.** Superar é entregar **no máximo 5 abas**, cada uma com alvo de 44 pt, marcadas só por luminância de ícone e rótulo, com **0** ponto colorido, **0** distintivo de contagem e **0** régua acima da barra. Ou seja, aplicar a regra do B11 num orçamento de espaço muito menor.

**C12 (cor).** Superar é entregar **0 botões preenchidos na tela de execução da série**, igual ao Linear, e ainda assim ter um alvo primário óbvio, marcado por área e posição em vez de preenchimento. O Linear não precisa de ação primária na lista; um app de academia precisa. Resolver isso sem preencher é o ganho. Se o preenchimento for inevitável, o teto passa a ser **exatamente 1 elemento preenchido por tela, em 100% das telas**, o que o Linear não precisa provar.

**C13 (estado vazio).** O Linear entrega estado vazio de 0% em busca. **Superar é impossível.** Onde ganhar em vez disso: um app de academia tem estados vazios com carga emocional (nenhum treino ainda, grupo sem gente). Superar é manter os **12% de altura e 0 ilustrações** mesmo nesses casos, onde a tentação de ilustração é máxima, e fazer o próprio elemento que preenche o vazio ser a única coisa na tela.

**C14 (hover).** Não se aplica em toque. **A tradução é o estado pressionado.** Superar é entregar pressionado que muda só o fundo em 1 passo, com resposta em menos de 100 ms, e **0** animação de escala. A maioria dos apps mobile falha aqui com escala e sombra; entregar a disciplina do Linear no toque já é ficar acima do padrão da categoria.

**C15 (corte em vez de reflow).** Superar é provar que passo de linha, tamanho de tipo e ordem de tokens são **bit a bit idênticos** entre a tela de lista e a mesma lista com painel aberto, entre retrato e a rolagem com teclado aberto. O Linear entrega isso no desktop, onde a largura muda pouco. No celular, entregar isso com o teclado ocupando 40% da tela é mais difícil, e portanto é ganho.
