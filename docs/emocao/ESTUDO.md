# Emoção — o inventário, o mapeamento e a fila

Fonte da pesquisa: `docs/barra/eixo3-ritual-aluno/NOTAS.md` (Duolingo medido em pixel e em
quadro; Hevy e Strong medidos na tabela de série). Fonte do domínio:
`../linkgym-api/CONTEXT.md`. Nada aqui é lembrança de como o Duolingo "parece" — cada
mecânica citada tem arquivo atrás.

O que faz o Duolingo ser emocional não é a coruja. A coruja é a **cara** de mecânicas que
funcionariam sem ela. Este documento lista as mecânicas, mapeia cada uma no que ESTE
produto já tem, e ranqueia intervenções por emoção gerada ÷ custo de implementação.

---

## 1. Inventário: as mecânicas de verdade

### M1 — O ativo que só existe enquanto você aparece
O número da sequência sobe sozinho enquanto você cumpre e volta a zero quando você some.
A emoção não é a recompensa; é o **patrimônio em risco**. Para funcionar, o número tem que
estar visível ANTES do ato — `duolingo-17` mostra o contador no chrome do topo, **em
cinza**, com o dia ainda aberto; em `duolingo-19` o mesmo número, no mesmo lugar, na mesma
forma, aceso. Estado é cor, não é tela nova.

### M2 — O seguro vendido antes do estrago
`duolingo-10`: o protetor é oferecido **antes** da falha, com o número de dias já em risco
no título. Depois do estrago ele não é oferecido — porque depois do estrago ele não é
alívio, é sal. A emoção é "este app está do meu lado e sabe o que eu tenho a perder".

### M3 — Celebração dimensionada ao esforço
Duas magnitudes, medidas: o acerto dentro da lição troca o enunciado por uma palavra no
MESMO slot, sem modal (`duolingo-08`), e a barra do topo muda de tom quando a série de
acertos cresce (`duolingo-04`) — recompensa numa peça que **já estava na tela**, zero
navegação. O marco raro, esse sim, vira a tela inteira por 7,5 s (`duolingo-09`). Um app
que comemora tudo igual não comemora nada: o valor da festa grande vem de a festa pequena
existir e ser pequena.

### M4 — Antecipação antes do resultado
`duolingo-09`, cronometrado no GIF: 0,00 → 3,65 s só o número e o mascote; **3,70 s** o
fundo vira de borda a borda; **5,90 s** os botões aparecem. Seis segundos de suspense que
não custam um toque, porque a saída já está desenhada no lugar dela desde o primeiro
quadro. Espera que não bloqueia não é fricção — é ritmo.

### M5 — O número anterior sendo SUBSTITUÍDO pelo novo
`duolingo-13`: o valor antigo aparece pequeno e mudo e é trocado pelo novo, grande. A
conquista não é anunciada por um texto: **ela é o número trocando de lugar consigo mesmo.**
É a mecânica mais barata e mais forte do inventário inteiro, e a única que não precisa de
personagem nenhum.

### M6 — Reconhecimento no instante exato
`duolingo-04`, `-08`: a recompensa acontece no componente que já estava ali, no quadro em
que o ato acontece. Não há tela de resultado no meio da lição. Emoção adiada é emoção
diluída — quem sente o recorde é o corpo, e o corpo sente no segundo em que a barra sobe,
não seis minutos depois no resumo.

### M7 — Falha é AUSÊNCIA de marca, nunca marca de falha
`duolingo-19`: os dias perdidos do calendário são **numeral cinza idêntico ao de qualquer
dia futuro**. Sem X, sem vermelho, sem contagem do que se perdeu. `duolingo-20`: quando a
sequência zera, o fato é dito **uma vez, no número**, numa faixa fechável sobre a home —
não num modal, e o caminho continua utilizável atrás.

### M8 — O menor ato fecha o dia; a ambição é medidor paralelo que não pune
`duolingo-12` (regra antiga) × `duolingo-11` (nova): o dia passou a fechar com UMA lição, e
a meta virou barra separada logo abaixo. O pedido de "faça mais" é uma frase de apoio
embaixo do ganho, **nunca um botão**.

### M9 — Segunda pessoa, uma frase, uma palavra em cor
`duolingo-03`, `-05`: instrução em balão curto com uma palavra destacada. Nunca parágrafo.

### M10 — Uma tela = um número = um botão
`duolingo-11`: o ganho da sessão e a sequência não dividem a mesma tela. Cada um tem a sua,
na ordem.

### M11 — A referência da última vez fica DENTRO da linha de entrada
Hevy e Strong, dois concorrentes, mesma tabela: `Set · Previous · kg · Reps · ✓`
(`hevy-11`, `strong-01`). E o campo já vem preenchido com o valor da coluna `Previous`
(`hevy-11`, Bench Press linha 3: `Previous 70×6` → `KG 70 · REPS 6`). O passado não fica
atrás de um toque: ele está no mesmo pixel onde o presente vai ser escrito.

### M12 — A coruja
Um personagem que reage. É a mecânica mais visível e a **menos** transferível — e a que
este produto não precisa copiar, pelo motivo da seção 3.

---

## 2. Mapeamento: o que ESTE produto tem

| # | Mecânica | O objeto aqui | Estado hoje |
| --- | --- | --- | --- |
| M1 | ativo em risco | **Ofensiva** (Cumprimentos no Vínculo) | existe na API e na Hoje; não é o chrome cinza→aceso de `duolingo-17` |
| M2 | seguro antes do estrago | **Protetor** (`protector_available`) | existe no payload, **nunca é oferecido na tela**; o aluno descobre que tinha um depois de ele ter sido gasto |
| M3 | festa dimensionada | Feito (virada de fundo, 3,7 s + 5,9 s) | existe — mas roda **idêntica na sessão 2 e na sessão 200**. A magnitude não é lida em lugar nenhum |
| M4 | antecipação | Feito | existe, bem feita. **Recorde não tem nenhuma** |
| M5 | número substituído | Recorde (PR anterior → novo) | o comentário do arquivo descreve a mecânica; a tela mostra os dois números lado a lado, parados |
| M6 | instante exato | fim da série (`Serie` → `Descanso`) | **vazio**. O PR só é reconhecido no fim da sessão, 18 séries depois |
| M7 | ausência de marca | Retomada, lista de séries, calendário | **respeitado com rigor** — é o eixo mais forte do app hoje |
| M8 | menor ato + ambição paralela | Compromisso (Combinado × Extra) | **respeitado**; a semana inteira desenhada, o extra sem marca de falta |
| M9 | segunda pessoa, uma palavra em cor | Pronto, Serie | quase todo lugar |
| M10 | uma tela, um número | Feito / Recorde / Compromisso | respeitado |
| M11 | última vez dentro da linha | `item.last_kg` / `last_reps` | **chega da API e é desenhado na Serie**; some no resto do ciclo |
| M12 | coruja | **um personal de verdade** | ver abaixo |

### O que a API entrega e a tela joga fora

Três números reais que já viajam e que quase ninguém usa:

- `TodayItem.last_kg` / `last_reps` — **a série EXECUTADA da última vez naquele exercício**
  (`internal/today/service.go:96`, sai de `workout_sets`, não da prescrição). Só a Serie
  desenha. O Descanso, que é a tela seguinte, mostra a carga PRESCRITA como se fosse o que
  a pessoa fez.
- `FinishRecord.previous_kg` — o recorde ANTERIOR da pessoa naquele exercício
  (`internal/workout/service.go:548`, lido de `personal_records`). É o valor exato que a
  mecânica M5 existe para substituir.
- `Ofensiva.protector_available` — o seguro de M2, nunca mostrado antes de ser gasto.

---

## 3. A alavanca que o Duolingo não tem: existe uma pessoa do outro lado

A coruja não vê ninguém. Ela reage a um evento, não a você. O personal **vê** — e isso é
verificável no código, não é promessa de marketing:

- `internal/owner/service.go:121` — o Retorno do personal carrega `records []Record`. **O
  recorde que o aluno bateu hoje chega na tela de trabalho de uma pessoa hoje.**
- `internal/owner/service.go:120` — o mesmo Retorno carrega `effort`. **A palavra que o
  aluno toca no Descanso é lida por alguém** e vira o `bumpKg` da próxima ficha
  (`applyOwnerReturn`).
- `Prescrição` — a sessão de amanhã não é gerada; é montada à mão por alguém que conhece o
  nome dele.

O app sabe de tudo isso e **não conta**. O aluno toca "Difícil" achando que está
alimentando um banco de dados. A intervenção mais barata do produto inteiro é: toda vez que
o app recebe um sinal do aluno, dizer **quem recebe** e **o que muda**. Isso não é
gamificação, não é recompensa fabricada, e não é frase assinada pelo personal — é o
funcionamento verdadeiro do produto, dito em voz alta.

O limite, e ele é duro: o app só pode pôr na boca dele o que ele digitou (`boas_vindas`,
`retomada`, `notes` do item). Tudo o mais é voz do produto FALANDO SOBRE ele — "quem monta
sua sessão vê isso hoje" é fato do sistema; "estou orgulhoso de você — Fred" é falsificação.

---

## 4. Fila ranqueada — emoção ÷ custo

Ranqueada de verdade: o topo é o que muda mais sensação por linha escrita. `[F]` = feito
nesta rodada; `[✗]` = mora em arquivo de outro agente nesta rodada.

1. **[F] O Descanso passa a dizer o que o CORPO fez, e não o que a ficha pediu.** Hoje o
   cabeçalho da tela de descanso imprime `item.load_kg × planned_reps` — a prescrição. Quem
   acabou de levantar 65 kg lê "60 kg × 8" no segundo seguinte ao esforço. O conserto lê a
   série **gravada** em disco (`loadSession`) e mostra ela. Defeito de verdade antes de ser
   emoção: o único momento em que o app fala sobre o ato que acabou de acontecer, e ele
   fala errado. (M6, M11)
2. **[F] O reconhecimento no instante: quando a carga registrada supera a última vez
   naquele exercício, `ÚLTIMA VEZ · 60 KG` é SUBSTITUÍDO por `VOCÊ SUBIU 5 KG` no mesmo
   slot, sem modal, sem toque, sem atraso.** O slot existe desde o primeiro quadro (a linha
   da última vez é permanente, como a coluna `Previous` do Hevy), então nada salta. Zero
   toque a mais — a catraca `toques_serie` continua em 2. É M5 aplicada onde M6 pede.
3. **[F] O Recorde executa a substituição em vez de descrever os dois números.** O recorde
   ANTERIOR (`previous_kg`, número real do banco) abre a tela em corpo mega e é trocado pelo
   de agora. Sem recorde anterior, nenhuma troca acontece — primeira vez no exercício não
   ganha teatro inventado. O botão está na doca desde o quadro zero: quem tem pressa toca e
   sai no meio da animação. (M4, M5, M10)
4. **[F] O humano nomeado nos dois pontos em que ele realmente age.** No Recorde: "quem
   monta sua sessão vê isso hoje" (fato: `ReturnItem.Records`). No Descanso, antes da
   palavra de esforço: "quem monta a próxima lê isso" (fato: `ReturnItem.Effort` →
   `applyOwnerReturn`). Duas frases. Nenhuma assinada por ele. (seção 3)
5. **[F] A Retomada para de exibir um zero embaixo do rótulo "o que continua de pé".**
   Depois de 11 dias fora a Ofensiva é literalmente 0 (`current_count = 0`,
   `internal/today/service.go:461`) — e a faixa que existe para dizer o que sobrou mostra
   um zero em corpo de métrica. Ausência de marca, nunca marca de falta: a célula da
   Ofensiva só entra quando ela continua de pé. O XP, que não zera, fica sempre. (M7)
6. **[F] O Pronto nomeia quem vai mandar a próxima sessão.** A tela emoldura a permissão de
   aviso (regra certa, de `duolingo-15`) mas o aviso não tem remetente: "toda sessão nova
   chega por aviso" é um app falando de si. Com o nome, é uma pessoa combinando de te
   chamar. Uma linha. (M9, seção 3)
7. **[✗ `Hoje.tsx`] A Ofensiva no chrome, cinza enquanto o dia está aberto, acesa quando a
   Sessão fecha.** É M1 inteira, é a mecânica nº 1 do Duolingo, e custa um número num
   canto. `cumprido` já vem no payload. Zero toque para saber se hoje está pendente.
8. **[✗ `Hoje.tsx`] O Protetor oferecido ANTES do estrago**, com o número de Cumprimentos em
   risco na frase. `protector_available` já viaja. É M2, e hoje o produto tem o mecanismo
   sem ter o momento — o aluno nunca sabe que foi protegido.
9. **[✗ `Feito.tsx`] Dimensionar a festa.** A virada de 3,7 s + 5,9 s é a maior espera do
   sistema e roda igual em toda sessão. Ela deveria escalar com o que aconteceu: sessão
   comum = a régua da própria tela acende (M3 barato, `duolingo-04`); marco raro (primeiro
   Cumprimento, recorde, semana do Combinado fechada) = a virada inteira. Hoje a festa
   grande está barateada por repetição.
10. **[✗ `Publicar.tsx` / API] `coach_line` assinada.** O app assina em nome do personal uma
    frase que ele não escreveu. Enquanto isso for verdade, toda frase humana do app é
    suspeita — e uma comemoração falsa custa o direito de comemorar de novo. Já está aberto
    em `.gate/estado.json` → `defeitos_abertos.ritual`.
11. **[adiado] A seta da Serie compara com o que o personal PEDIU, não com o que o corpo
    fez.** `dir` sai de `load` × `asked`. Progresso pessoal é `load` × `last_kg`; obediência
    é `load` × `asked`. Trocar mexe num bloco de hierarquia que já foi afinado por juiz
    cego (`pedido`/`desviou`), e a nota da Serie já carrega a última vez. Fica registrado
    como decisão de significado, não como defeito.
12. **[adiado] Progressão em REPETIÇÃO na mesma carga.** `last_reps` chega da API e mesma
    carga com mais repetições é progresso real. Dois sinais concorrentes no mesmo slot
    diluem o primeiro; entra quando o slot tiver como ranquear os dois.
13. **[adiado] `item.notes` — a voz literal do personal — mora embaixo da lista de séries
    da Serie, provavelmente fora da dobra.** É o único texto do app escrito pela mão dele.
    Subir exige remexer o ritmo vertical da tela mais usada do produto, e a catraca `ritmo`
    mede exatamente isso em captura — não se mexe sem poder rodar `tools/shots.mjs`, que
    nesta rodada é de outro agente.

---

## 5. O que este documento recusa

- **Moeda inventada, gema, contador que sobe sozinho, confete em cima de toque qualquer.**
  Aqui a emoção sai de esforço RECONHECIDO. O único número que pode crescer é um que um
  corpo levantou.
- **Comemoração que custa toque.** Toda festa acrescentada nesta rodada acontece em slot
  que já existia, sai do caminho sozinha, e não move o botão de lugar. `toques_serie`
  continua em 2.
- **Comemorar o que não aconteceu.** `last_kg` é a ÚLTIMA VEZ, não o recorde — então a
  linha do Descanso diz "última vez", nunca "recorde". Recorde é `personal_records`, e
  quem fala dele é a tela Recorde, com `previous_kg` na mão. Sem número anterior, nenhuma
  troca é desenhada.
- **Palavra na boca do personal.** Só `boas_vindas`, `retomada` e `notes` são dele. O resto
  é o produto falando SOBRE ele, e só o que é verificável no código.
