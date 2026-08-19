# Ciclo 5 — as cinco decisões do dono, e a porta pelo número

Este ciclo não começou com uma auditoria. Começou com o dono respondendo cinco perguntas
que estavam paradas esperando por ele, e mandando uma sexta coisa que ninguém tinha
perguntado: **o convite não deveria ter código nenhum.**

## As cinco decisões, e o que virou código

| # | pergunta | resposta | onde está |
|---|---|---|---|
| 1 | registrar `aparencia` e `kits` como eixos do gate | **sim** — "o item mais barato dos cinco e o que mais protege o resto" | *não executável por dentro do loop*; ver abaixo |
| 2 | `Band raised` como padrão | **"nada antes de você olhar"** | `tools/lado-a-lado.mjs`, PNGs entregues |
| 3 | cor da marca nos gráficos | **primária nunca; segunda cor sim** | `Progresso.tsx`, `Painel.tsx`, seção 14 do medidor |
| 4 | `coach_line` escrita pelo personal | **sim** — "aumenta a presença dele em vez de diminuir" | migration 00010, `internal/voz`, `Publicar.tsx` |
| 5 | nome/ícone/splash por estúdio | **adiado**, e adiado com critério: "vale quando houver estúdio grande o suficiente para pagar o próprio app" | registrado como decisão, não como defeito |

### 1 — por que o loop não fecha esta

Registrar eixo exige editar `.gate/config.json` e `.gate/base.json`, e os dois são arquivos
travados. O `--lock` é aditivo de propósito: ele trava arquivo novo e **recusa relegitimar
medidor alterado**, porque mudar a régua é decisão humana e tem que aparecer no `git diff`.

O que cabia ao loop foi feito: `tools/catraca.mjs` grava a medida no formato que o `.gate`
espera, e `aparencia.mjs`/`kits.mjs` passaram a chamá-lo. No dia em que o humano registrar,
a catraca nasce com histórico em vez de nascer vazia — e histórico vazio é o único caso que
o gate trata como integridade quebrada.

Uma nota que o script de preparação explica em detalhe: a mensagem do gate manda "apagar a
entrada do lock à mão", mas apagar a chave não basta — o `--lock` monta
`antes = { ...ledger, ...lock }` e o hash antigo volta pelo ledger, que é append-only. O que
satisfaz a intenção escrita (mudança de régua por mão humana, visível no diff) é **zerar** o
valor. Quem assina isso é o dono do repo, não o loop.

### 2 — a comparação existe, a decisão não

`tools/lado-a-lado.mjs` monta cada tela duas vezes e compõe os pares numa imagem só. A
versão "raised" vem de uma **flag só de captura** (`globalThis.__bandRaised`, ligada por
`addInitScript`), e não de uma alavanca de verdade: uma alavanca custaria SPEC + whitelist na
API para uma pergunta ainda não respondida. Em produção nada define a global, e a
renderização é a de hoje.

Quatro telas em dois chãos opostos, porque o efeito é diferente nos dois: no claro
`T.raised` é quase branco sobre o bege do papel e a hierarquia aparece sozinha; no escuro é
um degrau sutil de cinza — e vem com duas regressões reais, que a imagem mostra.

**O pré-requisito, medido:** as duas regressões têm a mesma raiz — peças que usam `T.raised`
como destaque **dentro** de uma Band, que passariam a pousar num fundo que já é `T.raised`.
São a linha "Você" da Liga (Progresso) e os chips de ação (Painel). O remédio já existe
desde o ciclo 3: `neutroSobre(fundo)`. Sem essa conversão, o `raised` global entrega a
alavanca inteira ao preço de dois destaques que hoje funcionam.

### 3 — um canal, um significado

A regra que saiu vale nas duas telas e é a mesma que `ui/Baseline` já usava: **o dado fica na
tinta neutra, a série de REFERÊNCIA ganha matiz.** O matiz aqui não significa "bom" nem
"ruim" — significa "esta é a outra".

A alternativa recusada foi pintar hoje e deixar a referência neutra. Colore menos, mas dentro
da mesma Band do Progresso o matiz passaria a significar duas coisas ao mesmo tempo: "hoje"
nas barras e "a média" no tique da Baseline.

Onde a cor **não** entrou é parte da regra: a calha do Painel (não é série — quem codifica o
feito é a fronteira; matiz ali leria como dívida), o dia sem registro (ausência é a marca), a
Liga e a fila do Painel (listas ranqueadas são uma série com um membro enfatizado).

Duas réguas, uma por pergunta: `contrast` (piso 3) responde "a barra existe sobre o fundo";
L\* (piso 5) responde "dá para ver que são DUAS". Como L\* **é** o valor em escala de cinza,
o par "se separa de hoje" é literalmente a prova de preto e branco.

### 4 — o app parou de falar pela boca dele

`internal/today/service.go` montava `"%s em %s. Técnica, não ego."` com o nome do exercício e
mandava isso ao aluno no slot da voz do personal. Um template assinado por quem não escreveu.

Agora a frase nasce no ato de publicar, e **sem frase o bloco não aparece**: ou é 100% dele
ou não existe. A validação é a que já existia para `boas_vindas` e `retomada` — movida para
`internal/voz` porque `owner` importa `publish` e nenhum dos dois podia hospedá-la sem obrigar
o outro a copiar. Duas cópias de uma regra divergem, e a que diverge é sempre a que o servidor
recusa.

O Hoje também perdeu `"{time} revisou sua semana"`. Ninguém revisou semana nenhuma — ele
publicou o dia e escreveu uma linha.

## A porta pelo número

O pedido veio na voz do dono: *"vai colocar o número do aluno e vai apertar enviar... vai ter
a opção de WhatsApp... esse número já vai estar liberado. O aluno só vai precisar entrar com
o número."*

A mudança inteira na API é uma função: `resolverConvite` procura, quando o convite chega
vazio, um convite aberto para aquele telefone. Tudo que já existia — a checagem, a marca do
estúdio na tela de entrada, o vínculo criado em `ensurePerson` — continua funcionando sem
saber que o aluno nunca digitou nada.

O código não morreu: ele é a única chave do convite **aberto** (o story, o cartaz na parede),
onde ninguém sabe de antemão qual é o telefone de quem vai ler.

**O que não foi removido, e por quê:** os 4 dígitos por SMS ficam. Aquilo não é convite, é a
prova de que o número é seu. Sem isso, qualquer pessoa entra na conta de qualquer aluno
digitando o número dele.

**Defeito achado no aparelho, não no código:** a primeira versão usava `https://wa.me`, por
ser universal. `Linking.openURL` de uma URL https **nunca falha** — sem WhatsApp instalado o
iOS abriu o Safari numa página em branco, e a queda para a folha de compartilhar, que existia
exatamente para esse caso, nunca chegou a rodar. Agora pergunta-se pelo esquema
(`whatsapp://`, com `LSApplicationQueriesSchemes` em `app.json`) e a resposta é honesta.

## A camada emocional

`docs/emocao/ESTUDO.md` inventaria as mecânicas do Duolingo e mapeia cada uma nos objetos
deste domínio. O achado central não é uma animação: **três números reais já viajam da API e a
tela jogava fora** — a carga executada da última vez, o recorde anterior, e o protetor de
ofensiva. E o Retorno do personal já carrega recorde e esforço, ou seja, o app sabe que uma
pessoa de verdade vê aquilo e nunca contou isso ao aluno.

Essa é a alavanca que a referência não tem: lá existe um mascote, aqui existe alguém do outro
lado.

O que entrou: `ui/Troca.tsx` (o valor anterior abre a cena e é substituído pelo de agora,
sequencial e não cross-fade, altura estável do primeiro ao último quadro), o Descanso
imprimindo a série **gravada** em vez da prescrição, e "VOCÊ SUBIU 5 KG" no lugar de "ÚLTIMA
VEZ · 60 KG" — mesmo slot, zero toque. `toques_serie` intocado: comemoração que custa toque
é fricção com fantasia.

## Acessibilidade da cor

`nomeDaCor` é **derivada** de matiz/saturação/claridade, e não tabelada, por um motivo que a
tabela não resolve: a cor **livre** também precisa de nome, e cardápio nenhum alcança uma cor
digitada. As dez sugestões caem onde deveriam cair, e uma cor qualquer ganha nome com
claridade ("verde escuro", "rosa claro").
