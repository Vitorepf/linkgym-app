# Ciclo 10 — o arsenal

O dono mudou o foco: a aparência do app virou O produto, com juízes de qualidade,
simplicidade e inovação a cada rodada. Este é o registro.

## O achado que reenquadra o ciclo

**A alavanca de material não pintava 78% dos blocos do app.**

O `raised` da `Band` caía numa bandeira de captura (`globalThis.__bandRaised`), aberta no
ciclo 5 para uma decisão do dono que ficou pendente por quatro ciclos. Em produção ela era
sempre `false`. E **93 das 119 chamadas de `<Band>` não passavam a prop.** Resultado: o
cardápio vendia seis materiais — vidro, elevada, fio duplo, vinco — e o app aplicava-os a um
quinto das superfícies.

É a mesma família de mentira que o `vidro` sem leitores do ciclo 9, só que na alavanca
inteira em vez de num valor dela.

A decisão pendente nunca precisou do dono, porque já tinha resposta no próprio cardápio: se
ele escolheu um material, todo bloco veste esse material; se ele não quer bloco, existe um
valor que diz isso com todas as letras. **A pergunta "raised por padrão?" era uma alavanca
disfarçada de bandeira.**

## O que entrou

| | antes | agora |
|---|---|---|
| materiais | 6 | **8** — entraram `nenhuma` (sem bloco) e `carimbo` (bloco impresso) |
| aparências fechadas | 8.817.984 | **11.757.312** |
| pares medidos | 458.239 | **590.705**, 0 reprovam |
| linguagens de design | 6 kits (documentos pré-preenchidos) | **8 linguagens**, com régua própria |
| `escala` (corpos cravados à mão) | 1 | **0** |

**Os dois materiais novos existem porque faltava o que dizer.** `nenhuma` é o oposto do
contorno, não uma versão fraca dele: o contorno é uma caixa de quatro lados, ou seja MAIS
cromo. Sem ele, "minimalista" só podia escolher entre cartão e gaiola. `carimbo` é a única
família cujo contraste é garantido por construção nos DOIS chãos, porque a laje deslocada é
um degrau da escada (ΔL\* ≈ 15 contra o chão para qualquer hex livre) e não uma sombra que
só existe no claro.

## Quatro réguas novas, e as quatro nasceram reprovando

| régua | o que conta | antes | agora |
|---|---|---|---|
| `rolagem` | viewports e alvos de toque por tela, no Chrome | **5 reprovam** | **0** de 56 |
| `tempo` | duração fora de `MOTION`, `withTiming` sem curva | **9** | **0** |
| `vaos` | espaço fora dos seis degraus de `SPACE` | **161** em 31 arquivos | 138 em 26 |
| `linguagens` | duas linguagens se separam em 3 de 6 canais grossos | — | **0** de 28 pares |

`tempo` achou **duas molas diferentes escritas à mão no mesmo arquivo**, sem nome, com
números distintos — quem lesse não tinha como saber se a diferença era intenção ou descuido.

`linguagens` provou os dentes contra o conjunto antigo: **Boutique × Sereno media 2 de 6** —
dois kits que eram quase o mesmo app.

E `rolagem` nasceu com um defeito meu que ela mesma expôs: contava alvos em telas
ESCONDIDAS. Na web o native-stack ignora `presentation` e deixa a tela de baixo montada em
`display: none`, então uma folha de escolha vinha somada ao palco inteiro atrás dela — 32
onde o dedo alcança 15. Régua que conta pixel que ninguém vê é o mesmo pecado que este repo
persegue desde sempre.

## O Palco

A porta da aparência era um índice de dez linhas com nome, valor e seta. Correto, e a
gramática errada: aquilo CONFIRMA de volta o que a pessoa já escolheu. Escolher é o prazer;
ser informado do que já se escolheu é escrituração. E nada ali mostrava o que ele PODERIA
ter.

Agora a tela inteira é o app do aluno, em tamanho real, e o polegar corre as oito
linguagens de lado. Ele não lê "Boutique" — vê o app dele em Boutique, com a marca dele, e
arrasta para ver em Cartaz. As dez alavancas continuam existindo, atrás de uma porta à
direita da régua.

## Os juízes

Três, cegos um ao outro, mais um sintetizador que **verificou cada afirmação no código antes
de repassar**. Notas: **qualidade 6, simplicidade 5, inovação 5.**

Os quatro achados em que os três coincidiram sem se falarem estão em `CICLO-10-BRIEF.md`. O
pior era meu e foi consertado no mesmo turno: **a lista de cartões encolhia debaixo do
dedo** — nove fichas quando o documento não batia com linguagem nenhuma, oito quando batia,
com o deslocamento em pixels apontando para a ficha errada depois do primeiro arrasto. A
tela mostrava uma linguagem, a régua acendia outra, e "Do seu jeito" sumia levando o ajuste
manual junto.

A contradição entre inovação e simplicidade foi resolvida escolhendo um lado: **a parede de
oito telefones vivos é NÃO.** Ela é peça de marketing, não tela de trabalho; os três juízes
disseram que a porta está QUEBRADA, nenhum disse que está chata; e este ciclo declarou que
acabamento é medido, não afirmado — a parede afirma o arsenal, os consertos o medem.

E um achado foi **refutado na checagem**, o que é resultado bom: "buraco branco no arrasto
rápido" não existia como descrito, porque o `pagingEnabled` avança uma página por gesto. O
buraco era real e a causa era outra.

## O que continua sendo do humano

Sete medidores rodam e **não travam nada**: `aparencia`, `botao`, `rolagem`, `tempo`,
`vaos`, `linguagens` e `kits`. Enquanto não forem registrados, nada impede o botão de voltar
aos 100pt nem o cardápio de voltar a vender duas linguagens que são uma. Script pronto no
scratchpad, com a nota do que ele faz ao lock.
