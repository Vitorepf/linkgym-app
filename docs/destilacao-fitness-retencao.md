# Destilação: por que apps de fitness prendem (e o que o Link rouba)

21 ago 2026. Complementa `estrategia-strava-academia.md`. Não é um app novo. É o dicionário curto de mecanismos para o proto do MVP.

**Mapa da categoria (os 103):** `destilacao-mobbin-103.md`. **Psicologia e retenção (o app mais íntimo):** `destilacao-psicologia-retencao.md`. Este arquivo é o bolso.

Fontes: Mobbin (telas reais) + papers/teardowns 2025–26. Números no canvas e no chat.

---

## O problema da categoria

Apps de fitness perdem **70–80%** dos usuários em 3 meses. Churn mensal médio da categoria ~**9,2%**. Motivo nº 1: motivação morre (38%). Nº 2: alternativa grátis (25%).

O sinal que prediz churn: **menos de 3 treinos nos primeiros 14 dias** → 3–4× mais chance de sair.

Quem fica não ficou por “conteúdo melhor”. Ficou porque o app ancorou um **hábito + uma obrigação social + uma prova**.

---

## Seis mecanismos (o que realmente prende)

| # | Mecanismo | Quem usa | Dor que resolve | Como o aluno fica preso | Link |
|---|---|---|---|---|---|
| 1 | **Ferramenta mais barata que o caderno** | Strong, Hevy | “O que eu fiz da última vez?” | Sem o app, o treino piora. Abre no rack. | Sagrado. Previous + um polegar. |
| 2 | **Timer de descanso no app** | Hevy | Ir para o Instagram no intervalo | O intervalo é *dentro* do app. | Destilar. Não copiar a planilha azul. |
| 3 | **Gesto de 1 bit** | Strava kudo (14 bi em 2025), Fitbit cheer, Hevy like | “Ninguém viu que eu fui” | Validação sem texto. | **Tá pago.** Sem inglês. Sem emoji farm. |
| 4 | **Ofensiva semanal + protetor** | Strava (semana), Duolingo (freeze +40% retenção 90d) | “Furei um dia e desisti” | Perder a cadeia dói mais que ganhar. Semana, não dia. | Já na tese. Não ofensiva eterna. |
| 5 | **Competição do lugar** | Strava segmento / Local Legend (90d) | Ranking mundial é inveja inútil | Vergonha e rival na mesma rua. | Rei da unidade / turma 18h. Nunca mundial. |
| 6 | **Plano que alguém obriga** | Runna (coach), MFIT, Peloton (instructor) | “O que eu faço hoje?” | A relação é com a pessoa, o app é o trilho. | Personal publica a ficha. Aluno abre. |

---

## App por app (destilado)

### Strong
- **Por que é grande:** ganhou o *caderno*. Zero social de propósito.
- **Dor:** logar série sem atrito.
- **Retenção:** previous / esta / próxima. O histórico é o vício.
- **Link:** rouba o rack. Não vira Strong — Strong recusou a rede.

### Hevy
- **Por que é grande:** Strong + feed + follow. Espanhol, lifting.
- **Dor:** sozinho no log + quer mostrar o treino.
- **Retenção (Mobbin):** coluna PREVIOUS, rest timer 2min30, Finish, like/comentário, relatório do mês com “1 week streak” + calendário + PR + Share.
- **Furo:** feed *global*. Comentário de desconhecido. Não é chão.
- **Link:** rack e recibo. Não o Home de 80 likes.

### Strava
- **Por que é grande:** GPS (ferramenta) + prova (mapa) + segmento (grafo) + clube (IRL).
- **Dor:** o treino outdoor sem testemunha.
- **Retenção:** kudo; KOM (perda do título); Local Legend (consistência 90d); streak **semanal**; clube.
- **Link:** copiar *função*. Indoor não tem mapa — o recibo é carga + lugar + “foi”.

### Whoop
- **Por que é grande:** identidade de “atleta sério”. Número de recovery.
- **Dor:** “posso treinar hoje?”
- **Retenção:** o número grande, pouco cromo. Wearable = hábito no pulso.
- **Link:** tom do Feito/Progresso. Não o hardware.

### Peloton
- **Por que prende:** churn hardware ~**1,6%/mês**. Digital-only ~5,2%. Instructor (relação parassocial) + aula ao vivo + high-five.
- **Dor:** treinar sozinho em casa.
- **Link:** a relação é o **personal real**, não o influencer da tela. Não copiar bike.

### Runna / Centr / Tempo
- **Por que prendem:** plano com começo e fim (semana 2/8). Nota do coach. Checkbox do dia.
- **Dor:** “qual o treino de hoje?”
- **Link:** isso **já é a ficha do Fred**. Não um programa de marca. O personal é o coach.

### Duolingo (mecanismo, não fitness)
- Freeze: +40% retenção 90d. Mínimo ridiculamente baixo. Ofensiva diária *funciona* em lição de 5 min.
- Academia **não** é diária. Ofensiva **semanal** + 1 protetor. A tese já travou isso.

### Fitbit
- Cheer + “acha seus amigos”. Social genérico. Fraco. Não copiar.

### MFIT Personal (Brasil)
- **Por que existe:** o personal *obriga*. Não porque o aluno ama.
- **Dor do personal:** gestão. Dor do aluno: lição de casa feia.
- **Link:** a obrigação fica. A superfície vira o app que o aluno *abre no rack*.

---

## O que o proto do MVP precisa ter (mecanismo, não tela)

Ordem de construção (ainda o proto inteiro, mas esta é a espinha):

1. **Rack** — previous, carga, “Fiz essa série”, descanso no app.
2. **Feito = recibo** — quem / o quê / onde / prova. Nasce da sessão, não do upload.
3. **Tá pago** — 1 toque. Sem kudo, sem 7 emojis do Hevy.
4. **Ofensiva semanal + 1 protetor** — calendário tipo Hevy/Strava, ciclo da ficha.
5. **Ficha do personal** — Hoje não mente se estiver vazia.
6. **Raid** — Bora → lista → Zap.
7. **Chão / placar da unidade** — não feed mundial.

Proibido no proto (mesmo “completo”): chat, Stories, ranking mundial, gemas, Explore, like de comentário, farm de XP.

---

## Mobbin — links da destilação

- Hevy log + previous + timer: https://mobbin.com/screens/7178a6f5-fe6b-4b20-9e1b-909af6cd8382
- Hevy rest timer flow: https://mobbin.com/flows/7d01a640-172f-4386-a85c-ba0db888bfd7
- Hevy comentário (o que *não* copiar de lugar): https://mobbin.com/flows/e60ea867-9608-4a6f-9546-cef48c90c6a3
- Hevy relatório / streak / calendário: https://mobbin.com/screens/9fb09e5a-3a45-4ec7-921d-afbc46cc9f48
- Strava kudo + recibo: https://mobbin.com/flows/167e99fd-b9db-4161-a934-6154ebc2254b
- Strava progress / streak semanal: https://mobbin.com/screens/02f8ff4a-0d9d-492b-8be8-08fb9e9fe486
- Runna plano + coach: https://mobbin.com/screens/61249296-39e2-4d16-8d37-a4479b535b88
- Runna today / semana: https://mobbin.com/screens/9d099f6c-d988-4f49-b510-dbbed4b68834
