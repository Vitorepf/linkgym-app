# Refutação — eixo 2, operação do personal

Papel: REFUTADOR. Alvo: veredito "venceu" do crítico cego. Método: checar cada alegação
no pixel dos arquivos citados, depois somar os 4 defeitos registrados e perguntar se
devolvem a vantagem à barra.

## Alegações checadas uma a uma

### 1. "mfit-03 mostra 11 cartões idênticos com 3 botões cada e 'Resolver todos (11)'"

**Confere, com uma ressalva de precisão.** `docs/barra/eixo2-operacao-personal/mfit-03-feedbacks-fila-resolver-todos-11.png`
mostra o botão `Resolver todos (11)` no topo e cartões idênticos ("Carla Bernardi",
"Treino Finalizado.", início/fim com data repetida) com os 3 botões `Ver Treino` /
`Resolver` / `Responder` em 3 estilos visuais distintos. A imagem é peça de marketing
inclinada e só exibe ~2 cartões; o "11" vem do rótulo do botão, não de 11 cartões
visíveis. RESSALVAS.md §3 manda usar essas peças só para mecânica e hierarquia — e é
exatamente o uso que o crítico fez (contagem no rótulo + 3 botões por cartão são
mecânica, não pixel). A ressalva não derruba a alegação.

### 2. "Atencao.png mostra 3 nomes ordenados com motivo e UMA ação por linha"

**Confere integralmente.** `tools/out/design/0/Atencao.png`: título "3 alunos precisam
de você"; 3 linhas — Marina Okamoto ("9 dias sem treinar" → "Mandar retomada curta",
destacada em vermelho como primeira da ordem), Carlos Eduardo Lima ("Última sessão
difícil" → "Subir 2,5 kg"), Ana Beatriz ("Marcou dor" → "Trocar desenvolvimento").
Uma ação por linha, motivo declarado, ordenação com destaque no topo. É o oposto
termo a termo da fila plana de mfit-03, como a aposta falsificável de RESSALVAS.md §2
exigia. O rodapé "Só estes. Os outros estão no automático." fecha o escopo.

### 3. "Painel abre com a fila de trabalho e ação na linha; mfit-01 abre com atalhos comerciais e cadastro alfabético"

**Confere dos dois lados.** `mfit-01`: marca centralizada, saudação ao profissional,
4 atalhos circulares (Links de Vendas e Carteira MFIT = 2 comerciais; zero é
"prescrever"), cartão Alunos Ativos com lista alfabética plana — inclusive "Exemplo
Exemplo" — com 1 ação por linha, e ela é o WhatsApp (sair do app). `Painel.png`:
abre com "3 PRECISAM DE UM TOQUE HOJE" e as 3 linhas com ação embutida, depois
"Feitos hoje 2 de 3" e "Retornos por ler 4". NOTAS.md §3 já classificava mfit-01
como "navegação + cadastro... a barra aqui é literalmente zero". Alegação sustentada.

### 4. "Ajustar.png pré-preenche as cargas com procedência declarada; mfit-02 entrega o campo Carga em branco"

**Confere.** `Ajustar.png`: 6 exercícios, todos com carga preenchida, cada um com a
origem escrita na própria linha — "É a carga da última série que Ana fez neste
exercício", "DA ÚLTIMA FICHA DE ANA", "PARTIDA DO MODELO", "POSTA À MÃO" — e o rodapé
soma a procedência: "1 do corpo · 1 da última ficha · 1 de partida · 3 à mão".
`mfit-02` + NOTAS.md §6: campo Carga em branco, Intervalo com `0,0` morto, e o botão
"Evolução de cargas" no cabeçalho provando que o app tem o histórico e não o usa.
Chequei também contra o espantalho de RESSALVAS.md §1: mesmo pelo caminho MFIT IA
(mfit-11), a saída é `3 × 12-10-8 × 60s` sem nenhuma carga em kg — a comparação do
crítico sobrevive ao caminho forte da barra, não só ao fraco. Ponto honesto contra
nós: 3 das 6 cargas são "à mão". Mas procedência declarada de 6/6 contra campo em
branco continua vitória clara.

## Os 4 defeitos, somados, devolvem a vantagem?

1. **Painel com cartão cortado pela tab bar** — real e visível em `Painel.png` (um
   cartão "Sai..." decapitado). Defeito de acabamento no fim da rolagem; a decisão do
   eixo acontece no topo da tela, que está intacto. Não devolve nada.
2. **Fila de 3 duplicada em Painel e Atencao** — real: mesmo trio, mesmas ações,
   pixel por pixel. Redundância, mas redundância de uma fila que a barra **não tem**
   em tela nenhuma (NOTAS.md §4: "não existe caminho para quem sumiu"). Duas cópias
   de algo que a MFIT tem zero cópias não é vantagem da MFIT.
3. **Retorno com seletor −2,5/0/+2,5 separado do número que edita** — real e é o
   defeito mais sério: em `Retorno.png`, entre o "+2,5 kg" gigante e o seletor há
   dois blocos de PR e um cartão de troca; dá para hesitar sobre o que o seletor
   edita. Mas o padrão vem pré-selecionado (+2,5 aceso, coerente com a sugestão) e a
   tela equivalente da barra não existe — mfit-03 arquiva o feedback com "Resolver",
   sem propor nem aplicar carga nenhuma. Defeito interno, sem tela da barra que o
   supere.
4. **AtencaoVazio com três cartões altos para três zeros** — real: `AtencaoVazio.png`
   gasta ~3/4 da tela em três zeros, o exato "muito espaço, pouco fato" que
   RESSALVAS.md §5 condena na MFIT. É o defeito mais irônico. Porém não há arquivo da
   barra de estado vazio para comparar (regra: sem arquivo, é palpite), e a mensagem
   central ("Ninguém precisa de você agora / Todo mundo está no automático") comunica
   o estado corretamente. Vergonha de ofício, não derrota de operação.

**Soma:** os 4 defeitos são de acabamento e de telas secundárias. Nenhum toca as três
comparações que fundamentam o veredito (Atencao vs mfit-03, Painel vs mfit-01,
Ajustar vs mfit-02), e nenhum tem tela da barra que faça o mesmo trabalho melhor.
O motivo do crítico julga mecânica e hierarquia (o que RESSALVAS.md §5 exige), não
visual, e não invade o que tem medidor (toques, tamanho de fila — catraca).

## Conclusão

As três alegações centrais conferem no pixel, a comparação resiste inclusive ao
caminho IA da barra (o espantalho denunciado em RESSALVAS.md §1), e os 4 defeitos,
somados, não devolvem à MFIT nenhuma das vantagens alegadas. Rebaixar para "empatou"
exigiria pelo menos uma tela da barra fazendo o trabalho do eixo melhor que a nossa;
não existe nos 12 arquivos.

VEREDITO: SUSTENTADO
