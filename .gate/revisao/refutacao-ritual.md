# Refutação — eixo3 ritual-aluno · veredito do crítico cego: "empatou"

Checagem no pixel (tools/out/design/0/) e no código, contra os arquivos da barra
(docs/barra/eixo3-ritual-aluno/NOTAS.md). Regra aplicada: regra sem arquivo da barra
é palpite; shot estático não prova passagem de tempo; na dúvida com evidência fraca
dos dois lados, o veredito fica.

## Alegação 1 — "HojeCumprido sem fim visível do dia" → NÃO SE SUSTENTA

`Hoje.png`: contador do chrome em **12, ícone cinza**. `HojeCumprido.png`: **13, ícone
aceso em laranja**. Isso é literalmente a regra da barra (NOTAS §2, `duolingo-17` vs
`duolingo-19`/`-06`): "o medidor não muda de forma nem de posição; muda só de
saturação. Estado é cor, não é tela nova" — e a implicação escrita para o LinkGym é
exatamente essa: "o número da Ofensiva no chrome, em cinza, acende quando a Sessão
fecha. Zero toque para saber se hoje está pendente." O crítico tratou a semelhança
das telas como defeito; a semelhança É a regra copiada. O "Começar · 52 MIN" que
permanece também tem cobertura: na barra o caminho continua utilizável depois de o
dia fechar (§7: uma lição fecha o dia; fazer mais é permitido, nunca cobrado).
Exigir um estado "feito" no cartão seria regra sem arquivo — nenhuma captura
coletada mostra a home do Duolingo pós-fechamento com o nó marcado.

## Alegação 2 — "Feito com 5 números concorrentes" → REAL

`Feito.png` empilha: Séries 20, Movido 10.863 kg, Tempo 47 min, **214** ofensiva,
+40 XP, Carga de hoje 127,5 kg (com "antes 120 kg"). Contra `duolingo-11` (arquivo
da barra): "**uma tela = um número = um botão.** O ganho da sessão e a sequência não
dividem a mesma tela; cada um tem a sua, na ordem." E a implicação já registrada na
própria NOTAS §6: "o retorno da sessão deve separar 'o que você fez hoje' de 'sua
Ofensiva' em duas telas curtas, **não empilhar**." O 214 tem o tamanho certo e a
virada de fundo para o acento bate com `duolingo-09`, mas a proporção da celebração
(4,2 : 1 : 0,38 em `duolingo-06` — o número é a tela, e nada mais) é violada pelos
seis números concorrentes. Defeito real, com arquivo.

## Alegação 3 — "Descanso sem passagem de tempo e sem −10s/+10s" → METADE CAI

- "Tempo não passa": shot é estático; cronômetro e barra de progresso não aparecem
  andando em captura. Não conta — mesma limitação declarada na própria barra ("não
  dá para contar toque em imagem estática"; nenhum arquivo mostra transição).
- Ausência de ±10s: `strong-04` mostra −10s/+10s/Skip. `Descanso.png` tem o Skip
  ("Pular descanso") e saída explícita ("Terminar por aqui"), zero teclado, zero
  campo numérico, e o descanso é atributo do exercício ("O Fred pediu 180s entre as
  séries deste exercício" = a linha Rest Timer por exercício de `hevy-02`/`-11`).
  As regras medíveis da barra (§6: sem teclado, sem roda, saída explícita, duração
  pertence ao exercício) estão todas cumpridas. O ±10s do Strong existe porque lá o
  atleta é dono do descanso; aqui quem prescreve é o personal — domínio do produto.
  Falta fraca, não grave.

## Alegação 4 — "Série 1 concluída aparecendo vazia" → NÃO É DO PRODUTO

`Serie.png` mostra a linha 1 sem valor e sem check. Causa: `tools/fixtures.ts`
(`session()`, linha ~318) põe `setIndex: 2` com `localId: "cs-shot-0001"` **sem
semear nenhum set** no `sessionQueue` — `doneSets` sai vazio no shot. No produto o
único caminho de série 1 → série 2 é `onDone()` → `enqueueSet()` (Serie.tsx:98-127);
uma série passada sem registro é estado inalcançável. A linha 1 até distingue estado
(numeral em tinta cheia vs. o "3" apagado — ausência de marca, nunca acusação).
Lacuna da fixture, não defeito da tela. (Fica anotado: a fixture deveria semear o
set 1 para o artefato não mentir contra si.)

## Alegação 5 — "prefill 127,5 difere da Última vez 132,5" → NÃO É BUG

Serie.tsx:85: `setLoad(lastLoadForItem(stored, item.id, item.load_kg))` — o prefill
é a série anterior DESTA sessão, com fallback na **prescrição do personal**
(`item.load_kg` = 127,5). A nota "Última vez · 132,5 kg × 6" é `item.last_kg`, a
referência histórica do corpo (linhas 146-172, com o raciocínio escrito no próprio
código). São duas referências distintas por desenho: quem manda na carga é o
personal, o histórico informa. O Hevy prefilla o Previous porque não existe personal
no Hevy; a cascata da barra (§3: "sessão anterior → série anterior → **alvo
prescrito na rotina**") já admite a prescrição como fonte. Domínio certo do produto.

## (b) O registro acima da barra se confirma? → SIM

`Serie.png`: referência da última vez na própria tela de entrada (equivalente da
coluna Previous, regra §1); carga pré-preenchida e sobrescrevível em passo fixo de
2,5 kg sem teclado (§2/§3, e ainda com gesto de arrasto); confirmação em alvo único
— "Fiz essa série" é o único CTA cheio (§5/§7). O que a barra prova, a tela cumpre
ou excede (os steppers eliminam até a digitação que H2 deixou em aberto).

## Conclusão

Dos cinco defeitos, três caem (1, 4, 5), um cai pela metade (3) e **um fica de pé
com arquivo da barra** (2: Feito empilha o ganho da sessão com a Ofensiva, contra
`duolingo-11`). "Perdeu" não se sustenta: o defeito central do crítico (HojeCumprido)
era na verdade a regra da barra cumprida. "Venceu" também não: a celebração — miolo
deste eixo — viola uma regra medida num arquivo coletado. Registro acima da barra +
celebração abaixo dela = empate. O veredito fica.

VEREDITO: SUSTENTADO
