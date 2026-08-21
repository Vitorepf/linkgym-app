# Barra do eixo 3: COMPONENTES. Referência: Stripe (web)

Fonte: acervo Mobbin, plataforma web. Toda tela citada abaixo foi aberta e descrita a partir da imagem, não do metadado.

Uma busca do lote não devolveu Stripe e fica registrada aqui:

- busca por formulário do Stripe com erro de validação em linha e banner de aviso no topo devolveu Workable, Link, Evernote, Mercury, Claude, Turo, Substack e Later. **Nenhuma tela do Stripe Dashboard.** O critério de erro (B7) foi montado a partir da tela do **Link**, que é produto do próprio Stripe mas não é o Dashboard, e isso está marcado no texto. Não trate B7 como observação do Dashboard.

---

## A. O que a referência faz, tela por tela

### A1. Tabela de transações com cartões de aba e popover de data
https://mobbin.com/screens/4bbb46ff-471b-494d-a543-4e5075d63788

O filtro por estado no topo não é um controle segmentado nem uma fileira de chips: são **seis retângulos com borda**, cada um com um rótulo pequeno em cinza e um número grande embaixo ("All 6", "Succeeded 1", "Refunded 0", "Disputed 0", "Failed 3", "Uncaptured 0"). O selecionado troca borda cinza por **borda roxa de 2 px** e pinta rótulo e número de roxo. Não há preenchimento. Seleção é borda mais cor de texto.

Abaixo, uma fileira de **chips de filtro** com glifo "⊕" à esquerda: "⊕ Date and time", "⊕ Amount", "⊕ Currency", "⊕ Status", "⊕ Payment method", "⊕ More filters". Cada um é contorno, sem preenchimento. À direita, "⇧ Export" e "⚙ Edit columns" com o mesmo tratamento de contorno.

O popover de data abre ancorado no chip, com borda de 1 px e sombra. Dentro dele há **exatamente um botão preenchido**: "Apply", roxo, largura total do popover.

Na página, o único preenchido é "+ Create payment" no topo direito. Ao lado, "Analyse" é contorno. Contagem de roxo na camada base: item ativo da barra lateral (texto), cartão de aba selecionado (borda mais texto), "Create payment" (preenchido), o "+" circular no canto superior direito. Quatro ocorrências, uma só preenchida.

Há também uma faixa de recomendação acima da tabela: glifo, "Recommendation" em rótulo, texto corrido, um link de ação à direita ("Install Xero") e um "✕". Fundo levemente diferente do painel, sem borda, dispensável.

### A2. Tabela com popover de colunas e os selos de estado
https://mobbin.com/screens/140880ca-003b-4498-8932-c09c223ed9de

Aqui os selos aparecem inteiros. Três variantes na mesma coluna:

- "Succeeded ✓": preenchimento verde claro, texto verde escuro, glifo de check.
- "Failed ✕": preenchimento rosa claro, texto vermelho escuro, glifo de "✕".
- "Incomplete ⓘ": preenchimento cinza claro, texto cinza escuro, glifo de informação.

**Todo selo carrega três coisas: preenchimento, palavra e glifo.** Nenhum depende só de cor. Raio pequeno, uma palavra apenas, altura pouco acima da altura de linha do corpo.

A primeira coluna é o valor, alinhado à esquerda mas com o número em peso médio e o código de moeda ("USD", "MYR") logo depois em cinza secundário e peso regular. Duas informações no mesmo campo, separadas só por peso e cor.

Cada linha da tabela tem uma **régua fininha embaixo**. Não há listras alternadas, não há réguas verticais. Campos sem valor recebem um travessão curto em cinza apagado em vez de ficarem em branco.

O popover "Edit columns" separa "Fixed columns" de "Active columns" só por rótulo, mostra caixas de seleção roxas marcadas e uma alça de arrastar de seis pontos à direita de cada item.

### A3. Tabela com popover de filtro por estado
https://mobbin.com/screens/78430f40-1d9b-45de-8c03-d25b8e33d728

O popover de filtro lista estados com caixa de seleção vazia. Botão "Apply" roxo preenchido na base, largura total. Enquanto nada está marcado, o chip "⊕ Status" continua neutro.

### A4. Filtro aplicado, chip com valor
https://mobbin.com/screens/373146e1-8686-43b0-8a10-5da707dc8873

Com dois estados marcados, o chip vira "Status: Cancelled, Blocked ▾" e o valor fica em acento, o rótulo fica em cinza. Aparece um botão de texto "Clear filters" à direita da fileira, que **não existia** antes de haver filtro. Ao lado, "Date and time: Last 3 days ▾" com o mesmo padrão. O chip preenchido não muda de forma, muda de conteúdo e de cor de texto.

### A5. Tabela sem selos
https://mobbin.com/screens/77a572a2-5002-41ce-8d89-964c5c9fc35a

Extrato de saldo. Aqui não há selo nenhum: o tipo de lançamento é **texto em peso médio na primeira coluna** ("Refund Failure" forte, "Refund" mais fraco, "Charge" forte). Valores negativos vêm entre parênteses em cinza secundário, não em vermelho. O Stripe não gasta cor onde peso resolve. Cabeçalho de coluna em maiúsculas pequenas, cinza, com uma régua abaixo. Paginação "Previous / Next" como dois botões de contorno desabilitados no canto inferior direito.

### A6. Diálogo
https://mobbin.com/screens/0e0a134f-11bb-435d-bc59-23da4d8e753b

O diálogo "Export" ocupa cerca de **33% da largura e 17% da altura** da janela. O véu atrás **clareia** a página em direção ao branco, não escurece. Dentro: título em peso forte, duas linhas de corpo com um link inline, um "✕" no topo direito e **exatamente um botão preenchido** no canto inferior direito. Nada mais.

### A7. Lista com selo de estado permanente
https://mobbin.com/screens/bbc81130-2236-4c92-971a-2dc2c396d472

Lista de links de pagamento. Nome em peso médio, selo "Active" verde claro ao lado, preço na coluna seguinte com uma segunda linha em cinza ("+1 currency"), data de criação, e "···" no fim da linha. O botão "+ New" no topo direito carrega uma **tecla de atalho desenhada** dentro do próprio botão preenchido.

### A8. Checklist de configuração do Connect
https://mobbin.com/screens/032c6d85-93ec-4828-9fe4-8a86a631d654

Sete linhas de tarefa, cada uma com: glifo à esquerda (check verde preenchido se concluída, glifo de contorno cinza se pendente), rótulo "Optional" acima do título quando cabível, título em peso médio, uma linha de descrição em cinza, e um botão à direita. Dos botões visíveis, **exatamente 1 é roxo preenchido** ("Get started" da verificação de identidade). Todos os outros são brancos com borda de 1 px ("Edit", "Get started", "View", "Get started"). Um está desabilitado, mantendo o formato de contorno com texto apagado.

A regra fica explícita aqui: numa tela com sete ações do mesmo tipo, **a hierarquia é feita escolhendo uma para preencher**, não mudando tamanho nem posição.

### A9. Checklist de billing, mesma gramática
https://mobbin.com/screens/0f4ab008-c3d5-46cd-9e88-4e788a240607

Seis tarefas, cinco com check verde, uma com glifo de olho. Cinco botões de contorno e **1 roxo preenchido** ("Start"), justamente na única tarefa não concluída. O botão preenchido marca o próximo passo, não a ação mais importante em abstrato. Descrições contêm links inline em azul dentro do parágrafo cinza.

### A10. Formulário
https://mobbin.com/screens/5c0ef31a-48e9-43bc-a728-a6228cec150c

Anatomia do campo, de cima para baixo: **rótulo** acima, pequeno, cinza escuro, peso regular; **campo** com fundo branco, borda de 1 px, raio quase nulo; **texto de ajuda** abaixo, no mesmo tamanho do rótulo, em cinza, podendo carregar link inline ("Learn more about..."). O espaço entre o texto de ajuda de um campo e o rótulo do próximo é visivelmente maior que o espaço entre rótulo e campo, na casa de 3x.

A trilha de progresso à esquerda usa numeral em círculo preenchido para o passo atual, numeral em círculo de contorno para os futuros, e sub-passos como texto recuado com marcador minúsculo. O passo atual da lista de sub-passos é o único texto colorido.

"Continue →" é o único preenchido da tela, com glifo direcional dentro.

### A11. Formulário com seletor aberto e botão desabilitado
https://mobbin.com/screens/a7864100-4bc0-4d56-86b2-e6703ea11bf3

O seletor de banco abre uma lista com campo de busca no topo, itens em **azul de link**, cada item com régua fininha embaixo. Abaixo, o "Continue" está desabilitado e mantém o **mesmo roxo com saturação e luminância reduzidas**, texto branco por cima. O Stripe não acinzenta o desabilitado: ele desbota o próprio acento. O contraste do texto branco sobre esse roxo desbotado cai bastante.

### A12. Cartões selecionáveis
https://mobbin.com/screens/c82b52f7-b3df-4fba-a8b3-3e59c3e70c68

Duas opções como cartões. O selecionado ganha **borda roxa de 2 px** mais um anel externo claro; o outro fica com borda cinza de 1 px. Nenhum dos dois é preenchido. Dentro do cartão: título em peso médio, duas linhas de descrição, e um botão de texto "Show more ⌄" em acento. Embaixo, "Back" de contorno e "Continue" preenchido, lado a lado, mesma altura, mesmo raio.

### A13. Revisão com selo de pendência e submissão desabilitada
https://mobbin.com/screens/6e3fdb2a-dca2-4c0e-a349-046eedf754a9

Cartões de revisão com borda de 1 px, título de seção fora do cartão. Dentro, pares rótulo e valor empilhados, com "Edit" como botão de texto em acento no topo direito de cada cartão. Um dos blocos carrega o selo "Incomplete" em rosa claro com texto vermelho, e ao lado um botão de texto "Add". Ao pé, "Agree and submit" preenchido em **roxo desbotado** ocupando a largura da coluna: desabilitado sem perder a forma.

### A14. Revisão final
https://mobbin.com/screens/7a1e1a52-db4d-46fe-9740-61036f6821e0

Três cartões de borda de 1 px, cada um com "Edit" em acento no topo direito. Rótulos de campo em cinza pequeno, valores logo abaixo em cinza escuro. Dados sensíveis vêm mascarados por barras cinza sólidas. Um único tamanho de tipo para tudo dentro do cartão, mais o título de seção fora dele.

### A15. Abertura de fluxo
https://mobbin.com/screens/d670c548-b885-417a-8122-f65da3dc2803

Duas colunas: à esquerda título grande, parágrafo, duas linhas com glifo e texto, e um botão roxo preenchido de largura fixa; à direita, três itens numerados sem círculo, só o numeral em cinza claro à esquerda do título. **Zero cartões, zero bordas** nesta tela. A separação é puramente espaço.

### A16. Estado vazio, cupons
https://mobbin.com/screens/4889befe-28c6-4dc6-8131-3aa9e316dd13

O bloco vazio tem **quatro partes e nada mais**: um glifo dentro de um quadrado cinza claro de canto arredondado, um título de uma linha ("No coupons"), duas linhas de corpo em cinza, um link "Learn more →" e um botão roxo preenchido ("+ Create coupon" com tecla de atalho desenhada). Tudo alinhado à esquerda numa coluna, não centralizado. O bloco ocupa cerca de **24% da altura** do painel e fica no terço superior, não no centro vertical.

**Falha da própria referência:** o mesmo botão roxo preenchido já existe no topo direito da página. A tela tem **dois preenchidos idênticos** ao mesmo tempo.

### A17. Estado vazio, tarifas de frete
https://mobbin.com/screens/0e51dae9-65d8-44b9-8541-287ba63a435b

Mesmo esqueleto de quatro partes, com o mesmo defeito: "Create shipping rate" preenchido no topo direito e "+ Create shipping rate" preenchido no bloco vazio.

### A18. Estado vazio, tabela de preços
https://mobbin.com/screens/0bc4fa17-a5de-4af7-a8f6-3fd5f45a1a7e

Idem. O título do bloco é imperativo ("Create a pricing table") e o botão repete o mesmo verbo. **Título e botão sempre compartilham o verbo.**

### A19. Estado vazio, taxas
https://mobbin.com/screens/741c48a0-2983-4e5d-ad6c-97af8529811c

Idem, com três linhas de corpo em vez de duas. O corpo nunca passa de três linhas.

### A20. Estado vazio degradado
https://mobbin.com/screens/5606b88c-aac5-4298-a9cc-5d02963275ce

Aqui o bloco vazio é **só glifo mais título mais uma linha**, sem link e sem botão, porque a ação já existe como "+ Create template" preenchido no topo. Quando o botão sai do bloco vazio, ele some do bloco. A tela não fica com dois.

### A21. Estado vazio sem ação
https://mobbin.com/screens/ba72cc6a-153e-43d4-81db-dcd9703bdd17

Vazio que o usuário não pode preencher diretamente ("No test balance transactions"): glifo, título, duas linhas e apenas um link "Learn more →". **Zero botões.** O Stripe não inventa uma ação quando não há ação.

### A22. Aviso transitório
https://mobbin.com/screens/5a903fc1-b123-430d-8ac1-1ad2c752417a

Pílula **escura, no topo, centralizada**, ocupando cerca de 18% da largura e uma linha de altura. Glifo de check verde mais quatro palavras ("Chargeflow has been uninstalled."). **Zero botões, zero dispensa, zero link.** Sobrepõe a barra de busca sem escurecer nada.

### A23. Painel inicial, cartões sem borda
https://mobbin.com/screens/54ef3db8-2b9e-4ef3-a91a-cad15de1e1c9

Seis blocos de métrica em grade de três colunas. **Nenhum deles tem borda.** O que separa é espaço horizontal e uma régua fininha de largura total entre as duas fileiras. Cada bloco: título em peso médio com um "ⓘ" ao lado, conteúdo, e um rodapé com "View more" em acento à esquerda e "Updated 11:18" em cinza apagado à direita. Barras de proporção coloridas (roxo, azul, laranja) com legenda de pontinhos coloridos e valor alinhado à direita.

### A24. O mesmo painel em modo de edição
https://mobbin.com/screens/673e89af-fe9e-4ab9-ac27-435dedf21888

Ao entrar em edição, **todos os blocos ganham borda de 1 px e raio**, cada um ganha um "✕" no topo direito, e o botão "Edit" cinza vira "Done" roxo preenchido. A borda apareceu porque o cartão virou objeto manipulável. **No Stripe, borda não é decoração: é o sinal de que aquilo é uma peça que você pode pegar.**

### A25. Modo de edição com vaga vazia
https://mobbin.com/screens/3ac28d1f-3058-4190-a369-ab4e5ef27a42

A grade mostra uma vaga com **borda tracejada** e "+ Add" ao centro. Tracejado é reservado para "aqui cabe um objeto que ainda não existe". Só aparece em modo de edição.

### A26. Painel de relatórios, quando o cartão volta a ter borda
https://mobbin.com/screens/6e67d584-93ed-426b-908a-e467c2ab6a18

Dois cartões lado a lado **com borda** mesmo fora do modo de edição: "Gross volume MYR 2.00" e "Net volume MYR 0.92". Aqui a borda existe porque os dois precisam ser lidos como unidades comparáveis. Abaixo, os gráficos da mesma página ficam **sem cartão nenhum**, direto sobre o fundo, separados por réguas de largura total. Três tratamentos de agrupamento na mesma página: sem caixa, caixa sem borda, caixa com borda.

### A27. Início com bloco de introdução e popover de agradecimento
https://mobbin.com/screens/b573d219-043a-4aa0-af43-3bde497b53fc

O bloco "Get started with Stripe" é o único elemento com fundo levemente diferente na página, contendo duas miniaturas de produto com imagem real. À direita dele, um cartão de contorno com "Explore all products ›" e um bloco de chaves de API com o selo "Live mode" em verde claro. Um popover de agradecimento flutua no canto superior direito, com glifo grande, duas linhas e assinatura, sem botão.

### A28. Estado global do sistema toma a borda da janela
https://mobbin.com/screens/d7461782-27a7-41e9-aa99-ac528bcd4fca

Em modo de teste, uma **faixa laranja de largura total** cobre o topo da janela inteira, o alternador de modo fica laranja, e o rótulo "Test mode" no topo fica laranja. Dentro da página, um banner amarelo claro com glifo, texto, um link e um botão de contorno ("Advance time"). Estado global do sistema é a única coisa que pinta uma faixa de borda a borda.

### A29. Gráficos e cor categórica
https://mobbin.com/screens/0073f205-693c-49dc-b0a9-3cd0c60295dc

Barras roxas para a série principal, azul para o recorte geográfico, cinza tracejado para a linha de comparação. Legenda de pontinho colorido mais rótulo, sempre abaixo do gráfico. Entre gráficos, régua de largura total. Frases de leitura em texto corrido acima de cada gráfico, com os números em peso médio no meio da frase.

---

## B. A BARRA, em número

**B1. Botão preenchido, orçamento por tela.** **Exatamente 1** botão preenchido por camada. Numa tela com N ações do mesmo tipo, a razão contorno para preenchido é de **pelo menos 5:1**. Um popover ou diálogo aberto tem direito ao seu próprio preenchido, e nunca mais de 1. **Estado vazio não pode duplicar o preenchido que já está no cabeçalho**: quando o cabeçalho tem o botão, o bloco vazio fica sem, e vice-versa. Contagem exigida na captura: **1 preenchido, sempre**, nunca 2.

**B2. Botão secundário.** Preenchimento **idêntico ao fundo do painel** (ΔL* menor que 1), borda de 1 px medindo **1,25:1 a 1,55:1** contra esse fundo, e texto medindo **no mínimo 11:1**. A razão entre contraste de texto e contraste de borda é de **pelo menos 7**. Altura, raio e recuo interno **idênticos** aos do preenchido: só o preenchimento muda.

**B3. Botão fantasma.** Só texto, na cor de acento, sem borda e sem fundo. Sempre acompanhado de glifo direcional quando leva para fora do contexto. **Nunca** usado para ação que cria, paga ou destrói. Área de toque real de **no mínimo 44 pt** mesmo com a caixa visual menor.

**B4. Desabilitado.** Mantém a **mesma matiz** do estado ativo, com o preenchimento caindo para **2,2:1 a 3,0:1** contra o painel e o texto de dentro caindo para **1,8:1 a 2,6:1** contra o preenchimento. Forma, altura e raio inalterados. **Zero** troca por cinza, **zero** mudança de tamanho, **zero** remoção do glifo.

**B5. Campo de formulário, ritmo vertical.** Rótulo acima, ajuda abaixo, **mesmo tamanho** e **mesmo cinza** para os dois. A razão entre o espaço que separa um grupo de campo do próximo e o espaço entre rótulo e campo fica entre **2,5 e 3,5**. Borda do campo em **1,25:1 a 1,50:1**. Altura do campo de **no mínimo 44 pt**.

**B6. Campo de formulário, contagem de partes.** No máximo **3** elementos de texto por campo (rótulo, ajuda, mensagem), e a ajuda tem no máximo **2 linhas**. Um campo nunca carrega rótulo interno e rótulo externo ao mesmo tempo.

**B7. Erro.** *(Evidência: tela do Link em https://mobbin.com/screens/0ef97473-a1fd-459a-95e6-2520d9de9664, não do Stripe Dashboard, conforme registrado no topo deste documento.)* **3 portadores redundantes** por erro: cor de borda, glifo e texto. O texto fica **diretamente abaixo do campo culpado**, nunca só num resumo no topo. Se houver banner de topo, ele repete o mesmo glifo e a mesma matiz. Contraste do texto de erro contra o fundo de **no mínimo 4,5:1**, e a borda de erro medindo **no mínimo 3x** o contraste da borda neutra.

**B8. Selo de estado.** **3 portadores** em 100% dos selos: preenchimento, palavra e glifo. **Nenhum** selo distinguível só por matiz. **1 palavra** apenas. Altura de **no máximo 1,5x** a altura de linha do corpo. **No máximo 1** selo por linha de lista. O texto do selo mede **no mínimo 4,5:1** contra o próprio preenchimento, e o preenchimento mede **1,15:1 a 1,6:1** contra o fundo da linha.

**B9. Chip de filtro.** Sem valor: contorno neutro com glifo de adição à esquerda. Com valor: **mesma forma, mesmo tamanho**, texto do rótulo em cinza e valor em acento, mais um chevron. **Zero** mudança de largura de borda, **zero** preenchimento. O botão de limpar filtros **só existe** enquanto houver ao menos 1 chip com valor.

**B10. Cartão e borda.** Borda é estado, não decoração. Regra conferível: **número de bordas na tela é menor ou igual ao número de objetos que o usuário pode mover, remover ou selecionar**. No modo de leitura, agrupamento por espaço e por régua de largura total, com **0 bordas**. Vaga que ainda não existe recebe **traçado tracejado**, e tracejado não aparece em mais nenhum lugar do app. Cartão selecionado troca borda de 1 px por **2 px em acento**, sem preenchimento.

**B11. Estado vazio.** Bloco de **no máximo 26%** da altura do painel, no terço superior, alinhado à esquerda da coluna de conteúdo. **No máximo 4** partes: glifo em caixa neutra, 1 linha de título, até 3 linhas de corpo, 1 ação. O título é imperativo e o botão **repete o verbo do título**. Quando a ação não existe para o usuário, o bloco fica com **0 botões** e apenas 1 link.

**B12. Tabela e lista de dados.** Passo de linha entre **2,4x e 2,9x** o tamanho do tipo de corpo. **1** régua fininha por linha, medindo **no máximo 1,3:1**. **0** listras alternadas, **0** réguas verticais. Célula vazia recebe um travessão curto em cinza apagado, nunca fica em branco. **No máximo 8** colunas visíveis, e a partir daí existe um controle explícito de escolha de coluna. Valor e unidade coexistem no mesmo campo separados por **peso e cor**, não por coluna nova.

**B13. Racionamento do acento.** **No máximo 4** ocorrências do acento na camada base de uma tela, das quais **exatamente 1** é preenchida. **0%** dos pixels do corpo da tabela ou da lista carregam acento. Soma de área do acento: **no máximo 2%** dos pixels da tela. Cor de acento **nunca** aparece em régua, fundo de painel, borda de cartão neutro ou ícone de navegação inativo.

**B14. Cor categórica.** Reservada a série de dado e a selo de estado. **0** cores categóricas no cromo. Legenda sempre presente quando há mais de 1 série, com pontinho colorido mais rótulo. Estado global do sistema é a **única** coisa autorizada a pintar uma faixa de borda a borda, e existe **no máximo 1** faixa dessas por vez.

**B15. Diálogo.** Ocupa **no máximo 35%** da largura e **no máximo 25%** da altura. Contém **1** título, **no máximo 2** linhas de corpo, **1** dispensa no topo e **exatamente 1** preenchido no rodapé. O véu **clareia ou escurece em no máximo 1 passo** de luminância: o conteúdo atrás continua legível.

**B16. Aviso transitório.** Pílula de **no máximo 20%** da largura, **1 linha**, **no máximo 6 palavras**, **1** glifo de estado, **0** botões, **0** links, **0** dispensa. Some sozinho. Posição fixa e única no app inteiro.

---

## C. O que contaria como SUPERAR

**C1 (preenchido por tela).** O Stripe define a regra e **quebra a própria regra** em pelo menos três estados vazios, onde o mesmo botão roxo aparece duas vezes. Superar é fácil de enunciar e difícil de manter: **exatamente 1 preenchido em 100% das telas do app, sem exceção**, incluindo os estados vazios, o recibo de série e a tela de descanso. Auditoria: contar preenchidos em toda captura do fluxo e nunca achar 2.

**C2 (secundário).** Empate quase certo em tema claro. **Em modo escuro é mais difícil e é onde dá para ganhar**: manter borda em 1,25:1 a 1,55:1 sobre fundo escuro sem que ela desapareça no OLED exige acertar a borda por cima do fundo, não por baixo. Superar é entregar a mesma razão de 7 entre contraste de texto e de borda **com o preto real do OLED como fundo**, coisa que o Stripe nunca precisou provar.

**C3 (fantasma).** Superar é garantir **44 pt de área de toque em 100% dos fantasmas**, algo que o Stripe não entrega porque é web com mouse: os "View more" e "Learn more" dele são alvos de altura de texto. Num app de academia usado com a mão suada, essa é uma vitória limpa e mensurável.

**C4 (desabilitado).** O Stripe desbota o acento e leva o texto branco para perto de 2:1. Isso é **ruim** e é a brecha mais óbvia do conjunto. Superar é entregar desabilitado que mantenha matiz e forma **e** mantenha o texto em **no mínimo 4,5:1** contra o preenchimento desbotado. Ficar acima aqui não é sutileza: é corrigir uma falha de acessibilidade da referência.

**C5 (ritmo do campo).** Empate provável, o Stripe é limpo aqui. Ganho possível: no celular o teclado come 40% da tela e o Stripe nunca lidou com isso. Superar é manter a razão de 2,5 a 3,5 entre grupos **com o teclado aberto**, sem colapsar a ajuda nem empurrar o rótulo para dentro do campo.

**C6 (partes do campo).** **Teto do Stripe, superar por contagem é impossível**, 3 elementos já é o mínimo funcional. Onde ganhar em vez disso: um app de academia tem campos de número (carga, repetição) que podem dispensar rótulo e ajuda por completo, usando a unidade dentro do próprio campo. Chegar a **1 elemento de texto por campo em pelo menos metade dos campos** é ganho real de componente.

**C7 (erro).** O Dashboard do Stripe não apareceu com erro no acervo, então **não há teto medido aqui**. Isso é oportunidade, não desculpa. Superar é entregar os 3 portadores redundantes **mais** uma quarta garantia que o Stripe não dá: o campo culpado rolar para a área visível acima do teclado, sempre, e o foco ir para ele. Mensurável: em 100% dos erros, o campo culpado está visível sem rolagem manual.

**C8 (selo de estado).** O Stripe já entrega 3 portadores em 100% dos selos. **Superar por contagem é impossível.** Onde ganhar: o Stripe usa selo em toda linha de tabela, o que faz a palavra do estado aparecer dezenas de vezes numa tela. Um app de academia pode entregar os mesmos 3 portadores **e** limitar a repetição, colocando a palavra no cabeçalho de grupo e deixando só o glifo na linha. Isso é o critério B7 do documento do Linear aplicado por cima da anatomia do Stripe: pegar o rigor de um e a economia do outro é o único jeito de ficar acima dos dois.

**C9 (chip de filtro).** Empate acessível. Ganho possível: o Stripe precisa de um botão separado de "limpar filtros". Superar é fazer o próprio chip carregar a remoção, sem botão extra na fileira, mantendo os 44 pt de alvo tanto no corpo do chip quanto no "✕". Reduz de 2 controles para 1 sem perder função.

**C10 (cartão e borda).** Borda como estado é a ideia mais forte da referência e o Stripe **é teto nisso**. Superar por rigor é impossível: ele já entrega 0 bordas no modo de leitura. Onde ganhar: o Stripe usa três tratamentos de agrupamento na mesma página (sem caixa, caixa sem borda, caixa com borda). Um app de academia que resolva com **2 tratamentos no app inteiro** e ainda mantenha a regra borda igual a objeto manipulável fica acima por consistência.

**C11 (estado vazio).** Superar é entregar **no máximo 18% da altura**, contra 26% do Stripe, e **0 ilustrações decorativas**, mantendo glifo neutro. E resolver o defeito da referência: nunca duplicar o preenchido. Extra que conta como ganho: quando a ação não existe para o usuário, entregar **0 botões**, como o Stripe faz no saldo vazio, em vez de inventar um destino.

**C12 (tabela e lista).** **Superar em densidade de tabela é impossível e é a pergunta errada**: um app de 430 px de largura não tem tabela de 8 colunas. A tradução justa é a linha de lista. Superar é carregar **valor mais unidade mais estado mais tempo numa linha de 44 pt** com 1 régua de no máximo 1,3:1, 0 listras e 0 réguas verticais, ou seja, a disciplina de célula do Stripe dentro de um alvo de toque que ele nunca precisou respeitar.

**C13 (racionamento do acento).** O Stripe roda com 4 ocorrências e 1 preenchida. **Superar é chegar a 2 ocorrências e 1 preenchida** na tela principal, o que só fecha se a navegação ativa for marcada por luminância em vez de cor. É o critério mais fácil de enunciar e o mais fácil de perder por descuido, porque cada tela nova tenta trazer o acento junto.

**C14 (cor categórica).** Empate provável, o Stripe é rigoroso. Ganho possível: o Stripe tem uma faixa laranja de borda a borda para modo de teste. Um app de academia tem estados globais legítimos (descanso rodando, série em andamento). Superar é entregar esse estado global **sem faixa de borda a borda**, marcando só o elemento que carrega o tempo, e ainda assim ser inconfundível.

**C15 (diálogo).** No celular o diálogo centralizado é pior que a folha inferior. Superar é entregar o mesmo orçamento de conteúdo do Stripe (1 título, 2 linhas, 1 preenchido, 1 dispensa) numa folha que **nasce do polegar**, com o preenchido dentro do alcance do polegar, e véu de no máximo 1 passo. Menos deslocamento de mão para o mesmo conteúdo é ganho mensurável.

**C16 (aviso transitório).** O Stripe já entrega 0 botões, 0 links e 0 dispensa em 4 palavras. **Superar por economia é praticamente impossível.** Onde ganhar em vez disso: o Stripe põe a pílula no topo, sobre a barra de busca, longe do polegar e longe de onde a ação aconteceu. Um app de academia pode ancorar o aviso **adjacente ao elemento que mudou**, mantendo as mesmas 6 palavras e 0 controles. Mesma economia, melhor endereço.
