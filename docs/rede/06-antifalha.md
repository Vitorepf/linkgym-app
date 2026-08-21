# Lente 6. Anti-falha

21 ago 2026. Revisor adversarial. Companheiro de `destilacao-mobbin-82-um-a-um.md` (82 problemas + 5 mortes), `destilacao-mobbin-82-social.md` (onde a categoria erra o ano) e `estrategia-strava-academia.md` §12.3 sagrado / §12.4 depois.

Isto não é brainstorm. É a lista do que o Link **recusa** mesmo se o fundador pedir “só um pouquinho”. Feature fofa é como o quarto produto nasce. O pedido “tipo Instagram, mais ou menos + Twitter antigo + RPG” cola três jobs que os 82 **separam**. Colar de novo é Instagram da academia. Já perdeu.

§12.3 não se troca por cromo. Polegar no rack, ficha, ofensiva+protetor, Tá pago, lugar na prova, Raid no Zap, app não cobra, liga do grupo. §12.4 é NFC, testemunha, app do personal, cor. Não é Stories, não é chat, não é For You “depois”.

Cinco mortes. Não são 82 mortes diferentes.

| Morte | O que acontece | Quem já pagou |
|---|---|---|
| Incumbente come a feature | A função viva vai para o app que já tem o grafo | Clubhouse → Spaces; Periscope → Twitter/FB Live; Houseparty → Zoom; zenly → Snap Map; Breaker → Spaces; Vine → IG/Snap |
| Acqui-hire / proteção | Compram o time ou matam o concorrente interno | Gas (Discord), zenly (Snap), Houseparty (Epic), Breaker (Twitter) |
| Métrica fictícia | “Grupo” sem gente no prédio | IRL (95% bot, SoftBank processa) |
| Grafo errado | Follow mundial, For You, random, anônimo | Instagram, TikTok, X hoje, Yubo, Monkey, Azar, Yik Yak, Gas |
| Sem rastro / sem ato | Presença que some quando a rua abre | Clubhouse, Houseparty, Airtime, Sonar, BeReal-como-instante |

Três máquinas sobrevivem. Diário que vira imagem. Casa com papel. Diálogo no objeto. O resto desta lista é veneno com nome fofo.

Como ler um item: falha, quem pagou, como o fundador enfia “um pouquinho”, regra que **bloqueia** (colar no proto / no código). Se a regra não dá para assertar, a recusa é teatro.

---

## Recusas (checklist)

### 1. For You

**Quem pagou:** Instagram, TikTok, X, Threads, Lemon8, Snapchat (Spotlight), Tumblr, Letterboxd (Popular this week), Discord (Discover), Swarm (Explore de lugar).

**O pouquinho:** “For You só da academia.” “Popular this week da Bueno.” “Mistura o chão com criador pra não ficar vazio no dia 1.” O algoritmo come o vizinho. O aluno da Bueno compete com pose de Dubai. Grafo de lugar morre. Morte: grafo errado.

**Regra:** `REDE_HOME = chao_da_unidade_hoje`. Proibido `forYou`, `popularThisWeek`, `recommendedCreators`. Se não tem Feito hoje, o chão mostra o buraco. Não preenche com criador.

### 2. Follower

**Quem pagou:** Instagram, TikTok, BeReal (0 followers no vazio), Lemon8, Behance, Threads, X, Bluesky, Letterboxd (o pecadinho no perfil honesto), Quora, Weverse. Quase os 82 põem `followers · following`. Mede audiência. Mata capacidade.

**O pouquinho:** “Follower da unidade.” “Seguir o personal.” “Following só pra achar o amigo de outra Smart Fit.” No perfil, o número vira o jogo. O RPG morre. Nasce um criador. §12.3: liga = o grupo. Não audiência.

**Regra:** `perfil.stats` não contém `followers`, `following`, `seguidores`. Grafo = `join(grupo|unidade)`. Sem follow mundial. Sem botão Seguir.

### 3. Stories

**Quem pagou:** Instagram, Snapchat, WhatsApp (Status), KakaoTalk, Messenger, Locket (Rollcall: dump semanal que some em 7 dias), Hypelist (share card → Stories), yope (álbum que finge círculo).

**O pouquinho:** “Stories só da unidade.” “24h só do raid.” “Highlight da sessão, some amanhã.” O timer não lava o crime. Stories come o instante e o Feito vira arquivo. Incumbente (IG/Snap) já ganhou pose com relógio.

**Regra:** `PROIBIDO: stories, status24h, highlightRing, rollcall, ephemeralFeed`. Recibo do Feito não some. Sem anel no avatar.

### 4. Grid

**Quem pagou:** Instagram, TikTok, Lemon8, Behance. Tese 1: você é o que mostra. Quem copia o grid já perdeu. A pose é deles.

**O pouquinho:** “Grid de PRs.” “3 colunas só de recibo.” “Behance do rack.” Se a célula é foto, é Instagram. Se a célula é pose no espelho, o Instagram ganha de novo. Diário Letterboxd é caixa do dia, não grade.

**Regra:** `perfil.layout !== grid3`. Perfil = headline + diário cronológico + histograma. Foto só como anexo de um Feito. Nunca célula de mood.

### 5. Chat

**Quem pagou:** WhatsApp, Discord, Telegram, Messenger, Signal, LINE, GroupMe, Messages, XChat, KakaoTalk, BFF, Retro (traiu a tese), Karrot. ~12 dos 82 são messaging. No Brasil o Zap já é o OS.

**O pouquinho:** “Chat só da turma.” “Inbox do personal.” “DM ao lado do Feito, tipo X.” Raid que não termina no Zap é arrogância. Chat in-app é o quarto messenger e o quarto produto. §12.3 item 6.

**Regra:** `assert(!inbox && !dm && !threadPrivada)`. Raid = Bora → lista → `openWhatsApp`. Comentário, se existir, mora no Feito, um nível, público da casa. Não é chat.

### 6. Swipe

**Quem pagou:** Tinder, Yubo, Plenty of Fish, Monkey, Azar.

**O pouquinho:** “Swipe pra achar parceiro de treino.” “Carta da turma, X ou coração.” Academia não é “quem combina”. É quem está a 20 metros. Sem objeto compartilhado, a pessoa é o produto. Chat depois do match é o deserto de sempre.

**Regra:** `PROIBIDO: swipe, superLike, boost, deckDeCara`. Carta só se o verso for Feito (quem / o quê / onde / foi). Sem X/Heart em pessoa.

### 7. Voice sem rastro

**Quem pagou:** Clubhouse (downloads -86% em 2022; valuation $4B; corte de metade do time), Sonar, Beep, Airtime, Discord voice como home, Breaker (Twitter comprou o time pra Spaces e ia matar o app).

**O pouquinho:** “Sala de voz da unidade enquanto treina.” “Raise hand no raid.” “Podcast da turma.” Sem rastro não há Rei. Presença que some quando a rua abre. Spaces comeu Clubhouse **dentro** de uma rede que já existia. Morte: sem rastro + incumbente.

**Regra:** `PROIBIDO: voiceRoom, spaces, raiseHand, soundBiteChat`. Presença = quem pagou hoje no Hoje. Raid fala no Zap.

### 8. Live

**Quem pagou:** Periscope (Twitter shut 31 mar 2021, “unsustainable maintenance-mode”), TikTok Live, YouTube Live, Yubo, Tribe (“live battle”), Clubhouse, Houseparty (Epic fechou out 2021).

**O pouquinho:** “Live do personal na aula.” “Broadcast do WOD.” “Explore lives da cidade.” Live sem casa morre. Live-como-feature sobrevive no incumbente. Recibo, não broadcast. Cadáver clássico: Periscope popularizou e o Twitter/FB comeu.

**Regra:** `PROIBIDO: live, broadcast, goLive, heartOverlay, exploreLives`. Feito nasce no fim da sessão, não no streaming.

### 9. Anônimo

**Quem pagou:** Yik Yak (morreu uma vez por veneno; voltar não apaga a lei), Gas (pico 3,1M downloads; Discord comprou e fechou 7 nov 2023; TBH já tinha morrido do mesmo jeito), Reddit (anonimato + karma apodrece).

**O pouquinho:** “Anônimo pra não ter vergonha do peso.” “Muro da unidade sem nome.” “Quem gostou de você na 18h.” Ego sem cara. Bullying. A turma tem cara. Tá pago assina.

**Regra:** `assert(autor.identificado)`. Sem ghost post, sem “see who likes you”, sem muro sem nome. Vergonha local é o produto. Anonimato a mata.

### 10. GPS de gente

**Quem pagou:** zenly (Snap comprou >$200M e matou em 2022 **mesmo crescendo**, pra proteger Snap Map), Bump, Life360, Snapchat Map, Swarm Map.

**O pouquinho:** “Mapa só dos amigos da Bueno.” “Bolha de quem está a 20m.” “Beacon tipo Strava.” Vigilância lúdica. Sem prova de ato. Academia indoor é vantagem: a unidade já é o lugar. Heatmap do Strava já vazou casa e base militar. Não copie o crime.

**Regra:** `PROIBIDO: friendMap, liveLocation, ghostMode, etaDeAmigo`. Lugar = nome da unidade no Feito. Presença no Hoje é opt-in da turma, sem lat/lng de pessoa.

### 11. Coin, XP, sticker

**Quem pagou:** Swarm (coins, +5 foto, +2 first friend, Pokédex 6/100, flame), LINE (sticker como língua), Azar (coins de atenção), Orb (token), Fitocracy (fora dos 82, mesma morte: farm de XP). Letterboxd é o ancestral honesto: **sem XP**.

**O pouquinho:** “XP só da turma do Fred.” “Sticker do check-in.” “Coin que não compra nada.” XP global é vício vazio. Loja chega na semana 3. Tá pago já é o carimbo. Duplicar é Swarm. §12.3: ofensiva sem loja, sem gemas. Liga do grupo, nunca mundial.

**Regra:** `PROIBIDO: coins, gems, xpGlobal, stickerUnlock, token, loja`. Tá pago é o único carimbo. Liga = `grupo.id`. Selos: poucos, conquista real, sem farm.

### 12. All-star / farm de perfil

**Quem pagou:** LinkedIn (Intermediate → All-star; Complete 2 steps), Swarm (categorias 6/100 locked), BeReal (“Fill in what's missing” vira quest se você tratar buraco como onboarding de cromo), Dimensional (quiz = classe).

**O pouquinho:** “Barra de perfil completo.” “All-star do aluno.” “Quiz de classe no onboarding: power ou hyper?” Complecionismo ≠ treino. Classe emerge do diário. Headline vem do rack. Quiz mente.

**Regra:** `PROIBIDO: profileCompleteness, allStar, quizDeClasse, skillAssessment`. Buraco = sem ficha no Hoje, sem Feito no diário. Não é quest. Headline comprovada pelo log, não por dropdown.

### 13. Daily camera

**Quem pagou:** BeReal (alarme, 2 min, late post quebra a tese, o app esfriou), Snapchat (streak diário: ansiedade e mentira), Lapse (delay não salva o Instagram; só atrasa), Locket, yope.

**O pouquinho:** “BeReal no horário do treino.” “Foto obrigatória pra valer o Feito.” “Streak de câmera.” Prova no tempo sim. Obrigação diária de pose não. Ofensiva é **semana** + 1 protetor. Streak vitalícia gera abandono no primeiro furo.

**Regra:** `PROIBIDO: dailyCamera, forcedDualCam, streakDiario, realMoji`. Feito não exige foto. Ofensiva = sessões na semana, não shutter.

### 14. Like no comentário

**Quem pagou:** Threads, Instagram, X, Reddit (karma no reply), LinkedIn reactions, GroupMe (like na mensagem). Destilação de fitness já recusou. Destilação social: erro nº 9 da categoria.

**O pouquinho:** “Like só no comentário do personal.” “Upvote pra subir o ajuste de carga.” Diálogo vira score. Quem performa, sobe. Quem fala carga, some. Twitter antigo é reply no objeto, não coração no reply.

**Regra:** `comment.like === undefined`. Sem coração, sem upvote, sem kudo no reply. Tá pago vive no Feito, uma vez. Não no comentário.

### 15. Ranking mundial

**Quem pagou:** Product Hunt (upvote mundial), Letterboxd (Popular this week), Hevy (fora dos 82, mesmo pecado: feed global de lifting), Swarm Explore, Quora, Weverse (ídolo vs massa).

**O pouquinho:** “Top 1% de supino.” “Ranking da Smart Fit Brasil.” “Leaderboard da marca, não do planeta.” Inveja global desiste. Rei da Asa Sul / da unidade / da 18h é Strava. §12.3 item 8: liga = o grupo. Grupos brigam entre si. Nunca ranking mundial de um.

**Regra:** `assert(placar.escopo ∈ {turma, unidade, grupo})`. Proibido `world`, `brasil`, `redeDaMarca`, `topPercentile`. Sem testemunha, número é diário, não Rei.

### 16. Explore

**Quem pagou:** Instagram, TikTok, Discord (compass / Discover), Swarm, Orb (Explore clubs), Digg (grid de communities), Meetup (Explore de evento), Facebook Local, Lemon8.

**O pouquinho:** “Explore de unidades da cidade.” “Achar box perto.” “5ª aba com lupa.” Quase todos os 82 usam 5 tabs. O ícone do meio delata. Se a Rede virar lupa, o lock morreu. Explore é For You com outro ícone.

**Regra:** `tabs === [Hoje, Ficha, Rede, Progresso, Perfil]`. `Rede !== Explore`. Sem lupa, sem Discover, sem compass. Join = código da turma (`18H-BUENO`) ou chão onde o Feito nasceu.

### 17. Matching

**Quem pagou:** Tinder, Yubo, Plenty of Fish, Monkey, Azar, Lex (classified que briga com o job quando mente “social”), BFF (“fazer amigo”).

**O pouquinho:** “Match de parceiro de treino.” “Pessoas que você talvez conheça.” “Intent pills: busco dupla.” 1 em 5 Gen Z do Strava saiu com alguém do **grupo de treino**, não do DM. Matching é mercado de cara. Grafo zero até o yes.

**Regra:** `PROIBIDO: match, suggestedPeople, youMayKnow, intentPills, classified`. Dupla nasce de raid, testemunha, mesma lista das 18h. Sem mercado.

### 18. Widget de vigilância

**Quem pagou:** Airbuds (música do amigo na homescreen; depois feed, escola, ghost), Locket (foto no widget; Rollcall = Stories), yope (lockscreen), zenly (widget de presença).

**O pouquinho:** “Widget: Fulano está no rack agora.” “Foto da turma na homescreen.” Tentação máxima. Esforço zero. É Life360 de academia. Presença passiva sem ato. Vigilância.

**Regra:** `PROIBIDO: widgetPresenca, lockscreenPic, friendNowPlaying`. Presença da turma mora no Hoje, opt-in, sem mapa, sem homescreen. O app não vigia o bolso do outro.

### 19. Métrica fictícia (IRL)

**Quem pagou:** IRL (SoftBank, $1,17B; board: 95% dos usuários eram bot; processo por esquema de proxy; ghost town com nome honesto). Mozi (empty state: your people aren't on Mozi yet). Orb (club deserto com floor price).

**O pouquinho:** “20 milhões de grupos.” “MAU da Rede.” “Eventos criados por dia.” Grupo sem gente no prédio é ficção. IRL de verdade = catraca + Zap. Se a métrica sobe e a Bueno está vazia, você é o próximo processo.

**Regra:** `metrica_que_vale = feitos_com_unidade + raids_que_abriram_zap + gente_no_chao`. Proibido vanity: grupos criados, MAU de chat, eventos sem check-in. Proto que ostenta número sem Feito falhou.

### 20. Cadáver de feature (Periscope)

**Quem pagou:** Periscope, Byte (Vine 2; descontinuado 3 mai 2023), Houseparty, Breaker, Gas, zenly, Monkey, Elbi, Facebook Local (absorvido). Mobbin guarda o pixel. Produto não.

**O pouquinho:** “A gente ressuscita live, mas com unidade.” “Vine de 6s do PR.” “Houseparty do vestiário.” Formato sem grafo de lugar não volta. A incumbente come. Acqui-hire mata. Copiar cadáver porque o pixel é bonito é incompetência.

**Regra:** `PROIBIDO_COPIAR: [Periscope, Byte, Houseparty, Breaker, Gas, Monkey, Elbi, zenly-como-mapa]`. Pixel de cadáver não entra no proto. Se o job já morreu duas vezes, a terceira não é inovação.

### 21. Protocolo / DID

**Quem pagou:** Bluesky (AT Protocol, starter packs, ainda vira Twitter: briga, viral, celeb), Mammoth / Mastodon (federated home = Twitter de novo), Orb (carteira).

**O pouquinho:** “O aluno leva o grafo se trocar de academia.” “Instância federada das Smart Fit.” “Login com carteira.” O aluno da Bueno não quer DID. Protocolo não resolve lugar. Federação vira For You com cromo de liberdade.

**Regra:** `PROIBIDO: did, atproto, wallet, federatedHome, starterPackDeFollow`. Escolher unidade = escolher casa. Conta do aluno sobrevive à troca de personal. Isso não é protocolo. É §12.5 tese 5.

### 22. Paywall de identidade

**Quem pagou:** Letterboxd PRO, Patreon, Locals, LinkedIn (identidade completa atrás de cromo), Weverse membership.

**O pouquinho:** “Selo PRO de quem pagou o personal.” “Tier pra ver a turma.” “Summit do Tá pago.” O aluno já pagou a matrícula. Segunda mensalidade pra ver a 18h é insulto. §12.3: app não cobra o aluno. “Já paguei” no perfil. Freemium cobre a lupa, nunca o gesto social.

**Regra:** `Tá pago, chão, raid, ofensiva, liga do grupo = livres`. Proibido `proBadge`, `tierDePertencimento`, `paywallDeFeed`. Quem cobra é o personal, fora do app.

### 23. Hashtag / música

**Quem pagou:** Instagram, TikTok (música como cola), BeReal + Apple Music, Tumblr (tags), LinkedIn (`#books`), Hypelist share-to-Stories.

**O pouquinho:** “#peito #costas.” “Som do Reel no recibo.” “Flair lifestyle.” Se parecer Instagram, perdeu. Caption curta. Sem trilha. Flair = modalidade ou unidade, não tag de vibe.

**Regra:** `PROIBIDO: hashtag, soundOnPost, musicSticker, tagLifestyle`. Flair ∈ {unidade, modalidade, turma}. Caption sem `#`. Sem Apple Music no Feito.

### 24. Comment como performance

**Quem pagou:** Instagram, TikTok, YouTube, Quora, Product Hunt, Weverse (fan letter no altar), Threads quando o reply vira palco.

**O pouquinho:** “Twitter antigo no Feito” sem trava de um nível. “Árvore Reddit pra discussão rica.” “Mention pra puxar audiência.” Comment vira plateia. Diálogo honesto é ajuste de carga: “Quarta sobe 2,5.” Um nível. Casa pequena. Sem quote, sem repost, sem fishing de `@`.

**Regra:** `reply.maxDepth === 1`. Sem quote, sem repost, sem stitch. Mention só quem estava no Feito (`with`). Sem composer de tweet solto. Sem Feito, sem fala.

### 25. Servidor de cidade

**Quem pagou:** Discord (Design Buddies: 82.378 members: já é cidade), BFF (~2k: cidade pequena, não turma), Telegram supergrupo, Reddit `r/worldnews`, Facebook Groups enormes, Orb Explore clubs.

**O pouquinho:** “Servidor da Smart Fit Bueno inteira no chat.” “#general da unidade.” “Discover de servidores da cidade.” Papel + canal da turma (12–20) é herança. 80 mil é shopping. Quem não fala some. RPG vira cargo de admin.

**Regra:** `turma.teto ≈ 12–20`. Unidade = placar + chão, não #general. Proibido `discoverServers`, `memberCountComoStatDePessoa`, `roleAdminComoRPG`. Papel = ofensiva / protetor / rei. Não mod.

---

## O fundador pede amanhã. Recusa mesmo assim.

Essas frases vão aparecer. Soam razoáveis. São o mesmo crime com advérbio.

| Pedido fofo | Recusa | Por quê, sem romance |
|---|---|---|
| “Stories só da unidade” | Item 3 | Timer + pose. IG/Snap já ganharam. Unidade não batiza Stories. |
| “For You só da academia / da marca” | Itens 1 e 16 | Algoritmo come o chão. Vazio no dia 1 se resolve com buraco, não com criador. |
| “Chat só da turma, o Zap some às vezes” | Item 5 | Quarto messenger. §12.3. |
| “Follower da unidade” | Item 2 | Audiência com outro nome. Join ≠ follow. |
| “Grid de PRs, é prova” | Item 4 | Célula de foto é tese 1. Diário é caixa do dia. |
| “Widget: quem está no rack” | Item 18 | Vigilância. Airbuds/Locket/zenly. |
| “Mapa dos amigos na Bueno” | Item 10 | zenly. Snap matou o mapa de gente **crescendo**. |
| “Live do personal / da aula” | Item 8 | Periscope. Incumbente come. Recibo, não broadcast. |
| “Sala de voz no treino” | Item 7 | Clubhouse. Sem rastro, sem Rei. |
| “Swipe de parceiro de treino” | Itens 6 e 17 | Tinder. 20 metros ≠ match. |
| “Anônimo pra não ter vergonha” | Item 9 | Gas / Yik Yak. Vergonha **com cara** é o que retém. |
| “XP da turma, sem loja” | Item 11 | Loja chega na semana 3. Tá pago basta. |
| “Ranking da Smart Fit Brasil” | Item 15 | Inveja. Não é segmento. |
| “Explore de unidades / boxes” | Item 16 | Lupa = For You. Código da turma. |
| “Like no comentário do personal” | Item 14 | Score no diálogo. O personal já fala carga sem coração. |
| “BeReal no horário do treino” | Item 13 | Câmera diária. Ofensiva é semana. |
| “Streak diário de quem vai todo dia” | Item 13 | Snap. Mentira e abandono. |
| “PRO de quem pagou o personal” | Item 22 | Paywall de identidade. Já pagou a casa. |
| “DID pra levar o grafo” | Item 21 | Aluno não quer protocolo. Conta ≠ federação. |
| “Hashtag e som no recibo” | Item 23 | Instagram. Se parecer, perdeu. |
| “#general da unidade, tipo Discord” | Item 25 | Cidade. Turma 12–20. |
| “Vine de 6s do PR” | Item 20 | Byte. Formato sem grafo não volta. |
| “Quote do Feito pra viralizar a unidade” | Item 24 | Virality. Recusa quote. |
| “Pessoas que você talvez conheça” | Item 17 | Matching. Grafo errado. |
| “Quiz de classe no onboarding” | Item 12 | Dimensional. Classe = diário. |
| “All-star / complete seu perfil” | Item 12 | LinkedIn. Farm. |
| “Moeda que não compra nada” | Item 11 | Swarm. Sempre compra cromo depois. |
| “Popular this week da Bueno” | Itens 1 e 15 | Letterboxd no pecado. |
| “Close friends / Stories íntimos” | Item 3 | Instagram com cadeado. Rede = unidade, não close friends. |
| “Comunidades com Admin/Mod” | Item 25 | X Communities. RPG falso de polícia. |

§12.4 não é porta dos fundos. NFC / relógio / voz no **log**. Testemunha de PR. App do personal. Cor. Se o pedido “depois” for Stories, chat, For You, live, widget, mapa, XP, recusa igual.

---

## Testes de recusa

Se o proto tiver qualquer um, falhou. Sem discussão de cromo. Sem “é só no proto”.

1. Se o proto tiver For You, Explore, Popular this week ou lupa na Rede, falhou.
2. Se o proto tiver `followers` / `following` / botão Seguir, falhou.
3. Se o proto tiver Stories, anel de 24h, Status ou dump que some, falhou.
4. Se o proto tiver grid 3 colunas de foto no perfil, falhou.
5. Se o proto tiver inbox, DM, chat de turma ou thread privada, falhou.
6. Se o proto tiver swipe, match, “pessoas que você talvez conheça” ou deck de cara, falhou.
7. Se o proto tiver live, sala de voz, raise hand ou broadcast do personal, falhou.
8. Se o proto tiver ranking mundial, da marca, do Brasil ou top %, falhou.
9. Se o proto tiver coin, XP global, gemas, sticker unlock, token ou loja, falhou.
10. Se o proto tiver composer sem Feito, tweet solto, hashtag, música, like no comentário ou mapa/widget de gente, falhou.

Bônus que já mata sozinho: métrica de grupos/MAU sem Feito no chão (você é a IRL). Pixel de Periscope/Byte/Houseparty. Quiz de classe. All-star. DID. PRO badge. Servidor com milhares. Post anônimo.

---

## Colar no proto

```
ASSERT §12.3 intacto.
REDE_HOME = chao_da_unidade_hoje
grafo = join(grupo|unidade)          // nunca follow
gesto = ta_pago                      // nunca like/kudo/coin
objeto = feito                       // nunca tweet, nunca selfie
fala.maxDepth = 1                    // ou zero; nunca árvore; nunca like no reply
raid.open = whatsapp
placar.escopo ∈ {turma, unidade, grupo}
turma.teto ≈ 12–20
perfil = headline + diario + histograma
foto = anexo(feito) | null
tabs = [Hoje, Ficha, Rede, Progresso, Perfil]

PROIBIDO = [
  forYou, explore, popularThisWeek,
  followers, following, seguir,
  stories, status24h, highlightRing,
  grid3, inbox, dm, chat,
  swipe, match, youMayKnow,
  voiceRoom, live, broadcast,
  anonimo, friendMap, liveLocation,
  coins, xpGlobal, gems, stickerUnlock, token,
  allStar, quizDeClasse, profileCompleteness,
  dailyCamera, streakDiario, realMoji,
  likeNoComment, quote, repost,
  rankingMundial, rankingMarca, topPercentile,
  widgetPresenca, lockscreenPic,
  did, atproto, wallet, federatedHome,
  proBadge, paywallDePertencimento,
  hashtag, soundOnPost,
  discoverServers, generalDaCidade,
  composerSemFeito
]
```

Se o fundador pedir Instagram + Twitter + RPG no mesmo home, recusa o colado. Herda Letterboxd (diário), Discord pequeno (papel), Swarm sem coin (lugar), Threads sem For You (um reply no Feito). O resto os 82 já pagaram. Não precisa pagar de novo.
