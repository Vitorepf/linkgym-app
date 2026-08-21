# Eixo 2. OFÍCIO iOS. Referência: Things 3 (ios)

Fonte: acervo Mobbin, plataforma ios, app "Things 3". Seis consultas distintas retornaram o app (lista de hoje, seleção múltipla, upcoming e agendamento, painel When, barra lateral, projeto e logbook), mais duas buscas de fluxo. Nenhuma busca deixou de devolver Things 3.

Duas ressalvas de honestidade sobre o acervo:

1. O Things 3 tem variantes de modo claro e modo escuro no acervo. As duas foram observadas e estão citadas separadamente. O texto abaixo diz sempre qual é qual, porque o nosso alvo é escuro.
2. Não existe no acervo nenhuma tela do Things 3 com calendário de mês em página cheia. O objeto calendário só aparece de três formas: faixa embutida no topo de Hoje, tique colorido antes do evento no Upcoming, e grade de mês dentro do painel de agendamento. Isso não é lacuna do acervo, é o desenho do app.

Medidas abaixo foram lidas em capturas de 393pt de largura útil, o mesmo referencial de um iPhone 14/15 Pro. Onde o valor é estimado por contagem de pixel numa captura escalada, o texto diz "faixa" em vez de número exato.

---

## A. O que a referência faz, tela por tela

### A1. Hoje, modo claro

`https://mobbin.com/screens/724087de-2e95-47ec-926c-efbdab249a23`

A tela abre com uma estrela amarela e a palavra "Today" em corpo grande. A estrela não fica acima nem abaixo do texto: o centro óptico dela cai no centro da altura de maiúscula do título, e ela é menor que o título, cerca de dois terços da altura da caixa alta. O ícone não compete, ele indexa.

Logo abaixo vem uma faixa preenchida cinza-claro com cinco linhas de agenda. Cada linha tem hora à esquerda em coluna fixa e nome do evento depois. As horas usam cores diferentes por calendário de origem: azul, cinza, cinza, roxo, roxo. Nenhuma dessas linhas tem caixa de seleção. É por isso que o calendário não vira assunto: ele está dentro de um retângulo com fundo próprio, sem cabeçalho, sem navegação, sem alvo de toque de conclusão. O olho lê "coisa que acontece" e não "coisa para fazer" antes de ler qualquer palavra.

Dois itens concluídos aparecem no topo da lista de tarefas, dentro de uma faixa cinza-claro contínua, com caixa azul preenchida e visto branco, título em cinza médio, e o nome do projeto abaixo em cinza mais claro. Um terceiro item, "Call Mom and Dad", está no meio da animação de conclusão: um traço horizontal escuro atravessa o texto da esquerda para a direita, mais longo que a palavra, ainda em curso. A conclusão portanto tem três marcas somadas: caixa preenchida, texto rebaixado em cinza, e fundo próprio. Nenhuma delas sozinha carrega o estado.

A seção seguinte é "This Evening", com ícone de lua e uma régua fininha logo abaixo do rótulo. A régua não corre de borda a borda: ela começa depois do texto do cabeçalho e vai até a margem direita, então o cabeçalho fica "dentro" da linha em vez de flutuar sobre ela.

Botão de ação flutuante: círculo azul cheio, canto inferior direito, sem rótulo, com um sinal de mais branco centrado.

### A2. Hoje, modo escuro

`https://mobbin.com/screens/3055273e-f993-4d94-a3cb-13c1bb281726`

Mesma estrutura no escuro. Aqui está a informação que interessa para o nosso alvo: a faixa do calendário continua sendo um retângulo, mas agora ela é **mais clara** que o fundo da página, e as horas dos eventos ficam em azul e roxo dessaturados, mais escuros do que ficariam no claro. Ou seja: o mecanismo "objeto secundário mora dentro de um plano próprio" se mantém, mas a direção do contraste inverte. No claro o plano é mais escuro que a página; no escuro o plano é mais claro.

A caixa de seleção vazia no escuro é um quadrado de traço cinza médio, não branco. O título de linha é branco quase puro; o subtítulo com nome do projeto é cinza médio. A distância de luminância entre título e subtítulo é maior no escuro do que no claro.

### A3. Hoje, variantes de estado

`https://mobbin.com/screens/e90634cd-7e0b-4852-9fc6-f57a017276b6`

Uma faixa amarela com "You have 1 new to-do" e um botão "OK" ocupa a largura entre as margens, logo abaixo da faixa do calendário. Um item da lista ganha um ponto amarelo pequeno antes do título, marcando qual é o novo. Duas aparições da mesma cor, uma no aviso e uma no item, e nada mais amarelo na tela além da estrela do cabeçalho.

`https://mobbin.com/screens/2617f49d-0496-4134-8867-2b0b8327e995`

Filtro por etiqueta ativo: faixa verde-pastel com ícone de etiqueta, o nome "Important", e um X à direita. A lista abaixo já vem reduzida. O filtro se anuncia ocupando uma faixa, não um chip discreto, porque esconder itens é um estado perigoso.

`https://mobbin.com/screens/02f165ec-7df1-4ccb-9f3a-252967867d94`

Menu do botão de cabeçalho, painel escuro sobre a lista, quatro itens, cada um com um glifo à esquerda e rótulo de uma palavra ou duas: Filter by Tag, Select, Paste, Share. Os glifos ficam alinhados numa coluna própria e o texto começa todo na mesma sangria.

### A4. Área, cabeçalho leve e chips de data

`https://mobbin.com/screens/f16197bf-3c84-4272-8f80-fa8c7c03a2aa`

Título "Work" com hexágono verde vazado à esquerda e três pontos à direita. Os três itens do topo não têm cabeçalho de seção nenhum, apenas uma estrela amarela antes de cada título, indicando que estão em Hoje. Depois vem "Upcoming" com ícone de calendário rosa e a mesma régua parcial.

Nos itens de Upcoming aparece um chip cinza-claro com "Fri" antes do título. O chip é do tamanho de duas letras, altura menor que a linha, e mora na mesma coluna onde os outros itens teriam a caixa de seleção deslocada para a direita. À direita da linha, um ícone de bandeira em cinza e "4d" também em cinza: prazo, não hoje.

Ao pé, "Hide later items" em cinza médio, sem borda, sem ícone. Ação de baixa consequência recebe o menor peso tipográfico da tela.

### A5. Seleção múltipla e barra de ação flutuante

`https://mobbin.com/screens/4f8e0995-45d2-48de-a0b2-8e04435558b7`
`https://mobbin.com/screens/5bc4a73d-af7d-4e63-aca2-27d13a2b1ed1`
`https://mobbin.com/screens/d6e7f013-e95c-4203-b98f-dfe27bac343d`

Ao entrar em seleção, três coisas mudam de uma vez. Aparece uma coluna de círculos de rádio na borda direita, um por linha. Aparece um botão "Done" azul no canto superior direito, e o título "Today" **desce** para dar lugar a ele em vez de dividir a linha. E a linha selecionada recebe fundo azul-claro de borda a borda, com o rádio da direita preenchido em azul.

A barra de ação é uma pílula escura flutuante, centralizada horizontalmente, largura definida pelo conteúdo e não pela tela, com cantos generosos. Ela tem quatro alvos: "When" com ícone de calendário e rótulo, "Move" com seta e rótulo, uma lixeira sem rótulo, e três pontos sem rótulo. As duas ações que precisam de explicação recebem palavra; as duas que já são universais ficam só no glifo. A pílula flutua acima da lista com sombra, e a lista continua visível atrás dela e continua rolando.

`https://mobbin.com/screens/d982d98b-010e-441c-8830-76a99a449ada`
`https://mobbin.com/screens/6890839b-938d-4a58-b16b-a470ffd912bb`

Item aberto: um cartão branco flutua sobre a lista escurecida, sem cobrir a tela toda. Dentro, uma lista de verificação interna, com círculos azuis vazados. Os dois itens já feitos usam **visto cinza sem círculo** e texto cinza, o que é uma marca diferente da usada na lista principal, porque aqui a hierarquia é interna. Duas etiquetas aparecem como pílulas verde-pastel com texto verde-escuro. A linha de agendamento traz estrela amarela, palavra "Today", sino e "10:00 PM", tudo na mesma altura de linha. À direita, uma bandeira vazada em cinza. A pílula escura de ação continua ao pé.

`https://mobbin.com/screens/fd763141-17b8-4879-91ba-0cf983a4c434`

Mesmo cartão, mas com uma fileira de quatro glifos cinzas no canto inferior direito do cartão: calendário, etiqueta, lista, bandeira. Quatro afordâncias sem nenhum rótulo, todas do mesmo tamanho, mesma cor, mesmo espaçamento. Elas só existem quando o cartão está aberto.

### A6. Upcoming: dia como cabeçalho, evento como tique

`https://mobbin.com/screens/590f4dd6-1a6d-45a3-91c3-3508a762b041` (escuro)

O cabeçalho de cada dia é um número grande em negrito, "17", seguido do rótulo "Tomorrow" em corpo menor e cor rebaixada, na mesma linha de base. Duas informações, dois pesos, uma linha. Depois, régua fininha.

Abaixo, os eventos de calendário do dia: um traço vertical colorido de dois pontos de largura antes do nome, ou hora em azul ou roxo antes do nome. Sem caixa de seleção. Depois, as tarefas do dia, todas com caixa de seleção. A distinção entre agenda e tarefa não usa cabeçalho nem cor de fundo aqui: usa presença ou ausência da caixa de seleção. O mesmo dia comporta os dois sem virar duas listas.

### A7. Painel de agendamento: o calendário mais embutido do app

`https://mobbin.com/screens/79b21b78-f56c-4d87-8b89-466ee2ef180c`
`https://mobbin.com/screens/6675a19f-4911-443c-b127-62965cd36d9a`
`https://mobbin.com/screens/e0ee6f5f-5d6a-45f4-a2f1-3dfcb52b98b6`

Painel escuro sobre o conteúdo esmaecido, cabeçalho "When?" centralizado com "Cancel" à direita. Duas linhas de atalho antes da grade: "Today" com estrela amarela e "This Evening" com lua. Só depois vem a grade de mês, com cabeçalho de dias da semana em cinza pequeno e os números em branco. O dia de hoje não é um círculo preenchido: é uma estrela cinza na posição da data. A virada de mês não abre outra tela, aparece como "Apr 1" escrito em duas linhas na própria célula. Um chevron à direita da última semana avança o mês no lugar.

Ao fim, "Someday" com ícone de caixa e "+ Add Reminder" em cinza. Quando o lembrete é definido, a linha ganha "10:00 PM" em azul e um X de limpar, e aparecem dois botões, "Clear" em vermelho e "Done" em cinza-azulado.

Isto é o mesmo objeto calendário de A1 e A6, aparecendo pela terceira vez em três formas diferentes, e em nenhuma delas ele pede para ser o assunto. Ele nunca ganha título próprio, nunca ganha aba, nunca ganha tela cheia.

`https://mobbin.com/screens/4b5113ff-97be-4fca-b1e1-6f5c8203c384`

Folha de repetição: segmentado de dois estados no topo, parágrafo explicativo em cinza, e quatro linhas rótulo à esquerda em branco, valor à direita em azul com chevron. Abaixo, duas linhas desabilitadas em cinza-escuro, ainda visíveis, ainda no lugar. O app mostra o que não está disponível em vez de esconder.

### A8. Barra lateral: cor como índice, não como enfeite

`https://mobbin.com/screens/a5c66118-447c-49b9-9b6b-994d19799f45` (escuro)
`https://mobbin.com/screens/f71276dd-48af-4fb8-b622-a177154050ff` (claro)

Campo "Quick Find" no topo. Seis destinos, cada um com um glifo de cor própria: bandeja azul, estrela amarela, calendário rosa, camadas verdes, caixa bege, livro verde. Nenhum texto colorido, só o glifo. "Today" tem duas contagens à direita, uma pastilha vermelha com "2" e um número cinza "7": urgente e total, dois pesos, mesma linha.

Depois de uma régua, os projetos, cada um com um anel de progresso vazado que é uma fatia de pizza, não uma barra. Depois de outra régua, as áreas, com hexágono vazado e chevron de expandir. Três blocos, dois separadores, nenhum cabeçalho de seção escrito. A régua faz todo o trabalho que um rótulo faria.

`https://mobbin.com/screens/1be9e1ca-ab95-4ba8-9ec8-c4135421f580`

O botão flutuante abre um painel escuro com três opções, cada uma com título e uma ou duas linhas de descrição em cinza: New To-Do, New Project, New Area. O botão de mais mais simples do app é o que abre o menu mais explicado.

### A9. Logbook e projeto

`https://mobbin.com/screens/627a2d8f-f5bb-408e-a724-c46b9e40a769`

Cabeçalhos "Today" e "Yesterday" em negrito com régua abaixo. Cada linha concluída tem: caixa azul preenchida, um chip de data pequeno em cinza ("today", "3/15"), o título em preto cheio, e o projeto de origem em cinza abaixo. Detalhe que importa: no Logbook o título concluído **volta a ser preto**. O rebaixamento em cinza que marcava conclusão na lista de Hoje não é uma propriedade do item, é uma propriedade do contexto. Numa lista de coisas por fazer, feito é rebaixado. Numa lista de coisas feitas, feito é o assunto.

`https://mobbin.com/screens/32aaaf2f-9ad2-42c4-86fa-747852952730`

Projeto "Throw party for Eve" com anel azul vazado à esquerda do título. Duas linhas de data: calendário rosa com "Fri, Mar 31", bandeira com "Thu, Mar 30" e "14 days left" em cinza ao lado. Os itens abaixo trazem lua para This Evening, "today" em vermelho à direita para prazo vencendo, chips "Fri" e "Sat" em cinza.

Nesta captura o botão flutuante está expandido: o círculo azul cresce e nascem dois satélites cinza-escuros menores, um de arquivar e um de fechar. O botão principal não muda de lugar ao expandir.

`https://mobbin.com/screens/e8da8594-ca98-443a-b6b4-6e3cd939c80c`
`https://mobbin.com/screens/5166c152-70db-4205-9c00-8a7518ce725d`

Cabeçalho de seção dentro do projeto: texto em azul, mesmo corpo do título das linhas, com três pontos à direita e régua abaixo. Nem negrito, nem maiúsculas, nem corpo maior, nem fundo. A cor sozinha promove a linha a cabeçalho, e por isso o cabeçalho não interrompe a leitura da lista.

### A10. Vazio e criação

`https://mobbin.com/flows/b1fa3cd6-e51a-4c76-9b52-747df82afefe` (18 telas)
`https://mobbin.com/flows/1999adcb-b259-4ae5-a6f2-2ea992810fbb` (12 telas)

Projeto vazio: uma frase em cinza médio, centralizada verticalmente na área livre, em duas linhas: "Tap or drag the plus button to create a new to-do." Sem ilustração, sem botão duplicado, sem título. A frase nomeia o gesto raro (arrastar) junto com o gesto óbvio (toque).

Ao criar, um cartão branco desliza sobre o topo com "New To-Do", campo de notas, e a mesma fileira de quatro glifos. Ao pé, uma barra de confirmação com "No Project" à esquerda em azul e "Save" à direita em azul preenchido. O destino do item é editável na hora de salvar, na mesma linha do salvar.

`https://mobbin.com/screens/aed0da9d-712a-4253-a8da-f08b9b2f9d9a`

Edição de título acontece no lugar: a linha vira campo com fundo azul-claro e um botão de teclado à direita. Nenhuma tela nova para renomear uma coisa.

---

## B. A BARRA, em número

Cada item abaixo é verificável contando pixels numa captura de 393pt de largura, ou lendo os valores computados de uma tela.

**B1. Escada de tipo: cinco passos, nenhum salto consecutivo acima de 1,35.**
Na referência os passos caem em cinco degraus dentro da faixa de 13pt a 28pt: metadado e subtítulo perto de 13, rótulo secundário de dia perto de 15, título de linha e cabeçalho de seção perto de 17, número de dia no Upcoming perto de 22, título de lista perto de 28. Razão entre extremos perto de 2,15. Razão entre degraus vizinhos entre 1,13 e 1,30. A barra: no máximo 5 corpos distintos por tela, extremos entre 2,0x e 2,3x, e nenhum par de degraus vizinhos com razão acima de 1,35 nem abaixo de 1,10.

**B2. Um peso por função, no máximo três pesos por tela.**
Referência usa regular para corpo de linha, semibold para cabeçalho de seção e negrito para título de lista e número de dia. Nunca aparece negrito dentro de linha de conteúdo. A barra: no máximo 3 pesos por tela, e nenhum trecho de negrito dentro do texto de um item de lista.

**B3. Ícone de linha entre 18pt e 22pt, com desvio de base abaixo de 1pt.**
A caixa de seleção do Things fica em torno de 20pt de lado com traço de 1,5pt, e o centro dela cai no centro da altura de maiúscula do título de 17pt, não no centro da caixa de linha inteira. Isso é o que produz o alinhamento óptico quando a linha tem subtítulo abaixo. A barra: ícone de linha entre 18pt e 22pt, centro óptico dentro de ±1pt do centro da altura de maiúscula do título, e nunca centrado na altura total da linha quando existe subtítulo.

**B4. Ícone de cabeçalho entre 60% e 75% da altura de maiúscula do título que acompanha.**
A estrela de "Today" e a lua de "This Evening" são visivelmente menores que as letras ao lado. A barra: ícone de cabeçalho nunca maior que 0,80 da altura de maiúscula do título, nunca menor que 0,55, e a linha de base dele coincidindo com a do texto dentro de 1pt.

**B5. Vão entre seções pelo menos 2,5x o vão entre itens da mesma seção.**
Medido na tela de Hoje: entre linhas da mesma seção o vão de respiro fica na faixa de 10pt a 14pt; entre a última linha de uma seção e o cabeçalho da seguinte, na faixa de 30pt a 38pt. A barra: razão mínima de 2,5x, e a distância entre cabeçalho e primeira linha da própria seção sempre menor que a distância entre a última linha e o cabeçalho seguinte, por fator de ao menos 1,8x.

**B6. Cabeçalho de seção sem fundo, sem caixa alta, sem corpo maior. No máximo um recurso de promoção por cabeçalho.**
No Things o cabeçalho de projeto usa só cor (azul). O cabeçalho de seção de Hoje usa só peso mais ícone. Nunca usa fundo, nem caixa alta, nem borda. A barra: nenhum cabeçalho de seção com preenchimento de fundo, e no máximo dois entre {peso, cor, ícone} ativos ao mesmo tempo, nunca corpo maior que o título da linha.

**B7. Régua de cabeçalho abaixo de 8% de contraste local e nunca de borda a borda.**
A régua sob "This Evening" começa depois do texto e termina na margem. Espessura de 0,5pt a 1pt, contraste muito baixo. A barra: régua de seção com espessura máxima de 1pt, contraste local abaixo de 8% do delta entre fundo e texto de corpo, e recuo inicial de pelo menos a largura do rótulo do cabeçalho.

**B8. No máximo 4 cores de significado por tela, cada uma com no máximo 3 aparições, e cada cor com um único significado no app inteiro.**
Em Hoje modo claro contei quatro: azul (interativo e concluído), amarelo (hoje), vermelho (prazo vencendo), verde (etiqueta). Cinza não conta, é ausência de cor. O bloco de calendário é o único lugar onde tons extras aparecem (roxo, azul de calendário), e ele está cercado por um plano próprio. A barra: no máximo 4 cores de estado fora de contêineres de objeto secundário, cada uma no máximo 3 vezes por tela, e nenhuma cor com dois significados diferentes em duas telas diferentes.

**B9. Estado concluído com três marcas simultâneas, e o rebaixamento sendo do contexto, não do item.**
Referência: caixa preenchida, texto rebaixado, plano de fundo próprio. E no Logbook o mesmo item volta a ter texto cheio. A barra: conclusão marcada por ao menos 3 sinais independentes numa lista de pendências, e o mesmo registro apresentado em contraste cheio quando visto numa lista cujo assunto é o feito.

**B10. Objeto calendário embutido: sem título, sem navegação, sem alvo de conclusão, ocupando no máximo 18% da primeira dobra.**
A faixa de agenda no topo de Hoje ocupa em torno de 85pt a 100pt de uma dobra de aproximadamente 740pt, algo entre 11% e 14%. Ela não tem cabeçalho de seção, não tem botão de mês, não tem chevron, e nenhuma de suas linhas é tocável para concluir. A barra: contêiner de objeto secundário sem título próprio, sem controle de navegação temporal, com zero alvos de conclusão, e no máximo 18% da altura da primeira dobra.

**B11. O objeto secundário aparece em pelo menos duas formas diferentes e em nenhuma delas ganha aba ou tela cheia.**
Things mostra calendário como faixa, como tique de evento no Upcoming e como grade dentro do painel de agendamento. Zero telas dedicadas. A barra: pelo menos 2 apresentações distintas do objeto secundário, e zero rotas de navegação de primeiro nível dedicadas a ele.

**B12. Distinção agenda contra tarefa por ausência de afordância, não por cor.**
No Upcoming, evento e tarefa dividem o mesmo dia, o mesmo corpo e a mesma coluna. O que separa é que o evento não tem caixa de seleção. A barra: quando dois tipos de registro convivem numa mesma lista, a diferença principal deve ser a presença ou ausência de um controle, e a cor deve ser sinal secundário, verificável apagando a cor da captura e ainda distinguindo os tipos.

**B13. Barra de ação flutuante: largura pelo conteúdo, no máximo 4 ações, no máximo 2 com rótulo, altura de 48pt a 56pt, e a lista continua visível e rolável atrás.**
A pílula do Things ocupa por volta de 60% da largura da tela, não 100%. Rótulo só em "When" e "Move". A barra: barra flutuante nunca de borda a borda, no máximo 4 alvos, rótulo apenas nas ações ambíguas, altura entre 48pt e 56pt, folga inferior de 20pt a 32pt acima da área segura, e conteúdo por baixo permanecendo legível e rolável.

**B14. Entrada em seleção múltipla muda no mínimo três coisas de uma vez e não reaproveita o alvo de conclusão.**
Things acrescenta coluna de rádio à direita, botão "Done" no topo, e realce de linha inteira. A caixa de seleção da esquerda continua sendo conclusão, nunca vira seleção. A barra: modo de seleção com ao menos 3 mudanças visuais simultâneas, saída sempre visível, e o controle de seleção fisicamente separado do controle de conclusão por pelo menos 200pt de distância horizontal.

**B15. Botão de ação flutuante: 52pt a 60pt de diâmetro, sem rótulo, sem sombra dura, e ele não se move ao expandir.**
No Things o botão tem em torno de 56pt, fica a cerca de 24pt da borda direita, e quando expande cresce no lugar e faz nascer satélites de aproximadamente 40pt. A barra: diâmetro entre 52pt e 60pt, margem de 20pt a 28pt das duas bordas, sem texto, e ao expandir o centro do botão desloca menos de 8pt.

**B16. Alvo de toque nunca abaixo de 44pt de altura efetiva, inclusive quando o glifo tem 20pt.**
Caixa de seleção de 20pt dentro de linha de 44pt ou mais. Chips e glifos de metadado só são alvos quando a linha inteira é o alvo. A barra: nenhum alvo com área efetiva abaixo de 44x44pt, e nenhum par de alvos distintos com centros a menos de 44pt um do outro.

**B17. Toda ação de baixa consequência recebe o menor peso da tela, e nenhuma ação destrutiva tem cor de destaque enquanto não é iniciada.**
"Hide later items" é cinza sem borda. A lixeira na pílula é branca como as outras, não vermelha. O vermelho só aparece em "Clear" dentro de um painel já aberto. A barra: zero elementos em cor de alerta em estado de repouso, e ao menos uma ação secundária por tela renderizada abaixo do peso de corpo.

**B18. Estado vazio: no máximo duas linhas de texto, zero ilustrações, e a frase nomeia o gesto.**
A barra: estado vazio com no máximo 2 linhas, sem imagem, sem botão duplicando o botão flutuante já presente, e mencionando explicitamente o gesto de entrada.

**B19. Renomear e editar nunca abrem tela nova.**
A barra: zero navegações de página para editar o texto de um registro existente; edição sempre no lugar ou em cartão sobreposto que preserva o contexto visível atrás.

**B20. Cartão de detalhe sobreposto cobre no máximo 70% da altura e mantém a lista reconhecível atrás.**
No Things o cartão de item aberto deixa duas ou três linhas da lista visíveis acima e abaixo. A barra: painel de detalhe sobreposto ocupando entre 40% e 70% da altura, com pelo menos duas linhas do contexto original ainda legíveis.

---

## C. O que contaria como SUPERAR

Regra de leitura: "empate" é reproduzir o número. "Superar" é entregar o número **e mais uma coisa que a referência não faz**. Quando a referência é teto, o texto diz que é teto.

### C0. O que do Things não transfere para o escuro

Seis critérios da seção B dependem de mecânica de modo claro e precisam de substituto, não de cópia. Isto não é opcional: copiar o Things no escuro produz uma tela pior que o Things.

1. **Faixa cinza-claro sob item concluído (B9).** No claro, cinza-claro sobre branco é rebaixamento. No escuro, qualquer faixa mais clara que o fundo é **promoção**: o item feito passa a ser a coisa mais brilhante da lista. Não transfere. Substituto no escuro: manter as três marcas, mas trocar a faixa por queda de opacidade do texto para a faixa de 40% a 50%, visto vazado em vez de preenchido, e zero mudança de fundo. Verificação: numa captura em escala de cinza, o item concluído tem luminância média **menor** que a do item ativo.
2. **Régua de 0,5pt de baixo contraste (B7).** No claro, cinza sobre branco a 6% funciona. No escuro, uma régua escura desaparece e uma clara grita. Substituto: régua de 1px a 8% a 10% de branco, ou nenhuma régua e apenas o vão de B5 fazendo o trabalho. Verificação: a régua tem que sobreviver a uma captura reduzida a 50% sem virar nem invisível nem linha dura.
3. **Botão flutuante azul saturado sobre branco (B15).** No escuro, azul saturado de 56pt sangra halo e vira o ponto mais quente da tela, competindo com todo estado. Substituto: reduzir croma, adicionar borda interna de 1px mais clara para definir a silhueta contra o fundo, e garantir que o botão flutuante nunca seja o elemento de maior luminância da tela. Verificação: existe pelo menos um pixel de conteúdo mais claro que o pixel mais claro do botão.
4. **Faixa amarela de aviso (B8).** Amarelo saturado ocupando faixa larga no escuro é o pior vizinho possível de qualquer outro estado. Substituto: faixa de fundo escuro, com tique vertical de 3px na cor do aviso e texto em branco. A cor entra por 3px de largura, não por 350pt. Verificação: a área em pixels ocupada pela cor de aviso cai para menos de 5% da área da faixa.
5. **Pílula de etiqueta verde-pastel (A5).** Pastel no escuro perde contraste com o texto e com o fundo ao mesmo tempo. Substituto: fundo da pílula em verde muito escuro, texto em verde claro, contraste de texto contra pílula acima de 4,5:1 e contraste da pílula contra a página acima de 1,4:1.
6. **A direção do contraste do contêiner do objeto secundário (B10).** No claro o plano do calendário é mais escuro que a página; no escuro tem que ser mais claro. A regra transferível não é "cinza claro", é "plano próprio a uma distância de 4% a 8% de luminância da página, na direção que se afasta do fundo".

### C1 a C20. Critério por critério

**C1, escada de tipo.** Things é teto prático aqui. Cinco degraus com razões entre 1,13 e 1,30 é escada bem feita e não há ganho em ter seis. Superar exige mudar de terreno: entregar a mesma escada de cinco degraus **e** um degrau adicional que o Things não tem, o número de desempenho em corpo grande, na faixa de 40pt a 56pt, aparecendo em no máximo um lugar por tela e apenas em telas de resultado. Escada de seis degraus com razão de extremos perto de 3,5x, sem quebrar B2. Se o número grande aparecer em duas telas seguidas, o critério está perdido, não ganho.

**C2, pesos.** Teto. Três pesos com regra de nunca negritar dentro de linha é o certo. Superar não é possível por adição. O ganho equivalente está em C1: usar corpo, não peso, para a única informação que precisa gritar.

**C3, alinhamento de ícone na linha.** Teto absoluto. Centrar no centro da altura de maiúscula em vez do centro da linha é a decisão correta e não tem versão melhor. Empatar aqui já é caro. Superar só existe na variante que o Things não tem: quando a linha carrega três níveis de texto em vez de dois, o ícone continua ancorado na primeira linha com desvio abaixo de 1pt. O Things nunca tem três níveis, então cumprir isso é território novo, não superação do mesmo critério.

**C4, ícone de cabeçalho.** Teto. Superar exige uma condição extra que o claro não impõe: no escuro, o glifo de cabeçalho colorido precisa manter contraste acima de 3:1 contra o fundo escuro **sem** aumentar de tamanho para compensar. Cumprir a proporção de 0,55 a 0,80 e ainda passar 3:1 é acima da referência, porque o Things resolve isso com o branco atrás.

**C5, vão entre seções.** Superar é possível e mensurável: razão de 3,0x ou mais, e a razão sendo **constante** em todas as telas do app, com variação abaixo de 2pt entre telas. O Things varia um pouco entre Hoje, área e projeto. Constância verificável é ganho real.

**C6, cabeçalho leve.** Superar é entregar a promoção com **um único** recurso em vez de dois. O Things usa cor no projeto e peso mais ícone em Hoje. Um app que promove todo cabeçalho de seção usando exclusivamente cor, sem nunca mudar peso nem adicionar ícone, e mantendo legibilidade no escuro, está acima. Difícil, porque no escuro cor sozinha carrega menos que no claro.

**C7, régua.** Não transfere (ver C0.2). Superar no escuro é eliminar a régua por completo e sustentar a separação apenas com o vão de C5, sem que um crítico cego reclame de "onde termina a seção". Se a régua for necessária, o critério está empatado na melhor das hipóteses.

**C8, orçamento de cor.** Aqui está a melhor chance de superar de verdade. O Things usa quatro cores de estado. Um app de academia no escuro que resolva o mesmo trabalho com **três** cores de estado, cada uma com no máximo 2 aparições por tela, e com o quarto significado codificado por forma em vez de cor, fica acima. Verificação dura: converter a captura para escala de cinza e ainda distinguir todos os estados. O Things não passa nesse teste, porque hoje contra prazo vencido depende de amarelo contra vermelho.

**C9, estado concluído.** Superar é entregar as três marcas **e** a inversão de contexto do Logbook, e ainda uma quarta marca que o Things não tem: a permanência. No Things o item feito sai da lista. Um app de academia pode manter o feito visível, rebaixado, no mesmo dia, e mostrar quantos ainda faltam sem que o feito roube atenção. Se o feito visível aumentar a luminância média da tela, o ganho virou perda.

**C10, objeto secundário embutido.** O Things é teto em disciplina, não em quantidade. Superar é cumprir os mesmos zeros (sem título, sem navegação, sem alvo de conclusão, no máximo 18% da dobra) e ainda fazer o contêiner **desaparecer** quando está vazio, sem deixar espaço reservado. O Things mantém a faixa mesmo com pouca coisa dentro. Colapso total a zero pixels é acima da referência.

**C11, formas do objeto secundário.** Empatar exige duas formas. Superar exige três formas com zero rotas dedicadas, e a terceira forma tendo que ser silenciosa: aparecer somente quando o registro tem data, e não deixar rastro na tela quando não tem.

**C12, distinção por ausência de afordância.** Teto conceitual, e o teste em escala de cinza é a prova. Superar só acontece se o app tiver **três** tipos de registro convivendo na mesma lista e ainda passar no teste em escala de cinza. Com dois tipos, o máximo possível é empate.

**C13, barra de ação flutuante.** Superar é possível: no máximo 3 ações em vez de 4, com rótulo em no máximo 1, mantendo a largura por conteúdo e a rolagem por baixo. Menos alvos com o mesmo alcance é ganho. Se o app precisar de 5 ações, perdeu, e nenhum acabamento visual compensa.

**C14, seleção múltipla.** Superar é entregar as três mudanças simultâneas **e** eliminar a necessidade da coluna de rádio à direita, resolvendo a seleção com realce de linha mais contagem no topo, sem acrescentar controle novo à linha. O Things acrescenta uma coluna e por isso a lista fica mais estreita em modo de seleção. Não estreitar a lista é acima da referência.

**C15, botão de ação flutuante.** Não transfere na cor (C0.3). Nos números é teto. Superar exige a coisa que o Things não faz: o botão flutuante precisa mudar de função conforme o contexto sem mudar de posição nem de tamanho, e o rótulo dessa função tem que aparecer em algum lugar da tela que não seja o próprio botão. Deslocamento do centro abaixo de 4pt entre contextos, contra os 8pt que aceitamos como empate.

**C16, alvo de toque.** Teto. 44pt é piso da plataforma e o Things o respeita. Não existe superação, existe cumprimento. O ganho vizinho é distância entre centros: 48pt em vez de 44pt entre alvos distintos, o que reduz toque errado num aparelho segurado com uma mão suada. Esse é o único lugar do eixo em que o contexto de academia justifica ficar acima da referência de produtividade.

**C17, ação destrutiva e peso.** Teto. Zero cor de alerta em repouso é o certo. Superar exige a etapa que o Things não tem: destrutivo com desfazer visível por tempo medido, sem diálogo de confirmação. Se aparecer um diálogo modal de "tem certeza", o critério regrediu abaixo da referência.

**C18, estado vazio.** Superar é duas linhas ou menos, zero ilustração, gesto nomeado, **e** o estado vazio nunca aparecendo duas vezes com o mesmo texto em telas diferentes. O Things reusa a mesma frase. Frase específica por contexto, sem ilustração e sem botão, é acima.

**C19, editar no lugar.** Teto. Zero navegações para renomear. Superar é ampliar o alcance: nenhuma navegação de página para **nenhuma** edição de campo único no app inteiro, incluindo campos numéricos. Um único caso de tela dedicada a editar um número derruba o critério.

**C20, cartão sobreposto.** Superar é manter as duas linhas de contexto legíveis atrás **e** garantir que o escurecimento do fundo não passe de 55% de opacidade, para que o contexto continue de fato legível e não apenas visível. No escuro isso é mais difícil que no claro, porque escurecer um fundo já escuro achata tudo. A alternativa que ficaria acima: não escurecer nada e separar o cartão do fundo apenas por elevação e borda de 1px.

### C-final. Onde este eixo se ganha e onde se perde

Ganha-se em três lugares: orçamento de cor mais apertado que o do Things com prova em escala de cinza (C8), constância métrica do vão entre telas (C5), e distância entre centros de alvo acima do piso da plataforma por causa do contexto físico (C16).

Perde-se em três lugares, e vale saber antes: alinhamento óptico de ícone (C3), disciplina de destrutivo (C17) e edição sem navegação (C19) são teto. Ali o trabalho é empatar sem tropeçar, e qualquer pixel a menos é derrota direta.
