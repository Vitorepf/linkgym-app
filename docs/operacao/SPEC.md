# A OPERAÇÃO DO PERSONAL — spec do ciclo 7

> Produzida por 7 lentes especializadas + júri triplo (viabilidade, valor ao personal, ofício)
> e uma síntese. Antes dela, uma auditoria de 13 agentes achou 34 defeitos confirmados na tela
> de hoje. Esta spec é a resposta.

## A tese

A Operação inteira — receita, ticket, "em aberto", risco, e tudo que as sete propostas construíram em cima — repousa num gesto digitado à mão que ninguém instrumentou, ninguém barateou, e cujo modo de falhar não é ficar em branco: é MENTIR NA PIOR DIREÇÃO, porque "em aberto = ausência de linha" torna o esquecimento do personal indistinguível de calote. Então a Fase 1 faz três coisas que nenhuma das sete fez juntas: torna o gesto valioso (o Pix copia-e-cola nasce na própria linha, então abrir a lista passa a fazer dinheiro chegar mais rápido), dá a ele uma segunda fonte (o aluno ganha o verbo "Já paguei", que não marca nada e não cobra ninguém — vira um nome para o dedo do personal confirmar), e projeta o estado em que ele parou de marcar (a tela escreve "nada marcado em agosto ainda" em vez de acusar a turma inteira). O resto é consequência: um único elemento visual, que só existe porque tocá-lo produz nomes; risco como frase verificável e nunca como número; e zero migração de tabela de dinheiro — tudo aditivo, porque a coisa mais cara que se pode fazer nesta rodada é mexer no fato financeiro que já funciona.

## Decisões travadas

### [Fase 1] A rota órfã ganha tela, e ela nasce em lote

Nova tela src/screens/owner/Combinado.tsx, uma só, dois modos. Modo LOTE (do rodapé de Operação): topo com "Mesmo valor para todos" [R$ ___] [dia __], depois uma linha por aluno sem combinado — Initials + nome + [R$ ____] + [dia __] — e DockFooter [Guardar os 8]. Modo UM (de Aluna.tsx): a mesma linha, sozinha, footer [Guardar]. Salvar dispara N PUT em paralelo em /v1/owner/mensalidades/{bond_id}, que JÁ EXISTE (cmd/api/main.go:80, Service.DefinirMensalidade). Nova função putMensalidade em src/api.ts — hoje ela não existe: confirmei por grep que NENHUMA linha do app chama essa rota. Zero backend novo, zero migration, zero rota de lote transacional: a linha que falhar fica vermelha com o valor preservado e o botão vira [Tentar os 3].

**Por que venceu.** Hoje o personal literalmente não consegue cadastrar quanto o aluno paga, então os quatro números da Operação são zero na vida real e toda a proposta acima deles é aritmética sobre nada. É o maior valor dividido pelo menor custo do documento inteiro: ~120 linhas de React Native contra uma rota já escrita e testada. E em lote porque um estúdio de 28 alunos com preço tabelado não tem 28 combinados, tem 1 combinado e 28 vínculos — 28 × 4 toques é a diferença entre cadastrar 3 para experimentar e cadastrar a turma.

<sub>origem: Consenso 7/7 das propostas e 3/3 dos juízes. O juiz técnico: "se apenas uma linha desta rodada virar código, é essa". A forma em lote vem da proposta de ofício e da do dashboard; o juiz de ofício a defendeu como "a primeira tela do produto em que a caixa de seleção fica sobre NOMES", que é literalmente a regra escrita em docs/barra/eixo2/NOTAS.md §2.</sub>

### [Fase 1] O ALUNO GANHA O VERBO — a peça que faltou nas sete

Tabela ja_paguei (bond_id, month, dito_em), PK composta. No app do aluno, em src/screens/student/Perfil.tsx, UMA linha: "Mensalidade de agosto · R$ 350 · todo dia 5" + botão [Já paguei]. Depois do toque: "Avisado. O Fred confirma quando ver." Rota POST /v1/student/ja-paguei. Do lado do personal, isso vira a PRIMEIRA linha de "Em aberto": "Marina diz que já pagou · R$ 350" com [Recebi] ao lado. A linha some sozinha quando o pagamento entra (NOT EXISTS em mensalidade_pagamentos). REGRA GRAVADA NO CÓDIGO: essa linha do aluno NUNCA muda de tom — nunca diz "vencido", "atrasado" ou "em aberto", nunca fica vermelha, nunca vira push. Ela só enuncia o combinado.

**Por que venceu.** O aluno é a única outra pessoa do sistema com incentivo PRÓPRIO para corrigir um "em aberto" errado, e em seis das sete propostas ele não tem como dizer nada. Custa 4 colunas e ~30 linhas, e é o que impede o modo de falha mais caro do produto: no mês em que o personal parar de marcar, a tela grita que a turma inteira deve, a fila de risco enche de falso positivo, e a credibilidade da fila — o ativo inteiro do lado do personal — morre em uma semana. E respeita a lei da casa inteira: o app não cobra, não notifica, não bloqueia; ele transforma a memória de uma pessoa ocupada num nome para o dedo de outra.

<sub>origem: NENHUMA das sete propostas tinha isto. É a correção do ponto cego que o juiz de ofício nomeou no veredito_geral ("ninguém dá ao aluno o verbo") e que os três juízes cercaram por três lados: o técnico ("ninguém mede se ele ainda marca no mês 2"), o personal ("a Fase 1 de TODAS elas é escrituração"), o de ofício ("o esquecimento é indistinguível do calote"). As duas propostas que chegaram mais perto — a linha "Do Fred" no Perfil e o "Quero pagar pelo app" — abriram a porta e não fecharam o circuito.</sub>

### [Fase 1] O app se recusa a mentir quando ele para de marcar

Quando NINGUÉM foi marcado no mês corrente (em_aberto.length == com_mensalidade) E já passou do dia 10, a barra do mês NÃO desenha e o número herói NÃO imprime "R$ 0". No lugar: título "Nada marcado em agosto ainda." / corpo "Se você já recebeu, marque — senão a conta de agosto fica errada." A lista de em aberto continua, sem faixa de aperto e sem contagem no cabeçalho. E o rodapé de Operação passa a carregar a data: "Última marcação: 12 de julho."

**Por que venceu.** É a diferença entre um produto que degrada e um que se autodestrói. "R$ 0 recebidos" e "28 em aberto" são afirmações sobre o negócio dele que o app não tem como sustentar — ele não sabe se ninguém pagou ou se ninguém marcou, e afirmar a primeira quando é a segunda é o app chamando a turma inteira de caloteira. Custa um IF e duas frases.

<sub>origem: Ponto cego comum, apontado pelos três juízes por caminhos diferentes. A lei de forma já está compilada no repo: o comentário de src/ui/Baseline.tsx diz que "uma baseline falsa é PIOR que nenhuma" — não desenhar é a resposta certa, não existe placeholder.</sub>

### [Fase 1] O BR Code Pix nasce como CAMPO, não como rota — e sem txid

ALTER TABLE studios: chave_pix, nome_recebedor, cidade_recebedor. Digitados uma vez em Aparencia/PerfilTime, campo "Sua chave Pix", dica embaixo: "É pra cá que o dinheiro do aluno vai. A LinkGym não toca nele." O backend monta o payload EMV MPM estático COM valor — campos 00, 26 (GUI br.gov.bcb.pix + chave), 52, 53=986, 54=valor, 58=BR, 59=nome, 60=cidade, 63=CRC16-CCITT/FALSE — em ~40 linhas de Go, zero dependência, zero cadastro. O campo 62-05 (txid) NÃO entra na Fase 1. O copia_e_cola viaja como CAMPO dentro do payload de GET /v1/owner/operacao e no retorno de POST /v1/owner/cobrancas: nenhuma rota nova, nenhum round-trip a mais. Na linha, botão [Pix]: um toque copia e a linha responde "Copiado. Manda pra ela."

**Por que venceu.** Derrubei o veto do juiz de ofício porque ele custa dinheiro real ao personal, que é a única condição prevista para isso — mas apliquei o argumento dele para matar a metade especulativa. O veto acertou sobre o TXID e errou sobre o COPIA-E-COLA: o código funciona e a aluna paga independentemente de o banco preservar o txid, que era o único elemento incerto. Sem txid, sobram ~40 linhas de EMV com um teste de CRC16 contra um payload conhecido do manual do BCB, e o personal para de digitar a chave na mão no WhatsApp e de receber R$300 em vez de R$350 porque a aluna leu errado. O txid entra na Fase 2, quando existir um provedor que de fato concilie por ele. E é campo em vez de rota porque o dado é derivado de dois números que a tela já tem.

<sub>origem: A proposta de rails. Voto de qualidade: o juiz de ofício VETOU o gerador na Fase 1 ("trabalho especulativo com nome de degrau", porque o txid pode não sobreviver ao banco emissor). O juiz de valor — o personal — chamou a mesma peça de melhor ideia das sete propostas inteiras: "é a única peça em sete propostas que faz o dinheiro chegar mais rápido AMANHÃ", e no veredito_geral a nomeou como uma de apenas DUAS peças de todo o documento que movem dinheiro na Fase 1.</sub>

### [Fase 1] [Recebi] continua em UM toque. O meio e o desfazer moram no recibo

O botão da linha muda de rótulo "Pago" para "Recebi" e continua sendo UM toque: grava meio='mao' e o valor cheio congelado. A linha NÃO some e nenhum diálogo aparece — o slot do botão vira o recibo, "Recebi · 08:12", e o recibo é o alvo do desfazer, com janela infinita. Tocar o recibo chama DELETE /v1/owner/mensalidades/{bond_id}/pagar, cujo SQL é travado em `AND meio = 'mao'`: pagamento de provedor nunca some por toque errado, e a regra da Fase 2 já está escrita hoje de graça. Sem coluna desfeito_em, sem soft-delete, sem índice parcial: um dedo errado não é um fato, e "em aberto = ausência de linha" sobrevive intacto.

**Por que venceu.** O veto do ofício fica de pé e vale mais do que a proposta percebeu: se o gesto ficar mais caro, ele para de fazê-lo, e o produto inteiro é aritmética sobre esse gesto. Guardar o meio ainda acontece — só que pelo padrão, não pela pergunta. Valor parcial é o único caso que perde, e ele volta quando doer: a coluna amount_cents já existe, então parcial vira uma mudança de VALOR, nunca de schema. Diálogo é o preço do irreversível; cobrar esse preço pelo reversível é cobrar duas vezes pelo mesmo toque.

<sub>origem: O rótulo e o meio vêm da proposta de rails; o desfazer-sem-diálogo vem da proposta de ofício, elogiado pelos três juízes. O juiz de ofício VETOU a folha de 2 toques da proposta de rails ("o eixo mede OPERAÇÃO"), e o personal confirmou pelo motivo real: "eu marco pago com a mão de outra pessoa embaixo de um agachamento, e um toast de 4 segundos é uma corrida que eu perco".</sub>

### [Fase 1] Congelar o valor no fato, e um relógio civil brasileiro

Duas correções de defeito vivo, ~30 linhas somadas. (a) ALTER TABLE mensalidade_pagamentos ADD COLUMN amount_cents integer NOT NULL DEFAULT 0, com UPDATE de backfill a partir de mensalidades, e PagarMensalidade passa a gravar o valor no momento do fato. (b) Uma função hoje() e uma competencia() em internal/owner, ancoradas em America/Sao_Paulo, mais `import _ "time/tzdata"` no main. Os dois call-sites de time.Date(..., time.UTC) em operacao.go passam a chamá-las, e o `current_date` da query de risco vira `$2::date` ligado a hoje().

**Por que venceu.** São bugs, não features. Hoje, aumentar o combinado de R$300 para R$350 em maio REESCREVE o que entrou em janeiro, porque o valor é lido de mensalidades na hora da consulta — dinheiro do passado que muda de valor é o bug que ninguém acha e que destrói a confiança em todo número da tela. E hoje, dia 31 às 21h em São Paulo já é dia 1º em UTC: a Operação vira o mês antes da hora e a turma INTEIRA aparece em aberto. Um ALTER, um UPDATE, doze linhas de Go. Sem pacote novo, sem teste-polícia de grep — o juiz técnico vetou a polícia e manteve o conserto.

<sub>origem: (a) é a melhor ideia da proposta de dashboard segundo o juiz técnico — "a única correção de DEFEITO REAL do conjunto que ninguém mais viu". (b) é da proposta de arquitetura; o mesmo juiz confirmou o bug lendo o código, e o personal disse que é o bug que o faria fechar o app para sempre.</sub>

### [Fase 1] Risco: seis sinais, uma frase, uma ação na linha, teto de três. Zero número.

internal/owner/risco.go, uma query sobre tabelas que já existem, chamada por Operacao() e pela fila de atenção — UMA computação, dois consumidores. Sem score, sem pesos somados, sem tabela nova: um CASE de prioridade escolhe o sinal MAIS FORTE e ele vira a frase da linha. Na ordem: (1) dinheiro+sumiço, em aberto ≥5 dias E ≥7 sem treinar → "R$ 350 em aberto há 12 dias, e 9 sem treinar" → [Recebi]; (2) queda contra a linha DELA, sessões dos últimos 14d < metade da média das 8 semanas anteriores, exigindo ≥6 sessões de base → "Treinava 4x por semana. Fez 1 nas últimas duas" → [Mandar]; (3) silêncio do personal, ≥21 dias sem prescriptions.published_at → "Você não publica para ela há 21 dias" → [Publicar]; (4) sessão aberta e não fechada nos últimos 21 dias → "Começou e não terminou, terça" → abre a pessoa; (5) sumiço puro ≥7 dias → "Sumiu faz 11 dias" → [Mandar]; (6) estreante, vínculo <60 dias com <3 sessões → "Estreou há 12 dias. Fez 1" → [Publicar]. Máximo TRÊS linhas, nunca quatro. Lista vazia é resposta legítima: "Ninguém em risco hoje. As 28 estão dentro da linha delas." [Mandar] abre o WhatsApp DELE com rascunho editável (people.phone é NOT NULL UNIQUE desde 00001) e grava um toque ANTES de abrir o link. Regra: NÃO existe rascunho de WhatsApp para o motivo dinheiro — ali a ação é [Recebi] e [Pix], e a frase de cobrança é dele.

**Por que venceu.** "Extremamente assertivo" não se compra com modelo, se compra com o denominador certo e com um fato conferível. A regra de hoje trata igual quem treinava 4x e sumiu há 5 dias (perdeu) e quem treina 1x e faltou uma semana (não perdeu nada). E um percentual é infalsificável para quem lê: o personal não tem como saber que "78%" está errado, então ou obedece sem julgar ou ignora. Três fatos ele confere contra a própria memória em dois segundos ("ah, ela viajou") e a fila continua merecendo confiança. O sinal (3) é o único que aponta o dedo para ELE, e num produto cujo migration 00010 diz que a presença dele é a única coisa que se vende, é o sinal certo. Teto três porque, na letra da doutrina, o trabalho é tocar em três hoje: um quarto nome não aumenta o trabalho feito, aumenta a culpa.

<sub>origem: Os sinais e a métrica contra a própria linha vêm da proposta do cientista de dados; a frase-em-vez-de-número e o denominador certo vêm também da de ofício, que chegou lá por outro caminho; o wa.me com rascunho foi a melhor ideia das sete segundo o juiz de valor. O corte do score veio de VETO explícito do personal ("pesos entregues como se fossem fato, sem nenhum jeito de eu saber que estão errados").</sub>

### [Fase 1] Produto na Fase 1 é uma cobrança avulsa de dois campos, não um catálogo

Tabela cobrancas_avulsas (bond_id, descricao text 1..60, valor_cents, criada_em, recebida_em, meio). Em Aluna.tsx, botão "Cobrar à parte" → folha com DOIS campos livres, descrição e valor → [Criar] → a folha já mostra "Copiar o Pix". Entra na lista "Em aberto" da Operação com a descrição na linha ("Marina · Avaliação física · R$ 150") e o mesmo [Recebi]. Sem categoria, sem foto, sem estoque, sem frete, sem variante, sem SKU, sem carrinho, sem prateleira. Nenhuma aba nova em nenhum dos dois lados.

**Por que venceu.** Decidi contra o juiz de ofício aqui, e o argumento é o pedido do próprio dono: "pouquíssimos cliques, do jeito mais simples possível". Cadastrar um objeto (5 toques) para depois vendê-lo uma vez (3 toques) é mais caro que dois campos (2 toques) para o caso que existe hoje — avaliação física, whey do porta-malas, aula avulsa. O enum de 4 tipos é uma boa taxonomia e o que ele acrescenta de verdade é a RECORRÊNCIA, que é a Fase 3 e que tem um gatilho verificável: quando o mesmo personal digitar a mesma descrição três meses seguidos, o produto pede para virar produto. E o veto sobre o instrumento de pagamento fica gravado como regra: a folha de criação já mostra o Pix, ou a peça não sai.

<sub>origem: A proposta de negócio ("cobrança avulsa, não catálogo"). O juiz de ofício preferia o enum fechado de 4 tipos com cardápio de modelos da proposta de comércio; o juiz de valor VETOU exigir criar um objeto de catálogo antes de cobrar ("cobrança avulsa é uma linha, não um produto") e vetou entregar ofertas sem instrumento de pagamento junto ("ganhei uma segunda caixa de promessas para perseguir").</sub>

### [Fase 1] A saída é DEDUZIDA do silêncio e CONTRADITA pelo personal — nunca assinada por ele

Tabela saidas (bond_id PK, ultima_presenca, ultimo_mes_pago, confirmada_em), com ultima_presenca CONGELADA no ato. A seção "SUMIRAM", abaixo da dobra, lista quem está há 60 dias sem sessão E sem pagamento, com um botão só: [Ainda é minha]. NÃO responder é o rótulo positivo — passados mais 30 dias sem contradição, a linha entra em saidas e o vínculo vai para status='ended', que o CHECK de bonds aceita desde 00001 e que NENHUMA linha de Go jamais escreveu (confirmei por grep). Tocar [Ainda é minha] grava um toque e a pessoa some da seção por 60 dias.

**Por que venceu.** Sem evento de saída não existe rótulo, e sem rótulo toda promessa de assertividade — hoje e daqui a um ano — é infalsificável. Mas há um ganho que se paga sozinho antes de qualquer modelo: hoje quem cancelou em março continua contando em student_count, receita_cents e ticket_cents para sempre, então os quatro números da Operação estão errados e sobem sozinhos. A inversão preserva o rótulo e remove o imposto de culpa: admitir custa, desmentir não custa, e o silêncio é a resposta que o personal já dá de graça.

<sub>origem: A tabela e o argumento do rótulo vêm do cientista de dados — o achado mais profundo das sete. A INVERSÃO é veto do juiz de valor: "deduza pelo silêncio e me deixe DESMENTIR, nunca me obrigue a assinar o atestado de óbito", porque a própria proposta admitia que o personal mentiria por otimismo.</sub>

### [Fase 1] A memória do que ele fez: applied_at no lugar do DELETE, e o único agregado que sobrevive

ALTER TABLE attention_items ADD COLUMN applied_at timestamptz. Em internal/owner/attention.go:48, `DELETE FROM attention_items WHERE id = $1` vira `UPDATE attention_items SET applied_at = now() WHERE id = $1`, e loadAttention ganha `AND a.applied_at IS NULL`. O campo `Applied bool` do struct Attention (service.go:50) — declarado, serializado e nunca preenchido — passa a valer. Mais a tabela toques (studio_id, person_id, motivo, created_at), gravada ao ABRIR o WhatsApp. Delas sai a ÚNICA estatística agregada do produto, no rodapé da Operação: "Você tocou em 7 pessoas este mês. 5 voltaram a treinar." — duas contagens inteiras, computadas de toques × sessão fechada em 14 dias.

**Por que venceu.** Hoje, toda vez que o personal age sobre a fila, o sistema destrói o registro de que sinalizou aquela pessoa e de que ele agiu. Uma coluna, uma linha de SQL trocada e um AND devolvem isso. E o placar é o número que o faz abrir a lista amanhã e o único que nenhum concorrente sabe lhe dar. A versão preguiçosa colhe o mesmo sinal de calibração do risco_diario vetado — ~1000 linhas por ano em vez de 10 mil, sem job, sem infraestrutura que falha calada na quinta-feira.

<sub>origem: O applied_at é a menor diff das sete propostas segundo o juiz técnico. O placar foi eleito pelo juiz de ofício como a melhor ideia daquela lente: "o único agregado que mede o comportamento DELE em vez do dos alunos". O juiz de ofício VETOU a tabela risco_diario (snapshot diário da turma inteira por job) e o técnico vetou a premissa do job — a tabela `jobs` existe desde 00002 e confirmei que nenhuma linha de Go a toca.</sub>

### [Fase 1] A dobra: um número com âncora, três nomes, e a última coisa visível é uma pessoa

Morre o MetricGrid de quatro cartões empilhados. No lugar, UMA peça: valor R$ 7.850 em Figure role="hero" com unit "R$" unitFirst, rótulo RECEBIDO EM AGOSTO, nota "de R$ 10.500 combinado", e abaixo uma barra de 10pt cuja largura total é o combinado, com três segmentos — recebido / a vencer / vencido — e legenda escrita. Segmento não-zero tem largura mínima de 3pt e o valor SEMPRE sai por escrito. O segmento vencido é o único tocável: rola até a lista de nomes. O cartão "RECEITA DO MÊS R$ 10.500" morre porque ele soma o CONTRATADO e chama de receita, incluindo quem não pagou — a tela mente para o personal sobre o próprio faturamento. Alunos e Ticket médio saem da dobra. Zero biblioteca nova: são três Views com flex.

**Por que venceu.** Três palavras que ninguém compara viram três cartões que ninguém lê. Numa barra, a relação entre elas é a própria geometria: o recebido é uma FRAÇÃO do combinado e o olho lê a fração sem ler número nenhum. E some a mentira mais cara da tela de hoje. Os quatro números não perdem informação ao encolher — perdem prioridade, que é o ponto: a dobra passa a terminar dentro de "Vai sumir", em cima de gente.

<sub>origem: A proposta de dashboard. Endossada pelos três juízes; o de ofício mapeou a dobra em pt e cravou a lei "a última coisa dentro da dobra é uma PESSOA, nunca um total, nunca um gráfico, nunca um espaço em branco", verificável com tools/shots.mjs, que já existe no repo.</sub>

### [Fase 1] Um gráfico só, no fim da tela, e ele é um acordeão que devolve nomes

A FITA: uma coluna por mês fechado com recebido no mês, no RODAPÉ da Operação, abaixo de todas as listas de nomes. Só desenha a partir de DOIS meses fechados — nunca placeholder, nunca coluna zerada, nunca eixo inventado. Tocar uma coluna a substitui, no lugar, por "JUNHO · R$ 9.100 · 26 pagaram" e a lista dos nomes daquele mês, com [voltar]. Não filtra nenhuma outra seção da tela: é um componente fechado, sem estado vazando para cima. Nenhum percentual em lugar nenhum da Operação. Nenhum segundo gráfico.

**Por que venceu.** Esta é a resolução da tensão central, e a formulo mais forte do que as sete: o gráfico só existe se mostrar a FORMA de um fato que o personal não consegue guardar na cabeça, E se tocá-lo produzir um nome. Ele sabe os 28 nomes; não sabe a forma da própria receita ao longo do tempo, e número solto não tem forma. A tela Retenção da referência é condenada por ter exatamente dois toques disponíveis, "Ver gráficos" e "O que significam essas métricas?", que levam a mais leitura — o defeito é topológico, não estatístico. Aqui cada coluna termina numa lista de gente. E o piso de dois meses é a lei que src/ui/Baseline.tsx já compilou: uma baseline falsa é pior que nenhuma.

<sub>origem: Resolução convergente das sete lentes ("todo elemento visual tem que produzir um NOME quando tocado"), na forma mais barata — a da proposta de rails e a da de negócio. A ponte/waterfall da proposta de dashboard levou VETO TRIPLO, dos três juízes.</sub>

### [Fase 1] Fase 1 NÃO migra tabela de dinheiro. Tudo aditivo.

mensalidades fica intacta, byte por byte: ela É o combinado. mensalidade_pagamentos só recebe duas colunas com DEFAULT. As queries de internal/owner/operacao.go continuam idênticas letra por letra. Nada de livro-razão de sinal, nada de espelho+diário, nada de DROP TABLE, nada de expand/contract, nada de janela de deploy. A migration 00011 é exclusivamente ALTER ... ADD COLUMN e CREATE TABLE.

**Por que venceu.** É o sinal cruzado mais forte de todo o material. Quatro das sete propostas gastam a Fase 1 mexendo em tabela de dinheiro que já funciona, e nenhuma dessas linhas move um Real. O livro-razão de sinal da proposta de arquitetura é o melhor desenho do lote para o dia em que existir webhook fora de ordem — e é exatamente por isso que ele é Fase 2: hoje não existe provedor, logo não existe estorno, logo não existe disputa, logo o desenho resolve um problema que ainda não chegou. E fazer a unificação DEPOIS custa dez vezes mais só se ela for feita sobre fato conciliado; feita aditivamente agora, ela não é feita, que é mais barato ainda.

<sub>origem: Convergência dos vetos: o juiz técnico vetou a migração de uma frase da proposta de rails; o de ofício vetou o DROP de mensalidades da proposta de ofício, apontando a coluna nullable da proposta de comércio como caminho seguro; o de valor vetou a ordem inteira da proposta de arquitetura. A regra escrita pelo juiz de ofício: "quando duas propostas divergem no custo e convergem no resultado, a spec final leva a barata, nunca a completa".</sub>

### [Fase 1] Uma computação de risco, nunca duas listas com duas regras

O bloco riscoRows de internal/owner/operacao.go sai de lá e vira internal/owner/risco.go, chamado tanto por Operacao() quanto pelo carregador da fila de atenção. As constantes riscoIdleDays=7 e riscoIdleComAbertura=3 morrem. A seção da Operação passa a se chamar "VAI SUMIR · 3" e carrega a frase e o botão da ação — nunca mais só um chevron que navega. NÃO renomeio abas, NÃO mexo na barra de navegação, NÃO movo PerfilTime e NÃO apago Atencao.tsx nesta fase.

**Por que venceu.** Se as duas contagens divergirem uma única vez, o personal para de confiar nas duas, e a credibilidade da fila é o ativo inteiro do lado dele. Mas o defeito é a DUPLICAÇÃO DA REGRA, não o nome da aba: uma função com dois chamadores conserta o defeito inteiro. Reorganizar a barra e apagar telas é bom trabalho e é Fase 3, porque não muda nada na manhã do personal e engorda uma release que ninguém consegue revisar.

<sub>origem: O corte mais valioso do lote segundo o juiz de ofício, verificado: a MESMA pessoa aparece hoje em duas abas, com dois limiares (dias>=7 em operacao.go, o enum student_stopped em attention_items) e duas ações — no Painel a decisão se aplica na linha, na Operação a linha só navega. O juiz técnico e o de valor vetaram a SIMULTANEIDADE do resto do pacote ("renomear aba não paga aluguel").</sub>

### [Fase 2] Fase 2: Asaas, e a recorrência é refém do CNPJ do personal

Provedor: Asaas, com subconta no CPF/CNPJ do PERSONAL e a cobrança emitida por ela; a LinkGym recebe só a taxinha por split e NUNCA custodia o dinheiro. Stripe está descartado por fato verificado: para empresa sediada no Brasil o Pix na Stripe é apenas para convidados (support.stripe.com/questions/how-to-enable-pix-as-a-payment-method-in-brazil), e o Pix é o trilho principal do produto; a taxa Stripe é 1,19% percentual contra R$1,99 fixo do Asaas (asaas.com/precos-e-taxas — R$0,99 nos 3 primeiros meses; cartão à vista R$0,49+2,99%; sem mensalidade). Numa mensalidade de R$350: R$1,99 contra R$4,17. TAXA DA LINKGYM: 1,99% do bruto, piso R$1,00, teto R$14,90 por cobrança, ZERO assinatura do personal — aritmética inteira, arredondada para baixo, enviada como fixedValue e nunca percentualValue (o percentual do Asaas incide sobre o líquido, que não é a base que mostramos). PIX AUTOMÁTICO SÓ PARA PERSONAL COM CNPJ ATIVO: verifiquei no Banco Central — o recebedor tem que ser pessoa jurídica com CNPJ ativo. Personal com CPF fica fora da recorrência automática e permanece no BR Code + [Recebi] da Fase 1, para sempre, sem ser cidadão de segunda. E o KYC começa no ALUNO: nenhum documento é pedido enquanto não existir uma linha nomeada dizendo "Marina quer pagar pelo app · R$ 375, todo dia 5". O botão [Recebi] manual nunca é removido.

**Por que venceu.** O dono sugeriu Stripe e disse não saber se havia formato melhor. Há, e a diferença é aritmética: sem Pix não há produto brasileiro de mensalidade, e um Pix que depende de convite é fundar a arquitetura numa aprovação que não controlamos. Custo fixo com preço percentual é a margem inteira do modelo — é o que permite o teto de R$14,90, que é o mecanismo que impede o personal de ticket alto de desviar para o Pix pessoal. Subconta no CPF/CNPJ dele custa o MESMO trabalho de integração que ser merchant of record e nos deixa fora da responsabilidade solidária e da custódia — é a decisão que mais reduz código no produto inteiro. E o KYC pelo aluno porque é ali que a curva morre: documento e selfie pedidos no cadastro derrubam a maioria; pedidos com um nome e R$375 esperando, convertem.

<sub>origem: A escolha do provedor é consenso de 5 das 7 propostas com os números na mão. O teto/piso e o zero-assinatura vêm da proposta de negócio (a Carteira MFIT cobra 2,59% E R$39,90/mês por cima). A inversão do KYC foi eleita a melhor ideia daquela lente por dois juízes. O requisito PJ do Pix Automático foi ponto cego de 5 das 7 e o juiz técnico o nomeou como o primeiro dos três fatos que controlam a Fase 2 — confirmei por conta própria.</sub>

### [Fase 2] Fase 2: Apple libera, e a regra que nos mantém liberados

Verifiquei o texto vigente das App Review Guidelines. 3.1.3(d), verbatim, cita fitness training nominalmente entre os serviços pessoa-a-pessoa em tempo real que PODEM usar meio de pagamento que não o IAP. 3.1.3(e), verbatim, DETERMINA que bem físico ou serviço consumido fora do app use meio que não o IAP. Mensalidade de treino, avaliação, suplemento e marmita estão todos do lado seguro, com 0% de Apple. REGRA DE PRODUTO GRAVADA: nada vendido por este trilho desbloqueia função ou conteúdo DENTRO do app — sem plano premium, sem curso gravado pago, sem ficha atrás de paywall, sem ebook entregue pelo app. E nenhum link externo de pagamento no iOS: o TCC do CADE permite, mas a Apple cobra de 5% a 15% por essa porta, e 3.1.3(d)/(e) já nos tiram de graça desse balde.

**Por que venceu.** É o único ponto da Fase 2 que pode derrubar o app inteiro na revisão, e o desenho que evita o risco não custa nada — basta a categoria "digital consumido dentro do app" não existir no que se vende. Um enum de categoria para policiar isso seria uma taxonomia inteira para manter por anos por causa de uma regra que o desenho já respeita. E a aritmética fecha o argumento: o IAP levaria 15–30% sobre uma venda em que a LinkGym pretende ganhar 1,99% — uma linha de catálogo mal tipada derruba o modelo de receita.

<sub>origem: Verificado por três das sete propostas e por mim, em developer.apple.com/app-store/review/guidelines/. O corte do produto digital é consenso; o corte do link externo vem da proposta de negócio.</sub>

### [Fase 3] Fase 3: o que espera, e o gatilho verificável de cada coisa

Catálogo de produtos com tipo recorrente (o enum fechado de 4 tipos + cardápio de modelos): entra quando um personal digitar a mesma descrição de cobrança avulsa três meses seguidos. Barra de abas de 5 para 4, renomear Fichas→Turma e Operação→Dinheiro, PerfilTime fora da barra, apagar Atencao.tsx: entra depois que a Fase 1 estiver de pé, sozinha, numa release que não toque em dinheiro. Livro-razão de sinal, provedor_eventos com payload cru, conciliação por INSERT de sinal oposto, chave UNIQUE de idempotência e FK composta por studio_id: entram JUNTO com o webhook, nunca antes. Modelo logístico global: só se saidas acumular ~300 eventos na base inteira; se o rótulo vier podre, não acontece e a regra continua sendo o produto. Fechamento do mês com [Guardar imagem]: entra sem trava de data e só depois de medir quantos personais compartilham qualquer coisa do app hoje.

**Por que venceu.** Nenhuma delas muda a manhã do personal amanhã, e cada uma tem um gatilho que se observa em vez de se estimar. A regra que as separa da Fase 1 é uma só: Fase 1 é o que funciona sem provedor aprovado, sem modelo treinado e sem migração de fato financeiro.

<sub>origem: Sobras deliberadas, cada uma com o veto ou a ressalva que a empurrou para cá.</sub>

## Vetos — o que NÃO se constrói, e por quê

- **A ponte/waterfall do combinado (Começou/Entrou/Subiu/Caiu/Saiu/Terminou) e a tabela mensalidade_eventos com espelho, na Fase 1.**
  VETO TRIPLO, o único do material. É a peça mais cara do lote — SVG novo, tabela nova, dupla escrita com risco de divergir, teste de reconciliação com sequências aleatórias e um fusível em produção — e ela não desenha nada nos primeiros 60 dias de vida de cada personal, por admissão da própria proposta. A mesma tela entrega a mesma informação em prosa três linhas abaixo, com os nomes em seguida. O personal foi o mais direto: "responde uma pergunta que eu nunca fiz na vida — eu não tenho MRR, eu tenho a Marina".

- **risco_diario como snapshot diário da turma inteira, rodado pela tabela jobs.**
  É construir o armazém de dados antes do produto: 10 mil linhas por ano por estúdio para treinar um modelo que chega, na melhor hipótese, no mês 9 e que pode nunca acontecer. E a premissa é falsa — confirmei por grep que a tabela jobs, vazia desde 00002, não é tocada por nenhuma linha de Go: não há worker, não há poller. Escalonador é a peça que falha em silêncio na quinta e faz o personal agir na segunda com dado de terça. A versão preguiçosa colhe o mesmo sinal: toques + applied_at, ~1000 linhas/ano, sem job.

- **Trocar o [PAGO] de um toque por um [RECEBI] que abre folha com meio de pagamento e valor editável.**
  Dois toques na ação mais repetida da tela, e o eixo mede OPERAÇÃO. Pior: o produto inteiro é aritmética sobre esse gesto, então encarecê-lo é a forma mais rápida de o personal parar de fazê-lo — que é exatamente o ponto cego que esta spec existe para consertar. O meio entra pelo padrão (meio='mao'), o parcial volta como mudança de valor no dia em que doer, e a folha vive atrás do recibo.

- **Migrar mensalidades/mensalidade_pagamentos na Fase 1 — em qualquer das três formas propostas (recebimentos, diário+espelho, DROP para produtos/combinados).**
  É a única parte irreversível do plano e nenhuma linha dela move um Real. A proposta de rails escreveu a migração de dinheiro em UMA frase, sem release de expansão, sem rollback, sem segundo backfill para a janela em que dois binários convivem, sem teste de totais. A de ofício empacotou o DROP junto com renomear abas. A coluna aditiva prova que 90% do valor sai com risco zero. Regra da casa aplicada: quando duas propostas divergem no custo e convergem no resultado, leva a barata.

- **Os testes-polícia: o grep sobre todo .go atrás de current_date/time.Now(), e o TestTodoNumeroTemLista.**
  Doutrina fantasiada de teste. O primeiro dá falso positivo em comentário e string, por admissão da própria proposta; o segundo é gamificável devolvendo lista vazia, também por admissão dela. Nenhum testa comportamento — testam estilo — e um teste que reprova por causa de uma palavra num comentário é a primeira coisa que alguém deleta às 3h para destravar um deploy, levando junto a credibilidade da suíte inteira. O conserto de fuso fica; a polícia sai.

- **Imprimir na tela "Dos últimos 20 nomes desta lista, 6 saíram" — e qualquer percentual, score ou faixa de engajamento.**
  O app contar ao personal que acerta 30% das vezes é o jeito mais rápido de ele parar de abrir a lista; isso é métrica nossa, não conversa com ele. E percentual é infalsificável para quem lê: ele não tem como saber que "78%" está errado. As 5 faixas da referência são o alvo nomeado da doutrina — respondem quantos, nunca quem. O score ordena a fila e morre no banco.

- **A pergunta recorrente [Ainda é minha aluna]/[Saiu] como colheita do rótulo de cancelamento.**
  A própria proposta admite que o personal vai mentir por otimismo, e mesmo assim a fez o alicerce do modelo do mês 9. Obrigar alguém a assinar o atestado de óbito de uma cliente é um imposto de culpa cobrado todo mês. Substituído por dedução do silêncio com direito a desmentir: não responder é o rótulo positivo, e desmentir é o negativo — os dois de graça.

- **O cartão de oferta comercial dentro de Hoje.tsx, mesmo abaixo do bloco do dia e mesmo um por vez.**
  Hoje é o ritual, e o ritual é o eixo 3 — o único lugar do produto onde "isto pertence aqui?" não se responde com medidor, porque quando o medidor acusar já custou a confiança de quem abriu o app para treinar. A oferta vive no rodapé do Perfil, que resolve descoberta sem encostar no dia de treino.

- **Loja/prateleira no app do aluno, catálogo com foto, estoque, frete, variante, cupom e carrinho.**
  28 alunos não são um marketplace. Prateleira dentro de app de treino não é navegada, e ela TIRA o personal da transação — enquanto a cobrança nominal o coloca dentro dela e vira, por construção, mais um motivo para ele tocar em alguém hoje. Estoque com quantidade exige decremento atômico, proteção contra venda a descoberto e uma tela de inventário para um personal que tem quatro potes de whey no porta-malas.

- **disputa_aberta_em / disputa_fechada_em / estado em_disputa na Fase 1; e toda a máquina de webhook, conciliação e provedor_eventos antes de existir provedor.**
  Sem provedor não existe disputa, logo são colunas e um ramo de CASE escritos para um mundo que ainda não chegou. E o desenho inteiro — que é o melhor do lote para quando o webhook chegar fora de ordem — resolve um problema que não temos. O personal foi literal: "nada disso passa por um centavo enquanto eu não puder nem cadastrar quanto a aluna paga".

- **Fechamento.tsx com rota travada por data no backend (existe só do dia 1 ao 5).**
  Uma rota que devolve 404 em 25 dos 30 dias é um gerador de ticket de suporte, impossível de testar fora da janela, e a doutrina que ela protege se cumpre igual com a tela simplesmente não sendo aba nem destino de notificação. A justificativa (o story do personal como canal de aquisição) é a única afirmação não verificada de uma proposta que verificou tudo o mais. Se a tela é boa, ela é boa no dia 12.

- **O portão de "nada de dinheiro de verdade antes de ~400 personais com turma cadastrada".**
  Traduzido para a cadeira do personal: espere um ano marcando pago na mão enquanto nós juntamos base. Pior, mede adoção de um produto que ninguém tem motivo para adotar. A aritmética de break-even fica de pé como o motivo de a Fase 2 ser Fase 2 — mas o gatilho é um piloto com estúdios reais, não uma contagem de usuários.

- **Importar extrato bancário (OFX/CSV) para conciliar automaticamente.**
  O dono pediu e eu recuso. Conciliar um Pix recebido a um aluno exige casar o nome do descritor com o cadastro e vai errar numa fração grande dos casos — nomes iguais, pagamento feito pela mãe, apelido. Um "pago" ERRADO é pior do que nenhum: o personal para de cobrar quem não pagou. O item 6 do pedido dele é atendido melhor pelo BR Code, que não tem ambiguidade nenhuma.

- **Régua de cobrança automática, lembrete de atraso, push de vencimento, negativação, e bloqueio do treino por inadimplência.**
  A relação personal-aluno é o produto; um robô cobrando estraga exatamente o que se está vendendo. E travar o treino é o movimento que converte atraso em cancelamento — a catraca da academia pode porque vende acesso, nós vendemos o treino, que é justamente o que traz a pessoa de volta para pagar. A lei fica reescrita e estreitada: o app nunca cobra por conta própria, nunca manda mensagem que o personal não escreveu, nunca assina com o nome LinkGym, nunca trava o treino.

- **Stripe como provedor, e produto digital consumido dentro do app.**
  Stripe: Pix para empresa sediada no Brasil é apenas para convidados (verificado), e a taxa é percentual, o que impede estruturalmente o teto de R$14,90 que é o mecanismo antifuga da tabela. Produto digital: cai em 3.1.1 e leva 15–30% da Apple sobre uma venda em que ganhamos 1,99% — a taxa da loja sozinha é dez a vinte vezes a nossa margem.

## Rotas da Fase 1

- `PUT /v1/owner/mensalidades/{bond_id} — JÁ EXISTE em cmd/api/main.go:80 e NENHUMA tela chama (confirmado por grep: putMensalidade não existe em src/api.ts). A tela Combinado passa a chamá-la, N vezes em paralelo no modo lote. Zero backend novo.`

- `DELETE /v1/owner/mensalidades/{bond_id}/pagar — desfazer o [Recebi], janela infinita, sem diálogo. SQL travado em `AND meio = 'mao'`: pagamento de provedor nunca é apagável por toque.`

- `GET /v1/owner/operacao — ESTENDIDA, sem rota nova para a dobra. Ganha: recebido_cents, a_vencer_cents, vencido_cents (a barra do mês); ultima_marcacao (data, para o vazio "nada marcado ainda"); em cada item de em_aberto o campo copia_e_cola (o BR Code é CAMPO, não endpoint) e o booleano ja_disse; a lista risco com {person_id, name, frase, acao, phone}; avulsas em aberto; sumiram (60d de silêncio); sem_combinado como lista de {bond_id, person_id, name}; fita: [{month, recebido_cents, pagantes}] só quando houver ≥2 meses fechados; e o placar {tocou, voltaram}.`

- `POST /v1/owner/cobrancas — {bond_id, descricao, valor_cents}. Devolve a linha criada JÁ COM copia_e_cola, para a folha mostrar o Pix sem segundo round-trip.`

- `POST /v1/owner/cobrancas/{id}/recebi — {meio}. Um toque, mesmo padrão do [Recebi] da mensalidade.`

- `DELETE /v1/owner/cobrancas/{id}/recebi — o mesmo desfazer, mesma trava de meio='mao'.`

- `POST /v1/owner/toques — {person_id, motivo}. Gravado ANTES de abrir o wa.me, para o registro não depender do retorno de outro app.`

- `POST /v1/owner/bonds/{bond_id}/continua — desmente a saída deduzida. Grava um toque e some da seção Sumiram por 60 dias. Não existe rota para AFIRMAR a saída: ela é dedução, nunca declaração.`

- `PATCH /v1/owner/time — JÁ EXISTE. Ganha os campos chave_pix, nome_recebedor, cidade_recebedor no corpo, validados como os outros (PatchTime já devolve 400 em vez de 500).`

- `POST /v1/owner/attention/{id}/apply — JÁ EXISTE. Só muda por dentro: UPDATE applied_at no lugar do DELETE.`

- `GET /v1/student/mensalidade — {valor_cents, due_day, month, ja_disse}. Devolve o combinado e nada mais. Nunca devolve estado de atraso: não existe campo vencido, em_aberto ou dias_de_atraso nesta rota, de propósito.`

- `POST /v1/student/ja-paguei — sem corpo. Idempotente pela PK (bond_id, month). Não marca pagamento, não notifica ninguém, não muda nada do lado do aluno além da frase de confirmação.`

## Telas

### Operação — `/Users/vitorepf/develop/linkgym/linkgym-app/src/screens/owner/Operacao.tsx`

**A dobra**

```
iPhone 13, ~640pt úteis com Head e dock. A última coisa visível é uma pessoa com dinheiro e dois botões — nunca um total, nunca um gráfico, nunca branco.

  0– 96  Head — kicker "Fred Personal" (muted) · título "Operação"
 96–232  A BARRA DO MÊS (Band, o MetricGrid de 4 cartões morre aqui)
           R$ 7.850                          ← Figure role="hero", unit "R$", unitFirst
           RECEBIDO EM AGOSTO                ← label
           de R$ 10.500 combinado            ← note
           [███████████████░░░░▓▓▓]          ← 10pt; largura total = o combinado
           recebido · a vencer 1.600 · vencido 1.050
           (só o segmento vencido é tocável: rola até os nomes. Segmento não-zero
            tem 3pt de largura mínima e o valor sai SEMPRE por escrito.)
232–272  Faixa: VAI SUMIR · 3
272–334  Marina Alves
           R$ 350 em aberto há 12 dias, e 9 sem treinar         [Recebi]
334–396  Bea Nunes
           Treinava 4x por semana. Fez 1 nas últimas duas.      [Mandar]
396–458  Léo Prado
           Você não publica para ela há 21 dias.                [Publicar]
458–498  Faixa: EM ABERTO · 3 · R$ 1.050
498–560  Marina diz que já pagou · R$ 350                       [Recebi]
560–622  Carla Reis · venceu há 9 dias · R$ 350          [Pix]  [Recebi]

Abaixo da dobra, nesta ordem: o resto de em aberto; A ENTREGAR (as avulsas em aberto, com a descrição na linha); SUMIRAM (60 dias de silêncio, um botão só: [Ainda é minha]); o rodapé "8 sem valor combinado. Combinar agora →"; o placar "Você tocou em 7 pessoas este mês. 5 voltaram a treinar."; e por último A FITA — uma coluna por mês fechado, só desenhada a partir de dois meses.
```

**Ações:** [Recebi] — UM toque, sem diálogo. A linha não some: o slot do botão vira o recibo "Recebi · 08:12", e o recibo é o alvo do desfazer, com janela infinita. Tocar o recibo reverte e o slot passa a ler "Desfeito".; [Pix] — copia o BR Code com o valor certo. A linha responde "Copiado. Manda pra ela." É a única peça da fase 1 que faz o dinheiro chegar mais rápido amanhã.; [Mandar] — abre o WhatsApp DELE com rascunho editável (people.phone é NOT NULL UNIQUE desde 00001). Grava o toque ANTES de abrir o link. NÃO existe rascunho para motivo de dinheiro: ali a ação é [Recebi] e [Pix], e a frase de cobrança é dele.; [Publicar] — vai direto para a prescrição daquela pessoa.; Tocar o segmento vencido da barra — rola até a lista de nomes. É o único elemento da barra que é botão.; Tocar uma coluna da fita — ela se substitui, no lugar, por "JUNHO · R$ 9.100 · 26 pagaram" e os nomes daquele mês, com [voltar]. Não filtra nenhuma outra seção: componente fechado, sem estado vazando para cima.; [Ainda é minha] — desmente a saída deduzida.; Rodapé tocável → Combinado, no modo lote, com todos os sem-valor já na tela.

**Vazio:** São cinco, e o terceiro é a peça que nenhuma das sete propostas tinha.

(a) ZERO ALUNOS — sem barra, sem seção, sem esqueleto:
    "Sua operação começa com um nome."
    "Convide o primeiro aluno. Quando ele aceitar, o valor combinado se digita aqui e o mês começa a contar."
    [Convidar aluno]

(b) ALUNOS, ZERO COMBINADOS — o vazio É o formulário: a Combinado inteira sobe para dentro da dobra.
    "3 alunos, nenhum valor combinado. Sem isso a conta do mês não existe."
    as 3 linhas com [R$ ___][dia __] e [Guardar os 3]

(c) NINGUÉM MARCADO NESTE MÊS e já passou do dia 10 — a barra NÃO desenha e o herói NÃO imprime "R$ 0":
    "Nada marcado em agosto ainda."
    "Se você já recebeu, marque — senão a conta de agosto fica errada."
    "Última marcação: 12 de julho."
    A lista de em aberto continua abaixo, sem faixa de aperto e sem contagem no cabeçalho.
    (Motivo: o app não sabe se ninguém pagou ou se ninguém marcou. Afirmar a primeira quando é a segunda é chamar a turma inteira de caloteira.)

(d) MÊS EM DIA — o vazio de hoje fica como está, é o único bom:
    "Mês em dia: as 28 mensalidades estão pagas."

(e) NINGUÉM EM RISCO — nunca se completa três vagas com enchimento:
    "Ninguém em risco hoje. As 28 estão dentro da linha delas."

Erros, e a regra é que a frase diz o que é VERDADE AGORA, não o que falhou:
    "Não deu para abrir o mês." [Tentar de novo]
    "Não deu para marcar. O recebimento de Mariana continua em aberto."
    "Não deu para desfazer. Continua marcado como recebido."
(Em dinheiro isso não é estilo: é o que impede cobrar duas vezes a mesma pessoa.)

### O combinado — `/Users/vitorepf/develop/linkgym/linkgym-app/src/screens/owner/Combinado.tsx`

**A dobra**

```
Uma tela, dois modos, o mesmo componente de linha.

MODO LOTE (chegando pelo rodapé da Operação):
  0– 96  Head — kicker "8 sem valor" · título "O combinado"
 96–152  Mesmo valor para todos   [R$ ____]   [dia __]
152–204  Ana Paula        [R$ 350 ]  [dia  5]
204–256  Bea Nunes        [R$ 350 ]  [dia  5]
256–308  Carla Reis       [R$ 350 ]  [dia  5]
308–...  (as demais)
 rodapé  DockFooter — [Guardar os 8]

MODO UM (chegando de Aluna.tsx): a mesma linha, sozinha, sem o bloco do topo, footer [Guardar].

Teclado numérico, dia pré-preenchido com o dia mais usado da turma (5 na turma vazia), e quem já tem combinado nasce com o valor atual na linha, nunca sobrescrito pelo "mesmo valor para todos" sem toque.
```

**Ações:** [Guardar os 8] — dispara N PUT em paralelo em /v1/owner/mensalidades/{bond_id}, a rota que já existe. Sem rota de lote transacional.; Falha parcial é aceita de propósito: a linha que falhou fica com a borda de aviso e o valor digitado preservado, e o botão vira [Tentar os 3].; Editar depois: a mesma tela, chegando pela linha "O combinado" da pessoa.

**Vazio:** Nunca vazio — só se chega aqui por uma contagem que é maior que zero. Depois de guardar: "Combinado com 8. Quem paga diferente, ajuste na pessoa."

### A pessoa — `/Users/vitorepf/develop/linkgym/linkgym-app/src/screens/owner/Aluna.tsx`

**A dobra**

```
A tela fica como está — o corpo dela continua sendo a ficha publicada, que é o trabalho. Entram duas linhas, abaixo do bloco de prescrição e acima das ações:

  O COMBINADO
  R$ 350 · todo dia 5                                    →

  Cobrar à parte                                         →
```

**Ações:** Tocar "O combinado" — abre Combinado.tsx no modo um.; "Cobrar à parte" — folha com DOIS campos: "O que é" (placeholder "Avaliação física") e "Quanto". Botão [Criar]. A folha já responde com "Criado. R$ 150." + [Copiar o Pix] — a cobrança nunca sai sem instrumento de pagamento junto.

**Vazio:** Sem combinado, a linha diz o que fazer em vez de dizer que está vazia:
  O COMBINADO
  Sem valor combinado. Toque para definir.               →

Sem avulsa nenhuma, a segunda linha aparece igual: "Cobrar à parte" é um verbo, não uma lista, e não tem vazio.

### Perfil do aluno — `/Users/vitorepf/develop/linkgym/linkgym-app/src/screens/student/Perfil.tsx`

**A dobra**

```
A tela fica como está. Entra UMA linha, no rodapé, e só quando existe combinado:

  Mensalidade de agosto · R$ 350 · todo dia 5
  [Já paguei]

Depois do toque:
  Mensalidade de agosto · R$ 350 · todo dia 5
  Avisado. O Fred confirma quando ver.

REGRA GRAVADA NO CÓDIGO, e ela é a lei da casa: esta linha NUNCA muda de tom. Nunca diz "vencido", "atrasado" ou "em aberto". Nunca fica vermelha. Nunca vira push, nunca vira selo, nunca bloqueia nada. Ela só enuncia o combinado, o mês inteiro, do mesmo jeito. O app não cobra o aluno — ele dá ao aluno a chance de falar.
```

**Ações:** [Já paguei] — um toque. Não marca pagamento, não notifica ninguém, não muda nada além da frase. Vira uma linha nomeada no topo do "Em aberto" do personal: "Marina diz que já pagou · R$ 350 [Recebi]".

**Vazio:** Sem combinado digitado, a linha não existe. Nada de "você ainda não tem mensalidade": o aluno não tem nada a fazer com isso, e uma frase sobre a ausência de um combinado que é assunto entre ele e o personal seria o app se metendo na conversa.

## Ordem de construção

1. 1. Migration 00011 inteira, aditiva. VERIFICA: `goose up` → `goose down` → `goose up` limpo, sem erro; e `SELECT count(*) FROM mensalidade_pagamentos WHERE amount_cents = 0` devolve 0 em base com dados.

2. 2. As funções hoje() e competencia() ancoradas em America/Sao_Paulo, em internal/owner, mais `import _ "time/tzdata"` no main. Os dois time.Date(..., time.UTC) de operacao.go passam a chamá-las. VERIFICA: teste com s.now cravado em 31/ago 21:00 BRT devolve competência 2026-08-01, não 2026-09-01. (~12 linhas. Sem pacote novo, sem teste-polícia de grep.)

3. 3. putMensalidade em src/api.ts + Combinado.tsx nos dois modos + o rodapé da Operação virando Pressable. VERIFICA À MÃO: o personal cadastra 8 valores em 3 toques + digitação, e os quatro números da Operação deixam de ser zero. ESTE É O PASSO EM QUE O PRODUTO MUDA — os dois anteriores somam 30 linhas.

4. 4. amount_cents e meio gravados por PagarMensalidade; DELETE /v1/owner/mensalidades/{bond_id}/pagar com a trava `AND meio='mao'`; a linha-recibo com desfazer sem diálogo. VERIFICA: marcar → desfazer → marcar de novo deixa UMA linha, com o valor congelado do momento; e um pagamento com meio='pix' escrito à mão no banco NÃO é apagável pela rota.

5. 5. O BR Code EMV estático em ~40 linhas de Go (campos 00/26/52/53/54/58/59/60/63, sem txid) + campos chave_pix/nome_recebedor/cidade_recebedor em PatchTime e na tela de Aparência + copia_e_cola viajando no payload da Operação + o botão [Pix] na linha. VERIFICA: teste de unidade do CRC16-CCITT/FALSE contra um payload conhecido do manual do BCB — é a única lógica não-trivial da peça; e colar um código gerado no app de um banco real e ver o valor certo aparecer.

6. 6. Tabela ja_paguei + GET /v1/student/mensalidade + POST /v1/student/ja-paguei + a linha em Perfil.tsx do aluno + a linha "Marina diz que já pagou" no topo do Em aberto. VERIFICA: o aluno toca, o personal recarrega a Operação e vê o nome no topo; o personal toca [Recebi] e a linha vira recibo comum.

7. 7. O vazio "Nada marcado em agosto ainda" + o campo ultima_marcacao + o herói que se recusa a imprimir R$ 0. VERIFICA: fixture com 28 combinados e zero pagamentos no mês, relógio no dia 12 — a tela NÃO desenha a barra e NÃO diz que 28 pessoas devem.

8. 8. internal/owner/risco.go: os seis sinais em prioridade, a frase, a ação, o teto de 3, e o `current_date` da query virando `$2::date` ligado a hoje(). O bloco riscoRows sai de operacao.go; as constantes riscoIdleDays/riscoIdleComAbertura morrem; o carregador da fila de atenção passa a chamar a mesma função. VERIFICA: fixture com um caso de cada sinal produz exatamente a frase esperada; fixture com sete pessoas em risco devolve três; fixture sem ninguém devolve lista vazia, não três nomes de enchimento.

9. 9. [Mandar] abrindo wa.me com rascunho + POST /v1/owner/toques gravado antes do link + applied_at no lugar do DELETE em attention.go:48 + `AND a.applied_at IS NULL` no loadAttention + o placar no rodapé. VERIFICA: aplicar uma linha da Atenção não apaga a linha do banco, e a fila do dia seguinte não a traz de volta; o placar conta 1 depois do primeiro toque.

10. 10. cobrancas_avulsas + POST /v1/owner/cobrancas devolvendo copia_e_cola + a folha de dois campos em Aluna.tsx + a seção A ENTREGAR na Operação. VERIFICA: criar "Avaliação física R$150", ver o Pix na mesma folha, ver a linha em aberto, receber, e ela sair.

11. 11. saidas deduzida (60d sem sessão e sem pagamento) + a seção SUMIRAM com [Ainda é minha] + POST /v1/owner/bonds/{bond_id}/continua + o UPDATE bonds SET status='ended' após 30 dias sem contradição. VERIFICA: fixture de 60d de silêncio aparece na seção; tocar [Ainda é minha] a remove por 60 dias; e student_count/receita_cents/ticket_cents param de contar quem saiu.

12. 12. A barra do mês substituindo o MetricGrid + a fita de meses no rodapé, desenhada só a partir de dois meses fechados. VERIFICA: tools/shots.mjs numa fixture de 12 alunos em aberto — o cabeçalho VAI SUMIR ainda cabe na dobra e a última linha visível é uma pessoa; e uma fixture de mês 1 NÃO desenha a fita.

## Perguntas para o dono — bloqueiam a Fase 2, não a Fase 1

- A maioria dos seus personais tem CNPJ (MEI que seja), ou é CPF? Isto não é curiosidade fiscal: verifiquei no Banco Central que o Pix Automático exige recebedor pessoa jurídica com CNPJ ativo. Se a base for majoritariamente CPF, a recorrência automática da Fase 2 não existe para o usuário típico, e o produto teria que incluir "abra seu MEI" no onboarding antes de escrever uma linha de integração. É a única resposta que muda a Fase 2 inteira, e ela sai de uma consulta no cadastro de hoje.

- A LinkGym é PJ hoje? Conta raiz pessoa física não cria subcontas no Asaas, e sem subconta não há split — ou seja, não há como cobrar a taxinha sem a LinkGym virar merchant of record, que é justamente o desenho que recusei (responsabilidade solidária, custódia, chargeback). É um bloqueio duro anterior a qualquer código.

- Algum personal seu vende alguma coisa RECORRENTE hoje além da mensalidade — marmita por assinatura, suplemento todo mês —, ou os exemplos são aspiração? A cobrança avulsa de dois campos cobre o caso avulso inteiro (avaliação, whey, aula) na Fase 1. O catálogo de produtos com tipo recorrente é uma taxonomia inteira para manter, e ela só se paga se a recorrência não-mensalidade já existir na base. Se for aspiração, ela fica na Fase 3 com o gatilho que já escrevi: quando alguém digitar a mesma descrição três meses seguidos.

- A Fase 2 transforma a LinkGym numa operação de pagamentos: análise de KYC, suporte de "cadê meu dinheiro", estorno, conciliação e, a partir de fevereiro de 2026, reporte transação a transação pela DIMP. Isso tem custo fixo mensal alto e independe de quantos personais usam. Você quer operar isso — ou prefere a alternativa que a Fase 1 já entrega inteira: o dinheiro vai direto para o Pix do personal, a LinkGym não toca nele, e a monetização é assinatura? As duas são defensáveis; a segunda não precisa de provedor, de CNPJ nosso, nem de aprovação de ninguém.

## O schema da Fase 1

```sql
-- +goose Up

-- ============================================================================
-- 00011_operacao.sql — TUDO ADITIVO.
--
-- `mensalidades` não é tocada: ela É o combinado entre as duas pessoas, e toda
-- query de internal/owner/operacao.go continua idêntica letra por letra. Não há
-- expand/contract aqui porque não há nada para contrair — migração de fato
-- financeiro é a única parte irreversível de qualquer plano, e esta rodada não
-- precisa dela para entregar o produto inteiro.
-- ============================================================================


-- O VALOR CONGELA NO FATO. Hoje a Operação lê o valor de `mensalidades` na hora da
-- consulta: aumentar o combinado de R$300 para R$350 em maio REESCREVE o que entrou
-- em janeiro. Dinheiro do passado que muda de valor é o bug que ninguém acha, e é o
-- mesmo motivo de os centavos serem integer desde 00006.
ALTER TABLE mensalidade_pagamentos ADD COLUMN amount_cents integer NOT NULL DEFAULT 0;

UPDATE mensalidade_pagamentos pg
   SET amount_cents = m.amount_cents
  FROM mensalidades m
 WHERE m.bond_id = pg.bond_id;

-- POR ONDE o dinheiro entrou. 'mao' é o dedo do personal e é o ÚNICO valor que a
-- fase 1 escreve. O desfazer é um DELETE travado em meio = 'mao': quando existir
-- provedor, o fato dele não some por toque errado, e a regra já nasce escrita —
-- sem coluna desfeito_em, sem soft-delete, sem índice parcial. Um dedo errado não
-- é um fato, e "em aberto = ausência de linha" continua valendo.
ALTER TABLE mensalidade_pagamentos ADD COLUMN meio text NOT NULL DEFAULT 'mao'
    CHECK (meio IN ('mao', 'pix', 'cartao'));


-- O ALUNO GANHA O VERBO, e ele NÃO MARCA NADA.
--
-- Toda a Operação repousa num gesto digitado à mão, e "em aberto = ausência de
-- linha" torna o esquecimento do personal indistinguível de calote: no mês em que
-- ele parar de marcar, a tela acusa a turma inteira. O aluno é a única outra pessoa
-- do sistema com incentivo PRÓPRIO para corrigir isso. "Já paguei" é o que ela diz;
-- o FATO continua sendo do personal, no toque dele.
--
-- Uma linha por vínculo por mês (PK composta = idempotente). Some sozinha quando o
-- pagamento entra — a leitura junta com NOT EXISTS em mensalidade_pagamentos.
CREATE TABLE ja_paguei (
    bond_id uuid        NOT NULL REFERENCES bonds(id) ON DELETE CASCADE,
    month   date        NOT NULL CHECK (date_trunc('month', month)::date = month),
    dito_em timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (bond_id, month)
);


-- COBRANÇA AVULSA: o que o personal vende fora da mensalidade. Avaliação física,
-- whey, marmita, aula experimental — "qualquer tipo de produto" traduzido para o
-- que ele de fato faz. DUAS colunas de conteúdo, descrição livre e valor, porque o
-- pedido era "pouquíssimos cliques": categoria, foto, estoque, frete e variante são
-- campos entre ele e o dinheiro, e cada um é uma decisão que ele não sabe tomar às
-- 22h. Repetiu a mesma descrição três meses seguidos? Aí vira produto (fase 3).
--
-- recebida_em e meio andam juntos: ou os dois são nulos (em aberto), ou nenhum.
CREATE TABLE cobrancas_avulsas (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    bond_id     uuid        NOT NULL REFERENCES bonds(id) ON DELETE CASCADE,
    descricao   text        NOT NULL CHECK (length(btrim(descricao)) BETWEEN 1 AND 60),
    valor_cents integer     NOT NULL CHECK (valor_cents > 0),
    criada_em   timestamptz NOT NULL DEFAULT now(),
    recebida_em timestamptz,
    meio        text CHECK (meio IN ('mao', 'pix', 'cartao')),
    CONSTRAINT cobrancas_avulsas_recebimento CHECK ((recebida_em IS NULL) = (meio IS NULL))
);

CREATE INDEX cobrancas_avulsas_aberta ON cobrancas_avulsas (bond_id) WHERE recebida_em IS NULL;


-- A SAÍDA, que nunca foi escrita.
--
-- `bonds.status` aceita 'ended' desde 00001 e NENHUMA linha de Go escreve isso —
-- só 'active', no aceite do convite. Consequência viva: quem cancelou em março
-- continua contando em student_count, receita_cents e ticket_cents para sempre, e
-- os quatro números da Operação sobem sozinhos. Consequência futura: sem evento de
-- saída não existe rótulo, e nenhuma afirmação sobre risco é falsificável.
--
-- DEDUZIDA do silêncio (60 dias sem sessão e sem pagamento) e CONTRADIZÍVEL pelo
-- personal: ele nunca assina atestado de óbito, só desmente. Não responder É o
-- rótulo. `ultima_presenca` é CONGELADA no ato — recalcular de tabela viva dá
-- rótulo móvel, que é o que inutiliza um dado de cancelamento.
CREATE TABLE saidas (
    bond_id         uuid PRIMARY KEY REFERENCES bonds(id) ON DELETE CASCADE,
    ultima_presenca date,
    ultimo_mes_pago date,
    confirmada_em   timestamptz NOT NULL DEFAULT now()
);


-- O TOQUE: o personal falou com alguém, e por qual motivo.
--
-- É o que torna a fila falsificável — sem ele, "assertivo" é superstição bem
-- diagramada — e é a fonte da ÚNICA estatística agregada do produto, que é sobre o
-- comportamento DELE: "você tocou em 7 pessoas este mês, 5 voltaram a treinar".
-- Gravado ao ABRIR o WhatsApp, não ao enviar: a alternativa é não gravar nada.
-- Sem coluna de score, porque não existe score.
CREATE TABLE toques (
    id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    studio_id  uuid        NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
    person_id  uuid        NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    motivo     text        NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX toques_pessoa ON toques (person_id, created_at DESC);


-- A MEMÓRIA DO QUE ELE FEZ. Hoje internal/owner/attention.go:48 faz
-- `DELETE FROM attention_items WHERE id = $1` — toda vez que o personal age sobre a
-- fila, o sistema destrói o registro de que sinalizou aquela pessoa e de que ele
-- agiu. O campo `Applied bool` do struct Attention (service.go:50) já existe,
-- já é serializado, e nunca foi preenchido por ninguém. Uma coluna devolve o placar.
ALTER TABLE attention_items ADD COLUMN applied_at timestamptz;


-- A CHAVE PIX DO PERSONAL. O BR Code é montado pelo backend a partir daqui: o
-- dinheiro do aluno vai DIRETO para a conta dele, a LinkGym não toca nele e não
-- entra na cadeia de custódia. Nome e cidade são campos obrigatórios do payload EMV.
ALTER TABLE studios ADD COLUMN chave_pix        text;
ALTER TABLE studios ADD COLUMN nome_recebedor   text;
ALTER TABLE studios ADD COLUMN cidade_recebedor text;


-- +goose Down

ALTER TABLE studios DROP COLUMN cidade_recebedor;
ALTER TABLE studios DROP COLUMN nome_recebedor;
ALTER TABLE studios DROP COLUMN chave_pix;
ALTER TABLE attention_items DROP COLUMN applied_at;
DROP TABLE toques;
DROP TABLE saidas;
DROP TABLE cobrancas_avulsas;
DROP TABLE ja_paguei;
ALTER TABLE mensalidade_pagamentos DROP COLUMN meio;
ALTER TABLE mensalidade_pagamentos DROP COLUMN amount_cents;
```
