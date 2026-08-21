# Lente 7. Superfície / Fluxo

21 ago 2026. Arquitetura de interação da rede **em cima do casco que já existe**. Não é redesign. Não é implementação. Não é proto novo.

Conta: só aluno. Cinco abas, nunca sexta. Raid vive no Hoje. Rede = Unidade / Grupos / Guerra. Sem Explore, sem chat, sem Stories, sem painel do personal.

Se o rack (Série → Descanso → Feito) falhar, a rede é teatro. Hipótese 1 primeiro. Se 1 falha, pare.

Casco lido: `proto-aluno` (abas, overlays, NoSheet, Feito, Raid, Zap, Grupo, Guerra). Este arquivo só diz **onde cada mecanismo mora na mão**. O visual fica.

---

## 0. Três máquinas, três donos

A destilação dos 82 deixa três máquinas vivas. Cada uma tem um endereço. Não se misturam.

| Máquina | O que é | Mora aqui |
|---|---|---|
| Diário que vira imagem | A sessão logada acumula quem você é | **Perfil** (lista) + reserva de **headline**. Progresso é o caderno privado, não a imagem. |
| Casa com papel | Join, teto, vaga, com ou sem personal | **Rede · Grupos** (corredor) + overlay **Grupo** (casa) |
| Diálogo no objeto | Gesto e fala *em cima do recibo* | Overlay **Prova**. Tá pago no quadro da Unidade. Sem inbox. |

O rack não é máquina social. É a ferramenta. Sem ele as três máquinas mentem.

---

## 1. Mapa de superfícies

Uma coisa, um dono. Atalho pode repetir o cartão. O dono não muda.

### 1.1 Abas (cinco, trava)

| Aba | Dona de | Não é |
|---|---|---|
| **Hoje** | O ato do dia: começar / continuar / sessão já fechada. Card da Raid. Atalho do placar da semana. | Feed. Casa. Caderno. Conta. |
| **Ficha** | O programa: o de hoje ou a última vez. Lista de exercícios e cues. | Rede. Tá pago. Raid. |
| **Rede** | A prova pública desta academia. Três faces, um dono: Unidade, Grupos, Guerra. | Explore. For You. 6ª aba. |
| **Progresso** | Caderno de carga (kg no tempo) + ofensiva pessoal + presença da semana. | Anel. Liga mundial. Feed. |
| **Perfil** | A conta do aluno: diário de sessões, headline (reserva), Já paguei, grupos que pertence, etiqueta do armário. | Grid. Followers. Painel do Fred. |

Raid **não** é aba. Explore **não** existe. Personal **não** tem home.

### 1.2 Segmentos da Rede

| Face | Dona de | Entra por |
|---|---|---|
| **Unidade** | Quem pagou hoje nesta academia + Tá pago de 1 bit + marca da casa (7 dias, sessões no prédio) | Aba Rede, default |
| **Grupos** | Corredor de portas. Com personal e sem personal são o mesmo tipo. Criar grupo nesta academia. | Segmento Grupos |
| **Guerra** | Placar grupo vs grupo + quem do *seu* grupo já veio | Segmento Guerra, ou atalho do Hoje |

### 1.3 Overlays (o casco já tem estes nomes)

A TabBar some em overlay. Certo: o rack é imersivo; a prova é um objeto, não uma aba.

**Ferramenta (tom ferro). Sem rede.**

| Overlay | Dono de |
|---|---|
| Série | Esta série. Carga, reps, um polegar. |
| Descanso | O intervalo. |
| Como | Cue do exercício. |
| Ficha da sessão | A lista *da sessão em curso*. Não substitui a aba Ficha. |
| Livre | Montar treino sem folha. Fecha no mesmo rack. |
| Feito | Recibo que **acaba de nascer**. Única porta de nascimento da prova. |

**Rede (tom do casco).**

| Overlay | Dono de |
|---|---|
| Prova | O recibo de qualquer um + Tá pago + fala no objeto (Fred ajusta carga). |
| Pessoa | O outro (ou o Fred como nome). Não é o Perfil. |
| Unidade | Retrato da academia (hero + quem pagou + marca). Sem Tá pago aqui. |
| Grupo | A casa: teto, vagas, membros, desafio, com ou sem personal. |
| Guerra | Detalhe do placar. Contribuição. Quem deve sessão. |
| Raid | Lista de quem vai. Horário. Capacidade. |
| Zap | Saída. Texto pronto. Não é conversa do app. |
| Desafio | Cartão 7 ou 30 do grupo. Fura quando fecha sessão. |
| Criar grupo | Abrir bloco nesta academia. Sempre sem personal. Sem taxa. |
| Convite | Entrar por código. O código veio do Zap. |

### 1.4 Conflitos resolvidos (não duplicar dono)

**Raid.** Hoje é dono da *lembrança do dia* (o card). Overlay Raid é dono da *lista*. Rede · Unidade tem “Bora” só como atalho para o mesmo overlay. Ninguém ganha uma 6ª aba.

No proto, o card do Hoje chama `bora` e pula para o Zap. A ordem da hipótese 3 é outra: **ver a lista → Bora muda a lista → Zap abre**. O card do Hoje deve abrir o overlay Raid. Não se edita o proto neste arquivo; o alinhamento fica travado aqui.

**Guerra.** Rede · Guerra é dona do jogo. Hoje só mostra o placar da semana (atalho). Overlay Guerra é o detalhe.

**Unidade (aba vs overlay).** A aba é o quadro vivo: linhas + Tá pago. O overlay é o retrato da casa (hero). Tá pago não mora no retrato.

**Feito vs Prova.** Feito = o seu, agora, acabou de fechar. Prova = o recibo de alguém, aberto depois. Mesmo objeto. Entradas diferentes.

**Perfil vs Pessoa.** Perfil = você, conta, Já paguei, headline. Pessoa = eles. Sem follow, sem DM.

**Progresso vs Perfil.** Progresso = kg no tempo (caderno Strong). Perfil = sessões nesta academia (diário Letterboxd). Não inverter.

**Comentário.** Só no overlay Prova, no recibo. Aluno dá Tá pago. Personal escreve ajuste. Sem composer de conversa. Sem thread infinita. Sem quote.

**Fred no Hoje.** Uma linha “publicou”. Abre Pessoa. Não é dashboard.

---

## 2. Loops clicáveis obrigatórios

O que o proto já fecha, e o que falta para a rede ficar blindada. Blindada = a mão completa o ciclo sem aba nova, sem chat, sem Stories.

### Loop 1. Hoje → rack → Feito → unidade vê

**Já.** Hoje: Começar / Continuar no rack / Última vez / Treino livre. Série → Descanso → Feito. Feito: “Ver a unidade” (`goRede`).

**Falta (lugar, não visual).** A prova do Feito vira a **primeira linha** de Rede · Unidade no mesmo minuto. Sem isso o loop mente: o aluno fecha e a academia não vê.

Ordem da mão: Hoje → Série → Descanso → (repete) → Feito → Ver a unidade → linha com o seu nome + volume + Tá pago dos outros.

Se este loop quebrar, pare. Não polir Grupos. Não polir Guerra.

### Loop 2. Rede unidade: Tá pago

**Já.** Rede · Unidade: “Quem pagou hoje” + `StampHold`. Overlay Prova: o mesmo gesto no recibo.

**Falta.** Empty honesto quando a lista do dia está vazia (ver §4). Tá pago não migra para Hoje, Ficha, Progresso ou Perfil.

Ordem da mão: Rede → Unidade → segura Tá pago na linha, ou abre Prova e paga lá.

### Loop 3. Raid → Zap

**Já.** Overlay Raid: lista, Bora · abrir Zap, Sair da lista. Overlay Zap: texto pronto + Abrir WhatsApp. Rede · Unidade: atalho Bora.

**Falta.** Hoje card = porta da **lista**, não atalho que queima o Zap. Hipótese 3: Bora → lista muda → Zap abre.

Ordem da mão: Hoje card (ou Rede · Bora) → Raid → Bora · abrir Zap → Zap → WhatsApp de verdade. O app é o motivo. O Zap é o container.

Sem grupo, o card some. Não inventar “descubra uma raid”.

### Loop 4. Grupo com personal vs sem

**Já.** Rede · Grupos: cada porta diz `ficha do Fred` ou `sem personal`. Overlay Grupo: a mesma diferença. Criar grupo: “Teto 20. Sem personal. Sem taxa.” Convite: código que veio do Zap.

**Falta.** Os dois tipos são o **mesmo objeto** (casa). A ficha é extra da porta, não requisito para existir. Sem personal não é empty triste. Com personal não vira painel do Fred.

Ordem da mão: Rede → Grupos → porta → Grupo. Ou Criar grupo nesta academia. Ou Convite.

### Loop 5. Guerra grupo vs grupo

**Já.** Hoje: Scoreboard. Rede · Guerra: placar + contribuição do seu grupo. Overlay Guerra: detalhe, “deve sessão”, ver o outro grupo.

**Falta.** Visitante (não está em nenhum dos dois lados): vê o placar, não a cobrança “você deve”. Guerra sem o Loop 1 é teatro: o ponto só nasce de sessão fechada nesta academia.

Ordem da mão: Hoje placar **ou** Rede → Guerra → overlay Guerra. Nunca ranking mundial de um. Nunca 1v1 de ego como home.

### Loop 6. Perfil = diário + headline (reserva)

**Já.** Perfil: nome, armário, ofensiva, Já paguei, “Seus grupos”, “Sessões nesta academia” (abre Prova), etiqueta.

**Falta.** Reservar **uma linha** entre o nome (`Display`) e “A conta é sua. Fred não é o dono.” Esse é o lugar da headline da lente 4. Este arquivo não escreve a headline. Se a lente 4 ainda não preencheu, a linha fica **em branco**. Sem quiz. Sem “complete seu perfil”. Sem All-star.

O diário já é a lista de sessões. Não virar grade 3 colunas. Não virar Stories.

### Loop 7. Progresso = caderno de carga, não anel

**Já.** Ofensiva + protetor. Faixa da semana (foi / não foi / P de protetor). Caderno por movimento (`Caderno · supino`).

**Trava.** A faixa da semana é presença nesta academia, não fechar anel de kcal. O dono da aba é o caderno. Sem share card. Sem liga mundial. Sem XP.

---

## 3. O que cada tela recusa

Anti-Instagram por superfície. Cinco recusas por aba. Vale para overlay filho: se a aba recusa, o overlay dela também recusa.

### Hoje recusa

1. Feed de provas (isso é Rede · Unidade).
2. Câmera, Stories, dump de selfie.
3. Chat, DM, “combine aqui”.
4. Explore, “pessoas que você talvez conheça”, matching.
5. Começar o dia por pose. O dia começa no rack ou no buraco da ficha.

### Ficha recusa

1. Tá pago.
2. Comentário no exercício.
3. Raid e Zap.
4. Guerra e placar.
5. Grade de foto, Reels, “compartilhar ficha” como post.

### Rede recusa

1. For You, algoritmo, Popular this week.
2. Follow mundial, follower count.
3. Stories, Reels, live, câmera como home.
4. Chat da turma, canais, voice, inbox.
5. Explore, 6ª aba, Raid como tab, clube virtual sem prédio.

### Progresso recusa

1. Anel de calorias / fechar anéis / move-stand-exercise.
2. Liga mundial, top 1%, “você vs o planeta”.
3. Card de share estilo Instagram.
4. Feed de amigos que “treinaram”.
5. XP, gemas, loja, protetor comprável.

### Perfil recusa

1. Grade 3 colunas, highlights, capa de criador.
2. Followers / following / “editar bio” de influencer.
3. Stories, Reels, destaque de foto.
4. Painel do personal, turma como dashboard, cobrança in-app.
5. Quiz de classe, All-star, “complete 80% do perfil”.

Overlays específicos que o casco **não ganha**: Stories no Feito, composer de chat na Prova, swipe de gente na Pessoa, mapa de amigo, widget de vigilância.

---

## 4. Estados vazios honestos

Empty bonito é mentira. O casco já tem o tom. Manter.

### Sem ficha

**Já.** `NoSheet`: “Sem ficha publicada. Ninguém mandou folha.” Última vez ou livre: a conta é sua. Hoje e Ficha usam o mesmo buraco.

**Trava.** Não mandar para a Rede. Não inventar “descubra um treino”. Ficha do personal é extra, não requisito. Última vez e Livre são a porta honesta da hipótese 1.

Ficha · Hoje, sessão já fechada e sem folha nova: “Sessão de hoje já fechou. Amanhã é outro.” Certo.

### Sem grupo

**Hoje.** O card da Raid some. O placar pode ficar (atalho de uma guerra da casa). Não aparece CTA de Explore. Não aparece “encontre sua turma”.

**Rede · Grupos.** As portas dos outros grupos continuam. “Criar grupo nesta academia” continua. Isso não é Explore: é corredor da *desta* academia.

**Rede · Guerra.** Se o aluno não está em nenhum lado: placar visível, sem “você deve sessão”.

**Perfil · Seus grupos.** Uma linha: “Nenhum grupo nesta academia.” Sem botão de descobrir pessoas.

**Raid.** Já: “Nenhum combinado do seu grupo. Marca no Zap.”

### Sessão já fechada

**Hoje.** Recibo do dia + Ver o Feito. Sem segundo Começar no produto. “Recomeçar o proto” é cromo de mock, não loop de produto.

**Ficha.** Texto do buraco: amanhã é outro. A lista da folha pode aparecer; o polegar de começar não.

**Rack.** Não reabre no mesmo dia no produto. Overlay Feito continua acessível pelo Hoje.

**Rede.** A prova já está no quadro. Tá pago dos outros é o gesto. O aluno não “posta de novo”.

### Unidade sem ninguém hoje

**Falta.** Rede · Unidade com zero linhas: “Ninguém pagou hoje nesta academia.” Sem cards de criador. Sem “você pode ser o primeiro” de campanha. Sem For You para encher o vazio.

---

## 5. Ordem de hipótese

Cópia operacional de `estrategia-strava-academia.md` §12.5, na superfície.

1. **O aluno fecha uma sessão no celular** (ficha, última vez, ou livre). Superfície: Hoje → rack → Feito. Se não fechar, **pare**. Grupo e guerra são enfeite. Não adicionar face na Rede para “compensar”.
2. A prova aparece no quadro da Unidade no mesmo minuto. Alguém dá Tá pago. Superfície: Feito → Rede · Unidade → StampHold / Prova.
3. Raid: Bora → lista muda → Zap abre. Superfície: Hoje card → Raid → Zap. Sem chat no app.
4. Placar da unidade (marca da casa, 7 dias) faz voltar no dia seguinte sem o personal mandar mensagem. Superfície: Rede · Unidade, bloco de baixo. Não é anel. Não é push de “seu amigo treinou”.
5. Trocar o personal não apaga o histórico. Superfície: Perfil (diário + headline) e Progresso (caderno) sobrevivem. Ainda não é o teste deste proto. Não desenhar tela de “trocar o Fred” agora.

Se 1 falha, as faces 2 a 5 não se constroem. Come for the tool.

---

## 6. Ordem da mão no dia (não é onboarding)

1. Abre no **Hoje**. Nunca na Rede.
2. Se tem buraco de ficha, vê o buraco. Última ou livre.
3. Entra no rack. TabBar some.
4. Fecha. Feito. Vai à Unidade ou Seguir (volta ao Hoje fechado).
5. Raid só se o grupo tem combinado. Termina fora, no Zap.
6. Progresso no dia que não treina: caderno, não scroll.
7. Perfil quando marca Já paguei, ou quando a imagem (diário + headline) importa.

---

## 7. Regras

1. Cinco abas no máximo: Hoje, Ficha, Rede, Progresso, Perfil. Raid não é aba.
2. Se o rack não fecha sessão, pare. A Rede não se enfeita para tapar a ferramenta.
3. Uma coisa, um dono. Atalho pode repetir o cartão. O dono não muda.
4. Hoje é o ato do dia. Não é feed, não é casa, não é conta.
5. Ficha é o programa. Sem Tá pago, sem Raid, sem Guerra.
6. Rede tem três faces e só essas: Unidade, Grupos, Guerra. Sem Explore.
7. Tá pago mora no quadro da Unidade e no overlay Prova. Em nenhum outro lugar.
8. Prova nasce no Feito, de sessão fechada. Upload de foto não nasce prova.
9. Diálogo no objeto = overlay Prova. Sem chat, sem DM, sem Stories, sem composer de conversa.
10. Casa = overlay Grupo. Corredor = Rede · Grupos. Com personal e sem personal são o mesmo tipo de porta.
11. Guerra é grupo vs grupo, nesta academia, nesta semana. Nunca ranking mundial de um.
12. Raid: card no Hoje, lista no overlay, destino no WhatsApp. O app não compete com o Zap.
13. Perfil é diário de sessões + uma linha de headline (lente 4 preenche) + Já paguei. Não é grid.
14. Progresso é caderno de carga. A faixa da semana é presença, não anel.
15. Empty mostra o buraco: sem ficha, sem grupo, sessão fechada, unidade sem ninguém hoje. Sem Discover para encher.
16. Sem painel do personal. Fred é um nome: publicou a ficha, comentou no recibo, está num grupo. A conta é do aluno.
