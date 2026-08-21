# Duelo e juiz

21 ago 2026. Documento de projeto. Implementável sem me perguntar nada.

Modelo do mundo travado: sem academia, sem unidade. Território é **setor** e **cidade**. Clã é aberto, com tipo e teto. Duas escadas: pessoa na arena, clã contra clã. Conta só do aluno. Onde `link-produto.mdc` e `AGENTS.md` disserem academia, unidade ou marca da casa, leia setor e cidade. Companheiros: `docs/rede/mecanismo-link.md`, `03-interacao.md`, `05-retencao.md`, `06-antifalha.md`, `docs/cla-tribo-volume.md`.

A **ficha de atributos** é de outro projetista. Aqui ela é dependência, não projeto. Contrato na seção 8.

---

## 1. O duelo em uma frase

Duelo é **duas pessoas, uma prova, uma semana, e um veredito que o app fecha sozinho**, entre gente que não se conhece e mora no mesmo setor.

Para quem: qualquer conta com uma sessão fechada. Não precisa de personal, de clã, nem de amigo.

Por que a pessoa aceita: porque o app já mostrou a marca dela e a do outro lado a lado antes do sim, e porque o duelo cabe dentro da sessão que ela ia fazer de qualquer jeito. Aceitar não pede um treino a mais. Isso é o produto inteiro.

O duelo não é a Guerra. Guerra é clã contra clã e continua sendo o motor do volume. O duelo é o motor da **primeira relação**: é como um estranho vira um nome.

---

## 2. Tipos de duelo

Quatro. Não são quatro sabores: são quatro graus de prova, do mais honesto ao mais frágil.

| | **Relógio** | **Janela** | **Semana** | **Vídeo** |
|---|---|---|---|---|
| Mede | Tempo de uma prova combinada. Menor vence. | Volume, séries ou reps registrados ao vivo em sessão aberta. Maior vence. | Sessões fechadas no app. Maior vence. | Uma marca única acima de um piso. Carga, hold, reps. |
| Testemunha | O app. Crava início, roda em primeiro plano, crava fim. Saiu do app, o lance morre. | O app testemunha o quando. O kg é digitado. | O app, inteiro. A sessão nasce dentro dele. | Ninguém. O app confia e guarda o vídeo. |
| Dura | Janela de 72 h a partir do aceite | 72 h | A semana | 72 h |
| Termina | Dois lances fechados, ou domingo 21h | Idem | Domingo 21h, sozinho | Dois vídeos, ou domingo 21h |
| Empate | Abaixo de 1% do menor tempo | Abaixo de 2% | Número igual, e é comum | Pela regra da prova |
| Abandono | Sai do primeiro plano, cai o lance, não o duelo. Refaz na janela. Duas saídas travam. | Ver 3.5 | Não existe. Zero sessão é resultado. | Ver 3.5 |

**Relógio** é o que o dono do produto pediu literalmente: o app é o start. É o único onde a palavra juiz é honesta.

**Semana** é o tipo padrão proposto para conta com menos de 14 dias. Único que atravessa esporte, não pede coordenação e não pode ser mentido. É também o mais alcançável, porque premia frequência e não talento. É o Local Legend do Strava, que coroa quem mais repetiu o trecho em 90 dias, não quem foi mais rápido.

**Vídeo**, custo assumido: um vídeo mentiroso passa até alguém contestar. Aceitamos porque é o único jeito de a carga entrar no duelo, e cercamos: só acima do piso da prova, `firme: false` por 24 h, e nada sobe na ficha antes disso.

Cortei um quinto tipo, **presença em janela combinada** (os dois às 19h de quinta). Exige coordenar horário entre estranhos, que é o problema que o app deveria resolver e não pressupor. Isso já tem nome e se chama **Bora**. Duelo não vira agenda.

---

## 3. O juiz

O app **não tem sensor**. Ele não vê a barra, não sabe se agacharam 120 kg, não sabe nem se a pessoa saiu de casa. Fingir o contrário é a única coisa que mata a escada inteira, porque honra declarada sem atrito vira mentira em duas semanas.

Então o juiz tem três camadas, e cada marca carrega **qual camada a produziu**, visível no recibo.

| Camada | O que o app garante | Papel dele | Onde vale |
|---|---|---|---|
| `relogio` | Início, continuidade e fim | Juiz do cronômetro, não da execução. Ele não sabe se saíram os 45 thrusters. | Relógio |
| `janela` | O ato foi registrado ao vivo, no prazo, com sessão aberta | Juiz do quando, escrivão do quanto. 120 kg é verdade sobre o horário e afirmação sobre o peso. | Janela e Semana |
| `video` | Nada | Arquivista. Quem julga é a arena, e só por contestação. | Vídeo |

Semana é o único tipo sem asterisco: lá o app é juiz pleno, porque a sessão nasce dentro dele.

Existe uma quarta camada e ela é **proibida no duelo**: `declarado`, o número digitado depois, sem janela e sem testemunha. Declarado entra no caderno pessoal do aluno e nunca em veredito. Se o implementador se pegar aceitando um campo de texto livre de marca para fechar duelo, ele errou.

### 3.2 Mecanismos de testemunha que julguei

| Mecanismo | Adotado | Por quê |
|---|---|---|
| Janela com início registrado | Sim | Barato, não pede terceiro, mata o número retroativo |
| Cronômetro só em primeiro plano | Sim | É a única coisa que o celular consegue provar sozinho |
| Vídeo obrigatório acima de um piso | Sim | Contém o custo: vídeo pesa, então só onde a marca é grande |
| Contestação pública com custo | Sim, modificada | Ver 3.3. Contestar só pode empatar, nunca coroar |
| Testemunha humana de terceiro | Não como requisito | Vira fazenda de confirmação entre amigos, e prende o duelo à presença de outra pessoa, que a premissa diz que não existe. Aceito só como **resolução** de contestação |
| Empate por falta de prova | Não | Ver 3.5. Falta de prova vira **duelo sem veredito**, não empate |

### 3.3 Contestação

Quem pode: só os dois duelistas, nunca a plateia. Prazo: 24 h depois do veredito. Enquanto aberta, o recibo mostra "em contestação" com o nome de quem abriu, porque contestação tem cara como todo gesto do Link. Motivos fechados, sem texto livre: `fora_da_janela`, `sem_video`, `video_nao_mostra`. Resolução: três pessoas da arena confirmam em 24 h.

**A regra que segura tudo: contestação só pode virar empate.** Nunca inverte o vencedor. Isso mata o incentivo de contestar por ganho, porque não existe ganho. Contesta quem quer apagar uma mentira, não quem quer subir.

Custo de contestar errado: o contestador fica **sem direito de contestar por 30 dias** e não pode abrir duelo novo enquanto a dele estiver aberta. O erro não é publicado. Expor quem errou a contestação transformaria a defesa contra mentira num risco, e aí ninguém contesta.

### 3.4 Onde o app admite que confia

Três lugares, escritos na tela e não no rodapé: o kg de um lance de Janela, a execução de uma prova de Relógio, e tudo no tipo Vídeo.

A etiqueta é o dado. Cada marca no recibo leva o nome da camada: "cronômetro do app", "registrado ao vivo", "vídeo". Quem lê o feed sabe o peso de cada número sem ninguém explicar.

### 3.5 Falta de prova não vira vitória

Se um lado fecha o lance e o outro não, o duelo fecha como `sem_prova`. **Ninguém vence.** Quem apareceu leva a marca registrada na ficha e **prioridade de pareamento** na semana seguinte, que é adversário melhor e mais rápido. Quem sumiu leva um `faltou++` invisível que baixa a prioridade dele.

Motivo: vitória por sumiço cria o pior incentivo possível, que é torcer contra. E premiar quem apareceu com adversário melhor é uma moeda que existe só dentro do produto e não pode ser comprada.

---

## 4. Pareamento

Ninguém conhece ninguém. Então **o app oferece o adversário. A pessoa não caça.**

É o mecanismo do Friends Quest do Duolingo: par semanal automático, escolhido entre gente ativa, sem o usuário poder escolher. Escolher adversário num app onde ninguém se conhece é um mercado de cara, e mercado de cara é swipe, que é proibido.

### 4.1 A arena, resolvida por função

```
arenaDe(pessoa):
  vivos = pessoas com sessão fechada nos últimos 7 dias no setor da pessoa
  se vivos >= 12  -> { tipo: "setor", id: pessoa.setorId }
  senão           -> { tipo: "cidade", id: pessoa.cidadeId }
```

Nunca chumbada na tela. O card diz "Setor Bueno" ou "Goiânia" porque a função devolveu isso. Se a cidade também estiver vazia, ver 10.8.

### 4.2 A faixa

Pareia por **cadência**, não por força. Cadência é sessões fechadas nas últimas 4 semanas dividido por 4. Faixa A abaixo de 2, faixa B de 2 a 3,9, faixa C de 4 para cima. Só duela dentro da faixa. A faixa nunca vira patente nem é exibida como posição: ela existe para o algoritmo, e a tela só diz "gente que treina como você".

Por que cadência e não carga: carga separa iniciante de monstro, mas também separa quem tem genética de quem tem disciplina, e é a disciplina que o produto quer premiar. Duolingo pareia liga por hábito de estudo, não por nível. Mesma decisão.

### 4.3 Ordem de escolha do adversário

Dentro da faixa e da arena, ordena por: `nuncaDuelouComigo` primeiro, porque o produto existe para aproximar estranho; depois menor `faltou` nas últimas 4 semanas; depois maior sobreposição de disciplina, se o tipo for Janela ou Vídeo; depois aleatório.

Um par por semana, proposto na segunda 06h. Mais um por semana no botão "quero outro". Teto de **2 duelos abertos**, que é a defesa contra fadiga e também a desculpa social para recusar.

### 4.4 O novato

Conta com menos de 14 dias ou menos de 6 sessões só recebe duelo do tipo **Semana**, só é pareado com faixa A, e tem **carência nos três primeiros**: vitória conta, perder não entra no histórico nem aparece no perfil dele. Carência não é mentira, porque o duelo aconteceu, o recibo existe e o número está lá. O que não acontece é o placar pessoal marcar contra quem ainda não sabe qual é a semana dele.

### 4.5 Esportes diferentes

**O duelo nunca compara esportes.** Ele compara duas pessoas na mesma prova. Um ciclista e um crossfiteiro só duelam se combinarem uma prova que os dois topam fazer, e aí não são um ciclista e um crossfiteiro: são duas pessoas fazendo a mesma coisa. Duas moedas atravessam disciplina sem tabela de conversão: **tempo**, numa prova combinada pelos dois, que é o Relógio; e **presença**, que é sessão fechada e vale igual para todo mundo, que é o Semana. Janela e Vídeo ficam dentro da disciplina, porque volume de powerlifting contra volume de calistenia é aritmética sem sentido.

A pergunta "qual é o corpo mais blindado", a lenda, **não é pergunta de duelo**. Duelo é evento e tem dois nomes. Lenda é acúmulo e tem um perfil. Ela mora na **ficha de atributos**, que é onde barra comparável faz sentido, porque lá se compara a pessoa com ela mesma no tempo e as pessoas entre si por eixo, nunca por soma.

---

## 5. O ciclo semanal

Uma coisa fecha por semana, e é domingo 21h no fuso da pessoa. Tudo fecha junto: duelo, guerra, raid, ofensiva, desafio de 7 dias.

| Dia | O que acontece | Quem age |
|---|---|---|
| Segunda 06h | Arena recalculada. Par novo proposto. Guerra nova abre. | O app |
| Segunda a quinta | Duelo vive dentro das sessões que já iam acontecer | A pessoa |
| Sexta | O card do duelo muda de tom: falta a sua marca | O app |
| Sábado | Dia do Bora e da raid. Duelo de Relógio cai aqui naturalmente. O app sugere, não obriga. | A pessoa |
| Domingo 21h | Veredito de todos os duelos abertos. Guerra fecha. Ofensiva fecha. | O app |
| Domingo 21h a segunda 06h | Janela de contestação e de revanche | A pessoa |

**Por que isso não briga por atenção:** uma sessão fechada na quarta alimenta quatro contadores ao mesmo tempo. Ofensiva, guerra do clã, desafio de 7 dias e, se o duelo for do tipo Semana, o duelo. Um ato, quatro livros. O duelo não pede uma ida a mais. Ele pede que a ida que já existia tenha um nome do outro lado.

O único tipo que pede ato dedicado é o Relógio, e é o único que o app empurra para o sábado, que já é o dia do encontro. A semana fecha no domingo à noite, uma vez, com movimento. Ver seção 11.

---

## 6. A derrota e a recusa

### 6.1 O perdedor

Regras duras, e cada uma tem um motivo:

1. **A palavra derrota não existe na interface.** O recibo mostra duas marcas e dois nomes. "Marina 11:58 · Vitor 12:41". Quem lê entende. O app não narra.
2. **Nada é subtraído.** O duelo nunca escreve para baixo na ficha de atributos, nunca tira ofensiva, nunca tira protetor, nunca baixa faixa. Perder custa zero. O único preço de duelar é ter feito o treino.
3. **A sessão do perdedor conta inteira.** Ofensiva, guerra, desafio, caderno de carga. Ele treinou. O placar do duelo não apaga isso.
4. **A legenda do recibo é do perdedor.** O vencedor tem o número. O perdedor tem as palavras, e escreve em até 1 h, num post que já subiu. Uma linha, 140 caracteres, sem resposta. É o único texto do post. Isso dá a última palavra a quem perdeu, e é a defesa mais barata contra deboche que existe: o post é assinado por ele. Escrever é opcional e não está no caminho de volta ao aparelho.
5. **A revanche é direito só do perdedor.** Um toque, mesma prova, abre na segunda, vale 7 dias, e o outro não pode recusar porque já aceitou uma vez. Se ele não aceitar em 24 h, vira `sem_prova` e o perdedor ganha prioridade de pareamento.
6. **A comparação com ele mesmo vem antes da comparação com o outro.** A faixa do veredito diz "Sua melhor. 12 s abaixo." antes de dizer qualquer coisa sobre o adversário, e essa ordem é fixa, não é escolha de redator. Ver a tabela em 11.3.

O que sobra para o perdedor: a sessão, a marca pessoal, a legenda, a revanche, e um nome que ele não conhecia na segunda e conhece no domingo. É mais do que ele tinha antes de aceitar. Esse é o teste.

### 6.2 A recusa

O convite expira em 24 h. **Expirar é o caminho padrão e não custa nada.** Três saídas, e nenhuma é um botão de recusar: **Aceito**; **Troco a prova**, que é uma contraproposta única e expira se o outro não topar; ou **nada**, e some em 24 h.

O que o proponente vê quando expira: "expirou". Nunca "recusou". O app não sabe distinguir quem não quis de quem não abriu, e é bom que não saiba.

Aceitar também não é obrigação, porque o teto de 2 duelos abertos é visível. Quem já tem 2 vê "sua agenda está cheia" no lugar do convite. A recusa fica terceirizada para uma regra do sistema, que é exatamente o que a etiqueta social precisa.

Não existe notificação de recusa, nem contador de recusas. `recusou` não é um campo.

---

## 7. Onde mora na superfície

Zero aba nova. Zero sobreposição nova. As sobreposições são máquinas de estado, não telas, então `desafio` cabe o duelo inteiro.

| Peça | Mora | O que empurra |
|---|---|---|
| Card do duelo, todos os estados | **Hoje**, logo abaixo do bloco da sessão e acima da Raid | Substitui o bloco "Te pegaram" atual, que vira um estado deste card |
| Convite, escolha da prova, contraproposta | Overlay `desafio` | O criar-desafio-de-grupo sai do overlay e vira um bloco inline dentro de `grupo` |
| Cronômetro ao vivo | Overlay `desafio`, modo `ao_vivo`, tela cheia sem chrome, que se fecha sozinha ao travar | Nada |
| Veredito | **Lugar nenhum.** Desenha por cima do que estiver vivo, seja `feito`, `descanso` ou o card do Hoje, e não navega. Ver 11.0 | Nada, porque não ocupa nada |
| Recibo do duelo no feed | **Rede · Feed**, como `Proof` normal | Nada |
| Recibo aberto, com contestação | Overlay `prova` | Ganha uma faixa nova no topo, acima da imagem |
| Faixa de duelo em cima de um post | Componente `DuelOnPost` que já existe | Passa a mostrar estado, não só "Aceito" |
| Duelos vencidos pelo clã na semana | **Rede · Guerra**, uma linha no placar | Nada. Guerra não vira duelo |
| Histórico: últimos 8 duelos, só as marcas | **Progresso** | Nada. Sem posição, sem ranking |
| Linha "12 aceitos · 5 vencidos · 4 empates" | **Perfil** | Nada. Nunca uma colocação |
| Botão "Duelar" numa pessoa | Overlay `pessoa` | Único lugar onde se escolhe adversário, e só dentro da arena ou do clã |

**Ficha não é tocada.** Ficha é o programa.

O que eu empurro para fora se precisar de espaço: o bloco do Fred no fim do Hoje. O card do duelo vale mais do que a citação da linha do personal, que já está no topo da Ficha.

---

## 8. Contrato com a ficha de atributos

O duelo **não** projeta a ficha e **não** escreve valor de atributo. Ele empurra eventos crus e a ficha decide o que fazer.

### 8.1 O que o duelo LÊ

```ts
ficha.cadencia28: number             // sessões por semana, média de 4 semanas. Pareamento.
ficha.novato: boolean                // conta < 14 dias OU < 6 sessões. Proteção.
ficha.disciplinas: DisciplinaId[]    // derivadas do histórico. Filtro de prova.
ficha.marcaDe(provaId): {
  valor: number
  unidade: "s" | "kg" | "reps" | "sessoes"
  quando: number
  arbitro: Arbitro
} | null                             // "sua melhor" no convite e no veredito
ficha.distancia(outroId): number     // 0 a 1. Só para desempate de pareamento.
                                     // O duelo nunca exibe este número.
```

O duelo **não lê** valor de barra, nível, nem soma de atributos. Se um dia ler, virou RPG e o convite passa a dizer "você é fraco demais para este", que é o oposto do produto.

### 8.2 O que o duelo ESCREVE

```ts
ficha.registrarMarca({
  personId, provaId, valor, unidade,
  quando: number,
  arbitro: "relogio" | "janela" | "video",
  firme: boolean,      // false enquanto a contestação estiver aberta
  duelId: string,
})

ficha.registrarDuelo({
  personId, duelId, provaId,
  papel: "venceu" | "empatou" | "perdeu" | "faltou" | "sem_prova",
  quando: number,
})
```

Regras do contrato, não negociáveis:

1. **O duelo nunca escreve valor negativo, nunca decrementa, nunca rebaixa.** `papel: "perdeu"` é informação, não punição. Se a ficha quiser transformar isso em algo, o problema é dela, e este documento pede que ela não transforme.
2. **`arbitro` viaja com a marca.** A ficha tem que poder pesar um `relogio` diferente de um `video`. Marca de vídeo com `firme: false` não sobe nada.
3. **`registrarMarca` é chamada mesmo para quem perdeu.** O perdedor com melhor tempo pessoal ganha na ficha.
4. **`registrarDuelo` com `papel: "faltou"`** é o único campo que o duelo escreve e a ficha deve ignorar. Ele existe só para o pareamento.
5. A ficha nunca chama nada do duelo. A dependência é de mão única.

---

## 9. Modelo de dados proposto

Especificação. Não é arquivo. Nada disso vai para `proto-aluno/src/`.

```ts
type Arbitro = "relogio" | "janela" | "video";
type DuelKind = "relogio" | "janela" | "semana" | "video";

type DuelState =
  | "convite"      // proposto, ninguém aceitou
  | "aceito"       // os dois dentro, janela aberta
  | "ao_vivo"      // cronômetro rodando (só relogio)
  | "aguardando"   // meu lance fechou, falta o outro
  | "julgado"      // veredito existe
  | "contestado"   // veredito existe, firme = false
  | "expirado"     // convite morreu sem aceite
  | "sem_prova";   // fechou sem lance suficiente. Ninguém venceu.

type Prova = {
  id: string;
  nome: string;                     // "Fran", "Supino 8 reps", "Sessões da semana"
  disciplina: DisciplinaId | "livre";
  kind: DuelKind;
  unidade: "s" | "kg" | "reps" | "sessoes";
  melhor: "menor" | "maior";
  pisoVideo?: number;               // acima disso, vídeo obrigatório
  toleranciaEmpate: number;         // fração. 0.01 no relógio, 0.02 na janela, 0 na semana
};

type Lance = {
  personId: string;
  valor: number | null;
  arbitro: Arbitro;
  iniciadoEm?: number;              // relogio: cravado pelo app
  fechadoEm?: number;
  primeiroPlano: boolean;           // relogio: rodou sem sair do app
  saidas: number;                   // relogio: quantas vezes saiu. 2 trava o lance.
  sessionId?: string;               // janela e semana: a sessão que sustenta
  proofId?: string;
  videoId?: string | null;
};

type Veredito = {
  vencedorId: string | null;        // null = empate
  motivo: "marca" | "empate_tecnico" | "sem_prova";
  fechadoEm: number;
  postId: string;                   // o recibo, publicado no mesmo instante
  firme: boolean;                   // false nas primeiras 24 h
  legenda: string | null;           // do perdedor, 140 chars. null = slot some
  legendaAte: number;               // fechadoEm + 1 h
  faixa: Record<string, string>;    // personId -> as 6 palavras da seção 11.3
  cenaVistaPor: string[];           // quem já viu os 520 ms. Roda uma vez só.
};

type Contestacao = {
  porId: string;
  motivo: "fora_da_janela" | "sem_video" | "video_nao_mostra";
  abertaEm: number;
  fecha: number;                    // abertaEm + 24 h
  confirmam: string[];              // 3 fecham
  resultado: "mantido" | "virou_empate" | null;
};

type Duel = {
  id: string;
  provaId: string;
  kind: DuelKind;
  arena: { tipo: "setor" | "cidade"; id: string; nome: string };
  fromId: string;
  toId: string;
  origem: "app" | "pessoa" | "post" | "revanche";
  postId?: string;                  // se nasceu de um post
  revancheDe?: string;
  estado: DuelState;
  criadoEm: number;
  expiraEm: number;                 // convite: +24 h
  janelaInicio?: number;
  janelaFim?: number;               // aceite + 72 h, ou domingo 21 h
  contraproposta?: { provaId: string; porId: string };  // uma vez só
  lances: Record<string, Lance>;
  veredito?: Veredito;
  contestacao?: Contestacao;
};
```

### O que muda em `Duel`

O tipo atual é `{ id, fromId, toId, mark, postId, open }`. Some inteiro.

- `mark: string` sai. Marca virou `Prova` com id, unidade e sentido. Texto livre não se arbitra.
- `open: boolean` sai. Dois estados não descrevem oito.
- `postId` fica, mas muda de sentido: era o post que originou o desafio, agora é opcional e existe `veredito.postId`, que é o recibo.
- Entram `provaId`, `kind`, `arena`, `estado`, `janela*`, `lances`, `veredito`, `contestacao`.
- `challengePost(postId)` continua existindo como atalho: ele cria um `Duel` com `origem: "post"` e uma `Prova` inferida do post.

### Campos novos em `Person`

```ts
setorId: string;          // "bueno"
cidadeId: string;         // "goiania"
desde: number;            // timestamp da conta. Carência do novato.
cadencia28: number;
faixa: "A" | "B" | "C";   // derivada, cacheada
disciplinas: DisciplinaId[];
duelos: {
  propostos: number; aceitos: number;
  venceu: number; empatou: number; perdeu: number;
  faltou: number;         // invisível na interface. Só pareamento.
};
contestacaoBloqueadaAte: number | null;
```

`locker` some. Armário era metáfora de academia e academia não existe mais.

### Campos novos em `Group`

```ts
tipo: "powerlifting" | "crossfit" | "corrida" | "hipertrofia" | "calistenia" | "geral";
descricao: string;        // escrita por quem criou. Substitui note.
setorId: string;
cidadeId: string;
duelosVencidos: number;   // na semana. Alimenta a Guerra.
```

Somem: `place` (era o nome da academia), `invite` (não existe código), `open` (todo clã é aberto), `reqOfensiva` e `reqRaids` (não existe requisito de entrada). Fica `cap`, que é o teto, e a porta é vaga ou nada.

---

## 10. Estados

Onze. Todos têm desenho. Nenhum pode faltar.

1. **Vazio.** Nenhum duelo. Card no Hoje: "Sem duelo esta semana." Linha 2: "Setor Bueno, 14 treinando." Um botão: "Quero um agora". Se a arena estiver vazia, ver 10.8. Estado obrigatório e o mais visto na primeira semana do produto.
2. **Convite recebido.** Face do outro, nome, prova, **a marca dele e a sua lado a lado**, e o prazo. Três saídas: Aceito, Troco a prova, nada. Nunca um botão de recusar.
3. **Convite enviado.** "Esperando resposta. Expira em 14 h." Sem contador de tentativas. Sem cutucar.
4. **Aceito.** Prova, janela, as duas faces, e a frase que importa: "cabe na sessão de hoje". Se for Relógio, um botão grande: "Começar agora".
5. **Ao vivo.** Só no tipo Relógio. Tela cheia, sem barra de abas, sem tudo. O número do cronômetro e nada mais. Ao travar, ela se fecha sozinha em 260 ms, sem botão. Se o app for para segundo plano, na volta a tela mostra "o lance caiu" com o botão de refazer, e `saidas++`.
6. **Aguardando prova.** Sua marca fechada, a do outro não. Mostra a sua e um espaço vazio com o nome dele. Nunca "ele está perdendo".
7. **Julgado, firme.** As duas marcas, a faixa de 6 palavras, a etiqueta do árbitro, a legenda do perdedor, e Tá pago. Se `cenaVistaPor` não tiver o seu id, os 520 ms da seção 11.3 rodam aqui, uma vez.
8. **Julgado, mole.** Igual, com uma linha fina: "aberto até segunda 21h". Só os dois veem o botão de contestar.
9. **Contestado.** Faixa no topo do recibo: "Huan contestou. Falta 1 confirmação." O veredito não some da tela enquanto isso.
10. **Expirado.** Some do Hoje sem alarde. Fica no Progresso como uma linha cinza. Nenhuma notificação.
11. **Sem prova.** "Ninguém venceu. Vitor fechou, Huan não apareceu." Sem vencedor, sem ironia. O card oferece um par novo para a semana seguinte.

10.8 **Arena vazia.** Setor e cidade abaixo do piso. O Hoje não mente e não preenche com gente falsa. Ele diz: "Ninguém para duelar por aqui ainda." E oferece o único adversário que sempre existe, que é a própria pessoa: o desafio semanal, que já é o tipo `Challenge` do modelo. Aqui o duelo entrega o bastão para o desafio de 7 dias e sai de cena.

---

## 11. Momentos de movimento

Quatro movimentos, mais o orçamento que manda neles. O resto é estático, porque densidade é o casco e movimento gasto vira Duolingo infantil.

Orçamento antes de coreografia. `docs/barra-proto/05-motion-duolingo.md` é teto medido, não sugestão: **D8** dá no máximo 2 telas cheias e 1 toque obrigatório entre o fim do ato e a pessoa de volta onde ela decide; **D9** manda a comemoração de dentro da execução ser desenhada por cima do conteúdo vivo, sem trocar de tela, sem escurecer fundo, sem esperar toque, abaixo de 600 ms; **D10** e **C9** mandam o algarismo ser o maior elemento da cena, no mínimo 2,5x o corpo, e a arte nunca maior que o número; **D5** e **C11** limitam a faixa a 6 palavras com pelo menos 1 número do próprio ato; **D12** dá uma festa de tela cheia por sessão, no máximo.

### 11.0 A conta do fluxo de vitória

**0 telas cheias. 0 toques obrigatórios.** O orçamento é 2 e 1. Gasto zero dos dois.

| Passo | Tela cheia | Toque obrigatório |
|---|---|---|
| Fim do ato: o cronômetro trava, ou a sessão fecha, ou dá domingo 21h | 0. A tela do cronômetro **se dissolve sozinha** no fim do lance, e não espera toque para sair | 0 |
| Veredito: 520 ms por cima do que estiver vivo, seja o Feito, o Descanso ou o card do Hoje | 0. Não navega, não escurece, não abre folha | 0 |
| Volta a decidir | 0. Ela nunca saiu | 0 |

Toques que existem e **não são obrigatórios**, nenhum deles no caminho de volta ao aparelho: legenda, revanche, abrir o recibo. Todos moram no card do Hoje e no post, que são superfícies que já existiam.

O que eu cortei do caminho, e para onde foi. Nada sumiu, tudo foi para onde vai ser olhado depois:

| O que era um passo no fluxo | Para onde foi |
|---|---|
| Botão **Publicar** | Some. O recibo **publica sozinho**, e o consentimento é o aceite do duelo, não um botão no fim. Era o único toque obrigatório do desenho antigo, e o dono do produto pediu isso literalmente: declarou vencedor, foi para a rede |
| Botão **Escrever a legenda** | Vira uma linha no card do Hoje e um campo dentro do recibo, aberto só para o perdedor, por 1 h. O post sobe sem legenda e ganha a legenda depois |
| Botão **Revanche** | Vira o card do Hoje, onde ele vive a semana inteira. É lá que acontece o giro de 320 ms |
| Prova, arena, etiqueta do árbitro, dia | Saem da cena e ficam no recibo, que é a superfície de olhar depois |
| Tela cheia de veredito no overlay `desafio` | Deixa de existir. Ver 11.5 |

### 11.1 O cronômetro travando

O ato de o app virar juiz. Toque em "Começar agora": em 300 ms o chrome sai de cena para cima, sobram as duas faces pequenas no topo e o número no meio, e um háptico médio único crava o timer. Depois disso nada se move além dos dígitos. A ausência de movimento é o desenho, porque sair dali mata o lance e a tela precisa parecer um lugar do qual não se sai.

Esta tela é **o ato, não a cerimônia**, então ela não entra na conta de D8. Mas ela tem uma obrigação: **quando o lance fecha, ela se dissolve sozinha** de volta para onde veio, em 260 ms, sem botão de sair. Cerimônia que cobra pedágio começa exatamente aqui, com um "Continuar" que ninguém precisava.

### 11.2 A marca do outro entrando ao vivo

Referência Flighty: o estado muda sozinho. Com o duelo aberto, quando o outro fecha o lance o card no Hoje se reescreve sem você tocar, e a linha vazia com o nome dele vira o número, deslizando 8 px de baixo para cima em 200 ms. Sem badge, sem push, sem som. Quem estiver olhando vê; quem não estiver, encontra pronto.

### 11.3 Declarar vencedor

**O instante mais importante do app inteiro, e ele não é uma tela.** É uma sobreposição de **520 ms** que não navega, no molde de D9: por cima do conteúdo vivo, sem escurecer o fundo, sem esperar toque, sem trocar de tela. Dispara quando o segundo lance fecha. Se fechar no domingo 21h, com ninguém treinando, ela roda uma vez sobre o card do Hoje, na primeira vez em que aquele card é visto.

**O algarismo da cena é a SUA marca.** Não a do vencedor: a sua. É ela que acabou de mudar, é ela que ocupa o lugar onde o Duolingo põe a palavra "PERFECT", e ela é o herói nos dois aparelhos. No telefone de quem perdeu, o maior objeto da tela é o número que ele mesmo fez. Isso resolve C9 e a ética da derrota com um gesto só, e é a única cena do app em que o herói é diferente em cada aparelho.

- **0 ms.** A sua marca já está na tela, em 1x o corpo, onde ela está desde que você fechou o lance. Se a do outro já chegou, as duas estão lado a lado, mesmo tamanho, mesma cor. Ninguém está ganhando, e esse quadro tem que existir.
- **0 a 160 ms.** A **sua** marca cresce de 1x para **2,8x o corpo**, curva de saída. Ela passa a ser o maior elemento da cena, acima do piso de 2,5x de D10. Nenhuma arte, nenhum selo, nenhum ícone é maior que ela, porque não existe arte nenhuma: as duas faces ficam em 24 pt.
- **160 a 340 ms.** A marca do outro entra embaixo, em 1x, com o nome, deslizando 8 px. **Ela nunca cresce e nunca encolhe**, ganhando ou perdendo. Nada na cena escurece, desbota, fica vermelho ou cai.
- **340 ms.** Háptico único. Usa a intensidade de **série confirmada** do vocabulário fechado de D4. Só quando a pessoa bate a própria melhor marca é que ele sobe para a intensidade de **recorde**, que é a mais forte e é a única que a derrota também pode disparar.
- **340 a 520 ms.** A faixa do veredito se escreve **no mesmo slot onde estava o botão de ação**, cobrindo, sem empurrar um pixel do que está acima (D1). Máximo 6 palavras, pelo menos 1 número do próprio ato. Ver a tabela abaixo.
- **520 ms.** Acabou. Nada espera toque, nada precisa ser dispensado, e a pessoa continua exatamente onde estava. A faixa fica na tela, e o card do Hoje passa a ser o estado julgado.

Sem som, sem troféu, sem medalha, sem confete, sem a palavra vitória e sem a palavra derrota. O número é o prêmio e o nome é o prêmio.

**O texto da faixa, com o teto de D5 e a comparação de C11.** Fato antes de elogio, e o melhor julgamento não é adjetivo, é comparação. A ordem de escolha da comparação é fixa: primeiro a melhor marca da própria pessoa, depois a última vez dela na mesma prova, e só então a diferença para o outro.

| Situação | Faixa | Palavras |
|---|---|---|
| Venceu e bateu a própria melhor | "Sua melhor. 12 s abaixo." | 5 |
| Venceu, sem marca pessoal | "Você fechou 43 s antes." | 5 |
| Venceu no tipo Semana | "5 sessões. Uma a mais." | 5 |
| Perdeu e bateu a própria melhor | "Sua melhor. 12 s abaixo." | 5 |
| Perdeu, sem marca pessoal | "Marina fechou 43 s antes." | 5 |
| Perdeu no tipo Semana | "4 sessões. Uma a menos." | 5 |
| Empate técnico | "Empate. 3 s entre vocês." | 5 |
| Sem prova | "Sem veredito. Sua marca: 12:41." | 5 |

Repare nas linhas 1 e 4: quando os dois batem a própria melhor marca, **os dois leem exatamente a mesma faixa**, e ela não menciona o duelo. Isso não é descuido, é a regra funcionando: a comparação com você mesmo vale mais que o placar, e num dia desses o placar é a segunda notícia da tela.

A faixa de quem perde tem a **mesma altura, a mesma tipografia e o mesmo peso** da faixa de quem ganha, e a mesma tinta. Nenhuma cor de alarme, nenhuma frase de consolo. Orçamento de elogio: 1 palavra, e nós gastamos **0**. Proibidas na faixa, sem exceção: parabéns, incrível, mandou bem, arrasou, você perdeu, derrota, vitória, quase lá.

### 11.4 A revanche abrindo

O único movimento dedicado ao perdedor. Toque em "Revanche" e o card **gira no eixo horizontal em 320 ms** e volta como convite novo, mesma prova, data da segunda. É o mesmo objeto, virado, e diz sem texto que nada acabou. É o movimento que traz a pessoa de volta na segunda, que é o único trabalho que a derrota tem que fazer. Acontece no card do Hoje, não numa tela cheia, e o toque é opcional.

### 11.5 A vaga única de festa por sessão, e quem cede

D12 dá **uma** festa de tela cheia por sessão. A subida de patamar da ficha de atributos disputa essa vaga com o veredito do duelo. A decisão deste documento é dura e é de mão única:

**O duelo nunca gasta a vaga. Nem quando ela está livre.**

Quatro motivos, e o primeiro é o que decide:

1. **O duelo deixa objeto, o patamar não.** O recibo é um post publicado sozinho, com dois nomes, uma legenda e um número, e vai ser olhado depois por gente que não estava lá. A subida de patamar não tem plateia nem recibo: se ela não acontecer no instante, ela não acontece em lugar nenhum. Tela cheia é para o que evapora. O duelo pode ser discreto porque ele sobrevive à discrição.
2. **A carga emocional do duelo é a outra pessoa, e ela chega como nome, não como pixel.** Nenhuma quantidade de tela cheia acrescenta a isso.
3. **Frequência.** Veredito é semanal, até 52 por ano. Patamar é raro por construção. Tela cheia semanal vira pedágio em quatro semanas, e é exatamente o que D8 chama de perder o critério por vaidade. Cerimônia cara só se paga no que é raro.
4. **Momento.** O patamar nasce dentro da execução, colado no ato que o causou. O veredito nasce, na maioria das semanas, no domingo 21h, quando ninguém está treinando: não existe conteúdo vivo por cima do qual acontecer. Ele é estado de card, não cena.

**Contrato implementável, para quem for costurar os dois:**

```ts
sessao.festaCheia: { dono: "ficha"; quando: number } | null
```

O duelo **lê e nunca escreve**. Quem escreve é a ficha. Se o campo já estiver ocupado, o duelo não muda de comportamento, porque o comportamento dele já é o de quem não gasta.

Quando os dois caem na mesma sessão, a ordem é: ato, patamar em tela cheia, volta ao Hoje, veredito em 520 ms sobre o card. Total no pior caso: **1 tela cheia e 1 toque obrigatório**, metade do orçamento de D8. E esse único toque tem que ser o alvo mais fácil da tela, com no mínimo 44 pt, nunca texto secundário debaixo de um primário, que é a falha nomeada em D12.

Se o outro projetista concluir que ele também deve ceder, a vaga fica **vazia**, e isso é um resultado legítimo. Zero festa numa sessão não é defeito. Duas é.

---

## 12. Como isso vira post na rede

O recibo é um `Proof` normal, com `duelId`. Ele entra no feed pelas mesmas regras de quem vê o Feito. Não é objeto especial e não tem destaque.

**Ele publica sozinho, no instante do veredito.** O consentimento é o aceite do duelo, não um botão no fim. Isso tira o único toque obrigatório do fluxo e atende ao que o dono do produto pediu com essas palavras: declarou o ganhador, foi para a rede.

**O que aparece:**

- Duas faces, do **mesmo tamanho**. Nunca a do vencedor maior.
- Duas marcas: `Marina 11:58 · Vitor 12:41`. O vencedor em peso maior, o perdedor em peso normal, nunca apagado.
- A faixa, a mesma da seção 11.3, com o mesmo teto de 6 palavras e 1 número. No feed ela é escrita na terceira pessoa e nomeia os dois: "Marina fechou 43 s antes."
- Uma linha: prova, arena, etiqueta do árbitro. "Fran · Setor Bueno · cronômetro do app".
- A legenda, escrita pelo perdedor, num slot que existe desde o começo e que só ele pode preencher, por 1 h. Sem legenda, o slot some, e ninguém fala no lugar dele.
- Tá pago e fala de um nível, como qualquer Feito.

**O que o perdedor vê no feed:** o mesmo post que todo mundo, com a legenda dele, no diário dos dois perfis. Não existe esconder, porque esconder ensinaria que perder é vergonha.

**Como o público reage sem virar deboche**, cinco travas:

1. **Tá pago paga o duelo, não o vencedor.** Um toque, um contador, sem lado. Não existe jeito de aplaudir só um. Esta é a trava nova e a mais importante.
2. Uma fala por pessoa, um nível, sem like na fala. Já é regra da rede.
3. O autor da legenda é o perdedor. Rir do post é rir por cima da fala dele, e isso é caro socialmente.
4. Sem placar público de indivíduo. O recibo é evento, não posição.
5. Sem For You. Só vê quem o grafo já deixava ver, que é clã do autor ou arena.

---

## 13. Rentabilidade, como hipótese honesta

**Isto é hipótese.** Nada aqui está decidido nem está no protótipo. A regra que não é hipótese: **o app não cobra o aluno** e **não existe nada para comprar dentro do duelo**.

Pagar para ganhar não é proibido por política, é impossível por arquitetura: não há revanche paga, árbitro pago, desfazer derrota, prioridade de pareamento comprável nem marca comprável. Se um dia existir um botão que troca dinheiro por resultado, o duelo morreu naquele dia.

Quatro lugares onde dinheiro poderia entrar sem tocar na disputa:

1. **O personal, em outra conta.** Receita provável, e não mora aqui. O duelo faz o aluno não sair, e aluno que não sai é o que o personal paga para ter.
2. **Prova patrocinada.** Uma marca põe uma prova no setor, "Fran abaixo de 12", com o nome de quem pagou. O dinheiro compra **a existência da prova**, nunca o veredito, o pareamento ou um lugar no recibo. Teto de uma por setor por mês. Risco declarado: prova patrocinada demais vira Nike Training Club.
3. **A lupa, no modelo Summit honesto do Strava.** Análise do histórico, a marca da pessoa contra ela mesma ao longo de meses. Gesto social, arena, veredito e recibo ficam livres para sempre. Se a lupa comer o gesto, a base grita e tem razão.
4. **O recibo fora do vidro.** O objeto físico do duelo ganho. Marginal, provavelmente não paga a operação.

O que eu **não** faria: aposta entre os duelistas, mesmo simbólica. GymPact morreu provando que punição financeira não cria tribo.

---

## 14. O que mata isso

Sendo adversário do meu próprio projeto.

**1. Mentira.** O app não tem sensor e a pessoa digita o número. Se mentir compensar, tudo desaba.
Defesa: quatro tipos em três camadas de árbitro, com a etiqueta na tela; o tipo padrão proposto pelo app é o Semana, que não é mentível; carga só entra com vídeo acima do piso; contestação que só pode empatar; número declarado nunca fecha veredito.
Risco que sobra: o tipo Vídeo. Assumido e escrito na seção 3.

**2. Deboche.** Perder em público num app onde ninguém se conhece é o cenário de saída.
Defesa: a palavra derrota não existe; nada encolhe na animação; a legenda é do perdedor; Tá pago paga os dois; sem like em fala; sem placar de indivíduo; carência de três duelos para novato.
Risco que sobra: o comentário cruel de um nível. Não tem defesa técnica. Tem uma fala por pessoa e ela tem cara.

**3. Deserto.** Setor vazio, ninguém para desafiar, o card fica mudo por três semanas e a pessoa some.
Defesa: arena sobe de setor para cidade por função; o app propõe, ninguém caça; o tipo Semana funciona com qualquer pessoa de qualquer esporte; e o estado 10.8 entrega o bastão para o desafio semanal contra si mesmo em vez de mostrar uma tela vazia.
Risco que sobra: cidade vazia no dia 1. O produto assume o buraco. Preencher com gente falsa é o crime da IRL.

**4. Fadiga de notificação.** Duelo é a feature que mais tenta empurrar push.
Defesa: teto de **2 pushes de duelo por semana por pessoa**, e só estes dois: "Fulano aceitou" e, na sexta, "domingo fecha e falta a sua marca". **O veredito não é empurrado.** Ele acontece e espera você abrir. Nunca existe push de "você perdeu", "fulano te desafiou de novo", "fulano bateu sua marca".

**5. Infantilização, e o pedágio de cerimônia que vem junto.** Arena, duelo, veredito. As palavras estão a um passo do RPG de fazenda, e a cena de vitória é onde a vaidade cobra tela.
Defesa: sem troféu, sem medalha, sem confete, sem som, sem XP, sem patente, sem invicto, sem cinturão. A arena se chama Setor Bueno porque é o nome do bairro. A faixa de pareamento é invisível. O prêmio é um número e um nome. E o veredito custa **0 telas cheias e 0 toques obrigatórios**, contra um orçamento de 2 e 1: a régua está na seção 11.0 e é conferível contando quadros.

**6. Duelo que ninguém aceita.** Se a taxa de aceite for baixa, tudo cai.
Defesa: o convite mostra as duas marcas antes do sim, então a pessoa vê que é alcançável; o tipo padrão cabe na sessão que ela já ia fazer; expirar é grátis e silencioso; o teto de 2 dá desculpa social; e o pareamento por cadência garante que o adversário treina como ela.
Métrica que mata a hipótese: se menos de 40% dos convites propostos pelo app forem aceitos na primeira semana, o mecanismo está errado e não é caso de polir a tela.

**7. O duelo comer a Guerra.** Clash Royale é 1v1 e o clã vira adesivo. Clash of Clans é grupo contra grupo e o clã é o produto.
Defesa: o duelo alimenta a guerra através de `duelosVencidos`, e nunca tem placar próprio de clã; o duelo não tem escada acumulada; o único acúmulo visível é a ficha de atributos, que é individual e não é ranking.

---

## 15. O que eu cortei

O cemitério, com o motivo.

1. **Ranking numerado da arena.** 1º, 2º, 3º do Setor Bueno. Cortei porque é ranking mundial com raio menor, e porque o 40º lugar ensina a pessoa a fechar o app. Sobrou: a sua faixa, invisível, e os seus últimos 8 duelos.
2. **Aposta.** Apostar ofensiva, protetor ou dias de sequência. Cortei porque perder passaria a doer de verdade, e derrota que dói esvazia o app. GymPact já pagou essa conta.
3. **Duelo síncrono ao vivo.** Os dois na mesma hora, com placar correndo, tipo Tribe. Cortei porque exige coordenação entre estranhos, que é o problema que o app deveria resolver e não pressupor.
4. **Juiz por OCR do display do aparelho.** Foto do painel da esteira, o app lê o número. Cortei porque é sensor de mentira: parece objetivo, erra, e ensina a mentir melhor. Falso juiz é pior que juiz assumidamente ausente.
5. **Testemunha humana obrigatória antes do lance.** Alguém do clã confirma que viu. Cortei como requisito porque vira confirmação recíproca entre amigos em duas semanas, e porque prende o duelo à presença de outra pessoa. Sobrou como resolução de contestação, depois do fato, com três pessoas, e podendo só empatar.
6. **Tabela de conversão entre esportes.** Coeficiente que compara ciclista com powerlifter. Cortei porque é fantasia estatística e o app não tem o dado. A comparação entre esportes mora na ficha de atributos, por eixo, não por soma.
7. **Handicap.** O mais forte começa atrás. Cortei porque insulta os dois: o forte não venceu, o fraco não competiu.
8. **Melhor de três e temporada de duelo.** Cortei porque o ciclo do produto é a semana e um duelo que atravessa três semanas compete com a guerra, com a raid e com a ofensiva ao mesmo tempo.
9. **Emblema de invicto.** Cortei porque cria medo de duelar exatamente em quem mais duela, que é o usuário que o produto precisa.
10. **Chat do duelo e provocação antes.** Cortei porque é chat. O Zap já ganhou.
11. **Aceitar por deslize.** Cortei porque é swipe, que é proibido, e porque decisão de 1 s é para carta de cara, não para compromisso de semana.
12. **Botão de recusar.** Cortei porque nomear a recusa cria a vergonha que o dono do produto pediu para não existir. Expirar faz o mesmo trabalho e não tem autor.
13. **Vitória por sumiço do outro.** Cortei porque cria torcida contra. Virou `sem_prova` e uma moeda que não se compra, que é prioridade de pareamento.
14. **Duelo de clã contra clã.** Cortei porque já existe e se chama Guerra. Duplicar seria a terceira escada.
15. **A tela cheia do veredito**, que eu tinha escrito com 1,4 s de cena e três botões no fim. Cortei contra D8 e D12: era 1 tela e pelo menos 1 toque de pedágio, toda semana, no meio do descanso de alguém. Virou 520 ms por cima do conteúdo vivo, e a cena não perdeu nada, porque o que ela tinha de informação foi para o recibo, que é onde se olha depois.
16. **O número do vencedor como herói da cena.** Cortei porque no aparelho de quem perdeu isso põe o número do outro como o maior objeto da tela. O herói virou a marca da própria pessoa, nos dois aparelhos, o que atende D10 e a ética da derrota com o mesmo gesto.
17. **Disputar a vaga de festa com a subida de patamar.** Cortei antes de disputar. Ver 11.5.

---

## Frase

O app não vê a barra. Ele vê o relógio, a janela e a sessão. Onde ele vê, ele julga e cala. Onde ele não vê, ele diz que está confiando, e escreve isso no recibo.

O instante mais importante do app dura 520 ms, não troca de tela e não pede toque nenhum. O maior objeto da cena é a marca da própria pessoa, e ela é a mesma coisa nos dois aparelhos.

Quem perde sai da tela com a sessão contada, a melhor marca dele registrada, a última palavra escrita e a revanche aberta na segunda. Se o perdedor não voltar, o mecanismo falhou, e nenhum número de vencedor conserta isso.
