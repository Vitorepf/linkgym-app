# Prontidão para o proto — o que está travado, o que é tese, o que falta

21 ago 2026. Resposta honesta à pergunta: *temos os dados para o MVP clicável e para decidir?*

Complementa: `estrategia-strava-academia.md` · `destilacao-psicologia-retencao.md` · `destilacao-mobbin-103.md`.

---

## A resposta em uma linha

**Temos o suficiente para o proto clicável com dado falso.** Não temos — e nenhum proto de App Store fechada teria — “todos os dados de comportamento dos *nossos* usuários”. O que faltava de categoria (GymRats, tribo, competição) está abaixo. O que ainda é hipótese tem que ser *testado no proto*, não pesquisado até virar certeza.

Esperar “tudo definido” é o jeito de nunca abrir o rack. O proto existe para matar hipótese, não para celebrar pesquisa.

---

## Semáforo

| Pergunta | Estado | O que isso significa |
|---|---|---|
| Dor do aluno no rack | **Travado** | Previous + um polegar. Sem isso o treino piora. |
| Dor do personal (obrigar) | **Travado** | MFIT: obriga, aluno odeia abrir. Link inverte a superfície. |
| Por que a categoria fracassa | **Travado** | 69% em 90d; log caro; rede sem lugar; ranking mundial; motivação morre em 14d. |
| Por que Strava / Strong / Peloton / Duo colaram | **Travado** | Tool + prova + lugar + IRL / caderno / instructor+bike / perda+mínimo. |
| Psicologia (motiva / desmotiva / íntimo) | **Travado** | `destilacao-psicologia-retencao.md` |
| Jobs dos 103 | **Travado o suficiente** | 10 jobs. Roster logado dos 103 não extraído. Não bloqueia proto. |
| Como criar tribo | **Corrigido** | Muitos grupos (com ou sem personal). Teto por grupo. Volume no app. Ver `cla-tribo-volume.md`. |
| Como competir sem virar inveja | **Corrigido** | Grupo vs grupo (Clash). Marca da casa. Nunca ranking mundial de um. |
| GymRats: por que bombou e por que o hype esfria | **Agora destilado** | Este arquivo, § GymRats. Não estava nos docs. |
| Comportamento *do aluno Link* | **Não existe** | App não está na loja. Zero coorte nossa. |
| Dado fake do proto | **Existe o elenco** | Vitor, Fred, Smart Fit Bueno, Marina, turma 18h — Grok + tese. |
| Hipóteses 2–5 (unidade, raid, placar, troca de personal) | **Tese** | Porta: fechar sessão. Grupo e guerra vêm atrás. |

---

## O que o proto precisa (e já temos)

Dado **falso** basta se o elenco carrega as decisões. Não precisamos de analytics. Precisamos de **cena**.

Elenco mínimo (já na tese):

- **Vitor** — aluno, conta dele, ofensiva da semana, protetor.
- **Fred** — personal, publica a ficha, não dono do histórico.
- **Marina + 4–7 nomes** — turma das 18h. Tá pago, furo visível, raid.
- **Smart Fit Bueno** — o lugar. Placar. Rei.
- **Uma ficha publicada** — A · Superior. Sem ela o Hoje mostra o buraco.
- **Uma sessão no rack** — previous, “Fiz essa série”, descanso, Feito = recibo.
- **Um raid** — Bora → lista → Zap (deep link / tela que *é* o Zap).

Isso é o dataset do proto. Não é pesquisa. É **ficção operacional** para travar UX.

---

## O que NÃO temos (e não devemos fingir)

1. **Coorte Link.** Quantos fecham sessão, quem dá Tá pago, se o placar traz de volta sem o Fred. Só o proto + depois o app real medem.
2. **Os 103 nomes do Mobbin logado.** Irrelevante para decidir o rack.
3. **Validação de receita.** O app não cobra o aluno. PIX é do personal. Fora do proto aluno.
4. **Wearable / NFC / voz.** Depois. Hipótese 1 primeiro.
5. **App do personal (operação, comercial).** Fora deste proto. Só a conta do aluno.

Falta que **importa** e que este arquivo fecha: GymRats não estava destilado. Abaixo.

---

## GymRats — por que bombou, por que as pessoas amaram, por que o hype esfria

App: [GymRats](https://www.gymrats.app/) · Mack Hasz · março 2019 · um engenheiro (“CPO — Chief Protein Officer”).

Não é Hevy. Não é Strava. É **desafio de grupo + foto + placar**. A frase do produto: *Pics or it didn't happen.*

### O que é

1. Cria ou entra num **challenge** (amigos, família, trabalho, faculdade).
2. Convida sem limite de gente.
3. Cada treino = **foto + título** (ou sync Apple Health). Selfie suada, aparelho, print de outro app — o *grupo* decide o que vale.
4. Placar: treinos, km, minutos, kcal, passos, ou **pontos que o grupo inventa**.
5. Chat do grupo. Time vs time. Privado — não é feed mundial.

About antigo (subestimado): ~100 mil rats, ~50 mil challenges, 2 milhões de treinos. Stores hoje: **2,5M+ downloads** all-time; Play **1M+**; iOS ~4,9★ / 4,7k ratings; Pro US$ 3,99/mês ou 32,99/ano ([App Store](https://apps.apple.com/us/app/gymrats-fitness-challenge/id1453444814), [MWM](https://mwm.ai/apps/gymrats-fitness-challenge/1453444814)).

**Brasil é o mercado.** Tráfego do site: **68% Brasil**, 15% EUA ([LinkedIn/company](https://www.linkedin.com/company/gym-rats-app)). Play BR: top ~12–28 free health, **#11 grossing** em abr 2026 ([Ember Picks](https://emberpicks.com/app/googleplay/gymrats-fitness-challenge/)). Por isso o hype que você viu: não é um app americano que “chegou”. É o app que o escritório / a turma / o grupo da academia brasileira usou para *se cobrir*.

### Por que bombou (mecanismo, não sorte)

| Mecânica | Psicologia | Por que no Brasil colou |
|---|---|---|
| O grupo **já existia** | Pertencimento. O app não inventa amigo. | Zap já tem a turma. GymRats deu placar ao Zap. |
| Foto = prova barata | “Pics or it didn't happen.” Intimidade leve (suor, não kcal). | Mais barato que logar série. Mais honesto que passo. |
| Placar **do grupo**, não do planeta | Vergonha útil. 8 pessoas > 8 milhões. | Exatamente o que o Strava faz com clube e o Hevy *não* faz. |
| Regras do grupo | Autonomia. “Open points”, hustle, kcal, só frequência. | O jogo que a tribo já jogava. |
| Qualquer atividade conta | Inclusão. A vó e o gym rat no mesmo challenge. | Viral no trabalho / família, não só no rack. |
| Challenge tem **fim** | Começo e fim (7/30d). Meta visível. | Janeiro, escritório, “30 dias”. Cadência de campanha. |

Isso é **tribo máxima com produto mínimo**: zero ficha, zero previous, zero lugar. Só: *a gente se vê, a gente se cobra, tem foto*.

### Por que as pessoas amaram

Reviews repetem o mesmo amor:

- “A competição faz a diferença. Treinar todo dia.”
- Privado. “Não precisa ser aberto para o mundo.”
- Não obriga balança nem macro — “só mover”.
- Melhor que step challenge (passo é mentira; foto + treino é presença).
- Coworkers / amigos que **não treinam juntos no espaço**, mas se cobrem no vidro.

O amor é **accountability visível entre conhecidos**. Não é o caderno. Não é o instructor. É a Marina vendo que você não postou.

### Por que o hype esfria (o app não “morreu”)

GymRats **não shut down**. Continua no chart BR. O que morre é o *ciclo*, e o produto não tem chão para segurar depois.

1. **O challenge acaba.** 30 dias, medalha, some o sentido de abrir. Sem tool (previous), sem lugar (unidade), sem ficha, o app vira pasta morta até o próximo “vamos fazer outro”.
2. **Não é o caderno.** Review BR: “pagar Pro só para entrar em mais grupos; Hevy pelo menos trackeia a ficha.” Quem fica sério no rack vai para Strong/Hevy. GymRats não segura o gym rat *de ofício*.
3. **Paywall no sagrado do produto.** Free = **2 grupos**. O viral é *entrar em vários* (trabalho + amigos + irmã). Cobrar o join, não o create, mata o boca-a-boca ([reviews MWM 2025–26](https://mwm.ai/apps/gymrats-fitness-challenge/1453444814)).
4. **Prova frágil.** Foto da galeria = trapaça. Esqueceu de abrir o app no último dia = perde dinheiro. Sync que loga caminhada sozinho. O grupo gasta energia *policiando o app*, não o treino.
5. **Solo founder, bug, downgrade.** Reviews: “a atualização piorou”; step challenge inútil; check-in quebrado. Velocidade lenta (ele mesmo admite).
6. **Chat no app.** Compete com Zap. No Brasil o chat perde.
7. **Tráfego do site −54,7% YoY** (mesmo snapshot que mostra 68% BR). Chart ainda alto; a onda de *descoberta* esfria. Típico de app de challenge: janeiro sobe, março cai — o mesmo padrão da categoria ([RetentionCheck](https://retentioncheck.com/churn-benchmarks/fitness-apps): fev/mar = pico de churn).
8. **Sem lugar.** O grupo é virtual. Não gera Rei da Bueno. Quando o escritório enjoa, não sobra grafo.

### O que o Link rouba / recusa do GymRats

| Rouba | Recusa |
|---|---|
| O grupo **já existe**. Não inventar amigo. | Challenge genérico de marca / janeiro eterno. |
| Prova visível para *os seus*. | Foto como produto (pose). Feito nasce da sessão. |
| Placar de 8, não de 8 milhões. | Chat in-app. O raid termina no Zap. |
| Regras da tribo (o personal / a turma). | Pontos soltos (“hustle”) sem ficha. |
| Challenge 7 ou 30 dias, criado pelo Fred. | Paywall para *entrar* na turma. Turma é sagrada e livre. |
| “Não postou” = vergonha útil. | Polícia de foto / galeria. Testemunha no chão, depois. |

GymRats prova a tese de tribo **e** o buraco do Link: tribo sem tool morre no dia 31. Tool sem tribo (Strong) nunca vira Strava. O Link é os dois — rack + turma no mesmo chão.

---

## Tribo — o máximo que se extrai (sem inventar feature)

Pesquisa + GymRats + Strava clubes + Peloton amigos = a mesma física.

**O que cria tribo**

1. **Gente que já se cruza.** Trabalho, turma 18h, unidade, box. O app nomeia. Não dá match.
2. **Presença visível.** Foto (GymRats) / mapa (Strava) / Feito no chão (Link). Ausência também visível.
3. **Jogo pequeno.** 6–15 pessoas. Liga do Fred. Leaderboard da aula (Peloton: amigo = ~metade do churn).
4. **Fim que recomeça.** Challenge 7/30d ou ofensiva *semanal*. Sempre tem “esta semana”.
5. **Saída IRL.** Raid → porta da academia. Clube Strava → rua. Sem isso é Facebook.

**O que finge tribo e esvazia**

- Follow mundial (Hevy).  
- “Pessoas que você talvez conheça.”  
- Chat.  
- Ranking da cidade no dia 1.  
- XP.  
- Desafio criado pelo HQ da marca.

**Como extrair o máximo no Link (já na tese, agora com GymRats)**

| Camada | Tamanho | Mecânica | Máximo |
|---|---|---|---|
| Dupla | 2 | Raid de 2. “Te vejo às 18h.” | Produto mínimo de relação. |
| Turma | 6–15 | Ofensiva coletiva. Furo visível. Tá pago. | Vergonha que retém. |
| Unidade | dezenas | Placar 90d. Feed do chão. Rei. | Grafo que o clone não copia. |
| Challenge | 7 ou 30d | Fred cria. Conta sessão *nesta* unidade. | O que o GymRats acertou, com chão. |

Máximo ≠ mais gente. Máximo = **a ausência doer no grupo certo**.

---

## Competição — a melhor forma (e a que mata)

| Forma | Efeito | Link |
|---|---|---|
| 1v1 mesma unidade, mesma semana, mesmo movimento | Rival que você cruza | Sim. Depois do rack. |
| Rei / lenda 90d nesta unidade | Consistência, não 1 RM de ego | Sim. Testemunha para entrar no placar. |
| Ofensiva da turma (ninguém fura a semana) | Time, não herói | Sim. Default. |
| Challenge 12 sessões / 30d nesta unidade | GymRats + lugar | Sim. Fred cria. |
| Leaderboard mundial de supino | Inveja. Desiste. | Nunca. |
| kcal / passo / “hustle points” | Jogo que o treino não pediu | Não no MVP. |
| Dinheiro no bolo (pacto) | GymPact morreu; review GymRats: esqueceu de abrir e *perdeu grana* | O app não cobra. Vergonha > multa. |

Competição boa **usa a linguagem da tribo** (carga, sessão, WOD) e **o grafo do lugar**. Competição ruim inventa moeda.

---

## Fidelidade — o que de fato segura

Não é love da marca. É custo de sair + sentido de ficar.

| Cola | Quem | No Link |
|---|---|---|
| Sem o app o treino piora | Strong, Hevy | Rack. Sagrado. |
| Alguém espera | MFIT, Peloton, Fred | Ficha + raid. |
| A turma vê | GymRats, Strava clube | Tá pago + furo. |
| O histórico é *meu* | Strong, Strava | Conta do aluno. Trocar o Fred não apaga. |
| Hardware / anel | Peloton, Oura | Sem. |
| Streak que dói perder | Duo, anéis | Semana + 1 protetor. Não dia. |

Pagar Pro **não** cria fiel ([Yale, 2026](https://som.yale.edu/story/2026/paying-health-app-boosts-engagement-not-long)). GymRats cobra o join e o review BR odeia. O Link não cobra o aluno.

---

## Decisão para o proto (o que está definido)

Pode ir ao clicável quando — e só quando — o mock carregar **isto**, não um clone de GymRats/Hevy:

1. Rack fecha sessão (hipótese 1).  
2. Feito = recibo com **lugar**.  
3. Tá pago da turma (não 7 emojis).  
4. Ofensiva **semanal** + 1 protetor.  
5. Ficha do Fred; Hoje vazio se não houver.  
6. Raid → lista → Zap.  
7. Placar da **unidade**, não mundial.  
8. Challenge estilo GymRats **só** como 7/30d da turma/unidade, criado pelo Fred — não como home.

Proibido continua: chat, Stories, Explore, gemas, kcal, anel, ofensiva diária, paywall, feed mundial.

Dado: fake do elenco. Isso **é** dado de decisão de UX. Não é dado de mercado. Mercado já está na destilação. Comportamento Link só existe depois de alguém tocar no rack.

---

## Fontes GymRats e mercado

- [GymRats home — pics or it didn't happen](https://www.gymrats.app/)
- [GymRats about — Mack, 2019, solo](https://www.gymrats.app/about)
- [App Store listing](https://apps.apple.com/us/app/gymrats-fitness-challenge/id1453444814)
- [MWM — 2,5M downloads, reviews BR/EN](https://mwm.ai/apps/gymrats-fitness-challenge/1453444814)
- [Ember Picks — chart BR #11 grossing](https://emberpicks.com/app/googleplay/gymrats-fitness-challenge/)
- [LinkedIn company — 68% tráfego BR, −54,7% YoY](https://www.linkedin.com/company/gym-rats-app)
- Categoria: ver `destilacao-psicologia-retencao.md`
