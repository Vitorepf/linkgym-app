# Destilação Mobbin — os 82 de Social Networking (iOS)

21 ago 2026. Complementa `destilacao-mobbin-103.md` (Health & Fitness) e `estrategia-strava-academia.md`. **Não é um app novo.** É o mapa da categoria que o Mobbin chama de Social Networking, para o Link saber o que herdar quando a imagem social vira classificação + capacidade — e o que recusar quando isso vira Instagram.

Filtro desta sessão: iOS · Social Networking · Most popular · **“Showing 82 apps”**.

URL da listagem: [Mobbin search — Social Networking, popularity](https://mobbin.com/search/apps/ios?content_type=apps&sort=popularity&filter=appCategories.Social+Networking)

---

## Como ler este documento

Os 82 **não** são 82 jeitos de fazer rede social. São o saco da Apple: feed de pose, microblog, chat, servidor, fórum, dating, círculo fechado, portfólio, check-in, e um rastro de app morto. Destilar “todos” **não** é copiar 82 homes. É achar os **10 jobs**. Dentro de cada job, 6 a 12 apps repetem o mesmo mecanismo com cromo diferente.

Quem tenta copiar tela de 82 apps inventa o quarto produto — o Instagram da academia. O Link já está travado:

> o app que o aluno abre no rack, e que o personal obriga o aluno — assim como faz com o MFIT Personal.

A pergunta do fundador nesta sessão não é “faz um Instagram”. É:

> RPG da vida real = estruturar a **imagem social e interativa**: classificação (powerlift / musculação / CrossFit), capacidades que evoluem, estatística — e uma rede em que a pessoa publica foto + texto e consegue **diálogo em cima da publicação**, no jeito do Twitter antigo.

Este texto destila **mecanismo**. Pixel do Mobbin é prova, não spec. O mapa e a gramática ficam no topo. **As 82 fichas** (ideia, estratégia, fluxo, rede, acerto, falha, para o Link) estão neste mesmo arquivo, uma a uma. Tabela de uma linha mente: parece que Instagram e Signal são o mesmo tipo de produto. Slack, Teams, QUITTR e Character AI **não** estão nos 82.

### O que foi visto de verdade

- Listagem logada do Mobbin Discover → Search: **82/82 nomes + taglines** extraídos do DOM, sort Most popular. Primeira fileira bate com a captura: Instagram, Tinder, Clubhouse, Discord.
- Screens MCP desta sessão (olhar o pixel, não só metadado):
  - [Instagram perfil / grid](https://mobbin.com/screens/fd46bbb4-f06b-4ef9-83aa-461daa667c15) — 12 telas
  - [Threads diálogo na publicação](https://mobbin.com/screens/4c1965df-7e7c-4938-a4a1-ac0498f64a2e) — 10 telas
  - [Letterboxd diário / stats / Year in Review](https://mobbin.com/screens/0cbd7a3c-9a2d-4889-813a-9d826730a778) — 10 telas
  - [Discord servidor + papéis](https://mobbin.com/screens/e0d2e713-f400-407c-b0ce-bbc1c617eca7) — 10 telas (a busca misturou Slack/Teams; Discord é o pixel que importa)
  - [Tinder carta / bio / badges](https://mobbin.com/screens/edd51a54-162e-4ecf-a044-97a9ed07b3df) — 8 telas
  - [X thread](https://mobbin.com/screens/d566d851-d002-453a-8058-ea9ace35a7d4) — busca misturou; o ancestral do diálogo é o tweet + replies
  - [Reddit post + comentários](https://mobbin.com/screens/fa893128-b9da-4820-b136-89efd151ac0c) — 7 telas
  - [BeReal feed + comentário + perfil vazio](https://mobbin.com/screens/72d3854d-97be-4541-a917-64a0100ce65d) — 8 telas
  - [LinkedIn headline / skills / All-star](https://mobbin.com/screens/9920d587-49eb-4d75-9681-ec11117580ab) — 8 telas
  - [Swarm check-in / coins / stickers](https://mobbin.com/screens/aced7ef7-5a07-4d00-a9f0-6dc1ea2e713c) — 6 telas
- Aprofundamento MCP (pixel olhado, não só metadado):
  - [Hypelist lista / share](https://mobbin.com/screens/fe7379e2-66dc-47ef-bd74-711b4aab7e1b)
  - [Mozi perfil / My People / cidade](https://mobbin.com/screens/0d32a70a-eb85-4d94-8bb8-3f938cf80dc5)
  - [Bond onboarding Polaroid](https://mobbin.com/screens/09dd4d40-dc1c-49f1-bd95-55e2ca061ec4)
  - [Airbuds Space / recently played](https://mobbin.com/screens/f5873508-93a3-4b66-94e3-a7d1d5aa08e4)
  - [Locket Pick 10/20 best friends](https://mobbin.com/screens/15acb83a-00af-4253-ac85-19f6e5e88132)
  - [yope muro / group recap / gate](https://mobbin.com/screens/7a7b4292-349f-45c5-a294-d48daa998a6a)
  - [Weverse Fan Letter / Home / Highlight](https://mobbin.com/screens/fd26fa8f-4dab-43e5-8211-90cbedcf6a89)
  - [Lex post + reply / Ask me about](https://mobbin.com/screens/ff16a344-1e3b-4df6-b239-1fe113ed2f2f)
- URLs existem, **imagem pulada** nesta sessão (não inventamos pixel): Fable, Bump, Lapse, Mammoth, Digg. Gas devolveu Yubo/POF, não o app.
- Galeria pública [Social Media App Mobile Design](https://mobbin.com/explore/mobile/app-categories/social-networking) — screens soltas, não o censo dos 82.
- **Não** abrimos as ~2–8 mil telas restantes. Cadáveres (Periscope, Byte, Houseparty, zenly, Breaker, Monkey, Elbi, Gas) e estratégia vêm de conhecimento de produto + reportagem. Se o 83º for mais um “For You + follow + like”, ele já está neste documento.

---

## O mapa (não 82 produtos)

Peso **contado** nesta listagem — censo, não palpite. Soma 82.

| Job | Qtd | O que o usuário contrata | Ancestral | Link |
|---|---|---|---|---|
| Broadcast / pose | 6 | “Me vê o mundo” | Instagram, TikTok | Recusa feed global. Foto de pose já perdeu para o Instagram. |
| Microblog / diálogo na publicação | 7 | “Falo e o povo responde **neste** post” | X antigo, Threads, Reddit | **Função candidata.** Objeto = Feito, não tweet. Grafo = unidade/grupo, não For You. |
| Chat 1:1 / grupo | 12 | “Falo com alguém agora” | WhatsApp | Recusa. Raid já termina no Zap. Chat in-app é o quarto produto. |
| Servidor / sala / clã | 10 | “Tenho um lugar com papéis” | Discord, Clubhouse | Rouba **papel + canal**. Não rouba o chat eterno. |
| Fórum / interesse | 9 | “Gente do mesmo assunto” | Reddit, Peanut | Tribo (power / Hyrox / 18h). Não subreddit mundial. |
| Dating / matching | 6 | “Quem combina comigo” | Tinder | Recusa swipe. Rouba **carta de prova** (bio = ato, não pose). |
| Círculo / prova do momento | 9 | “Quem está perto, agora” | BeReal, Bump, zenly | Rouba **prova no tempo**. Sem Stories. Sem foto obrigatória todo dia. |
| Perfil-portfólio / stats | 9 | “Sou isto, e dá para ver” | Letterboxd, LinkedIn | **Sagrado do RPG.** Classificação + diário + histograma. Sem XP farm. |
| Lugar / check-in | 5 | “Eu estive aqui” | Swarm | **Sagrado do lugar.** Check-in = Feito na unidade. Sem moeda/sticker. |
| Morto / widget / nicho | 9 | Já nasceu ou já morreu | Periscope, Byte, Houseparty | Recusa. Não copiar cadáver. |

Leitura dura: **~27 dos 82 são chat ou dating.** Não são concorrentes do Link. **~15 são feed de pose ou YouTube.** Já perderam para o Instagram. O que importa para o RPG social que o fundador descreveu são **4 jobs**:

1. **Perfil-portfólio / stats** (Letterboxd, LinkedIn) — a classificação e a estatística.
2. **Lugar / check-in** (Swarm) — a prova mora no chão.
3. **Servidor / clã** (Discord) — o papel (powerlift vs CrossFit) e o canal da turma.
4. **Diálogo na publicação** (Threads / X antigo / Reddit) — o povo responde **no Feito**, não no DM.

O resto é cromo, cadáver ou WhatsApp.

---

## Gramática que a maioria compartilha

Quase todo app popular desta categoria, Instagram ou Signal, abre com a mesma frase. Destilar isso evita copiar 82 homes.

### 1. O perfil é uma tese, não um formulário

Quatro teses aparecem. O Link só pode ter **uma**.

| Tese | Como se constrói | Onde acerta | Onde erra | Apps |
|---|---|---|---|---|
| **Eu sou o que eu mostro** | Avatar + grid de foto + contagem de seguidor | Identidade imediata | Pose. A estatística é follower, não ato | Instagram, TikTok, Lemon8, Behance |
| **Eu sou o que eu falei** | Handle + bio curta + thread | Diálogo vive no objeto | For You come o grafo; virólatra | X, Threads, Bluesky, Mammoth |
| **Eu sou o que eu fiz** | Diário + histograma + meta do ano | RPG honesto. A imagem é consequência | Vira coleção (filme, lugar, skill) se o ato for falso | Letterboxd, Swarm, LinkedIn (quando a skill é prova) |
| **Eu sou o que o grupo me deu** | Role, badge, canal, mayorship | Classificação social sem farm | Hierarquia de admin/mod vira polícia | Discord, X Communities, Swarm mayor |

O RPG que o fundador descreveu é a tese 3 + um pouco da 4. **Não** é a tese 1. Se o perfil do Link nascer com grid de foto e follower, ele já escolheu Instagram e já perdeu.

Pixel desta sessão:

- Letterboxd ([perfil](https://mobbin.com/screens/f41976a6-dc7b-47f1-b2c6-5e28640d8f77)): nome, PRO, lugar, abas Profile / Diary / Lists / Watchlist, carrossel do que **acabou de logar**, histograma de nota, `Films 8/5 this year`, `Diary 5/5`, Reviews, Lists, Following. A pessoa **é** o diário.
- LinkedIn ([All-star](https://mobbin.com/screens/81dafcac-a437-4beb-8fd6-4308cb8b7f19)): headline = classe (`UX Analyst at Mobbin`), anel `#OPENTOWORK` = status, barra Intermediate → All-star = quest de perfil (errado para o Link: isso é farm de preenchimento), Experience = linha do tempo do ato, Skills com “Passed assessment” = stat **verificado**.
- BeReal ([perfil vazio](https://mobbin.com/screens/515f709f-0ae0-4a74-89ce-86b998ebee54)): “Tap to add profile pic”, 0 followers, Pins vazios, banner “Fill in what's missing”. Perfil sem ato é buraco. O Link já tem o nome disso: **sem ficha o Hoje mostra o buraco**.
- Discord ([Design Buddies](https://mobbin.com/screens/e0d2e713-f400-407c-b0ce-bbc1c617eca7)): 82.378 members, Channels & Roles, `#welcome` / `#general` / voice. O perfil individual some. Quem você é = o servidor + o papel.

### 2. A interação mora num objeto — ou não mora

Cinco máquinas. Só uma serve ao “Twitter antigo em cima da publicação”.

| Máquina | Objeto | Gesto | Onde acerta | Onde erra |
|---|---|---|---|---|
| **Feed de pose** | Foto/Reels | Like, compartilhar, DM | Baixo atrito | Diálogo morre. Like não é conversa |
| **Thread** | Post de texto (+ foto opcional) | Reply aninhado, repost | Diálogo **no** objeto. Twitter antigo | For You + virality. Grafo explode |
| **Fórum** | Post + árvore | Upvote, reply, flair | Tribo + memória | Anonimato / briga / moderação |
| **Chat** | Mensagem | Enviar agora | Útil | Não é publicação. Não constrói imagem |
| **Carta / swipe** | Perfil do outro | Like / X / Super | Decisão em 1s | Sem diálogo até o match. Mercado de cara |

Pixel:

- Threads: o post é o centro; replies caem **embaixo**; composer “Add a comment” no próprio objeto. Isso **é** o Twitter antigo com cromo da Meta.
- Reddit: o post tem casa (`r/…`), flair, árvore, score. Utile para “turma da 18h discute o Feito”. Péssimo como home do aluno no rack.
- BeReal ([comentário](https://mobbin.com/screens/42be5399-a074-4cff-8bf1-737833f0cbb3)): foto do momento + RealMojis (reação = selfie, não coração) + 1 comment “@sam How are you?” + Reply. Diálogo existe, mas o objeto é **o instante**, não o ato.
- Swarm ([timeline](https://mobbin.com/screens/dfd98b64-ff9e-44be-a762-bf2fe201a588)): o objeto é o check-in. Texto + foto + “— with Alex” + moeda. Diálogo é raso (like/view). A imagem social nasce do **lugar**, não do comentário.
- Tinder: a interação **antes** do match é gesto mudo (X / Heart / Star / Bolt). Depois vira chat. Zero publicação. Zero diálogo público.

Para o Link: o objeto já tem nome — **Feito**. Quem / o quê / onde / foi. O diálogo, se existir, mora **no Feito da unidade**, não num feed For You e não num DM.

### 3. Classificação nunca é um dropdown mentiroso

A categoria classifica de quatro jeitos. Só um sobrevive a um aluno de verdade.

| Jeito | Exemplo | Verdade? | Link |
|---|---|---|---|
| Eu me declarei | Tinder “Has Bio”, “Art”; LinkedIn headline | Mentira fácil | Recusa como única fonte. Pode ser **intenção** (power / hyper), não prova |
| O grupo me deu um papel | Discord role, X Admin/Mod | Social, não atlético | Papel de **turma** (rei da unidade, protetor), não de admin |
| O diário me denunciou | Letterboxd histograma; Swarm 6/100 categorias | Ato acumulado | **Este.** Powerlift = o que o rack registrou, não o que o bio escreveu |
| O app me vendeu um nível | LinkedIn Intermediate → All-star; Swarm coins | Farm | Recusa. Sem XP, sem All-star, sem moeda |

Letterboxd é o ancestral honesto do RPG que o fundador pediu: você não “é cinefilo” porque escreveu no bio. Você é o diário, a distribuição de nota, a meta do ano, a lista. Troca “filme” por “sessão” e “nota” por “foi / carga / Tá pago” e o perfil do Link já tem esqueleto — **sem** copiar o feed Popular this week.

Swarm é o ancestral honesto do **lugar**: check-in, categoria do venue, “first of your friends”, sticker. O erro dele é a moeda (124 coins) e o sticker de sorvete. O Link já tem o carimbo: **Tá pago**. Não precisa de coin.

LinkedIn é o ancestral honesto da **headline** (“UX Analyst at Mobbin” = “Power na Bueno”) e o ancestral **desonesto** da quest de perfil (Complete 2 steps to All-star). Rouba a headline. Recusa a barra.

### 4. Seguir / follower é o stat errado

Quase todos os 82, do Instagram ao BeReal vazio, põem `followers · following` no perfil. Isso mede **audiência**, não capacidade.

Stats que a categoria acertou **quando parou de contar gente**:

- Letterboxd: films / diary / reviews / lists / likes / tags — e só então following.
- Swarm: categories 6/100, stickers, coins (errado), check-ins por tipo de lugar.
- LinkedIn: connections como prova de rede profissional — faz sentido **lá**. No rack, 500+ connections é Instagram de gravata.
- Discord: members do servidor, não followers do indivíduo.

O Link já tem os stats certos na destilação de fitness: **ofensiva semanal**, **rei da unidade**, **Tá pago**. Se o perfil ganhar follower, o RPG morreu e nasceu um criador.

### 5. O botão do meio delata o produto

Olha o `+` de cada ancestral:

| App | `+` no meio | O que o produto **é** |
|---|---|---|
| Letterboxd | Logar um filme | Ferramenta. Rede de brinde |
| Instagram | Stories / post / Reels | Fábrica de conteúdo |
| BeReal | Câmera | Prova do instante |
| Swarm | Check-in | Estive aqui |
| Reddit / Digg | Post no fórum | Discurso |
| LinkedIn | Start a post | Feed corporativo (o produto verdadeiro já não é o CV) |
| Discord | (não tem `+` de post; tem canal) | Lugar para ficar |

O Link já escolheu: o polegar no rack é “Fiz essa série”. O `+` social, se existir, só pode nascer **depois** do Feito. Composer vazio no Hoje é Instagram.

---

## Catálogo de elementos (o que a categoria sabe fazer)

Isto não é backlog. É o alfabeto. Marcar o que o Link já tem, o que pode herdar, o que é veneno.

### Identidade

| Elemento | Onde aparece | Link |
|---|---|---|
| Avatar circular | Quase todos | Sim. Foto de cara, não de pose no rack |
| Banner / cover | LinkedIn, Discord server, Instagram | Só se for **unidade**, não lifestyle |
| Handle `@` | X, Threads, BeReal, Instagram | Opcional. Nome real da turma basta |
| Headline / classe | LinkedIn, Tinder bio, Discord role | **Sim.** Power / hyper / CrossFit como tese, comprovada pelo diário |
| Badge verificado | Instagram, Discord, LinkedIn | Recusa check azul. Prova = Tá pago |
| Anel de status | LinkedIn `#OPENTOWORK` | Status = **ofensiva / protetor / sem ficha**. Não Open to work |
| PRO / All-star | Letterboxd PRO, LinkedIn All-star | Recusa paywall de identidade |
| Pins / Featured / Highlights | BeReal Pins, LinkedIn Featured, Instagram Highlights | Pin = **PRs / Feitos da semana**. Não Stories |
| Private lock | BeReal cadeado | Rede = unidade. Privado por grafo, não por cadeado de influencer |

### Prova e estatística

| Elemento | Onde aparece | Link |
|---|---|---|
| Contagem follower/following | Quase todos | **Veneno** |
| Grid 3 colunas | Instagram, Behance | Recusa. Vira pose |
| Diário cronológico | Letterboxd Diary (caixa do dia + poster + estrelas + ícones like/rewatch/review) | **Herda.** Caixa do dia + exercício + carga + Tá pago |
| Histograma | Letterboxd rating distribution | **Herda.** Distribuição de sessões / cargas, não de “gostei” |
| Meta do ano | Letterboxd `8/5 this year` | Ofensiva é **semana**, não ano. Sem meta anual de volume |
| Year in Review | Letterboxd cards “HIGHEST RATED” + share | Recibo anual opcional. Não ranking mundial |
| Timeline de lugar | Swarm, check-in + “with Alex” | Feito na unidade + quem estava |
| Categorias 6/100 + silhueta locked | Swarm Achievements | Recusa coleção. A academia não é Pokédex |
| Coins / stickers | Swarm +5 photo, +2 first friend | Recusa. Tá pago já é o carimbo |
| Skills + assessment | LinkedIn “Passed Skill Assessment” | Stat **verificado pelo rack**, não por quiz |
| Experience / linha do tempo | LinkedIn 1975–Present | Histórico de unidade / grupo, não de emprego |
| Streak diário | Swarm flame, BeReal daily | Recusa. Ofensiva **semanal** + 1 protetor |
| Mayorship / first of friends | Swarm | Rei da **unidade**, não do planeta |

### Publicação

| Elemento | Onde aparece | Link |
|---|---|---|
| Foto + caption | Instagram, Swarm, BeReal | Foto **só** se nasceu da sessão / unidade. Caption curta. Sem grid |
| Texto puro | X, Threads, Reddit, Tumblr | Texto no Feito = nota do personal / da turma. Não tweet solto |
| Stories / 24h | Instagram, Snapchat | **Veneno.** Já travado |
| RealMoji / reação-selfie | BeReal | Recusa. Tá pago não é cara |
| Composer “Add a comment” no objeto | Threads, BeReal, Reddit | **Candidato.** No Feito da unidade, sem like no comentário |
| Reply aninhado | Threads, Reddit, X | Um nível basta. Árvore Reddit é fórum, não rack |
| Repost / quote | X, Threads | Recusa virality |
| Upvote / like | Reddit, Instagram, LinkedIn reactions | Tá pago é o gesto. Não coração. Não kudo |
| Flair / tag | Reddit, LinkedIn hashtags `#books` | Flair = modalidade ou unidade, não hashtag lifestyle |
| Spoiler gate | Letterboxd “Review may contain spoilers” | Inútil no rack |
| Mention `@` | BeReal, X, Threads | Mencionar quem estava. Sem fishing de audiência |
| Tag “with Alex” | Swarm | **Herda.** Quem pagou junto |
| Música na foto | BeReal + Apple Music | Recusa. Teatro |

### Grafo e lugar

| Elemento | Onde aparece | Link |
|---|---|---|
| Follow | Instagram, Letterboxd, LinkedIn | Recusa follow mundial. Join de **grupo/unidade** |
| Match / swipe | Tinder, Yubo, POF | Recusa |
| Server / community join | Discord, Digg `/science` Join, Mammoth instance | **Join unidade / grupo.** Mammoth escolhendo instância = escolher a Bueno |
| Rooms / channels | Discord, BFF Rooms, Clubhouse | Canal da turma, não 40 rooms de fofoca |
| Events | BFF Events, Meetup, Facebook Local | Raid / guerra / bora. Termina no Zap |
| Nearby / map | zenly, Life360, Swarm Map | Recusa GPS de vigilância. Lugar = unidade |
| Invite | BeReal Add Friends, Discord +, BFF Invite | Código da turma (`18H-BUENO`). Já existe |
| Explore / For You | Instagram, TikTok, Discord compass | **Veneno.** Já travado |

### Navegação (o crime da 5ª aba)

Quase todos os 82 usam 5 tabs. O ícone do meio delata (ver §5). O Link já lockou: **Hoje · Ficha · Rede · Progresso · Perfil**. Rede ≠ Explore. Se a Rede virar For You, o lock morreu.

---

## Onde a categoria acerta um dia — e onde erra o ano

### Acertos (roubar a função, não o cromo)

1. **Letterboxd: a imagem é o diário.** Perfil sem filme logado é vazio; perfil com histograma é alguém. Isso é RPG sem XP.
2. **Discord: classificação é papel no grupo, não bio.** Powerlift vs CrossFit é role da turma, não badge comprada.
3. **Swarm: o ato tem endereço.** “Estive aqui” + “with Alex” + first of friends. O Link já chama isso de unidade + Tá pago + turma.
4. **Threads / X antigo: o diálogo mora no objeto.** Reply embaixo do post, não DM, não Stories.
5. **BeReal: o perfil vazio é honesto.** “Fill in what's missing” = buraco. O Hoje sem ficha já faz isso.
6. **LinkedIn headline:** uma linha classifica. “Power na Bueno” cabe numa headline. A barra All-star não.
7. **Mammoth / Digg: escolhe a casa antes do feed.** Instância / `/sports` Join. Unidade primeiro.
8. **Tinder (só a carta):** prova empilhada — foto, idade, “Matched 3 Preferences”, pills (Has Bio, Art), ações no rodapé. A carta do aluno pode ser **prova**, não mercado de cara.
9. **Bump / Meetup / Nextdoor:** IRL é o produto. Hang, evento, vizinhança. Raid → Zap já é isso.
10. **Peanut / Fable / Lex:** tribo com linguagem própria. A 18h, o power, o Hyrox. Não “social networking” genérico.

### Erros (a categoria inteira, repetido 82 vezes)

1. **Follower como stat.** Mede audiência. Mata capacidade.
2. **For You / Explore.** Come o grafo do lugar. O aluno da Bueno compete com criador de Dubai.
3. **Chat in-app.** Os 12 de messaging já perderam para o WhatsApp no Brasil. Reimplementar é arrogância.
4. **Stories.** Pose com timer. Já travado.
5. **Farm de perfil.** LinkedIn All-star, Swarm 6/100, stickers locked. Complecionismo ≠ treino.
6. **Moeda.** Swarm coins, gamification de check-in. O Link não vende gemas.
7. **Swipe como encontro.** Tinder resolve “quem combina”. Academia resolve “quem está a 20 metros”.
8. **Cadáver na listagem.** Periscope, Byte, Houseparty, Breaker, Elbi, Monkey. Mobbin guarda o pixel. Produto não.
9. **Like no comentário.** Transforma diálogo em score. Destilação de fitness já recusou.
10. **Foto como identidade.** Instagram ganhou. Quem copia, perde. A prova do Link nasce da sessão, não do upload.

---

## Os quatro ancestrais do RPG social (se o fundador for por aí)

Isto é o coração do pedido. Não são 82. São quatro.

### A. Letterboxd — a ficha de personagem honesta

[Perfil](https://mobbin.com/screens/f41976a6-dc7b-47f1-b2c6-5e28640d8f77) · [Diary](https://mobbin.com/screens/094588af-a310-458b-8e20-171a643b8978) · [Reviews populares](https://mobbin.com/screens/4d6cc472-6fed-4b2a-b431-0e620c4edab2) · [Year in Review](https://mobbin.com/screens/11ec3954-ff90-4553-be58-04e4ecbd8d31)

- **Perfil:** tese 3. Você é o que logou. PRO é paywall (recusar). Lugar (Menlo Park) é contexto.
- **Interação:** o `+` verde loga um filme. Review é texto **no objeto**. Feed “Popular this week” é o pecado — vira crítica mundial.
- **Elementos:** caixa do dia, poster, estrelas, heart, rewatch, ícone de review, histograma, meta `n/m this year`, listas.
- **Acerto:** RPG sem XP. A classificação (gosto) emerge do histograma.
- **Erro:** feed popular; PRO badge; meta anual que vira pressure.
- **Para o Link:** Feito = log. Histograma = cargas / sessões. Sem estrelinha de “gostei do treino”. Sem Popular this week.

### B. Discord — a classificação como papel

[Design Buddies](https://mobbin.com/screens/e0d2e713-f400-407c-b0ce-bbc1c617eca7)

- **Perfil:** some no servidor. Você é o role + o canal.
- **Interação:** canal, não publicação. Voice. Server Guide. Invite.
- **Acerto:** power vs CrossFit como **sala da casa**, não como tag de Tinder.
- **Erro:** chat eterno, Explore de servidor, 82 mil members (isso já é cidade, não turma).
- **Para o Link:** grupo da 18h = servidor pequeno. Guerra = servidor vs servidor. Sem #general mundial.

### C. Swarm — a prova tem endereço

[Check-in coins](https://mobbin.com/screens/aced7ef7-5a07-4d00-a9f0-6dc1ea2e713c) · [Achievements](https://mobbin.com/screens/085857b4-f045-45e7-b7c6-968aca449194) · [Timeline](https://mobbin.com/screens/dfd98b64-ff9e-44be-a762-bf2fe201a588)

- **Perfil:** categorias visitadas, stickers, listas Saved/Liked.
- **Interação:** check-in → breakdown de pontos → sticker. Timeline com “with Alex” + foto + nota.
- **Acerto:** first of friends, lugar, quem estava. Isso é unidade.
- **Erro:** coins, Pokédex 6/100, flame de streak, Explore.
- **Para o Link:** Feito já é o check-in. Tá pago já é o coin. Não duplicar.

### D. Threads / X antigo — o diálogo no objeto

[Threads](https://mobbin.com/screens/4c1965df-7e7c-4938-a4a1-ac0498f64a2e) · [X](https://mobbin.com/screens/d566d851-d002-453a-8058-ea9ace35a7d4) · [Reddit árvore](https://mobbin.com/screens/fa893128-b9da-4820-b136-89efd151ac0c)

- **Perfil:** tese 2. Você é o que falou.
- **Interação:** reply no post. Mencionar. Um composer. Árvore (Reddit) ou linha (Threads).
- **Acerto:** o povo discute **esta** publicação. É o que o fundador chamou de Twitter antigo.
- **Erro:** For You, virality, like no reply, DM ao lado, Communities com Admin/Mod como RPG falso.
- **Para o Link:** se reabrir diálogo, ele nasce no **Feito da unidade**, um nível de resposta, sem like, sem For You. A destilação de fitness e o lock atual **recusam** like de comentário e chat. Reabrir isso é decisão de produto, não de tela.

---

## Os 82, um a um

**Fichas completas dos 82** (ideia, estratégia, fluxo, rede, acerto, problema, Link) estão em [`destilacao-mobbin-82-um-a-um.md`](destilacao-mobbin-82-um-a-um.md). Abaixo, 1–20 ficam como amostra do formato; 21–82 na tabela são só índice. Sem o outro arquivo, a tabela mente.

Ordem = Most popular no Mobbin em 21 ago 2026. Tagline = texto da listagem. Job = um dos 10. **Fonte** declara o que foi pixel desta sessão versus conhecimento de produto. Não inventamos tela que não abrimos. Cadáver ainda ganha ficha: a falha **é** a lição.

Legenda de **Para o Link:** herda função / recusa / irrelevante. Uma linha.

---

### 1. Instagram — Videos, creators & friends

Job: Broadcast / pose · Fonte: [pixel perfil/grid](https://mobbin.com/screens/fd46bbb4-f06b-4ef9-83aa-461daa667c15)

**Ideia.** Você é o grid. O contrato é ser visto pelo mundo — foto, Reels, Stories — e converter olhar em follower.

**Estratégia.** Grafo assimétrico (follow). Objeto = pose. Distribuição For You. Creator > círculo. Vidro, não IRL. Lugar some.

**Fluxo.** Abre no feed/Reels → like / comment raso / DM → Stories (24h) → perfil = grid 3 colunas + highlights + contagem. O `+` é fábrica (post / Reel / Story).

**Rede.** Quem segue quem, sem reciprocidade. Post = foto ou vídeo. Gesto mínimo = like. Diálogo morre no comment ou foge para o DM.

**Acertou.** Identidade imediata. Distribuição mundial. O alfabeto visual da década.

**Falhou / o problema.** A pose ganhou o mundo e matou o diálogo. Follower virou o stat. Stories comeram o instante. Quem copia o grid já perdeu — o Instagram já é o Instagram.

**Para o Link.** Recusa feed, Stories, grid, follower. Ancestral **falso**. Rouba zero.

---

### 2. Tinder — Meet new people & date singles

Job: Dating · Fonte: [pixel carta](https://mobbin.com/screens/edd51a54-162e-4ecf-a044-97a9ed07b3df) + Explore “What are you looking for?”

**Ideia.** Mercado de cara. Swipe até o match; só então existe fala — e a fala é chat privado.

**Estratégia.** Grafo de intenção (dating). Objeto = perfil do outro, não publicação. Distribuição por filtro + algoritmo. IRL é a promessa; o produto é o vidro.

**Fluxo.** Carta full-bleed (foto, idade, pills, “Matched N Preferences”) → X / Star / Heart / Bolt → match → chat. Explore = intent pills. Sem objeto público.

**Rede.** Dois estranhos até o match. Não há post. Gesto mínimo = swipe. Diálogo mora no 1:1 depois do yes mútuo.

**Acertou.** Bio como prova empilhada. Decisão em 1 segundo. Intent explícito (“o que você busca”).

**Falhou / o problema.** Sem publicação, sem memória pública, sem lugar. Mercado de cara. O chat pós-match já é o WhatsApp. Fadiga de swipe e mentira de foto são o produto, não o bug.

**Para o Link.** Recusa swipe e mercado. Carta de **prova** só se for Feito, não cara.

---

### 3. Clubhouse — Join live voice chats

Job: Servidor · Fonte: conhecimento de produto (COVID boom → freeze; Twitter Spaces; layoff 2023; tentativa de “houses”)

**Ideia.** Você é a sala. Voz ao vivo, mãozinha, palco — e quando a sala fecha, não sobra nada.

**Estratégia.** Grafo de sala (invite → stage). Objeto = conversa que evapora. Creator- palco. Vidro. Sem For You de post; o “For You” era a sala da moda.

**Fluxo.** Convite / hallway → join room → ouvir → raise hand → falar → sala acaba. Perfil quase nenhum.

**Rede.** Quem está na sala agora. Sem post. Gesto mínimo = entrar. Diálogo = voz, sem rastro.

**Acertou.** Presença. Hierarquia de palco (speaker / listener). FOMO de estar.

**Falhou / o problema.** Sem rastro, sem stats, sem volta. Founders admitiram: os amigos não estão e a conversa longa não cabe no telefone. Twitter Spaces comeu o job. Freeze pós-COVID. Live sem objeto é fumaça.

**Para o Link.** Recusa voice. Raid é Zap. Sem sala que some.

---

### 4. Discord — Talk, play, hang out

Job: Servidor · Fonte: [pixel Design Buddies](https://mobbin.com/screens/e0d2e713-f400-407c-b0ce-bbc1c617eca7)

**Ideia.** A casa vem antes da pessoa. Você é o servidor + o role + o canal.

**Estratégia.** Grafo de clã. Objeto = canal (texto/voz), não post mundial. Círculo que escala até virar cidade. IRL opcional. Creator some; a casa fica.

**Fluxo.** Invite / Discover → servidor → `#welcome` / `#general` / voice → react, cargo, Server Guide. Sem `+` de post mundial.

**Rede.** Members do servidor. “Post” = mensagem no canal. Gesto mínimo = entrar no canal. Diálogo mora no canal — eterno, sem objeto.

**Acertou.** Papel. Hierarquia da casa. Power vs CrossFit como **sala**, não como tag.

**Falhou / o problema.** Chat eterno (o Zap já ganhou o 1:1; Discord ganha o clã gamer). Explore de servidor. 80k members = cidade, não turma. Sem publicação com memória pública honesta.

**Para o Link.** Herda papel e canal da turma. Recusa chat eterno e Discover.

---

### 5. WhatsApp — Simple, reliable, private messaging

Job: Chat · Fonte: conhecimento de produto

**Ideia.** Falar com alguém agora, de forma privada, no grafo do telefone. Já ganhou o Brasil.

**Estratégia.** Grafo do SIM / contatos. Objeto = mensagem. Círculo. IRL via call. Sem For You. Status é Stories pálido.

**Fluxo.** Lista de chats → thread → texto / áudio / call. Grupos. Status 24h. Sem perfil-tese.

**Rede.** Número a número. Sem post público. Gesto = enviar. Diálogo = o próprio produto.

**Acertou.** Distribuição (todo mundo já está). Confiabilidade. Grupo da turma já vive aqui.

**Falhou / o problema.** Não é publicação. Não constrói imagem social. Status é Instagram pior. Quem reimplementa chat no Brasil está brigando com um OS.

**Para o Link.** Recusa. Raid / bora já termina no Zap.

---

### 6. Fable — Books & TV

Job: Fórum / clube · Fonte: URL Mobbin existe, **imagem pulada**; resto = conhecimento de produto

**Ideia.** Clube do livro/série: o objeto cultural é o pretexto para a tribo falar junta, com calendário.

**Estratégia.** Grafo de clube. Objeto = livro/show. Círculo com teto. Vidro + IRL de discussão. Não é For You de pose.

**Fluxo.** (inferido) Entrar num clube → schedule da leitura → discutir o capítulo → perfil = o que você está lendo.

**Rede.** Membros do clube. Post = reação ao livro. Gesto = check-in de progresso / comment. Diálogo no clube.

**Acertou.** Tribo com objeto (livro). Identidade = gosto declarado + ritmo compartilhado.

**Falhou / o problema.** Vira clube de conteúdo. Sem ato corporal. Goodreads/Letterboxd já comem o diário; Discord já come o clube. Objeto fraco para quem não lê junto.

**Para o Link.** Herda tribo com objeto. Recusa clube de TV. O objeto do Link é o Feito, não o capítulo.

---

### 7. Bump — Hang with friends IRL

Job: Círculo · Fonte: URL existe, **imagem pulada**; conhecimento de produto (hang / disponibilidade)

**Ideia.** Combinar de sair. O telefone serve para desligar o telefone.

**Estratégia.** Grafo íntimo. Objeto = hang (quando/onde). IRL é o produto. Sem For You. Sem creator.

**Fluxo.** (inferido) Ver quem está down → propor hang → confirmar → encontrar. Sem feed de pose.

**Rede.** Amigos. “Post” = disponibilidade / plano. Gesto = bump / down. Diálogo = combinado, depois some.

**Acertou.** Sai do vidro. Grafo pequeno. Intenção explícita de estar junto.

**Falhou / o problema.** Sem prova de ato. Sem memória. Calendário + Zap já fazem o job. Grafo vazio se os amigos não aderirem — o mesmo buraco do Mozi.

**Para o Link.** Bora / raid. Sem chat. Sem app de “hang” genérico.

---

### 8. TikTok — Videos, music & live streams

Job: Broadcast / pose · Fonte: conhecimento de produto

**Ideia.** Atenção em loop. Você não abre um grafo — o For You abre você.

**Estratégia.** Grafo quase irrelevante. Objeto = vídeo curto. Distribuição For You absoluta. Creator. Vidro. Lugar morto.

**Fluxo.** Abre no For You → swipe vertical → like / comment / stitch / live. Perfil = grid de clips. Seguir é afterthought.

**Rede.** Algoritmo liga desconhecidos. Post = vídeo. Gesto = ficar assistindo. Diálogo = comment de palco, não conversa.

**Acertou.** Motor de atenção. Som + gesto. Live como segundo produto.

**Falhou / o problema.** Pior ancestral possível para academia: o lugar some, o ato vira performance, o grafo da unidade é inútil. Comment não é Twitter antigo — é plateia.

**Para o Link.** Recusa. Zero.

---

### 9. X — Breaking news & social media

Job: Microblog · Fonte: [pixel thread](https://mobbin.com/screens/d566d851-d002-453a-8058-ea9ace35a7d4) + conhecimento de produto

**Ideia.** Falo agora, o povo responde **neste** post. Notícia + opinião + briga no mesmo objeto.

**Estratégia.** Grafo follow + For You. Objeto = tweet. Creator e círculo misturados. Vidro. Communities = tentativa de casa.

**Fluxo.** Home (For You / Following) → post → replies / repost / quote → perfil = handle + bio + posts. Communities com Admin/Mod.

**Rede.** Follow assimétrico + viral. Post = texto (+ mídia). Gesto mínimo = reply ou like. Diálogo mora no thread — e explode.

**Acertou.** Twitter antigo: o objeto carrega a conversa. Velocidade. Memória pública.

**Falhou / o problema.** For You comeu o grafo. Virality e briga são o motor. Badge de mod é RPG falso. DM ao lado. O diálogo sobrevive, a casa não.

**Para o Link.** Herda reply no objeto. Recusa For You, quote, badge de polícia.

---

### 10. Peanut — Fertility pregnancy motherhood

Job: Fórum · Fonte: conhecimento de produto

**Ideia.** Estágio de vida = classe. Mulheres no mesmo capítulo (TTC, gravidez, pós) falam a mesma língua.

**Estratégia.** Grafo de tribo etária/biológica. Objeto = post do estágio. Círculo com gate. Vidro + grupos. Não é For You de pose.

**Fluxo.** (inferido) Onboarding de estágio → grupos / feed da tribo → post → reply / groups.

**Rede.** Quem está no mesmo capítulo. Post = pergunta ou desabafo. Gesto = reply. Diálogo no grupo.

**Acertou.** Linguagem própria. Gate honesto (você está nisto ou não). Identidade sem follower.

**Falhou / o problema.** Fora do rack. Escala para conteúdo / ads. Anonimato relativo ainda vira conselho perigoso. Não é prova de ato — é estágio declarado.

**Para o Link.** Modelo de tribo (18h, power, Hyrox), não o conteúdo. Recusa fórum de vida.

---

### 11. Snapchat — Share the moment

Job: Broadcast / círculo · Fonte: conhecimento de produto

**Ideia.** Manda o instante para alguém — some. Stories e Map são o segundo e o terceiro produto.

**Estratégia.** Grafo de amigos (lista). Objeto = snap 1:1 que evapora. Círculo. IRL via Map. Streak = farm diário. Spotlight = For You tardio.

**Fluxo.** Câmera first → envia para amigos → Stories → Chat → Map / Spotlight. Snapcode. Streaks.

**Rede.** Lista de amigos. “Post” = snap. Gesto = câmera. Diálogo = chat que some + Stories.

**Acertou.** Instantâneo. Câmera como home. Grafo real (contatos), não follow mundial.

**Falhou / o problema.** Streak diário é farm. Map é vigilância lúdica (comeu o zenly). Spotlight é TikTok pior. Stories = Instagram. O instante vira obrigação.

**Para o Link.** Recusa streak, Map, Stories, Spotlight.

---

### 12. Linktree — Link in bio creator

Job: Portfólio · Fonte: conhecimento de produto

**Ideia.** O perfil é um índice. Você não mora aqui — daqui você sai.

**Estratégia.** Sem grafo. Objeto = link. Distribuição = bio do Instagram. Creator. Vidro. Sem diálogo.

**Fluxo.** Visitante abre a página → tap num destino → sai. Dono edita blocos. Analytics.

**Rede.** Ninguém está ligado a ninguém. Sem post. Gesto = tap out. Diálogo = zero.

**Acertou.** Honestidade: o “perfil” é só um índice. Baixo atrito.

**Falhou / o problema.** Não há ato, não há diálogo, não há lugar. É infraestrutura do Instagram, não rede. Sem objeto, não há imagem — só funil.

**Para o Link.** Recusa. Não somos bio de Instagram.

---

### 13. LinkedIn — Find jobs, insights and news

Job: Portfólio · Fonte: [pixel headline / All-star / Add to profile](https://mobbin.com/screens/9920d587-49eb-4d75-9681-ec11117580ab)

**Ideia.** Você é o CV que o mercado vasculha — e, no caminho, um feed corporativo te pediu um post.

**Estratégia.** Grafo de connections (falso-recíproco). Objeto verdadeiro = Experience/Skills. Objeto falso = Start a post. Creator de gravata. Vidro.

**Fluxo.** Perfil (headline, anel `#OPENTOWORK`, Intermediate → All-star, Experience, Skills “Passed assessment”) → feed → reactions / Message. O `+` delata: Start a post.

**Rede.** Connections + follow de página. Post = update profissional. Gesto = Connect / reaction. Diálogo raso no post; o job mora no Message.

**Acertou.** Headline classifica. Skill verificada. Linha do tempo do ato (emprego).

**Falhou / o problema.** Farm de perfil (All-star). Feed corporativo comeu o CV. Humblebrag. 500+ connections = Instagram de gravata. Reactions ≠ diálogo.

**Para o Link.** Headline + skill do rack. Recusa All-star, feed e Connect mundial.

---

### 14. Nextdoor — Neighborhood network

Job: Fórum · Fonte: conhecimento de produto

**Ideia.** Sua rua é o grafo. Fofoca, alerta, prestador — o condomínio no telefone.

**Estratégia.** Grafo de lugar (endereço verificado). Objeto = post da vizinhança. IRL. Sem creator. For You local = o feed da rua.

**Fluxo.** Verifica endereço → feed do bairro → post / alerta / groups → comment. Mapa de vizinhos.

**Rede.** Quem mora perto. Post = aviso ou pergunta. Gesto = post local. Diálogo no thread do bairro.

**Acertou.** Grafo de lugar. Gate geográfico. O “For You” ainda é a rua.

**Falhou / o problema.** Fofoca de condomínio, pânico, racismo de portaria. Lugar residencial ≠ unidade de treino. Sem prova de ato — só proximidade.

**Para o Link.** Unidade ≠ rua, mas o grafo (casa primeiro) é primo. Recusa o tom de condomínio.

---

### 15. Telegram — Fast. Secure. Powerful.

Job: Chat · Fonte: conhecimento de produto

**Ideia.** Chat rápido + canal de broadcast. Privacidade como marketing; escala como produto.

**Estratégia.** Grafo de username / telefone. Objeto = mensagem ou canal one-to-many. Círculo e creator no mesmo app. Vidro.

**Fluxo.** Chats → grupos / canais → bots. Sem perfil-tese. Canal ≠ diálogo.

**Rede.** Contatos + subscribers do canal. “Post” no canal = broadcast. Gesto = send. Diálogo no grupo; no canal, some.

**Acertou.** Velocidade. Canal como megafone. Supergrupo escala.

**Falhou / o problema.** Canal não é diálogo (é Twitter sem reply honesto). Supergrupo é Discord sem role. Chat que o Zap já ganhou no Brasil. Spam / bots.

**Para o Link.** Recusa. Canal de academia já é Instagram / Zap.

---

### 16. BeReal. — Share real moments, no filters

Job: Círculo · Fonte: [pixel feed + comment + perfil vazio](https://mobbin.com/screens/72d3854d-97be-4541-a917-64a0100ce65d)

**Ideia.** No mesmo minuto, todo mundo tira a mesma foto crua. Prova de que você existiu hoje — não de que treinou.

**Estratégia.** Grafo de amigos. Objeto = foto do dia (dupla câmera). Círculo. Vidro que finge IRL. Sem For You clássico; o “For You” é o alarme.

**Fluxo.** Notificação 2 min → câmera → feed dos amigos → RealMoji + comment (“@sam How are you?”) → Memories. Perfil: “Tap to add profile pic”, 0 followers, Pins vazios, “Fill in what's missing”, cadeado.

**Rede.** Amigos. Post = o instante. Gesto = foto obrigatória. Diálogo no objeto do dia — raso.

**Acertou.** Prova no tempo. Perfil vazio honesto. RealMoji tenta matar o coração.

**Falhou / o problema.** Daily fatigue: o alarme vira teatro. Late BeReal / retake matam a prova. RealMoji é pose. Sem ato — só presença. O app esfriou quando a novidade acabou.

**Para o Link.** Prova sim. Daily camera não. Tá pago ≠ cara.

---

### 17. Patreon — Exclusive creator communities

Job: Portfólio / clube · Fonte: conhecimento de produto

**Ideia.** Paga o criador, entra na casa. Pertencimento tem preço de mensalidade.

**Estratégia.** Grafo assimétrico (fan → creator). Objeto = post pago / tier. Creator. Vidro. Teto = paywall.

**Fluxo.** Seguir creator → assinar tier → feed exclusivo → posts / Discord / lives. Perfil do fan some; o do creator é a loja.

**Rede.** Patron ↔ creator. Post = conteúdo exclusivo. Gesto = subscribe. Diálogo no post pago ou no Discord anexado.

**Acertou.** Comunidade com teto. Relação explícita de dinheiro. Casa pequena possível.

**Falhou / o problema.** Paywall de pertencimento. Fan economy. O diálogo é privilégio, não grafo. Já pago na academia — segunda mensalidade é insulto.

**Para o Link.** Recusa. A mensalidade da casa já existe.

---

### 18. Facebook — More together

Job: Broadcast · Fonte: conhecimento de produto

**Ideia.** O grafo real (família, escola, rua) num feed que morreu de ruído — Groups e Events ainda carregam o cadáver.

**Estratégia.** Grafo de vida real (amigos + Groups). Objeto misturado (post, Reel, Event). IRL via Events. For You comeu o grafo. Creator tardio (Reels).

**Fluxo.** Feed (ads + Reels + posts) → Groups → Events → Marketplace → perfil Sobre + fotos. Messenger ao lado.

**Rede.** Amigos + grupos. Post = update. Gesto = like/reaction. Diálogo no post (raso) ou no Group.

**Acertou.** Groups e Events ainda funcionam. Grafo de gente que você conhece. Evento tira do telefone.

**Falhou / o problema.** Feed morreu de ruído e ad. Reels é TikTok pior. Perfil é arquivo morto. O produto verdadeiro migrou: Groups / Events / Messenger. O resto é zumbido.

**Para o Link.** Evento / grupo da casa. Recusa feed.

---

### 19. YouTube — Videos, music and live streams

Job: Broadcast · Fonte: conhecimento de produto

**Ideia.** O canal é a tese. Assiste longo (ou Shorts). Comment é plateia.

**Estratégia.** Grafo subscribe. Objeto = vídeo. Creator. For You / Home. Vidro. Lugar nenhum.

**Fluxo.** Home / Shorts → watch → like / comment / subscribe → canal. Live. Community tab = microblog tardio.

**Rede.** Subscriber assimétrico. Post = vídeo. Gesto = assistir. Diálogo = comment de palco.

**Acertou.** Prova longa (aula, recap, technique). Arquivo. Discoverability de skill.

**Falhou / o problema.** Não é academia social. Shorts é TikTok. Comment não constrói turma. O aluno no rack não abre um player de 12 minutos.

**Para o Link.** Recusa como rede. Aula longa, se existir, é ferramenta — não home.

---

### 20. Messenger — Text, audio and video calls

Job: Chat · Fonte: conhecimento de produto

**Ideia.** O atalho de chat do Facebook. Mesmo job do Zap, grafo do FB.

**Estratégia.** Grafo Facebook. Objeto = mensagem. Círculo. Vidro. Sem publicação.

**Fluxo.** Inbox → thread → texto / áudio / video / Stories light. Rooms (tentativa Houseparty).

**Rede.** Amigos FB. Sem post. Gesto = send. Diálogo = o produto.

**Acertou.** Distribuição em quem já está no Facebook. Call. Integração com o grafo.

**Falhou / o problema.** Não constrói imagem. No Brasil o Zap já ganhou. Rooms morreu com o momento. Chat sem objeto.

**Para o Link.** Recusa.

### 21. zenly — The app that maps your world

Job: Círculo · Fonte: conhecimento de produto (Snap comprou ~US$213M; ~35–40M MAU; Snap matou em 2022 para proteger Snap Map, sem vender)

**Ideia.** Seus amigos no mapa, agora. O mundo é gente com ponto.

**Estratégia.** Grafo íntimo + GPS. Objeto = presença ao vivo. IRL via mapa. Sem For You de post. Círculo.

**Fluxo.** Abre o mapa → vê amigos → “ghost” / ping / hang. Widget de presença. Sem publicação.

**Rede.** Amigos. Sem post. Gesto = estar no mapa. Diálogo = ping / chat raso.

**Acertou.** “Quem está a 20 metros.” Presença como produto. O job que o fundador chama de IRL.

**Falhou / o problema.** Vigilância. Privacidade insustentável. Snap comprou e **matou** para não canibalizar Snap Map — cadáver por aquisição. Mapa de amigo não é prova de ato.

**Para o Link.** Lugar sim. Mapinha de amigo não. Unidade ≠ GPS de gente.

---

### 22. Reddit — Social forum & community chats

Job: Fórum · Fonte: [pixel post + árvore](https://mobbin.com/screens/fa893128-b9da-4820-b136-89efd151ac0c)

**Ideia.** A casa (`r/…`) vem antes de você. O post tem flair, score e árvore. O perfil é fraco de propósito.

**Estratégia.** Grafo de comunidade. Objeto = post + thread. Tribo. Vidro. Home mundial compete com o sub. Chat tardio.

**Fluxo.** Home / sub → post → árvore de comment + upvote + flair → perfil = karma. Join de `r/`.

**Rede.** Membros do sub. Post = texto/link. Gesto = upvote ou reply. Diálogo = árvore com memória.

**Acertou.** Diálogo com memória. Tribo. Flair. Casa antes do indivíduo.

**Falhou / o problema.** Anonimato + briga + karma farm. Home mundial come o sub. Moderação é polícia. Chat no app é Zap pior. O perfil fraco é honesto — e inútil para RPG de capacidade.

**Para o Link.** Árvore no Feito da turma. Sem karma, sem home mundial, sem anônimo.

---

### 23. Yubo — Match text talk. Be real now

Job: Dating · Fonte: conhecimento de produto (live + swipe teen/young)

**Ideia.** Live com estranhos + match. “Be real” é marketing; o produto é video random com menores no raio.

**Estratégia.** Grafo de intenção (conhecer gente). Objeto = live / perfil. Dating disfarçado de social. Vidro.

**Fluxo.** (inferido) Live grid → entra na sala → swipe / match → chat / video.

**Rede.** Estranhos até o match. Sem publicação. Gesto = entrar na live ou swipe. Diálogo = video/chat.

**Acertou.** Presença. Baixa fricção para falar com desconhecido.

**Falhou / o problema.** Menor / live random. Segurança. Sem objeto, sem lugar, sem prova. Azar com cromo jovem. O Zap não precisa disso; o Tinder já é o mercado.

**Para o Link.** Recusa.

---

### 24. Gas — See who likes you

Job: Dating / veneno · Fonte: conhecimento de produto (polls anônimos de escola; Discord comprou jan/2023, matou nov/2023; mesmo padrão TBH)

**Ideia.** Anônimo da escola te “gaseia”. Ego sem nome — quem gostou de você, sem dizer quem.

**Estratégia.** Grafo de escola. Objeto = poll anônimo. Círculo teen. Vidro. Sem publicação honesta.

**Fluxo.** (inferido) Entra com escola → vota em polls (“mais bonito”, “melhor amigo”) → notificação “alguém te gasiou” → tenta adivinhar.

**Rede.** Turma da escola, anônima num sentido. Sem post. Gesto = voto escondido. Diálogo = zero (só ego).

**Acertou.** Densidade (escola é grafo fechado). Loop de ego viciante. Distribuição teen.

**Falhou / o problema.** Toxicidade adolescente. Rumor e bullying. Discord comprou e matou — cadáver clássico (TBH → Facebook → morte). Anonimato + ranking social de escola é veneno, não rede.

**Para o Link.** Recusa. Zero.

---

### 25. Lemon8 — Lifestyle community app

Job: Broadcast / pose · Fonte: conhecimento de produto (ByteDance; Pinterest × Instagram)

**Ideia.** Grid editorial de lifestyle. O For You da ByteDance com cromo de revista.

**Estratégia.** Grafo follow + For You. Objeto = foto/artigo lifestyle. Creator. Vidro. Lugar some.

**Fluxo.** (inferido) For You editorial → save / follow → perfil grid. Composer de “magazine”.

**Rede.** Follow assimétrico. Post = card lifestyle. Gesto = save/like. Diálogo raso.

**Acertou.** Nicho visual. Save como gesto (Pinterest). Editoria clara.

**Falhou / o problema.** Instagram com Pinterest. Pose + For You. Sem ato, sem casa. ByteDance já tem o TikTok — Lemon8 é segundo front de atenção.

**Para o Link.** Recusa.

---

### 26. Behance — Photography & design community

Job: Portfólio · Fonte: conhecimento de produto

**Ideia.** O projeto é a tese. Grid de ato criativo + appreciation. LinkedIn da arte.

**Estratégia.** Grafo follow de projeto. Objeto = case / série. Creator-portfólio. Vidro. For You de Explore.

**Fluxo.** (inferido) Explore / follow → projeto full-bleed → appreciation → perfil = grid de projetos.

**Rede.** Follow de criador. Post = projeto. Gesto = appreciation. Diálogo = comment de portfólio (fraco).

**Acertou.** Portfólio de ato (o trabalho), não de cara. Projeto > Stories.

**Falhou / o problema.** Follower de arte. Explore mundial. Appreciation é like. Sem lugar, sem turma. Grid ainda é tese 1 se o “projeto” for pose.

**Para o Link.** Grid só se for **prova** (Feito / PR), não pose. Recusa follow de criador.

---

### 27. Hypelist — Create & share lists

Job: Portfólio · Fonte: [pixel lista / New Hypelist / share](https://mobbin.com/screens/fe7379e2-66dc-47ef-bd74-711b4aab7e1b)

**Ideia.** A lista é o objeto. Gosto explícito, compartilhável — “Alex Game Bucket List”, Shelved / Playing.

**Estratégia.** Grafo follow de lista. Objeto = lista (Public/Private, cor, stock). Círculo leve. Vidro. Share card → Stories/Zap.

**Fluxo.** New Hypelist (Public/Private) → itens (+, heart, comment, star; “Comments turned off”) → share card para Stories / Zap. Perfil = suas listas.

**Rede.** Quem segue a lista. Post = a lista. Gesto = heart / star no item. Diálogo opcional (e dá para desligar).

**Acertou.** Lista = gosto explícito. Privado/público honesto. Objeto claro.

**Falhou / o problema.** Sem ato — só curadoria. Share vaza para Instagram/Zap (o app não segura o diálogo). Comment off é honesto: a lista não precisa de conversa. Letterboxd já ganhou lista de filme.

**Para o Link.** Lista de PRs / fichas, não vibe. Recusa share-to-Stories como home.

---

### 28. Retro — Share photos worth remembering

Job: Círculo · Fonte: conhecimento de produto (álbum de amigos; nostalgia; buscas Mobbin misturaram)

**Ideia.** Foto que merece ficar — álbum de amigos, não Stories de 24h.

**Estratégia.** Grafo íntimo. Objeto = foto + recado. Círculo. Vidro. Anti-For You (memória, não viral).

**Fluxo.** (inferido) Sobe foto → amigos veem no álbum → recado / react → volta no tempo.

**Rede.** Amigos. Post = foto. Gesto = recado. Diálogo no recado, pequeno.

**Acertou.** Memória, não Stories. Grafo fechado. Tempo lento.

**Falhou / o problema.** Nostalgia sem prova de ato. Ainda é foto. iCloud Shared Album + Zap já comem o job. Sem lugar, sem classificação.

**Para o Link.** Recusa como home. Álbum não é Feito.

---

### 29. Mozi — A place for your people

Job: Círculo · Fonte: [pixel perfil / My People / cidade](https://mobbin.com/screens/0d32a70a-eb85-4d94-8bb8-3f938cf80dc5)

**Ideia.** Seus people — contatos iOS mútuos — num lugar. Cidade como home, não For You.

**Estratégia.** Grafo de agenda (mútuo). Objeto = plano / presença. Círculo. IRL. Home por cidade (SF). Close Friends.

**Fluxo.** Perfil (SAM LEE / ALEX SMITH, Mozi Member #19755) → My People (contatos mútuos) → empty state “Your people aren't on Mozi yet” → Home por cidade → tabs Home / My Plans / + / My People / Profile. Close Friends.

**Rede.** Contatos mútuos. “Post” = plano / update. Gesto = add people. Diálogo = plano, não thread.

**Acertou.** Grafo íntimo. Casa = cidade. Número de membro (ordem de chegada). Empty state honesto.

**Falhou / o problema.** Grafo vazio: se os amigos não vierem, o app é um deserto. Pouca prova. “People” genérico. Zap + Calendário já fazem planos. Member # é cromo, não stat.

**Para o Link.** Turma, não app de “people”. Empty state de unidade sem gente = o mesmo aviso.

---

### 30. Orb Social — The best Web3 social app

Job: Servidor · Fonte: conhecimento de produto (clubs + token)

**Ideia.** Club on-chain. A casa tem member count e, em algum ponto, um token.

**Estratégia.** Grafo de club. Objeto = post do club. Círculo com cromo Web3. Explore de club = For You de casa.

**Fluxo.** (inferido) Explore clubs → join → post no club → wallet / member.

**Rede.** Members do club. Post = update do club. Gesto = join. Diálogo no club.

**Acertou.** Casa antes do feed. Member count. Join explícito.

**Falhou / o problema.** Web3 é o cromo que afasta. Token / wallet. Explore de club é Discover do Discord. Sem ato. A maioria dos clubs Web3 é deserto com floor price.

**Para o Link.** Join sim. Token não.

---

### 31. Meetup — Meet new people & make friends

Job: Fórum / IRL · Fonte: conhecimento de produto

**Ideia.** O evento é o objeto. Interesse → RSVP → aparecer.

**Estratégia.** Grafo de interesse + cidade. Objeto = evento. IRL. Sem creator clássico. Explore de evento.

**Fluxo.** Busca interesse / cidade → página do evento → RSVP → vai. Grupos persistentes em volta do evento.

**Rede.** Quem deu RSVP. Post = evento. Gesto = RSVP. Diálogo no grupo do evento (fraco) — o diálogo real é presencial.

**Acertou.** Sai do telefone. Interesse explícito. Cidade.

**Falhou / o problema.** Evento genérico (hiking, idiomas, networking). No-show. Sem prova depois. Zap + Instagram já organizam. Sem classificação de capacidade.

**Para o Link.** Raid / bora. Já existe. Recusa Meetup genérico.

---

### 32. LINE — Always at your side

Job: Chat · Fonte: conhecimento de produto (Ásia; sticker-first; superapp light)

**Ideia.** Chat + sticker + OS social do Japão/TW. O Zap daquela geografia.

**Estratégia.** Grafo do telefone. Objeto = mensagem / sticker. Círculo. Vidro. Timeline / Official Accounts = broadcast.

**Fluxo.** Chats → stickers → calls → Official Accounts / VOOM (feed tardio).

**Rede.** Contatos. Sem post necessário. Gesto = sticker. Diálogo = chat.

**Acertou.** Sticker como língua. Distribuição regional. Superapp light (pay, etc.).

**Falhou / o problema.** Não é publicação. No Brasil o Zap já ganhou. VOOM é Instagram pior. Chat sem objeto.

**Para o Link.** Recusa.

---

### 33. GroupMe — Group chats, events, calling

Job: Chat · Fonte: conhecimento de produto (Microsoft; turma / escola)

**Ideia.** Grupo da turma com chat + evento + call. O Zap de 2012 que não morreu na escola americana.

**Estratégia.** Grafo de grupo. Objeto = mensagem. Círculo. IRL via calendar. Sem For You.

**Fluxo.** Lista de grupos → chat → calendar / likes nas msgs / call.

**Rede.** Membros do grupo. Sem post público. Gesto = send. Diálogo = o chat do grupo.

**Acertou.** Turma no chat. Evento colado. Baixa fricção escolar.

**Falhou / o problema.** WhatsApp já faz. Like na mensagem é score bobo. Sem publicação, sem prova, sem lugar de ato.

**Para o Link.** Recusa. Grupo da 18h já é Zap.

---

### 34. ID — Moodboard with friends

Job: Nicho · Fonte: conhecimento de produto (board compartilhado)

**Ideia.** Moodboard com amigos. Gosto visual compartilhado — Pinterest de círculo.

**Estratégia.** Grafo íntimo. Objeto = pin / board. Círculo. Vidro. Sem For You mundial.

**Fluxo.** (inferido) Board → pin imagem → amigos veem / reagem.

**Rede.** Amigos no board. Post = pin. Gesto = pin. Diálogo raso no pin.

**Acertou.** Gosto compartilhado. Círculo. Objeto visual claro.

**Falhou / o problema.** Não é ato. Pinterest + Zap já fazem. Sem lugar, sem stats, sem prova. Nicho que não escala e não aprofunda.

**Para o Link.** Recusa.

---

### 35. Airtime — Hangout with friends & family

Job: Servidor · Fonte: conhecimento de produto (video hang; Houseparty 2)

**Ideia.** Liga o vídeo com a família/amigos. Presença, sem palco.

**Estratégia.** Grafo íntimo. Objeto = sala de vídeo. IRL-via-vidro. Sem publicação.

**Fluxo.** (inferido) Lista de amigos → entra na sala → hang → sai. Nada fica.

**Rede.** Amigos/família. Sem post. Gesto = entrar. Diálogo = voz/vídeo.

**Acertou.** Presença. Baixa produção. Família como grafo.

**Falhou / o problema.** Houseparty 2. Zoom/FaceTime/Zap já ganharam. Sem rastro. Live sem objeto evapora. Mesma falha estrutural do Clubhouse com câmera.

**Para o Link.** Recusa.

---

### 36. Tumblr — Welcome back to weird

Job: Microblog · Fonte: conhecimento de produto

**Ideia.** Blog-identidade. Reblog é o gesto. A tribo do estranho — e do porn, e do fandom.

**Estratégia.** Grafo follow + reblog. Objeto = post (texto/gif/foto). Creator-comunidade. For You tardio. Vidro.

**Fluxo.** Dashboard → reblog / comment → blog. Tags como canal.

**Rede.** Follow + reblog chain. Post = o blog. Gesto = reblog. Diálogo no comment / reblog note.

**Acertou.** Comunidade de gosto. Reblog como citação. Identidade por microblog, não por cara.

**Falhou / o problema.** Caos, porn ban, Yahoo/Automattic. For You come o dashboard. Sem lugar. Reblog não é Feito. “Welcome back to weird” admite que o produto já tinha morrido uma vez.

**Para o Link.** Recusa como home. Tags ≠ modalidade.

---

### 37. Polywork — The collaboration network

Job: Portfólio · Fonte: conhecimento de produto (skills + collabs; morto-vivo vs LinkedIn)

**Ideia.** Você é o que faz com os outros — colaboração, não cargo. LinkedIn sem gravata, em tese.

**Estratégia.** Grafo de collab. Objeto = “o que eu faço” / projeto. Portfólio. Vidro. Sem For You forte.

**Fluxo.** (inferido) Perfil de skills → pedir/aceitar collab → timeline de atos profissionais.

**Rede.** Collaborators. Post = ato / oferta. Gesto = collab. Diálogo no projeto.

**Acertou.** Identidade por ato profissional, não por employer. Headline colaborativa.

**Falhou / o problema.** LinkedIn ganhou o grafo de trabalho. Sem densidade, collab é empty state. Morto-vivo. Sem lugar corporal. Skill auto-declarada.

**Para o Link.** Headline colaborativa (quem paga junto). Sem rede de collab. Recusa o app.

---

### 38. Lapse — Social photo journal

Job: Círculo · Fonte: URL existe, **imagem pulada**; conhecimento de produto (filme; delay de revelação)

**Ideia.** Tira agora, revela depois. O delay é o anti-pose — jornal fotográfico, não Stories.

**Estratégia.** Grafo de amigos. Objeto = foto revelada. Círculo. Vidro. Tempo lento contra For You.

**Fluxo.** (inferido) Câmera “filme” → espera revelar → amigos veem o jornal → react.

**Rede.** Amigos. Post = foto atrasada. Gesto = disparar o filme. Diálogo raso no reveal.

**Acertou.** Delay mata a pose imediata. Jornal, não grid. Círculo.

**Falhou / o problema.** Ainda é foto. Delay não salva tese 1. Sem ato. BeReal com cromo de filme. Quando a novidade do delay passa, sobra Instagram lento.

**Para o Link.** Recusa como home. Delay não é Tá pago.

---

### 39. corner — Curate & share places

Job: Portfólio / lugar · Fonte: conhecimento de produto (listas de lugar; buscas Mobbin misturaram Places)

**Ideia.** Cura lugares — café, bar, cidade — e compartilha a lista. Gosto de lugar, sem check-in.

**Estratégia.** Grafo follow de curadoria. Objeto = lugar na lista. Vidro. Anti-Swarm (sem “estive”). For You de spots.

**Fluxo.** (inferido) Salva lugar → lista → share. Mapa editorial.

**Rede.** Quem segue a lista. Post = pin de lugar. Gesto = save. Diálogo fraco.

**Acertou.** Gosto de lugar explícito. Curadoria > check-in farm.

**Falhou / o problema.** Sem check-in de ato — você não esteve, só curtiu. Unidade ≠ café bonito. Maps / Google Saved / Instagram já fazem. Objeto fraco (lista sem corpo).

**Para o Link.** Unidade ≠ café. Recusa curadoria de spot. Swarm é o ancestral de lugar, não corner.

---

### 40. BFF — Friendship, chat and meet up

Job: Servidor · Fonte: conhecimento de produto (Rooms, Events, Members, “introduce yourself”; ~2k)

**Ideia.** Casa de amizade: rooms, events, members online. Discord de “fazer amigo”, não de game.

**Estratégia.** Grafo de room. Objeto = sala + evento. Círculo que escala. IRL via Events. Invite.

**Fluxo.** (inferido) Join room → “introduce yourself” → chat / events → members (N online).

**Rede.** Members da room. Post = mensagem / intro. Gesto = join + intro. Diálogo no room.

**Acertou.** Onboarding de grupo (“introduce yourself”). Rooms + Events. Presença (N online).

**Falhou / o problema.** Chat. 2k members = cidade pequena, não turma. Fazer amigo genérico. Zap + Meetup já comem. Sem prova de ato.

**Para o Link.** Herda rooms da turma e intro. Recusa 2k e chat.

### 41–60

| # | App | Tagline | Job | Perfil | Interação | Acerto | Erro | Link |
|---|---|---|---|---|---|---|---|---|
| 41 | Signal | Say “hello” to privacy | Chat | Quase nenhum | Mensagem | Privacidade | Zero imagem social | Recusa |
| 42 | GoFundMe | Fundraise & accept donations | Lugar / causa | Campanha = perfil | Donate, share | Objeto com meta | Fora | Recusa |
| 43 | Dimensional | Personality tests reimagined | Portfólio | Teste = classe | Quiz, share tipo | Classificação explícita | Quiz mente. RPG de natal | Recusa teste. Classe vem do rack |
| 44 | Plenty of Fish | Date, chat, meet singles | Dating | Perfil de mercado | Browse + chat | Mais texto que Tinder | Mercado | Recusa |
| 45 | Airbuds Widget | Friends’ music on your homescreen | Widget | Widget | Presença passiva | “O que o amigo está fazendo” | Música, não treino | Widget de “Fulano está no rack” é tentador e é vigilância |
| 46 | Locket | Live pics from best friends | Círculo | Widget de foto | Foto no homescreen | Círculo mínimo | Pose no widget | Recusa |
| 47 | Threads | Connect and share ideas | Microblog | Igual Instagram, texto first | Reply no post, follow | **Melhor ancestral vivo do Twitter antigo** | For You da Meta. Sem lugar | Reply no Feito. Sem For You |
| 48 | yope | friends-only pics | Círculo | Círculo | Foto só de amigo | Grafo fechado | Foto | Rede = unidade, não álbum |
| 49 | Locals | Community & events app | Servidor | Comunidade paga | Post + evento | Teto de grupo | Paywall | Teto sim. Pagar de novo não |
| 50 | Mammoth | Powerful, fast, feature-rich | Microblog | Instância primeiro (`moth.social` 6.4K, EN, Non-Explicit) | Mastodon: reply, boost | **Casa antes do feed** | Cliente, não rede | Escolher unidade = escolher instância |
| 51 | Messages | Stay connected | Chat | iMessage | Bolha azul | OS | Não é produto | Recusa |
| 52 | IRL | Groups, chats, events | Servidor | Grupo + evento | Chat | Nome honesto (IRL) | App de grupo genérico | Recusa cromo; IRL já é o Zap |
| 53 | Powder | Get & edit auto-highlights | Nicho | Clip de jogo | Share highlight | Recibo automático | Gaming | Recusa. Feito não é highlight reel |
| 54 | Swarm | Check in & track places | Lugar | Categorias, stickers, lists | Check-in, with, coins | Lugar + first of friends | Moeda, Pokédex, Explore | Herda lugar. Recusa coin |
| 55 | Yik Yak | Find your herd | Fórum | Quase anônimo | Post local anônimo | Grafo de campus | Anonimato tóxico | Recusa anônimo |
| 56 | Karrot (Daangn) | Buy & sell in your community | Lugar | Bairro + reputação | Anúncio, chat | Confiança local | Classificados | Recusa. Não somos OLX |
| 57 | Quora | Questions, answers, and more | Fórum | Credencial | Q&A | Resposta como prova | SEO, ego | Recusa |
| 58 | WeChat | Calls, chats, and more | Chat | Superapp | Tudo | China | Superapp | Recusa |
| 59 | Posts | A community app by read.cv | Microblog | CV + post | Texto curto | Portfólio + fala | Nicho design | Recusa |
| 60 | Sonar | Voice chat, music, and games | Servidor | Sala | Voice | Discord de voz | Mais um voice | Recusa |

### 61–82

| # | App | Tagline | Job | Perfil | Interação | Acerto | Erro | Link |
|---|---|---|---|---|---|---|---|---|
| 61 | Weverse | Global fandom platform | Servidor | Fandom = classe | Artist + fan post | Tribo fanática | Idol economy | Recusa. Aluno ≠ fan |
| 62 | Lex | If it's queer, it's here | Fórum / classified | Texto first, queer | Post, reply | Classified honesto | Dating disfarçado | Recusa conteúdo; herda “texto first, tribo explícita” |
| 63 | XChat | Chat with anyone | Chat | Quase nenhum | Chat aberto | — | Random chat | Recusa |
| 64 | KakaoTalk | Connect everything | Chat | Superapp KR | Chat | — | Superapp | Recusa |
| 65 | Bond | Turn memories into discoveries | Nicho | Memória | Discover | — | Vago | Recusa |
| 66 | Life360 | GPS phone locator & tracker | Círculo | Família no mapa | Local ao vivo | Segurança familiar | Vigilância | Recusa GPS de gente |
| 67 | Digg | Human-first communities | Microblog / fórum | `/science` Join/Joined | Post + communities grid | Join explícito de tribo | Clone de Reddit | Join de modalidade, não `/politics` |
| 68 | Beep | Chat with sound bites | Chat | Quase nenhum | Áudio curto | — | Novelty | Recusa |
| 69 | Facebook Local | Find things to do near you | Lugar | Eventos perto | RSVP | IRL | Morto / absorvido | Evento da casa |
| 70 | Monkey | Add time - fun chat | Dating / random | Quase nenhum | Video random | — | Cadáver / menor | Recusa |
| 71 | TextNow | Phone number & wifi calling | Chat | Número | SMS | Utilitário | Não é social | Recusa |
| 72 | Tribe | Live battle your friends! | Nicho | Battle | Live vs amigo | Disputa pequena | Jogo, não treino | Guerra de grupo já existe. Sem live battle |
| 73 | Azar | Video chat & meet friends | Dating | Video | Match video | — | Random video | Recusa |
| 74 | Byte | Video communities | Morto | Creator | Clip 6s | — | Cadáver do Vine | Recusa |
| 75 | Houseparty | Group video chat | Morto | Hang | Video grupo | Presença | Epic matou | Recusa |
| 76 | Product Hunt | The best new products in tech | Fórum | Maker + upvote | Upvote, comment | Objeto + score da tribo | Tech twitter | Upvote mundial ≠ Tá pago |
| 77 | Kickstarter | Bringing creative projects to life | Lugar / campanha | Projeto + meta | Back | Meta pública | Fora | Recusa |
| 78 | Breaker | #1 best podcast app | Morto | — | Play | Social listening | Spotify ganhou | Recusa |
| 79 | Letterboxd | The social app for film lovers | Portfólio / stats | Diário + histograma + meta | Log, review, follow, Year in Review | **Melhor RPG honesto dos 82** | Feed popular; PRO | **Ancestral #1 do perfil** |
| 80 | Periscope | Meet people, explore the world | Morto | Live | Broadcast | — | Twitter matou | Recusa |
| 81 | Bluesky Social | Social media as it should be | Microblog | Handle, starter packs | Reply, skeet | Protocolo, grafo escolhido | Ainda vira Twitter | Grafo escolhido = unidade. Recusa protocolo |
| 82 | Elbi | Where loves unlocks change | Nicho | Causa | Donate / kind | — | Irrelevante | Recusa |

---

## O que isso muda no pedido de RPG

O fundador descreveu três coisas coladas. Os 82 **separam**. Colar de novo é o quarto produto.

| Pedido | Ancestral honesto nos 82 | Ancestral falso | Já existe no Link? |
|---|---|---|---|
| Classificação (power / hyper / CrossFit) | Discord role + LinkedIn headline + Letterboxd histograma | Tinder pills, Dimensional quiz, Instagram bio | Grupo + unidade. Headline ainda não |
| Capacidades que evoluem / stats | Letterboxd diary + Swarm categorias **sem** coin | LinkedIn All-star, Swarm coins, follower | Ofensiva semanal, Tá pago, previous no rack |
| Rede tipo Instagram + foto/texto | — (Instagram **é** o erro) | Instagram, TikTok, Lemon8 | Recusado de propósito |
| Diálogo na publicação (Twitter antigo) | Threads, X, Reddit | Instagram comment, LinkedIn reactions, chat | Recusado hoje (sem comment, sem like). **Decisão em aberto** se o Feito ganha 1 nível de fala |

A leitura dura, alinhada à tese do Strava:

- Instagram já tomou a pose. Copiar feed + grid + follower é perder de propósito.
- WhatsApp já tomou o chat. Copiar Messenger é arrogância no Brasil.
- O espaço aberto continua o mesmo: **prova no chão da unidade + gente a 20 metros + ferramenta no rack**.
- RPG honesto = a imagem social **nasce do Feito**. Classificação emerge (Letterboxd). Papel vive no grupo (Discord). Lugar carimba (Swarm). Diálogo, se houver, é no objeto (Threads) e **na casa** (Mammoth/unidade) — nunca no For You.

Se o próximo passo for produto, as únicas heranças que não inventam Instagram são:

1. **Headline de classe** no Perfil (“Power · Bueno”), comprovada pelo diário — não por quiz.
2. **Diário tipo Letterboxd** no Progresso/Perfil (caixa do dia + carga + Tá pago), sem estrelinha.
3. **Papel no grupo** (não admin/mod): quem está na ofensiva, quem é protetor, quem é rei da unidade.
4. **Diálogo no Feito**, só se o fundador **reabrir** o lock. Um nível. Sem like. Sem Stories. Sem follower.

Tudo que for grid, Stories, swipe, coin, All-star, For You, chat, RealMoji — os 82 já provaram. Não precisa provar de novo.

---

## Fontes (Mobbin desta sessão)

- [Listagem iOS Social Networking · Most popular · 82 apps](https://mobbin.com/search/apps/ios?content_type=apps&sort=popularity&filter=appCategories.Social+Networking)
- [Galeria pública Social Networking](https://mobbin.com/explore/mobile/app-categories/social-networking)
- [Instagram perfil](https://mobbin.com/screens/fd46bbb4-f06b-4ef9-83aa-461daa667c15)
- [Threads diálogo](https://mobbin.com/screens/4c1965df-7e7c-4938-a4a1-ac0498f64a2e)
- [Letterboxd perfil / diary / year](https://mobbin.com/screens/0cbd7a3c-9a2d-4889-813a-9d826730a778)
- [Discord Design Buddies](https://mobbin.com/screens/e0d2e713-f400-407c-b0ce-bbc1c617eca7)
- [Tinder carta](https://mobbin.com/screens/edd51a54-162e-4ecf-a044-97a9ed07b3df)
- [X](https://mobbin.com/screens/d566d851-d002-453a-8058-ea9ace35a7d4)
- [Reddit](https://mobbin.com/screens/fa893128-b9da-4820-b136-89efd151ac0c)
- [BeReal comment + perfil](https://mobbin.com/screens/72d3854d-97be-4541-a917-64a0100ce65d)
- [LinkedIn profile / All-star / Add to profile](https://mobbin.com/screens/9920d587-49eb-4d75-9681-ec11117580ab)
- [Swarm check-in / achievements / timeline](https://mobbin.com/screens/aced7ef7-5a07-4d00-a9f0-6dc1ea2e713c)
