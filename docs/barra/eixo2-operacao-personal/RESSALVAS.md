# Eixo 2 — ressalvas que screenshot não carrega

Este arquivo existe porque duas coisas podem invalidar a comparação do eixo 2, e imagem
nenhuma avisa sobre elas. Quem for julgar o eixo 2 lê isto antes de olhar os PNGs.

## 1. MFIT IA existe. O fluxo manual de 7 passos é espantalho.

> **CORREÇÃO (procedência).** A primeira versão desta seção dizia que `mfit-10` era
> "screenshot oficial da App Store". **Estava errado, e o erro era meu.** O agente que
> coletou este diretório rastreou a procedência arquivo por arquivo e me corrigiu: `mfit-10`
> e `mfit-11` vêm de `blog.mfitpersonal.com.br/mfit-personal-atualizacoes-app-2026/`.
> Nenhuma das 7 screenshots de loja mostra a MFIT IA. Ver a tabela de fontes em `NOTAS.md`,
> que é a procedência verificada. Blog oficial da própria MFIT continua sendo fonte
> primária e verificável — só não é a App Store, e num arquivo sobre disciplina de
> procedência a diferença importa.

**Verificado com os próprios olhos** em `mfit-10-ia-4-campos-gerar-treino.png` (imagem do
blog oficial da MFIT): a MFIT prescreve por IA.

A tela "Configure seu treino" tem **4 campos e um botão**:

| campo | valor no screenshot |
| --- | --- |
| Grupos musculares | `superiores` |
| Tipo de exercícios | `Apenas exercícios do app` (select) |
| Quantidade de exercícios | `5` |
| Descrição | texto livre: "Preciso de um treino de superiores para aluno iniciante" |

E então `Gerar treino`. A saída está em `mfit-11-ia-treino-pronto-series-reps-intervalo.png`.

**Consequência:** qualquer comparação que meça o LinkGym contra o fluxo manual da MFIT
(Biblioteca → Adicionar → Nova rotina → preencher → selecionar exercícios → personalizar
séries → finalizar → associar ao aluno) está julgando contra um caminho que a MFIT não
obriga mais ninguém a usar. Isso infla a nossa vitória e é proibido.

O custo real da MFIT para montar a estrutura de **um** treino é ~4 campos + 1 botão.

## 2. A MFIT TEM ação em lote. Só não é na prescrição.

Corrige a leitura anterior de que "a MFIT não tem lote".

**Verificado** em `mfit-03-feedbacks-fila-resolver-todos-11.png`: existe o botão
**`Resolver todos (11)`** — lote, com a contagem no próprio rótulo.

O que a tela mostra, item por item:

- fila de feedbacks, um cartão por sessão finalizada de aluno
- cada cartão: nome, data, "Treino Finalizado.", início e fim do treino, "Ver mais"
- **três** botões por cartão: `Ver Treino`, `Resolver`, `Responder`
- 11 itens na fila, com o lote como escape

**O que isso significa para a nossa aposta.** A fila é plana: os 11 cartões são visualmente
idênticos e nada indica quem precisa de atenção primeiro. Com 3 botões por cartão, são ~33
ações disputando a mesma tela. O `Resolver todos (11)` é a admissão de que a lista virou
ruído — se cada item merecesse atenção, não haveria botão para descartar todos de uma vez.

O `CONTEXT.md` do LinkGym já modelou o contrário, no verbete **Atenção do dia**:
"Fila curta de alunos daquele time que precisam de um toque agora. Nunca a turma inteira.
O protótipo cabe em 3."

Então a aposta do eixo 2, em forma falsificável: **ranquear vence resolver-todos.** Três
itens ordenados por quem precisa mais, cada um com UMA ação sugerida, vencem onze itens
indiferenciados com três botões cada e uma válvula de escape.

Se um crítico cego preferir a fila de 11 da MFIT, a aposta estava errada e a gente refaz.

## 3. O que NÃO dá para medir nestes arquivos

- **São peças de marketing da App Store**, não capturas limpas de UI. Vários estão em
  telefone inclinado, com corte e copy promocional por cima (`mfit-03` é o caso claro).
  Não é possível medir espaçamento, escala tipográfica ou alinhamento com precisão neles.
  Use-os para MECÂNICA e HIERARQUIA, nunca para medir pixel.
- **Não existe contagem de toques publicada da MFIT.** Passo de artigo de ajuda não é toque
  de app: um "passo" documentado pode ser 1 toque ou 6. Se alguém citar os 7-8 passos do
  fluxo manual, tem que rotular como "passos documentados", nunca como toques.
- O site de ajuda `ajuda.mfitpersonal.com.br` está com **TLS expirado** (Sectigo DV, venceu
  em 24/jun/2026; hoje é 18/ago/2026). Subject e issuer conferem, então é desleixo e não
  ataque.
- **Canal fraco declarado:** o `NOTAS.md` deste diretório registra que os artigos de ajuda
  da MFIT foram lidos **ignorando a verificação de certificado**. Foi leitura pública, sem
  login e sem formulário, então o risco prático é baixo — mas é um canal não verificado, e
  os totais de toque (≈66 manual, ≈13–14 com IA) derivam em parte dele.
  **Dupla ressalva sobre esses números:** (1) canal não verificado; (2) são *passos
  documentados convertidos em toques*, e um passo de artigo pode valer 1 toque ou 6.
  Use-os como ordem de grandeza. Nunca cite "66 toques" como medição de app.
  A única forma de transformar isso em número forte é contar em vídeo oficial ou instalar
  a MFIT e cronometrar. Até lá, o número honesto do eixo 2 é a INCLINAÇÃO, não o absoluto.

## 4. Como medir o eixo 2, então

Não meça o valor absoluto de toques. Meça a **inclinação**:

```
toques(prescrever para 1 aluno)  vs  toques(prescrever para 20 alunos)
```

- MFIT: a IA barateia o treino de **um** aluno, mas a associação continua sendo por aluno
  (`Alunos → nome do aluno`). Cresce com n.
- LinkGym: `CONTEXT.md`, verbete **Modelo** — "Publicar em lote replica o modelo, nunca a
  carga." Tem que ficar aproximadamente plano em n.

Se a nossa curva não for plana, o lote não está entregando o que o domínio promete, e isso
é defeito de produto, não de UI.

---

As imagens deste diretório são referência interna de pesquisa. Não entram no app, não são
republicadas, e nenhuma tela do LinkGym é clonada a partir delas. Copia-se o ofício, nunca
a identidade.

---

## 5. A MFIT é a número 1 do mercado E tem design odiado. As duas coisas juntas.

Informação do Vitor, quem decide o produto: a MFIT é o app número um dos personais, e o design
dela é detestado — "quebrado, vazio, ruim".

Isso não é fofoca, é a instrução mais importante deste arquivo, por dois motivos.

**Primeiro: o que retém personal não é beleza.** Um app pode liderar o mercado com design
ruim se o trabalho sair. Então o eixo 2 não pode trocar operação por acabamento. Se a nossa
tela ficar linda e o personal levar mais toque para publicar, perdemos o eixo — mesmo com
crítico aplaudindo.

**Segundo, e é um defeito de método que precisa ficar consertado aqui:** um crítico cego
comparando a nossa tela de owner contra a tela da MFIT vai escolher a nossa pelo VISUAL, e
não vai ter testado operação nenhuma. Vitória fácil, aprendizado zero, eixo declarado pronto
sem nunca ter sido medido.

### Como julgar tela de owner, então

| o que se julga | contra quem | como |
| --- | --- | --- |
| **Operação** | MFIT | fluxo executado: toques, tempo, e a inclinação de 1 → 20 alunos |
| **Ofício** | Whoop (eixo 1) | densidade, hierarquia, estado vazio/carregando/erro |

A MFIT **nunca** é referência visual. Nem de tela de owner. O ofício da tela do personal se
mede contra o Whoop, igual à tela do aluno.

### O que a MFIT ensina por contraste (o "vazio" é medível)

Em `mfit-03-feedbacks-fila-resolver-todos-11.png`, três defeitos concretos que a nossa tela
de Atenção do dia não pode repetir:

1. **Cartão branco sobre chrome escuro** — dois sistemas visuais na mesma tela, sem que a
   troca signifique nada.
2. **Três botões por cartão × 11 cartões** — ~33 ações disputando prioridade. Nenhuma delas
   é a ação óbvia. Compare com o domínio: Atenção do dia tem UMA ação sugerida por aluno.
3. **Muito espaço, pouco fato** — o cartão gasta quatro linhas em início/fim de treino com
   data repetida ("23/05/2024 14:02" duas vezes), e esconde o resto atrás de "Ver mais".
   É isso que "vazio" quer dizer: área grande carregando pouca informação. O oposto da
   densidade do Whoop.
