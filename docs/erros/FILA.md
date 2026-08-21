# A fila dos erros — auditoria adversarial do ciclo 9

O dono terminou a mensagem dele com *"tem muitos erros aqui, muita coisa que precisa ser
resolvida"*. Um crítico leu todas as telas dos dois lados do produto procurando os erros
que ele NÃO nomeou. Vinte e cinco defeitos verificados no código. Oito foram consertados no
ciclo 9; o resto é esta fila, na ordem em que machuca quem está com o celular na mão.

Uma correção ao relatório: o item que dizia que `Revisao.tsx` imprimia um enum cru
(`row.suggested`) **não se confirmou**. Rastreei o campo até a API: `OwnerWeekItem.Suggested`
já sai em prosa ("manter", "+2,5 kg no supino", "versão curta"). O enum de verdade
(`nudge`/`renew`/`keep`) mora em outro campo, e esse nunca chega cru na tela. Achado
descartado — não vale consertar o que não está quebrado.

## Consertado no ciclo 9

| | o defeito | o conserto |
|---|---|---|
| 1 | **Aluna presa dentro do treino.** `Serie.tsx` com item ausente desenhava uma frase e nada mais — e a tela roda com `headerShown: false` e `gestureEnabled: false`. A única saída era matar o app, no meio da sessão, com treino guardado no celular | `Head` com a frase honesta + `DockFooter` com saída |
| 2 | **A aba Semana se trancava.** Depois de aprovar uma vez, o recibo ficava para sempre: nada zerava `done` e o `useFocusEffect` ainda voltava cedo por causa dele | botão "Ver a semana" + o foco volta a carregar |
| 3 | **O recibo mentia sobre a tela do aluno.** Prometia, entre aspas, que ele recebia `"{time} revisou sua semana"` — frase apagada do app do aluno no ciclo 5 porque ninguém revisou semana nenhuma | diz o que acontece: a carga entra na próxima ficha, nada é avisado hoje |
| 4 | **A entrada pedia consentimento para uma notificação que não existe.** `expo-notifications` não está instalado; a última tela da entrada dizia "o aviso chega aqui" e o botão dizia "Quero o aviso" | a alavanca que sempre foi a de verdade — a PESSOA que monta a sessão — sem prometer o aviso |
| 5 | **"Terminar por aqui" não podia ser tocado.** `disabled={!effort}`, e as fichas que definem `effort` só aparecem quando o exercício fecha: entre séries do mesmo exercício, retângulo morto | a mesma guarda do botão principal |
| 6 | **O convite contradizia a primeira tela.** A mensagem saía na voz do personal dizendo "não precisa de código nem de senha", e `Access.tsx` exige os quatro dígitos do SMS | a mensagem conta do SMS, e diz por quê |
| 7 | **"Não deu para falar com a API. Ela está no ar?"** na tela que todo aluno de todo personal vê — o exemplo mais literal da reclamação do dono | "Sem conexão agora. Confira a internet e tente de novo." |
| 8 | **Um botão sem palavra nenhuma.** `Atencao` lia `row.decision` cru; vazia, o botão virava um retângulo de acento tocável | a queda que o Painel já tinha |

Mais dois de vocabulário e coerência: "Escolhe o **piso**" na tela do primeiro combinado
(a mesma metáfora que o dono recusou em "chão"), e a primeira linha da fila de Atenção
desenhada em `role="title"` enquanto as outras em `role="body"` — depois do ciclo 9 isso
deixou de ser ênfase de tamanho e virou **duas famílias de letra na mesma fila**.

## A fila, por ordem de dor

### 1. O aluno não tem como tentar de novo
`Hoje.tsx` grava "Não deu para abrir o hoje." e desenha uma linha — sem botão, sem puxar
para atualizar, e o efeito só roda em `[token]`. Uma falha de rede às 6h deixa a casa dela
quebrada até matar o app. `FichaTab` e `Painel` já oferecem "Tentar de novo" para a mesma
falha: o app sabe a resposta e não a aplica na tela mais importante. Mesmo buraco em
`Atencao`, `Aluna`, `Perfil` e `Progresso`. Some-se: `request()` não tem timeout nem
`AbortController`, então "Abrindo o dia…" pode ficar aberto para sempre.

### 2. A comemoração inventa XP quando o celular está sem rede
`xpGained: finish?.xp_gained ?? 10` — e a tela imprime "+10 XP" e anima a ofensiva. O
estudo da emoção proíbe isso com todas as letras: *"o único número que pode crescer é um
que um corpo levantou."* Quando a fila sobe, o total real discorda do que ela viu.

### 3. Seis respostas da entrada caem num buraco, e uma delas é uma promessa
`experience`, `days_per_week`, `pain`, `sex`, `height_cm`, `weight_kg` são coletados e
**nenhum aparece em tela nenhuma do personal**. E a tela diz: *"Se marcar sim, o {time} te
liga antes de montar a ficha."* Ele não tem como ver que ela marcou. Uma iniciante conta de
uma dor no joelho na porta de entrada e quem vai prescrever agachamento nunca fica sabendo.

### 4. "Ver como fazer" é uma sala vazia em quase todo exercício
`src/exerciseCues.ts` tem **três** entradas. Todo o resto cai em "pergunte ao {time} na
hora" — para uma iniciante que acabou de responder que nunca treinou, no único lugar do app
que ensina alguma coisa. Com `video_url` morto e `notes` sem editor, esta tela não tem
nenhum caminho de conteúdo.

### 5. `notes` — "a única frase escrita pela mão do personal" — não tem editor
Aparece em quatro superfícies do aluno como a voz dele, inclusive com "{time} disse".
`grep notes src/screens/owner/` não devolve nada, e `patchPrescriptionItem` não manda o
campo. O aparato inteiro da voz do personal, do lado do aluno, é decorativo.

### 6. O passo de carga que o personal configura, o editor dele ignora
`ComoFunciona` vende `passo_kg`; `Ajustar.tsx` crava `const STEP = 2.5`. Um fisio que põe
1 kg para idosos continua montando ficha de 2,5 em 2,5. E no lado do aluno as dicas de
leitor de tela dizem "Menos dois e meio" cravado, então uma aluna cega de um time de 0,5 kg
ouve o número errado.

### 7. Salvar o nome num lugar desfaz a configuração feita no outro
`PerfilTime` guarda uma cópia da config em `useState` e nunca ressincroniza. Depois de
salvar em `ComoFunciona`, "Salvar" acende sozinho numa tela que ele não tocou — e grava os
valores velhos por cima do que ele acabou de escolher.

### 8. Um botão escrito "Pix" que não faz Pix
`agir()` não tem `case "pix"`, então cai no `default` e navega para o perfil.

### 9. Um personal novo nunca publica a primeira ficha
`Base.tsx` pega `models.items[0]` e mais nada. Lista vazia: uma frase técnica, sem ação, e
"Continuar" desligado para sempre — numa tela sem cabeçalho. Com cinco modelos, ele nunca
alcança do segundo em diante, e a tela apresenta o primeiro como se fosse escolha.

### 10. "Protetor" desenhado de quatro jeitos, um deles marca de falha e um deles zero cravado
Inclusive `value={0}` literal, ignorando o payload, e "Protetor **gasto**" — marca de falha
que este produto não desenha em lugar nenhum. E ela nunca é informada do que é um protetor
antes de ser informada de que perdeu o dela.

### 11. Onze controles cuja saída ninguém além dela vê
A aluna escolhe foto e cor de avatar sob o título "Como você aparece". O personal vê
`Initials` em todas as seis telas onde ela aparece, e a liga é só nomes.

### 12. O resto
`MaquinaOcupada` oferece trocar um exercício por outro que já está na sessão de hoje. Os
selos têm três nomes cada, e um deles é anunciado na config e não existe na API. "Publicar"
vaza para o vocabulário da aluna. `Convite` crava "quatro anos" enquanto a API devolve
`expires_at`. `time.name` é usado onde cabe nome de gente ("O Iron Lab pediu 90s"), com
artigo numa tela e sem artigo na seguinte. E `previous_kg` é gasto duas vezes — uma no
Feito e outra no Recorde, um toque depois, que estraga a própria revelação.
