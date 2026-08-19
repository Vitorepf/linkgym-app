#!/usr/bin/env node
// A GARANTIA DA FÁBRICA DE APARÊNCIA. node tools/aparencia.mjs [--json]
//
// O dono pediu duas coisas que brigam: customização TOTAL e resultado ULTRA PREMIUM em
// qualquer combinação. Só existe um jeito honesto de prometer as duas — percorrer o
// produto cartesiano inteiro e reprovar o que cai abaixo do piso. É isto.
//
// Não é uma segunda régua: importa `criarTema` de src/theme.ts, o MESMO código que a tela
// desenha, e mede o que sai dele. Nenhuma cópia de token, nenhuma fórmula duplicada.
//
// O que percorre:
//   7 chãos  x  (20 marcas fictícias + 10 cores do cardápio + 5 extremos)  =  245 paletas
//   x 3 densidades x 3 formas (as que mudam geometria, não cor)
// O que exige, em cada uma:
//   TEXTO 4,5:1 · UI 3:1 · a aba ativa DOMINA a inativa · a segunda cor SE DISTINGUE da
//   primeira · o aviso de erro NÃO se confunde com a marca · alvo de toque >= 44pt.
import { readdirSync, readFileSync } from "node:fs";
import { gravarMedida } from "./catraca.mjs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ACCENT_CHOICES,
  ANEL_DO_ROSTO,
  VOZES,
  compor,
  luminance,
  APARENCIA_PADRAO,
  CHAOS,
  MOTION,
  contrast as ratio,
  corLivre,
  criarTema,
  escada,
  separadasNoMatiz,
  AVANCO_DO_DIGITO,
  folgaDaUnidade,
  neutroSobre,
  pressedFill,
  separadas,
  UNIDADE_DE,
} from "../src/theme.ts";
import { BRANDS } from "./brands.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const TEXTO = 4.5;
const UI = 3;
/** iOS Human Interface e Material concordam neste: 44pt. Densidade compacta não pode
 *  encolher um alvo abaixo disso — apertar o vão é gosto, apertar o dedo é defeito. */
const ALVO = 44;

/** `separadas` vem de src/theme.ts de propósito: se o medidor tivesse a própria conta de
 *  "duas cores são duas", ele mediria uma régua que a tela não usa. */

const EXTREMOS = ["#ffffff", "#000000", "#808080", "#121111", "#f3f2f2"];

/** A COR LIVRE — a porta que a doc vende desde sempre ("livre + 10 sugestões") e que o
 *  app só agora tem. O que mudou é a ENTRADA, não o motor: então a prova honesta não é um
 *  piso novo, é fazer a cor DIGITADA percorrer os mesmos pisos das paletas do cardápio.
 *  São hexes fora das dez sugestões, escritos como um dedo escreve — caixa alta, sem `#`,
 *  com espaço em volta —, normalizados pela mesma `corLivre` que a tela do personal
 *  chama. Duas cópias da regra divergiriam, e a que diverge é sempre a que o servidor
 *  recusa. */
const GRAFIAS = [(c) => c.toUpperCase(), (c) => c.slice(1), (c) => ` ${c.slice(1).toUpperCase()} `];
const LIVRES = BRANDS.map((b) => b.accent)
  .filter((c) => !ACCENT_CHOICES.includes(c))
  .map((canonica, i) => {
    const digitado = GRAFIAS[i % GRAFIAS.length](canonica);
    return { canonica, digitado, cor: corLivre(digitado) };
  });

const MARCAS = [
  ...BRANDS.map((b, i) => ({ nome: `${i} ${b.name}`, cor: b.accent })),
  ...ACCENT_CHOICES.map((c) => ({ nome: `cardápio ${c}`, cor: c })),
  ...EXTREMOS.map((c) => ({ nome: `extremo ${c}`, cor: c })),
  ...LIVRES.map((l) => ({ nome: `livre ${l.digitado.trim()}`, cor: l.cor })),
];
const CHAOS_NOMES = Object.keys(CHAOS);
const DENSIDADES = ["compacta", "normal", "arejada"];
const FORMAS = ["reta", "macia", "pilula"];

/** As faces com `tnum` (dígito de largura fixa), lido do GSUB do TTF — não suposto.
 *  Archivo, Inter e Space Grotesk têm; Playfair, Nunito e Oswald não. */
const COM_TNUM = [
  "Archivo_800ExtraBold",
  "Archivo_500Medium",
  "Inter_700Bold",
  "Inter_500Medium",
  "SpaceGrotesk_700Bold",
  "SpaceGrotesk_500Medium",
];

/** SEPARAÇÃO em L*, que é a régua que faltava e a razão de este arquivo já ter marcado
 *  "0 reprovam" com defeito real na tela. Razão de contraste responde "dá para ler"; ela
 *  NÃO responde "dá para ver que são duas superfícies". Um véu que escurece 1,4 de L*
 *  contra o chão passa em contraste — porque contraste ali nem é exigido — e some no
 *  olho. L* é a escala perceptual: 5 é o degrau em que uma superfície começa a existir. */
const L = (hex) => {
  const y = luminance(hex);
  return y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y;
};
const separacao = (a, b) => Math.abs(L(a) - L(b));

const linhas = [];
const par = (onde, quem, oque, medido, minimo) =>
  linhas.push({ onde, quem, oque, medido, minimo });

for (const chao of CHAOS_NOMES) {
  for (const marca of MARCAS) {
    const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor });
    const { T } = t;
    const chaos = [
      ["bg", T.bg],
      ["dock", T.dock],
      ["surface", T.surface],
      ["raised", T.raised],
    ];

    // 1. O CHÃO. Independe da marca, mas medir uma vez por marca custa nada e prova que
    //    trocar a marca não mexeu no chão.
    for (const [gn, g] of chaos) {
      for (const tinta of ["ink", "muted", "muted2"]) {
        par(chao, marca.nome, `${tinta} sobre ${gn}`, ratio(T[tinta], g), TEXTO);
      }
      par(chao, marca.nome, `divider sobre ${gn}`, ratio(T.divider, g), UI);
    }

    // 2. A MARCA nos três papéis. text escreve, mark risca, piece preenche.
    for (const [gn, g] of chaos) {
      par(chao, marca.nome, `marca escreve em ${gn}`, ratio(t.acento(undefined, g).text, g), TEXTO);
      par(chao, marca.nome, `marca risca em ${gn}`, ratio(t.acento(undefined, g).mark, g), UI);
    }
    const peca = t.acento().piece;
    par(chao, marca.nome, "tinta sobre a peça", ratio(peca.ink, peca.fill), TEXTO);
    for (const [gn, g] of chaos) {
      par(chao, marca.nome, `peça existe sobre ${gn}`, ratio(peca.fill, g), UI);
    }
    const tocada = pressedFill(peca.fill, peca.ink);
    par(chao, marca.nome, "tinta sobre o toque", ratio(peca.ink, tocada), TEXTO);
    // O TOQUE TEM QUE ACONTECER. Só medir se o rótulo sobrevive ao toque deixa passar o
    // botão que nao muda nada quando o dedo encosta — foi o caso das marcas ja no teto de
    // luz (branco, amarelo, ciano), onde `shade` grampeava e devolvia a mesma cor.
    par(chao, marca.nome, "o toque muda o tom", ratio(tocada, peca.fill), 1.06);

    // 2b. A MASSA — o botão cheio, que é a marca do personal em tamanho grande. Regra
    //     diferente da peça: aqui o MATIZ é preservado e quem garante existência é o anel.
    //     Então o par medido é (preenchimento OU anel) contra cada fundo.
    const massa = t.massa();
    par(chao, marca.nome, "tinta sobre a massa", ratio(massa.ink, massa.fill), TEXTO);
    for (const [gn, g] of chaos) {
      const existe = Math.max(ratio(massa.fill, g), massa.ring ? ratio(massa.ring, g) : 0);
      par(chao, marca.nome, `massa existe sobre ${gn}`, existe, UI);
    }
    par(
      chao,
      marca.nome,
      "a massa guarda o matiz da marca",
      separadas(massa.fill, marca.cor) ? 0 : 1,
      1,
    );

    // 3. A ABA ATIVA tem que DOMINAR a inativa — empate é hierarquia invertida.
    par(
      chao,
      marca.nome,
      "aba ativa domina",
      ratio(t.acentoEm(undefined, T.dock, t.dockActiveMin), T.dock),
      t.dockActiveMin,
    );

    // 4. A SEGUNDA COR. Tem que existir contra o chão E se separar da primeira: segunda
    //    cor que lê igual à primeira não cria hierarquia nenhuma, só gasta orçamento.
    const seg = t.acento(t.secundaria);
    par(chao, marca.nome, "segunda cor escreve", ratio(seg.text, T.bg), TEXTO);
    // A segunda série é desenhada pela Baseline contra `raised`, o fundo difícil: é ali
    // que ela tem que existir como TRAÇO (3:1) e como NÚMERO (4,5:1).
    const segRef = t.acento(t.secundaria, T.raised);
    par(chao, marca.nome, "segunda série risca", ratio(segRef.mark, T.raised), UI);
    par(chao, marca.nome, "segunda série escreve", ratio(segRef.text, T.raised), TEXTO);
    par(
      chao,
      marca.nome,
      "segunda cor se separa da marca",
      separadas(seg.piece.fill, peca.fill) ? 1 : 0,
      1,
    );

    // 4b. A CARA DO BOTÃO DESLIGADO. `AccentCTA` desligado pinta T.fill com tinta T.muted —
    //     um par que o produto usa em TODA tela e que nenhum medidor olhava, porque `fill`
    //     não é um dos quatro fundos. Num chão claro esse par pode desabar sem que uma
    //     única linha de código mude.
    par(chao, marca.nome, "rótulo do botão desligado", ratio(T.muted, T.fill), TEXTO);
    par(chao, marca.nome, "botão desligado existe no chão", ratio(T.fill, T.bg), 1.1);

    // 4c. AS TRÊS CORES DA TELA — marca, segunda e aviso — duas a duas. Uma hierarquia de
    //     três cores em que duas se confundem é uma hierarquia de duas mentindo ser de
    //     três.
    par(
      chao,
      marca.nome,
      "segunda cor se separa do aviso",
      separadas(t.acento(t.secundaria).text, t.errorInk) ? 1 : 0,
      1,
    );
    // 4d. A segunda cor também é tocada: se ela pinta peça, a peça responde ao dedo.
    const seg2 = t.acento(t.secundaria).piece;
    par(
      chao,
      marca.nome,
      "o toque muda o tom (segunda)",
      ratio(pressedFill(seg2.fill, seg2.ink), seg2.fill),
      1.06,
    );

    // 5. O AVISO. Se a marca do personal for vermelha, o erro em vermelho vira decoração:
    //    o aviso tem que continuar LEGÍVEL e SEPARÁVEL da marca.
    par(chao, marca.nome, "aviso legível", ratio(t.errorInk, T.bg), TEXTO);
    par(
      chao,
      marca.nome,
      "aviso não se confunde com a marca",
      separadas(t.errorInk, t.acento().text) ? 1 : 0,
      1,
    );
  }
}

// 6. AS QUATRO SUPERFÍCIES. O texto tem que continuar legível em cima de cada uma —
//    inclusive sobre o vidro, que é o único chão COMPOSTO do app. É aqui que a promessa
//    "a família não muda o valor da superfície, só a textura" vira número.
for (const chao of CHAOS_NOMES) {
  for (const superficie of ["solida", "contorno", "elevada", "vidro"]) {
    const t = criarTema({ ...APARENCIA_PADRAO, chao, superficie });
    const onde = `${chao}/${superficie}`;
    for (const tinta of ["ink", "muted", "muted2"]) {
      par(onde, "superfície", `${tinta} sobre a superfície`, ratio(t.T[tinta], t.FORMA.veuComposto), TEXTO);
    }
    par(onde, "superfície", "divider sobre a superfície", ratio(t.T.divider, t.FORMA.veuComposto), UI);
    // A superfície tem que EXISTIR contra o chão em que pousou. `contorno` está fora: ali
    // ela não pousa, ela é a borda — e a borda já é medida como elemento de UI.
    // Separação é LUZ ou SOMBRA — as duas contam, e no chão claro a sombra é a única que
    // sobra: branco sobre quase-branco tem 6,5 de L* de curso inteiro, e gastar tudo em
    // opacidade mataria o desfoque que dá nome à família. `contorno` está fora: ali a
    // superfície não pousa, ela É a borda, e a borda já é medida como elemento de UI.
    if (superficie !== "contorno") {
      const separa = separacao(t.FORMA.veuComposto, t.T.bg) + (t.FORMA.elevacao ? 5 : 0);
      par(onde, "superfície", "a superfície se afasta do chão", separa, 5);
    }
  }
}

// 7. A VOZ. Contraste é cego a fonte e `telas` só pergunta se montou — então até aqui a
//    única alavanca vendida como premium que ninguém media era justamente a que muda mais
//    a personalidade. O que dá para medir sem olho humano: o tamanho APARENTE do herói
//    (caixa alta em pontos) e do corpo (altura de x), que têm que bater com a referência
//    dentro de 3%, e a entrelinha, que não pode ser menor que a linha natural da face.
for (const voz of ["bloco", "tecnica", "editorial", "suave", "condensada"]) {
  const t = criarTema({ ...APARENCIA_PADRAO, voz });
  // `face`, e não `par`: `par()` é a função que registra a medida, e a sombra dela aqui
  // dentro fazia o arquivo inteiro morrer com "par is not a function".
  const face = VOZES[voz];
  const ref = criarTema({ ...APARENCIA_PADRAO, voz: "bloco" });
  const capRef = ref.TYPE.hero * VOZES.bloco.cap;
  const xRef = ref.TYPE.body * VOZES.bloco.x;
  const onde = `voz/${voz}`;
  // razão entre o aparente e a referência, normalizada para "quanto falta para 1"
  const perto = (a, b) => 1 - Math.abs(a - b) / b;
  par(onde, "tipografia", "herói do mesmo tamanho aparente", perto(t.TYPE.hero * face.cap, capRef), 0.97);
  par(onde, "tipografia", "corpo do mesmo tamanho aparente", perto(t.TYPE.body * face.x, xRef), 0.97);
  // TEXTO: a caixa da linha tem que caber a LINHA NATURAL da face, senão o Á, o Ç e o Õ
  // raspam a base — em português isso é metade das palavras.
  for (const degrau of ["label", "body"]) {
    par(onde, "tipografia", `entrelinha cabe (${degrau})`, t.LEAD[degrau], Math.ceil(t.TYPE[degrau] * face.linha));
  }
  // DISPLAY: entrelinha negativa é o desenho, não um defeito — o que não pode é a caixa
  // ficar menor que a própria letra com acento. Piso = caixa alta + espaço do acento.
  for (const degrau of ["title", "value", "hero", "mega"]) {
    par(onde, "tipografia", `acento cabe (${degrau})`, t.LEAD[degrau], Math.ceil(t.TYPE[degrau] * (face.cap + 0.15)));
  }
  // dígito de largura fixa: a face do NÚMERO tem que ser uma das que têm `tnum`.
  par(onde, "tipografia", "dígito de largura fixa", COM_TNUM.includes(face.numero) ? 1 : 0, 1);
}

// 7b. O CARDÁPIO DA API COBRE O DO APP? A whitelist do servidor e o cardápio da tela são
//     duas listas, em duas linguagens, em dois repositórios. Quando elas divergem o
//     personal escolhe uma voz, toca em Salvar e a API recusa — sem mensagem que explique,
//     porque o erro dela é um `invalido` genérico. Já aconteceu duas vezes nesta fábrica.
const CARDAPIO = {
  voz: Object.keys(VOZES),
  chao: CHAOS_NOMES,
  acao: ["linha", "centro", "caixa", "empilhada"],
  hierarquia: ["salto", "parelha", "eco"],
  anel: ["resgate", "sempre"],
  numero: ["empilhado", "linha", "cartaz"],
  contraste: ["normal", "alto"],
  forma: FORMAS,
  superficie: ["solida", "contorno", "elevada", "vidro"],
  densidade: DENSIDADES,
  movimento: ["seco", "normal", "generoso"],
  peso: ["fino", "medio", "grosso"],
};

try {
  const go = readFileSync(join(ROOT, "../linkgym-api/internal/owner/config.go"), "utf8");
  for (const [campo, valores] of Object.entries(CARDAPIO)) {
    const linha = go.match(new RegExp(`"${campo}":\\s*\\{([^}]*)\\}`))?.[1] ?? "";
    const naApi = [...linha.matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
    const faltando = valores.filter((v) => !naApi.includes(v));
    par("cardápio", "api", `a API aceita todo ${campo}`, valores.length - faltando.length, valores.length);
  }
} catch {
  // repo da API ausente (CI do app sozinho): não é reprova, é ausência de sujeito.
}

// 7c. O CARDÁPIO DO EDITOR COBRE O DA FÁBRICA, E CADA VALOR TEM NOME DE GENTE. A seção 7b
//     mede a ponta do servidor; esta mede a ponta do dedo, e as duas apodrecem pelo mesmo
//     motivo. Uma voz nova entra em `VOZES`, passa em todos os pares de tipografia — e o
//     editor não a oferece: a fábrica cresce e ninguém alcança o botão.
//     O segundo par é o que estava na tela: o rótulo de acessibilidade do chão lia o
//     IDENTIFICADOR (`Chão carvao`) com "Carvão" pronto na tabela duas linhas acima.
//     Identificador é chave de dado, não palavra — quem lê com leitor de tela ouvia o
//     nome do banco. Medir "existe rótulo próprio" cobre os dois: sem entrada na tabela,
//     o único texto que sobra para a tela é a chave.
{
  const tsx = readFileSync(join(ROOT, "src/screens/owner/Aparencia.tsx"), "utf8");
  const TABELAS = {
    voz: "VOZES_DO_CARDAPIO",
    chao: "NOMES_DO_CHAO",
    acao: "ACOES_DO_CARDAPIO",
    forma: "FORMAS",
    superficie: "SUPERFICIES",
    densidade: "DENSIDADES",
    movimento: "MOVIMENTOS",
    peso: "PESOS",
    hierarquia: "HIERARQUIAS",
    anel: "ANEIS",
    numero: "NUMEROS",
    contraste: "CONTRASTES",
  };
  for (const [campo, valores] of Object.entries(CARDAPIO)) {
    const bloco = tsx.match(new RegExp(`const ${TABELAS[campo]}[\\s\\S]*?\\n(\\]|\\});`))?.[0] ?? "";
    const rotulo = new Map();
    // Duas grafias no arquivo, e nenhuma delas vale a pena unificar só para o medidor: a
    // tabela do chão (`carvao: "Carvão"`) e as filas de alavanca (`{ valor, rotulo }`).
    for (const m of bloco.matchAll(/valor:\s*"([^"]+)",\s*rotulo:\s*"([^"]+)"/g)) rotulo.set(m[1], m[2]);
    for (const m of bloco.matchAll(/^\s+(\w+):\s*"([^"]+)",$/gm)) rotulo.set(m[1], m[2]);
    par(
      "cardápio",
      "editor",
      `o editor nomeia todo ${campo}`,
      valores.filter((v) => (rotulo.get(v) ?? v) !== v).length,
      valores.length,
    );
  }
  // A CONTA DAS COMBINAÇÕES. O docblock do editor dizia 2.268 e o README dizia 34.020 —
  // dois números, ambos velhos, para o mesmo produto cartesiano. Prosa que conta o
  // cardápio envelhece no dia em que o cardápio cresce, e ninguém recalcula à mão.
  const total = Object.values(CARDAPIO).reduce((n, v) => n * v.length, 1);
  const anunciado = (fonte) =>
    Number((fonte.match(/([\d.]{5,})\s*(?:combinações|aparências)/) ?? [])[1]?.replace(/\./g, ""));
  for (const [onde, fonte] of [
    ["editor", tsx],
    ["README", readFileSync(join(ROOT, "docs/aparencia/README.md"), "utf8")],
  ]) {
    par("cardápio", "conta", `o ${onde} anuncia a conta certa`, anunciado(fonte) === total ? 1 : 0, 1);
  }
}

// 8. GEOMETRIA. Não é cor, mas é o outro jeito de a customização estragar o app: densidade
//    compacta encolhendo o alvo do dedo, ou canto maior que a própria peça.
for (const densidade of DENSIDADES) {
  for (const forma of FORMAS) {
    const t = criarTema({ ...APARENCIA_PADRAO, densidade, forma });
    const onde = `${densidade}/${forma}`;
    // Os dois alvos de dedo do app, agora tirados do tema e não de um número no medidor.
    par(onde, "geometria", "alvo do dedo (chip)", t.FORMA.alturaChip, ALVO);
    par(onde, "geometria", "alvo do dedo (peça compacta)", t.FORMA.alturaMinima, ALVO);
    par(onde, "geometria", "alvo do dedo (botão)", t.FORMA.alturaAcao, ALVO);
    // Canto não pode passar da metade da peça — senão vira cápsula onde devia ser caixa.
    par(
      onde,
      "geometria",
      "canto cabe na peça",
      t.FORMA.alturaChip / 2 - Math.min(t.FORMA.raio, t.FORMA.alturaChip / 2) + 1,
      1,
    );
    // Vão mínimo entre irmãos: o PISO 8 da escala vale em qualquer densidade.
    par(onde, "geometria", "piso do vão", t.SPACE.hair, 8);
    // Margem do conteúdo: abaixo de 12 o texto encosta na borda da tela.
    par(onde, "geometria", "margem do conteúdo", t.T.pad, 12);
  }
}

// 9. A CÉLULA DE NÚMERO. A escolha de superfície tinha que CHEGAR à tela onde o app vive.
//    `FORMA.celula` é a outra metade da grade: onde o fio não pode existir — canto
//    arredondado, ou superfície que não é sólida — as células vizinhas do Metric
//    simplesmente encostavam, e nada além do vão as separava. Agora o separador é nomeado
//    (fio, caixa ou cartão) e carrega a TINTA que a tela pinta; aqui ela é medida contra o
//    chão em que a grade pousa, na mesma L* e no mesmo piso 5 da separação de superfície.
for (const chao of CHAOS_NOMES) {
  for (const forma of FORMAS) {
    for (const superficie of ["solida", "contorno", "elevada", "vidro"]) {
      const t = criarTema({ ...APARENCIA_PADRAO, chao, forma, superficie });
      const { modo, tinta } = t.FORMA.celula;
      const onde = `${chao}/${superficie}`;
      const quem = `célula ${forma}`;
      // Sombra separa tanto quanto luz — mesma conta da seção 6, pelo mesmo motivo.
      const separa =
        separacao(tinta, t.T.bg) + (modo === "cartao" && t.FORMA.elevacao ? 5 : 0);
      par(onde, quem, "duas células vizinhas se separam", separa, 5);
      // Um separador só, e nomeado: ramo esquecido devolve undefined e cai aqui.
      par(onde, quem, "o separador é um dos três", ["fio", "caixa", "cartao"].includes(modo) ? 1 : 0, 1);
      // O fio reto cruzando o arco é a razão de a grade ser condicional: se alguém a
      // soltar, esta linha reprova antes da tela.
      par(onde, quem, "o fio da grade não cruza o canto", modo === "fio" && t.FORMA.raio > 0 ? 0 : 1, 1);
    }
  }
}

// O PADRÃO É O APP DE HOJE. A célula do carvão reto e sólido continua sendo a grade de
// fios de `hairline`, sangrada: trocar o separador do padrão muda o pixel de quem nunca
// abriu a fábrica.
{
  const t = criarTema(APARENCIA_PADRAO);
  const c = t.FORMA.celula;
  par(
    "padrão",
    "célula",
    "o padrão continua na grade de fios",
    c.modo === "fio" && c.tinta === t.T.hairline && t.FORMA.inset === 0 ? 1 : 0,
    1,
  );
}

// 10. A PEÇA QUE POUSA NA SUPERFÍCIE LEVANTADA. `fill` e `hairline` são degraus contados a
//     partir de `bg` — e a peça não pousa em `bg`, pousa DENTRO da Band. Medido antes do
//     conserto, nos quatro chãos escuros: `fill` separava 8,3 de L* de `raised` contra os
//     14,9 que entrega no chão (meio degrau), e `hairline` separava 3,5, abaixo do piso 5
//     em que uma superfície começa a existir. Três peças caíam nisso — a calha do
//     cronômetro (Descanso), a barra apagada da semana (Compromisso) e o selo (Perfil) —
//     e nenhum par olhava para lá, porque nenhum media contra o fundo REAL.
for (const chao of CHAOS_NOMES) {
  for (const superficie of ["solida", "contorno", "elevada", "vidro"]) {
    const t = criarTema({ ...APARENCIA_PADRAO, chao, superficie });
    const { T } = t;
    // `veuComposto` é o fundo real da superfície levantada nas quatro famílias: `raised`
    // na sólida e na elevada, o chão na `contorno`, o véu já achatado no vidro.
    const g = t.FORMA.veuComposto;
    const onde = `${chao}/${superficie}`;
    const neutro = neutroSobre(g, T);
    // O degrau tem que valer no fundo real o mesmo que vale no chão. É o par que reprova
    // `T.fill` sobre `raised` e aprova `neutroSobre(veuComposto)`.
    par(onde, "neutro", "o degrau neutro guarda o passo", separacao(neutro, g), separacao(T.fill, T.bg));
    // E não pode passar do ponto: neutro que alcança o piso de TEXTO deixou de ser fundo
    // e virou tinta — a calha do cronômetro leria como a barra cheia.
    par(onde, "neutro", "o degrau neutro não vira tinta", TEXTO - ratio(neutro, g), 0);
    // O SELO. Conquistado é a peça da marca; não conquistado é o anel de `divider`. Os
    // dois têm que existir sobre a superfície — era isso que não dava para dizer quando os
    // dois estados pintavam `T.fill`.
    par(onde, "selo", "selo conquistado existe", ratio(t.acento().piece.fill, g), UI);
    par(onde, "selo", "anel do selo não conquistado existe", ratio(T.divider, g), UI);
    par(
      onde,
      "selo",
      "conquistado se separa de não conquistado",
      separadas(t.acento().piece.fill, g) ? 1 : 0,
      1,
    );
  }
}

// 10b. O ROSTO e o EIXO, que pousam sem saber onde: Avatar e Initials aparecem em lista
//      (chão), em cabeçalho e dentro de superfície; a Baseline desenha o eixo 0–100 sob o
//      medidor. Por isso a régua dos dois vale nos QUATRO fundos.
for (const chao of CHAOS_NOMES) {
  const { T } = criarTema({ ...APARENCIA_PADRAO, chao });
  for (const [gn, g] of [
    ["bg", T.bg],
    ["dock", T.dock],
    ["surface", T.surface],
    ["raised", T.raised],
  ]) {
    // O ANEL DA FOTO. Tinta translúcida composta sobre o fundo onde o rosto pousou: é o
    // que dá fronteira a um logo PNG de fundo branco no chão claro, que até aqui
    // terminava onde ninguém via.
    par(chao, "rosto", `anel da foto existe sobre ${gn}`, ratio(compor(T.ink, ANEL_DO_ROSTO, g), g), 1.06);
    // O ROSTO SEM COR não foi repintado, e este par é a razão: medido, `T.fill` se afasta
    // de todos os quatro fundos acima do piso 5 (14,9 do chão, 8,3 do levantado no escuro,
    // 21,5 no claro). Ele não some — o que sumia era a foto sem anel. O par fica como
    // guarda: chão novo que raspe isto reprova antes da tela.
    par(chao, "rosto", `rosto sem cor se afasta de ${gn}`, separacao(T.fill, g), 5);
    // O EIXO da Baseline é elemento de UI, não fio interno de bloco. Em `hairline` ele
    // media 1,23:1 contra o chão; em `divider` o contrato do token é justamente 3:1 nos
    // quatro fundos.
    par(chao, "eixo", `o eixo da baseline existe sobre ${gn}`, ratio(T.divider, g), UI);
  }
}

// 11. O MOVIMENTO. A alavanca é vendida como "a duração das transições" e alcançava duas
//     das quatro: `state` (220) e `enter` (340). As DUAS MAIORES esperas do sistema — a
//     virada da comemoração (3.700) e a chegada do botão (5.900) — ficavam fora da conta,
//     e são justamente as que o olho mede em segundos. O multiplicador não é copiado para
//     cá: é LIDO de `state`, que já obedecia, e cobrado das outras duas. `press` é o
//     contrário — resposta de dedo não é animação, e o par prova que ele NÃO andou.
{
  const ref = criarTema({ ...APARENCIA_PADRAO, movimento: "normal" });
  for (const movimento of ["seco", "normal", "generoso"]) {
    const t = criarTema({ ...APARENCIA_PADRAO, movimento });
    const mov = t.MOTION.state / ref.MOTION.state;
    const onde = `mov/${movimento}`;
    for (const degrau of ["turn", "reveal"]) {
      const esperado = Math.round(ref.MOTION[degrau] * mov);
      par(onde, "movimento", `${degrau} anda com a alavanca`, t.MOTION[degrau] === esperado ? 1 : 0, 1);
    }
    par(onde, "movimento", "o toque NÃO anda com a alavanca", t.MOTION.press === MOTION.press ? 1 : 0, 1);
  }
}

// 12. A ANATOMIA DO BOTÃO. `AccentCTA` é uma linha de colunas — [custo fantasma] rótulo
//     [custo] [seta] — e quem declara quais delas existem é `FORMA.acao`, não o
//     componente. Nas duas anatomias centradas só a coluna da direita existia: o `flex: 1`
//     do rótulo comia toda a sobra e o texto centrava na PORÇÃO ESQUERDA do botão, meia
//     coluna fora do centro. A conta abaixo é a do flexbox; a largura de referência do
//     custo não decide nada — o par mede SIMETRIA, ela só dá unidade ao desvio.
const CUSTO = 44; // "52 MIN" no degrau `label`
const SETA = 18; // IconCheck / IconChevron
for (const acao of ["linha", "centro", "caixa"]) {
  const t = criarTema({ ...APARENCIA_PADRAO, acao });
  const a = t.FORMA.acao;
  const vao = t.SPACE.tight; // o `gap` da linha do botão
  const esquerda = a.reservaMeta ? CUSTO + vao : 0;
  const direita = CUSTO + vao + (a.seta ? SETA + vao : 0);
  const onde = `acao/${acao}`;
  // Rótulo centrado desloca METADE da diferença entre as colunas laterais. Na anatomia de
  // linha ele mora à esquerda de propósito, e a sobra é o que empurra o custo para o fim.
  const desvio = a.alinha === "center" ? Math.abs(direita - esquerda) / 2 : 0;
  par(onde, "botão", "o rótulo centra no botão, não na sobra", 1 - desvio, 1);
  // E a seta não sobrevive ao centro: ela é o FECHO da linha, e no meio empurra o centro
  // óptico para o lado — a coluna fantasma consertaria a régua e estragaria o desenho.
  par(onde, "botão", "seta só na anatomia de linha", a.seta && a.alinha === "center" ? 0 : 1, 1);
}

// 11. O CAMPO DA COR LIVRE. As paletas `livre …` acima já provaram que a cor digitada
//     aguenta os mesmos pisos; falta provar as duas pontas do campo. Primeira: o que o
//     dedo escreve chega ao motor como a MESMA cor — grafia não pode virar cor nova.
for (const l of LIVRES) {
  par("cor livre", l.canonica, `"${l.digitado}" vira a cor`, l.cor === l.canonica ? 1 : 0, 1);
}
// Segunda: o campo RECUSA o que não é cor. Sem isto o documento aceitaria lixo e a
// recusa viria do servidor, 400 genérico, sem dizer o que estava errado.
for (const lixo of ["", " ", "#12345", "#1234567", "#gggggg", "vermelho", "rgb(1,2,3)", "#abc"]) {
  par("cor livre", "recusa", `"${lixo}" não é cor`, corLivre(lixo) ? 0 : 1, 1);
}
// E a fronteira, que é onde esta alavanca é nova de verdade: até aqui só saíam do app as
// dez do cardápio, que a API conhece. Agora sai o que o personal digitou — e a coluna
// `accent_color` tem régua própria, em outra linguagem, em outro repositório. Mesma
// classe de divergência que já quebrou o save duas vezes nesta fábrica (seção 7b).
try {
  const go = readFileSync(join(ROOT, "../linkgym-api/internal/owner/operacao.go"), "utf8");
  const fonte = go.match(/hexColor\s*=\s*regexp\.MustCompile\(`([^`]+)`\)/)?.[1];
  if (fonte) {
    const daApi = new RegExp(fonte);
    par(
      "cardápio",
      "api",
      "a API aceita a cor livre normalizada",
      LIVRES.filter((l) => daApi.test(l.cor)).length,
      LIVRES.length,
    );
  }
} catch {
  // repo da API ausente: ausência de sujeito, não reprova. Mesma regra da seção 7b.
}

// 11. O ÍCONE TEM CAIXA DE TINTA, e ela é uma só. Num dock ninguém lê "tamanho": lê a
//     mancha. Todos os ícones desenham num viewBox de 24 e todos os irmãos vivem entre
//     y=3 e y=21 — menos a haste do cifrão, que ia de 2,5 a 21,5 e por isso saía 22% mais
//     alta que os vizinhos na MESMA fila de 17pt. Nenhum medidor olhava para dentro do
//     SVG, então o defeito só aparecia no olho, e só de relance.
const ICONES = readFileSync(join(ROOT, "src/ui/Icons.tsx"), "utf8");
const CAIXA_DE_TINTA = { topo: 3, base: 21, lado: 24 };

/** A caixa de um `d` de SVG. Os pontos de controle da Bézier entram inteiros e o arco de
 *  meia-volta entra alargado pelo raio: os dois SUPERESTIMAM, que é o lado seguro de uma
 *  régua que pergunta "cabe dentro?" — ela nunca aprova por engano.
 *  ponytail: arco de large-arc-flag 0 é limitado pelos extremos, o que só vale até 90°;
 *  os quatro deste arquivo são quartos de círculo. Arco maior pede a conversão
 *  extremo→centro da spec. */
function caixa(d) {
  const toks = d.match(/[a-zA-Z]|-?(?:\d*\.\d+|\d+)/g) ?? [];
  const xs = [];
  const ys = [];
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let cmd = "M";
  let i = 0;
  const n = () => Number(toks[i++]);
  const ponto = (px, py) => {
    xs.push(px);
    ys.push(py);
  };
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    const bx = rel ? x : 0;
    const by = rel ? y : 0;
    switch (cmd.toUpperCase()) {
      case "Z":
        x = sx;
        y = sy;
        cmd = "M";
        continue;
      case "M":
        x = bx + n();
        y = by + n();
        sx = x;
        sy = y;
        ponto(x, y);
        // par solto depois de um moveto é lineto: é assim que "M5 1.5 9 8.5" desenha.
        cmd = rel ? "l" : "L";
        break;
      case "L":
      case "T":
        x = bx + n();
        y = by + n();
        ponto(x, y);
        break;
      case "H":
        x = bx + n();
        ponto(x, y);
        break;
      case "V":
        y = by + n();
        ponto(x, y);
        break;
      case "C": {
        const x1 = bx + n();
        const y1 = by + n();
        const x2 = bx + n();
        const y2 = by + n();
        x = bx + n();
        y = by + n();
        ponto(x1, y1);
        ponto(x2, y2);
        ponto(x, y);
        break;
      }
      case "S":
      case "Q": {
        const x1 = bx + n();
        const y1 = by + n();
        x = bx + n();
        y = by + n();
        ponto(x1, y1);
        ponto(x, y);
        break;
      }
      case "A": {
        const rx = n();
        const ry = n();
        n();
        const meiaVolta = n();
        n();
        const nx = bx + n();
        const ny = by + n();
        if (meiaVolta) {
          ponto(x - rx, y - ry);
          ponto(x + rx, y + ry);
          ponto(nx - rx, ny - ry);
          ponto(nx + rx, ny + ry);
        } else {
          ponto(nx, ny);
        }
        x = nx;
        y = ny;
        break;
      }
      default:
        i++;
    }
  }
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
}

for (const bloco of ICONES.split("export function ").slice(1)) {
  const nome = bloco.slice(0, bloco.indexOf("("));
  if (!bloco.includes('viewBox="0 0 24 24"')) continue;
  const ys = [];
  for (const m of bloco.matchAll(/\bd="([^"]+)"/g)) {
    const c = caixa(m[1]);
    ys.push(c.y0, c.y1);
  }
  for (const m of bloco.matchAll(/<Rect[^/]*?y=\{([\d.]+)\}[^/]*?height=\{([\d.]+)\}/g))
    ys.push(Number(m[1]), Number(m[1]) + Number(m[2]));
  for (const m of bloco.matchAll(/<Circle[^/]*?cy=\{([\d.]+)\}[^/]*?r=\{([\d.]+)\}/g))
    ys.push(Number(m[1]) - Number(m[2]), Number(m[1]) + Number(m[2]));
  if (!ys.length) continue;
  par("ícone", nome, "a tinta começa dentro da caixa comum", Math.min(...ys), CAIXA_DE_TINTA.topo);
  par(
    "ícone",
    nome,
    "a tinta termina dentro da caixa comum",
    CAIXA_DE_TINTA.lado - Math.max(...ys),
    CAIXA_DE_TINTA.lado - CAIXA_DE_TINTA.base,
  );
}

// 11b. A MARCA DE DIREÇÃO tem três estados e os três têm que PESAR o mesmo. O plano era um
//      quadrado de 3x3 num viewBox de 10 — 9 de tinta contra os 28 da seta — e, colado ao
//      fim do valor, não lia "não mudou": lia separador esquecido, "2 de 3 ·".
{
  const bloco = ICONES.slice(ICONES.indexOf("export function TrendMark"));
  const seta = caixa(bloco.match(/d=\{dir === "up" \? "([^"]+)"/)[1]);
  const r = bloco.match(/<Rect x=\{([\d.]+)\} y=\{[\d.]+\} width=\{([\d.]+)\} height=\{([\d.]+)\}/);
  const massaSeta = ((seta.x1 - seta.x0) * (seta.y1 - seta.y0)) / 2; // triângulo
  const massaPlano = Number(r[2]) * Number(r[3]);
  par(
    "marca de direção",
    "ícone",
    "o plano pesa o mesmo que a seta",
    1 - Math.abs(massaPlano - massaSeta) / massaSeta,
    0.9,
  );
  par(
    "marca de direção",
    "ícone",
    "o plano tem a base da seta",
    Number(r[1]) === seta.x0 && Number(r[1]) + Number(r[2]) === seta.x1 ? 1 : 0,
    1,
  );
}

// 12. O ALVO DO DEDO ONDE ELE FOI DESENHADO À MÃO. `alturaChip` já é medido na seção 8; o
//     que faltava é o par entre VIZINHOS. Na fila de avatar do Perfil o quadradinho de cor
//     mede 34 e paga hitSlop de 6 — 46 de alvo — e o botão "Foto" ao lado vivia da soma do
//     padding com a linha do rótulo: 33,5, abaixo do piso de 44, na mesma fila. Defeito que
//     mora no arquivo da tela, e por isso nenhuma volta pelo tema o alcançava.
const PERFIL = readFileSync(join(ROOT, "src/screens/student/Perfil.tsx"), "utf8");
const regra = (fonte, nome) => fonte.match(new RegExp(`\\b${nome}:\\s*\\{([^}]*)\\}`))?.[1] ?? "";
const lado = Number(regra(PERFIL, "corAvatar").match(/height:\s*([\d.]+)/)?.[1] ?? 0);
const folga = Number(PERFIL.match(/hitSlop=\{(\d+)\}/)?.[1] ?? 0);
par("perfil", "geometria", "o quadradinho de cor alcança o alvo", lado + 2 * folga, ALVO);
par(
  "perfil",
  "geometria",
  "o botão de foto pega o alvo do tema",
  /minHeight:\s*FORMA\.alturaChip/.test(regra(PERFIL, "fotoBtn")) ? 1 : 0,
  1,
);


// 13. A FIGURA — número e unidade na mesma fila, em dois degraus diferentes.
//
//     A BASE. A peça alinhava por `flex-end`, que é o FUNDO DA CAIXA e não a base. Abaixo
//     da letra cada degrau sobra uma quantidade diferente — a meia-folga da entrelinha,
//     `(LEAD - corpo x linha natural) / 2`, MAIS a descida da face — então alinhar pelo
//     rodapé desalinha as duas bases por construção, e o erro anda com a voz. Alinhando
//     pela BASE ele é exatamente zero em qualquer face, inclusive naquelas cujo descender
//     este arquivo não sabe ler; por isso o par lê do arquivo o alinhamento que a peça
//     DECLARA, em vez de fingir que mediu um layout. O número que ele reporta sob o
//     alinhamento velho é só a PARCELA que o tema conhece — a meia-folga, 4,5pt no `value`
//     do bloco e 12,6 no `mega` da suave, sem contar a descida. Com ela, os 18 pares
//     voz x papel reprovam.
//
//     A FOLGA. Era o literal `gap: 6`: 0,33em de espaço ao lado do `value` e 0,15em ao
//     lado do `mega`, o mesmo vão para um número de 41pt e para um de 92. Medida no corpo
//     da UNIDADE, que é quem encosta ou descola: abaixo de 0,25em ela gruda no algarismo,
//     acima de 0,45em lê como palavra solta ao lado dele.
const FIGURA_TSX = readFileSync(join(ROOT, "src/ui/Figure.tsx"), "utf8");
const naBase = /alignItems:\s*"baseline"/.test(FIGURA_TSX);
for (const voz of Object.keys(VOZES)) {
  const t = criarTema({ ...APARENCIA_PADRAO, voz });
  const face = VOZES[voz];
  const meiaSobra = (degrau) => (t.LEAD[degrau] - t.TYPE[degrau] * face.linha) / 2;
  for (const [papel, unidade] of Object.entries(UNIDADE_DE)) {
    const onde = `voz/${voz}`;
    const quem = `figura ${papel}`;
    const erro = naBase ? 0 : Math.abs(meiaSobra(papel) - meiaSobra(unidade));
    // meio ponto: menos de dois pixels em 3x, e o piso do que o olho separa numa fila.
    par(onde, quem, "número e unidade na mesma base", 0.5 - erro, 0);
    const em = folgaDaUnidade(t.TYPE[papel]) / t.TYPE[unidade];
    par(onde, quem, "a unidade não encosta no número", em, 0.25);
    par(onde, quem, "a unidade não se solta do número", 0.45 - em, 0);
  }
}

// 14. A SEGUNDA COR NO GRÁFICO — a única peça do app onde a marca entra no DADO.
//
//     Os dois gráficos codificavam SÉRIE só por degrau de cinza: na semana do aluno hoje
//     era `ink` e os dias que passaram eram `divider`; no fio do personal hoje era `ink` e
//     os outros dias eram `muted`. Duas séries no mesmo eixo de tom, e a marca do personal
//     — que é a razão de o app ser branco — não chegava justamente onde o aluno olha. A
//     PRIMÁRIA continua proibida ali (a massa dela é da ação, e a semana não pode competir
//     com o botão de hoje); quem entra é a SEGUNDA cor, que já existe derivada e medida.
//
//     Quem NÃO é medido aqui é o dado: hoje continua em tinta neutra nos dois gráficos, e
//     os dois primeiros pares leem isso do ARQUIVO DA TELA. Sem eles a régua mediria uma
//     separação contra `T.ink` que a tela poderia ter deixado de pintar — o par passaria
//     verde sobre um gráfico de uma cor só.
//
//     As duas réguas são as que já existem, uma para cada pergunta: RAZÃO DE CONTRASTE (3,
//     piso de elemento de interface) responde "a barra existe sobre o fundo"; L* responde
//     "dá para ver que são DUAS" — e é ela que vale entre as duas séries vizinhas, porque
//     contraste não enxerga duas superfícies, só legibilidade.
//
//     Os fundos são diferentes de propósito, e é o que a `acento(cor, fundo)` cobra: a
//     barra do aluno pousa na Band (o chão hoje, `raised` se a decisão do dono virar — as
//     duas são medidas, o gráfico não pode depender de qual), e a parte feita do dia no
//     fio do personal pousa DENTRO da calha, que não é nenhum dos quatro fundos.
const PROGRESSO_TSX = readFileSync(join(ROOT, "src/screens/student/Progresso.tsx"), "utf8");
const PAINEL_TSX = readFileSync(join(ROOT, "src/screens/owner/Painel.tsx"), "utf8");
par(
  "gráfico",
  "progresso",
  "o dado de hoje fica em tinta neutra",
  /week\.length - 1 \? T\.ink : referencia/.test(PROGRESSO_TSX) ? 1 : 0,
  1,
);
par(
  "gráfico",
  "painel",
  "o dado de hoje fica em tinta neutra",
  /d\.today \? T\.ink : referencia/.test(PAINEL_TSX) ? 1 : 0,
  1,
);
for (const chao of CHAOS_NOMES) {
  for (const marca of MARCAS) {
    const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor });
    const { T, secundaria } = t;
    // A semana do aluno: peça pequena e REPETIDA que pinta área, então `piece` — o mesmo
    // motor do chip e do rosto, que garante o piso contra o fundo difícil da paleta.
    const semana = t.acento(secundaria).piece.fill;
    for (const [gn, g] of [
      ["bg", T.bg],
      ["raised", T.raised],
    ]) {
      par(chao, marca.nome, `barra da semana existe sobre ${gn}`, ratio(semana, g), UI);
      par(chao, marca.nome, `barra da semana se vê sobre ${gn}`, separacao(semana, g), 5);
    }
    par(chao, marca.nome, "barra da semana se separa de hoje", separacao(semana, T.ink), 5);
    // O fio do personal: a parte feita pousa na calha, e `mark` é traço/marca (piso 3).
    const fio = t.acento(secundaria, T.fill).mark;
    par(chao, marca.nome, "fio: a referência existe na calha", ratio(fio, T.fill), UI);
    par(chao, marca.nome, "fio: a referência se vê na calha", separacao(fio, T.fill), 5);
    par(chao, marca.nome, "fio: a referência se separa de hoje", separacao(fio, T.ink), 5);
  }
}

// 15. O CHÃO LIVRE. A doc vendia sete chãos; a promessa do dono é "todas as cores do
//     sistema", e sete não é todas. O que mudou é a ENTRADA, não o motor: `escada(bg)`
//     resolve os outros nove degraus até bater os pisos, e a prova honesta é a mesma da
//     cor da marca livre — AMOSTRAGEM, porque hex não é lista. Aqui a grade é
//     matiz x croma x claridade, dentro da janela de L* que o próprio solver desenha.
//
//     O segundo par é o que impede o gerador de virar um segundo chão: os SETE continuam
//     sendo dado, e `escada()` só roda para hex livre. Se um dia ele se afastar do dado,
//     é porque a fórmula deixou de descrever a escada que a tela desenha — e aí quem está
//     errado é a fórmula.
{
  const dentroDaJanela = [
    ...[0, 1, 2, 5, 8, 12, 16, 20, 22],
    ...[78, 82, 86, 90, 92, 94],
  ];
  // A SEMENTE é fabricada aqui, não lida de lugar nenhum: o ponto desta seção é justamente
  // o chão que NÃO está em tabela. Busca binária na luminosidade até pousar no L* pedido.
  const emLstar = (h, s, alvo) => {
    let lo = 0, hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (L(hslHex(h, s, mid)) < alvo) lo = mid; else hi = mid;
    }
    return hslHex(h, s, (lo + hi) / 2);
  };
  function hslHex(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
      : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return "#" + t.map((v) => Math.round(Math.max(0, Math.min(1, v + m)) * 255).toString(16).padStart(2, "0")).join("");
  }
  for (let h = 0; h < 360; h += 30) {
    for (const s of [0, 0.05, 0.1, 0.2, 0.35, 0.6, 1]) {
      for (const alvo of dentroDaJanela) {
        const semente = emLstar(h, s, alvo);
        const t = criarTema({ ...APARENCIA_PADRAO, chao: semente });
        const { T } = t;
        const onde = `livre ${alvo}`;
        const quem = `h${h} s${s}`;
        for (const gn of ["bg", "dock", "surface", "raised"]) {
          for (const tinta of ["ink", "muted", "muted2"]) {
            par(onde, quem, `${tinta} sobre ${gn}`, ratio(T[tinta], T[gn]), TEXTO);
          }
          par(onde, quem, `divider sobre ${gn}`, ratio(T.divider, T[gn]), UI);
        }
        // a superfície levantada tem que EXISTIR contra o chão gerado
        par(onde, quem, "raised se afasta do chão", separacao(T.raised, T.bg), 5);
        // e a marca do personal tem que continuar existindo em cima dele
        const massa = t.massa();
        par(onde, quem, "tinta sobre a massa", ratio(massa.ink, massa.fill), TEXTO);
      }
    }
  }
  // O GERADOR VIGIADO PELO DADO. `ink` do breu é branco puro à mão (L* 100) e a escada
  // para em 93: é o maior desvio, e é no degrau menos sensível do conjunto.
  for (const nome of CHAOS_NOMES) {
    const dado = CHAOS[nome];
    const gerado = escada(dado.bg);
    for (const degrau of ["dock", "surface", "raised", "hairline", "fill", "divider", "muted2", "muted", "ink"]) {
      par("chão gerado", nome, `${degrau} bate o dado`, 8 - separacao(gerado[degrau], dado[degrau]), 0);
    }
  }
}

// 16. AS FOLHAS — DUAS SUPERFÍCIES NUNCA PODEM SER O MESMO PIXEL. Era o defeito medido da
//     alavanca mais cara do cardápio: `solida` e `elevada` saíam IDÊNTICAS byte a byte em
//     carvão, breu, grafite e tabaco (o fio de luz era calculado e descartado), e no dock
//     21 dos 42 pares colidiam porque o chrome só perguntava `vidro`. Agora a decisão é UM
//     objeto por estrato, e é este objeto que a tela pinta e este medidor lê.
const SUPERFICIES_TODAS = ["solida", "contorno", "elevada", "vidro"];
/** O ÚNICO par de superfícies que pode colidir, e só na MOLDURA. O dock continua OPACO em
 *  `contorno` de propósito — moldura transparente deixa a lista correr por baixo do
 *  rótulo —, e não sobra nenhum canal onde `contorno` possa diferir de `solida` ali.
 *
 *  Até este ciclo a isenção não estava escrita: ela era comprada com uma MENTIRA. A folha
 *  do chrome declarava `borda: 0` na sólida e `borda` no contorno, e as duas molduras
 *  pintavam `FORMA.borda` de qualquer jeito — esta régua lia uma diferença que o pixel não
 *  tinha e marcava 0 colisões enquanto o pixel marcava 15 de 42. A folha ficou honesta (o
 *  traço da moldura é UM só, espessura e cor, e é o que a tela pinta), o par passou a
 *  colidir de verdade, e a isenção passou a estar aqui, onde se lê. A §33 mede o PIXEL com
 *  exatamente esta isenção e nenhuma outra. */
const COLIDE_DE_PROPOSITO = (estrato, a, b) =>
  estrato === "chrome" && a === "solida" && b === "contorno";
for (const chao of CHAOS_NOMES) {
  const temas = SUPERFICIES_TODAS.map((s) => criarTema({ ...APARENCIA_PADRAO, chao, superficie: s }));
  for (const estrato of ["peca", "chrome", "miuda"]) {
    for (let i = 0; i < temas.length; i++) {
      for (let j = i + 1; j < temas.length; j++) {
        if (COLIDE_DE_PROPOSITO(estrato, SUPERFICIES_TODAS[i], SUPERFICIES_TODAS[j])) continue;
        const a = JSON.stringify(temas[i].FORMA.folha[estrato]);
        const b = JSON.stringify(temas[j].FORMA.folha[estrato]);
        par(
          chao,
          `folha ${estrato}`,
          `${SUPERFICIES_TODAS[i]} ≠ ${SUPERFICIES_TODAS[j]}`,
          a === b ? 0 : 1,
          1,
        );
      }
    }
  }
  for (const [i, s] of SUPERFICIES_TODAS.entries()) {
    const t = temas[i];
    for (const estrato of ["peca", "chrome", "miuda"]) {
      const f = t.FORMA.folha[estrato];
      // O TEXTO POUSA NO COMPOSTO, que é o pixel real — não no fundo que a peça declara.
      //
      // `muted2` só é exigido nos dois estratos que pousam num dos QUATRO FUNDOS. Na peça
      // pequena preenchida ele NÃO é exigido, e isso é a decisão, não uma isenção: ele é
      // calibrado contra os quatro fundos e mede 4,52 contra `raised` com folga zero, então
      // qualquer degrau acima dele o derruba. Quem responde por "o que se escreve aqui" é
      // `folha.tinta`, que a própria folha declara e o par seguinte cobra — assim a regra
      // é de construção e não de disciplina de quem escreve a tela.
      const tintas = estrato === "miuda" ? ["ink", "muted"] : ["ink", "muted", "muted2"];
      for (const tinta of tintas) {
        par(`${chao}/${s}`, `folha ${estrato}`, `${tinta} sobre a folha`, ratio(t.T[tinta], f.composto), TEXTO);
      }
      par(`${chao}/${s}`, `folha ${estrato}`, "a folha declara tinta de apoio", ratio(f.tinta, f.composto), TEXTO);
      // O FIO DE LUZ é MATERIAL, não elemento de interface: ele não carrega informação e
      // não se toca, então quem responde por ele é L* ("dá para ver que a peça tem
      // altura"), e não a razão de contraste ("dá para ler"). Um fio a 3:1 sobre a
      // superfície não seria fio de luz, seria borda.
      if (f.aresta) {
        const alfa = Number(f.aresta.match(/([\d.]+)\)$/)[1]);
        const composto = compor(t.T.ink, alfa, f.composto);
        par(`${chao}/${s}`, `folha ${estrato}`, "o fio de luz se vê", separacao(composto, f.composto), 5);
      }
    }
    // UM SINAL DE ALTURA POR CHÃO, e exatamente um: fio no escuro, sombra no claro. Dois
    // traços na mesma aresta leem como erro de renderização.
    if (s === "elevada") {
      const f = t.FORMA.folha.peca;
      const sinais = (f.aresta ? 1 : 0) + (f.sombra.shadowOpacity > 0 ? 1 : 0);
      par(chao, "folha peca", "elevada tem UM sinal de altura", sinais === 1 ? 1 : 0, 1);
    }
  }
}

// 17. A FORÇA DA TINTA. A alavanca só SOBE — piorar contraste não é um valor de cardápio —
//     então o par não é um piso, é uma DESIGUALDADE contra o app de hoje. E o multiplicador
//     tem que parar no chão: se ele alcançasse o acento, a marca do personal seria
//     repintada em nome da acessibilidade, que é a traição que accentMassa existe para
//     impedir.
for (const chao of CHAOS_NOMES) {
  for (const marca of MARCAS.slice(0, 12)) {
    const base = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor });
    const alto = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor, contraste: "alto" });
    for (const tinta of ["divider", "muted2", "muted"]) {
      for (const gn of ["bg", "raised"]) {
        par(chao, marca.nome, `alto não piora ${tinta}/${gn}`,
          ratio(alto.T[tinta], alto.T[gn]) - ratio(base.T[tinta], base.T[gn]), 0);
      }
    }
    // a ordem dos degraus não pode virar: tinta muda não pode passar tinta de texto.
    par(chao, marca.nome, "alto preserva a ordem das tintas",
      separacao(alto.T.muted, alto.T.bg) > separacao(alto.T.muted2, alto.T.bg) &&
      separacao(alto.T.muted2, alto.T.bg) > separacao(alto.T.divider, alto.T.bg) ? 1 : 0, 1);
    par(chao, marca.nome, "alto não repinta a marca",
      alto.massa().fill === base.massa().fill ? 1 : 0, 1);
    par(chao, marca.nome, "tinta sobre a massa em alto", ratio(alto.massa().ink, alto.massa().fill), TEXTO);
  }
}

// 18. O PAR DE AÇÕES. O personal não escolhe o peso do botão principal — ele escolhe
//     quanto o segundo recua. Com degrau neutro FIXO isso reprovaria em 53 de 210 pares
//     (o primário deixaria de dominar por √2 em L*); com o degrau DERIVADO da presença do
//     primário, a dominância é verdadeira por construção e o par vira prova.
for (const chao of CHAOS_NOMES) {
  for (const marca of MARCAS.slice(0, 12)) {
    for (const hierarquia of ["salto", "parelha", "eco"]) {
      const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor, hierarquia });
      const { T } = t;
      for (const fundo of [T.bg, T.raised]) {
        const s = t.secundario(fundo);
        const onde = `${chao}/${hierarquia}`;
        const pousa = s.fundo === "transparent" ? fundo : s.fundo;
        par(onde, marca.nome, "o rótulo do segundo se lê", ratio(s.tinta, pousa), TEXTO);
        // O affordance nunca some: sem preenchimento, a borda é a única coisa que faz o
        // botão parecer tocável, e ela não pode cair para zero em peso nenhum.
        par(onde, marca.nome, "o segundo botão tem fronteira",
          s.fundo === "transparent" ? s.larguraDaBorda : separacao(pousa, fundo), 0.5);
        // DOMINÂNCIA: presença = |ΔL*| contra o fundo onde os dois pousam.
        const presencaPrim = Math.abs(L(t.massa().fill) - L(fundo));
        const presencaSec = s.fundo === "transparent" ? 0 : Math.abs(L(s.fundo) - L(fundo));
        par(onde, marca.nome, "o principal domina o segundo",
          presencaPrim - presencaSec * Math.SQRT2, 0);
      }
    }
  }
}

// 19. O ANEL DECLARADO. Derivar só pelo piso contra o chão devolve a PRÓPRIA cor do
//     preenchimento nos 130 pares que já limpam o chão sozinhos — anel a 1,00:1, uma
//     alavanca vendida que não aparece em 62% das marcas. As duas condições vivem no mesmo
//     laço, e é isso que estes três pares provam.
for (const chao of CHAOS_NOMES) {
  for (const marca of MARCAS) {
    const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor, anel: "sempre" });
    const m = t.massa();
    par(chao, marca.nome, "o anel existe quando declarado", m.ring ? 1 : 0, 1);
    if (m.ring) {
      const dificil = [t.T.bg, t.T.dock, t.T.surface, t.T.raised]
        .map((g) => ratio(m.ring, g))
        .sort((a, b) => a - b)[0];
      par(chao, marca.nome, "o anel existe contra o chão", dificil, UI);
      par(chao, marca.nome, "o anel se separa do preenchimento", ratio(m.ring, m.fill), 1.3);
    }
  }
}

// 20. O CABIMENTO DA CIFRA — a régua que faltava, e a única metade da fábrica que ainda
//     não tinha nenhuma. Medido antes: a célula de 3 colunas em `arejada`+`macia` tem 53pt
//     úteis e quatro algarismos no degrau `value` pedem ~98 — e a combinação já é vendida
//     (o kit Boutique é papel/macia/arejada, e a Hoje pede 3 colunas). `escala` conta
//     fontSize, `contraste` mede cor, `telas` só pergunta se montou: ninguém perguntava se
//     o número CABE. A resposta ao estouro NÃO pode ser encolher a fonte — isso quebra a
//     catraca `escala` e transforma o app em template. É recusar a coluna.
const LARGURA_DA_TELA = 375;
for (const densidade of DENSIDADES) {
  for (const forma of FORMAS) {
    for (const voz of Object.keys(VOZES)) {
      for (const numero of ["empilhado", "linha", "cartaz"]) {
        const t = criarTema({ ...APARENCIA_PADRAO, densidade, forma, voz, numero });
        const util = LARGURA_DA_TELA - 2 * t.FORMA.inset;
        const onde = `${densidade}/${forma}`;
        const quem = `${voz}/${numero}`;
        const n = t.FORMA.numero.colunas(3, util, 4);
        par(onde, quem, "a cifra ganha ao menos uma coluna", n, 1);
        par(onde, quem, "a cifra nunca ganha mais do que pediram", 3 - n, 0);
        // e onde ele deu N colunas, o número de fato cabe naquela largura
        const precisa =
          4 * t.TYPE.value * AVANCO_DO_DIGITO +
          folgaDaUnidade(t.TYPE.value) +
          2 * t.TYPE[UNIDADE_DE.value] * AVANCO_DO_DIGITO;
        par(onde, quem, "quatro algarismos cabem na coluna", util / n - 2 * t.SPACE.step - precisa, 0);
      }
    }
  }
}

// 21. O AVISO NÃO É A MARCA. Defeito em PRODUÇÃO no padrão de fábrica: `PERIGO` e
//     `APARENCIA_PADRAO.primaria` são a MESMA cor, e `separadas` aceita 1,3 de razão de
//     contraste como prova de separação — o que passa com Δmatiz ZERO. Medido nos sete
//     chãos com a marca padrão: Δmatiz 0° e Δrazão 1,30, encostado no limiar, ou seja, o
//     estúdio escreve erro num vermelho que é a própria marca 30% mais clara. A régua nova
//     vale SÓ neste par: a segunda cor tem outro trabalho (ser contável num gráfico) e ali
//     1,3 basta.
for (const chao of CHAOS_NOMES) {
  for (const marca of MARCAS) {
    const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor });
    par(chao, marca.nome, "o aviso não é a marca",
      separadasNoMatiz(t.errorInk, t.acento().text) ? 1 : 0, 1);
    par(chao, marca.nome, "o aviso se lê", ratio(t.errorInk, t.T.bg), TEXTO);
  }
}

// 22. A FOLHA NO CHÃO QUE NINGUÉM DIGITOU AINDA. A seção 15 percorre o chão livre com a
//     superfície de fábrica; a 16 percorre as quatro superfícies nos SETE chãos de tabela.
//     O produto delas — o personal que digita um vinho qualquer e escolhe `vidro` — não era
//     medido por nenhuma delas, e é exatamente onde a fábrica cresceu: o chão deixou de ser
//     lista no mesmo ciclo em que a superfície deixou de ser um ternário na tela.
//     `contraste` entra no mesmo laço porque ele repinta o chão INTEIRO e a folha é
//     derivada dele: medir a folha só na tinta de fábrica seria medir metade da alavanca.
{
  // A SEMENTE é fabricada aqui pelo mesmo motivo da seção 15: o ponto é o chão que não
  // está em tabela nenhuma. Busca binária na luminosidade até pousar no L* pedido.
  const hslHex = (h, s, l) => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
      : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return "#" + t.map((v) => Math.round(Math.max(0, Math.min(1, v + m)) * 255).toString(16).padStart(2, "0")).join("");
  };
  const emLstar = (h, s, alvo) => {
    let lo = 0, hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (L(hslHex(h, s, mid)) < alvo) lo = mid; else hi = mid;
    }
    return hslHex(h, s, (lo + hi) / 2);
  };
  for (let h = 0; h < 360; h += 30) {
    for (const s of [0.05, 0.35, 1]) {
      for (const alvo of [1, 8, 20, 80, 88, 94]) {
        const semente = emLstar(h, s, alvo);
        for (const contraste of ["normal", "alto"]) {
          const temas = SUPERFICIES_TODAS.map((sup) =>
            criarTema({ ...APARENCIA_PADRAO, chao: semente, superficie: sup, contraste }));
          const onde = `livre ${alvo}/${contraste}`;
          const quem = `h${h} s${s}`;
          for (const estrato of ["peca", "chrome", "miuda"]) {
            for (const [i, sup] of SUPERFICIES_TODAS.entries()) {
              const f = temas[i].FORMA.folha[estrato];
              const { T } = temas[i];
              // O que se escreve na folha: a tinta que ela declara e a tinta de texto do
              // produto, as duas contra o PIXEL composto — não contra o fundo que a peça
              // pede. Sem isto, `alto` podia fortalecer o chão e afrouxar a folha.
              par(onde, `${quem} ${sup}/${estrato}`, "a folha declara tinta de apoio", ratio(f.tinta, f.composto), TEXTO);
              par(onde, `${quem} ${sup}/${estrato}`, "ink sobre a folha", ratio(T.ink, f.composto), TEXTO);
              if (estrato === "chrome") {
                // A MOLDURA é irmã do conteúdo numa coluna: ela não se separa por altura
                // (o dock anda 1,1 de L* contra o chão, de propósito) — quem a delimita é
                // a RÉGUA de topo, e traço que delimita responde a contraste de UI, não a
                // L*. Onde a folha declara aresta, quem responde é o fio de luz abaixo.
                if (!f.aresta) {
                  const regua = f.corDaBorda === "transparent" ? T.divider : f.corDaBorda;
                  par(onde, `${quem} ${sup}/${estrato}`, "a régua da moldura delimita", ratio(regua, f.composto), UI);
                }
              } else {
                // A peça tem que EXISTIR contra o que está atrás dela: ou por borda
                // própria, ou por altura. A peça pequena pousa na peça, não no chão — é o
                // degrau que `preenchimentoMiudo` derruba até a tinta voltar ao piso.
                const atras = estrato === "miuda" ? temas[i].FORMA.folha.peca.composto : T.bg;
                par(onde, `${quem} ${sup}/${estrato}`, "a peça tem fronteira",
                  f.borda > 0 ? f.borda : separacao(f.composto, atras), f.borda > 0 ? 0.5 : 5);
              }
              if (f.aresta) {
                const alfa = Number(f.aresta.match(/([\d.]+)\)$/)[1]);
                par(onde, `${quem} ${sup}/${estrato}`, "o fio de luz se vê",
                  separacao(compor(T.ink, alfa, f.composto), f.composto), 5);
              }
            }
            for (let i = 0; i < SUPERFICIES_TODAS.length; i++) {
              for (let j = i + 1; j < SUPERFICIES_TODAS.length; j++) {
                if (COLIDE_DE_PROPOSITO(estrato, SUPERFICIES_TODAS[i], SUPERFICIES_TODAS[j])) continue;
                par(onde, `${quem} ${estrato}`,
                  `${SUPERFICIES_TODAS[i]} ≠ ${SUPERFICIES_TODAS[j]}`,
                  JSON.stringify(temas[i].FORMA.folha[estrato]) === JSON.stringify(temas[j].FORMA.folha[estrato]) ? 0 : 1, 1);
              }
            }
          }
          // UM sinal de altura, no chão gerado também: fio no escuro, sombra no claro.
          const fe = temas[SUPERFICIES_TODAS.indexOf("elevada")].FORMA.folha.peca;
          par(onde, quem, "elevada tem UM sinal de altura",
            (fe.aresta ? 1 : 0) + (fe.sombra.shadowOpacity > 0 ? 1 : 0) === 1 ? 1 : 0, 1);
        }
      }
    }
  }
}

// 23. O SEGUNDO BOTÃO POUSA NA FOLHA, NÃO NO CHÃO. A seção 18 mede o par de ações contra
//     `bg` e `raised`, que é onde ele pousava quando a superfície era um ternário. Agora o
//     rodapé de ação pinta `folha.chrome` e a Band pinta `folha.peca` — e no vidro esses
//     dois pixels não são nenhum dos quatro fundos. Um segundo botão derivado do chão e
//     desenhado sobre a folha chega com METADE do degrau: é o defeito nomeado nos sete
//     GhostCTA que ainda não declaram `fundo`, e este laço é a régua que o cobra.
for (const chao of CHAOS_NOMES) {
  for (const superficie of SUPERFICIES_TODAS) {
    for (const hierarquia of ["salto", "parelha", "eco"]) {
      for (const marca of MARCAS.slice(0, 12)) {
        const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor, superficie, hierarquia });
        for (const estrato of ["peca", "chrome"]) {
          const fundo = t.FORMA.folha[estrato].composto;
          const s = t.secundario(fundo);
          const pousa = s.fundo === "transparent" ? fundo : s.fundo;
          const onde = `${chao}/${superficie}`;
          const quem = `${hierarquia} ${estrato}`;
          par(onde, quem, "o rótulo do segundo se lê na folha", ratio(s.tinta, pousa), TEXTO);
          par(onde, quem, "o segundo botão tem fronteira na folha",
            s.fundo === "transparent" ? s.larguraDaBorda : separacao(s.fundo, fundo), 0.5);
          const presencaSec = s.fundo === "transparent" ? 0 : Math.abs(L(s.fundo) - L(fundo));
          par(onde, quem, "o principal domina o segundo na folha",
            Math.abs(L(t.massa().fill) - L(fundo)) - presencaSec * Math.SQRT2, 0);
        }
      }
    }
  }
}

// 24. A ALTURA DO PAR DE AÇÕES, e a anatomia que a seção 12 não percorria. `empilhada` põe
//     o custo na SEGUNDA linha: é o único valor do cardápio que muda a ALTURA do botão, e
//     altura de botão é o único número da fábrica que dois componentes diferentes têm que
//     concordar — o principal e o fantasma aparecem lado a lado em dez telas, e o principal
//     mais BAIXO que o secundário é hierarquia invertida.
//
//     A conta abaixo é a do flexbox, como na seção 12: caixa de linha + respiro. O respiro
//     é `SPACE.step` porque é o token que os dois componentes pagam. `alturaAcao` conta com
//     `SPACE.tight` — por isso ele é medido aqui como PISO (a tela paga pelo menos ele) e
//     não como o token único de altura que o comentário dele promete. É dívida declarada
//     entre a fábrica e a tela, não regressão: com o mesmo respiro nos dois o par nunca
//     inverte, e é isso que o segundo par prova.
for (const acao of ["linha", "centro", "caixa", "empilhada"]) {
  for (const densidade of DENSIDADES) {
    for (const voz of Object.keys(VOZES)) {
      const t = criarTema({ ...APARENCIA_PADRAO, acao, densidade, voz });
      const a = t.FORMA.acao;
      const onde = `acao/${acao}`;
      const quem = `${densidade}/${voz}`;
      // O piso do dedo não é alavanca: `empilhada` só SOBE a partir dele.
      par(onde, quem, "alvo do dedo (botão)", t.FORMA.alturaAcao, ALVO);
      const respiro = 2 * t.SPACE.step;
      const principal = Math.max(t.FORMA.alturaAcao, respiro + (a.empilha ? t.LEAD.body + t.LEAD.label : t.LEAD.body));
      const segundo = Math.max(t.FORMA.alturaAcao, respiro + t.LEAD.body);
      par(onde, quem, "o principal nunca é mais baixo que o segundo", principal - segundo, 0);
      // E não vira laje: um botão de duas linhas cresce UMA linha de rótulo, não mais.
      par(onde, quem, "o empilhado cresce uma linha, não um bloco", segundo + t.LEAD.label - principal, 0);
      // `alturaAcao` é PISO: a tela nunca desenha um botão menor do que a fábrica declara.
      par(onde, quem, "alturaAcao é piso, não teto", principal - t.FORMA.alturaAcao, 0);
      // Sem coluna lateral não há o que compensar: seta e custo fantasma são da linha.
      par(onde, quem, "o empilhado não reserva coluna lateral",
        a.empilha && (a.seta || a.reservaMeta) ? 0 : 1, 1);
    }
  }
}

// 25. O CABIMENTO DA CIFRA NA LARGURA REAL E NO DÍGITO REAL. A seção 20 pergunta pela
//     largura da TELA e por quatro algarismos. Nenhuma das duas é o que a grade recebe: ela
//     aparece solta na rolagem, dentro de uma Band (que paga margem E respiro) e dentro de
//     uma opção larga (que paga de novo) — e a diferença entre essas larguras é exatamente
//     a coluna que cabe ou não cabe. O dígito também é medido, não suposto: cobrar quatro
//     algarismos de uma fila de "5" recusaria coluna que cabia folgada.
//
//     A alavanca `numero` é o que faz esta régua existir: `columns` virou PEDIDO e quem
//     responde é a fábrica. A resposta ao estouro é recusar a coluna — encolher a fonte
//     quebraria a catraca `escala` e transformaria o app em template.
for (const densidade of DENSIDADES) {
  for (const forma of FORMAS) {
    for (const voz of Object.keys(VOZES)) {
      for (const numero of ["empilhado", "linha", "cartaz"]) {
        const t = criarTema({ ...APARENCIA_PADRAO, densidade, forma, voz, numero });
        const { FORMA, TYPE, SPACE, T } = t;
        // Os três sítios reais da grade, cada um tirado dos tokens que o encaixam: a
        // margem da tela, a margem da peça (inset + respiro) e a da opção dentro dela.
        const larguras = [
          ["solta", LARGURA_DA_TELA - 2 * T.pad],
          ["peça", LARGURA_DA_TELA - 2 * FORMA.inset - 2 * T.pad],
          ["opção", LARGURA_DA_TELA - 2 * FORMA.inset - 4 * T.pad],
        ];
        for (const [sitio, largura] of larguras) {
          for (const pedidas of [1, 2, 3]) {
            for (const digitos of [1, 2, 4]) {
              const n = FORMA.numero.colunas(pedidas, largura, digitos);
              const onde = `${densidade}/${forma}`;
              const quem = `${voz}/${numero} ${sitio} ${pedidas}x${digitos}`;
              par(onde, quem, "a cifra ganha ao menos uma coluna", n, 1);
              par(onde, quem, "a cifra nunca ganha mais do que pediram", pedidas - n, 0);
              const precisa =
                digitos * TYPE.value * AVANCO_DO_DIGITO +
                folgaDaUnidade(TYPE.value) +
                2 * TYPE[UNIDADE_DE.value] * AVANCO_DO_DIGITO;
              par(onde, quem, "os algarismos cabem na coluna que ele deu",
                largura / n - 2 * SPACE.step - precisa, 0);
            }
          }
        }
      }
    }
  }
}

// 26. O AVISO PINTA NOS QUATRO FUNDOS. `errorInk` era a única tinta do sistema que
//     resolvia contra UM chão (`T.bg`) e era escrita em todos — o que `chaoDificil` existe
//     para impedir e o que `escada()` já fazia com `Math.min(...fundos)`. Nenhum par
//     olhava para lá: as seções 5 e 21 mediam o aviso SÓ contra `bg`, exatamente o fundo
//     contra o qual ele fora resolvido, então a régua confirmava a própria conta.
//     Medido antes do conserto: 636 de 1.680 abaixo de 4,5, pior 3,94, em 27 das 30
//     marcas. O padrão de fábrica estava a salvo por ACIDENTE — a marca vermelha dispara
//     o `afastar` de matiz, que empurra a tinta para longe sem que ninguém peça.
for (const chao of CHAOS_NOMES) {
  for (const marca of MARCAS) {
    for (const contraste of ["normal", "alto"]) {
      const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor, contraste });
      for (const g of ["bg", "dock", "surface", "raised"]) {
        par(`${chao}/${contraste}`, marca.nome, `o aviso se lê sobre ${g}`, ratio(t.errorInk, t.T[g]), TEXTO);
      }
    }
  }
}
// E na FOLHA, que é onde os sítios reais estão: o aviso de PerfilTime e o de Aparência são
// `<Txt color={errorInk}>` DENTRO de Band levantada, e a borda de erro do Campo é o único
// sinal de que o hex digitado não serve — ela pousa na folha miúda, que no vidro não é
// nenhum dos quatro fundos. Texto responde a 4,5; borda é elemento de interface, e a
// pergunta dela é outra: "dá para ver o traço", que é 3.
for (const chao of CHAOS_NOMES) {
  for (const superficie of SUPERFICIES_TODAS) {
    for (const marca of MARCAS.slice(0, 12)) {
      const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor, superficie });
      const onde = `${chao}/${superficie}`;
      for (const estrato of ["peca", "chrome"]) {
        par(onde, marca.nome, `o aviso se lê na folha ${estrato}`,
          ratio(t.errorInk, t.FORMA.folha[estrato].composto), TEXTO);
      }
      par(onde, marca.nome, "a borda de erro do Campo se vê",
        ratio(t.errorInk, t.FORMA.folha.miuda.composto), UI);
    }
  }
}

// 27. O SEGUNDO BOTÃO DESLIGADO. A seção 18 e a 23 medem o par de ações LIGADO; o estado
//     que ninguém media é o que duas telas do produto entregam de saída — o "Descansar" do
//     Descanso e o "Agora não" da Retomada NASCEM desligados. `GhostCTA` escolhia `T.muted`
//     por conta própria, e `T.muted` é calibrado contra os quatro fundos do produto, não
//     contra o preenchimento que `parelha` deriva em tempo de execução. Medido antes do
//     conserto, 7 chãos x 30 marcas x 3 fundos: salto 0/630, eco 0/630, parelha 441/630 —
//     70% —, pior 1,00. No padrão de fábrica, sobre o preenchimento que `parelha` deriva:
//     ligado 6,55:1, desligado 2,53:1. O rótulo simplesmente não existia.
//
//     O segundo par é o que impede o conserto de virar outro defeito: tinta apagada que
//     limpa o piso ANDANDO pode chegar mais forte que a ligada, e aí "desligado" lê como
//     o botão mais gritante da tela. Desligado é um degrau ABAIXO, nunca acima.
for (const chao of CHAOS_NOMES) {
  for (const hierarquia of ["salto", "parelha", "eco"]) {
    for (const marca of MARCAS) {
      const t = criarTema({ ...APARENCIA_PADRAO, chao, primaria: marca.cor, hierarquia });
      const { T } = t;
      for (const [nome, fundo] of [
        ["chão", t.T.bg],
        ["peça", t.FORMA.folha.peca.composto],
        ["moldura", t.FORMA.folha.chrome.composto],
      ]) {
        const s = t.secundario(fundo);
        const pousa = s.fundo === "transparent" ? fundo : s.fundo;
        const quem = `${hierarquia} ${nome}`;
        par(chao, `${marca.nome} ${quem}`, "o rótulo desligado se lê", ratio(s.desligada, pousa), TEXTO);
        par(chao, `${marca.nome} ${quem}`, "desligado não grita mais que ligado",
          ratio(s.tinta, pousa) - ratio(s.desligada, pousa), 0);
        // O PAR QUE ACUSA COLAPSO, e não só inversão. O de cima é uma DESIGUALDADE contra
        // zero, e o filtro de reprovação é `medido + 1e-9 < minimo`: a identidade exata
        // passa por construção. Medido antes do conserto, 7 chãos x 52 marcas x 3 pousos:
        // `eco` colapsava em 1.092 de 1.092 — 100% das paletas, nos três pousos —, e as
        // duas telas que nascem com o botão desligado (o "Descansar" do Descanso e o
        // "Agora não" da Retomada) não tinham estado nenhum.
        //
        // A régua é L*, e não razão: "desligado" é uma diferença que o olho tem que ver, e
        // 5 é o degrau em que duas tintas passam a ser duas — o mesmo piso que decide se
        // uma superfície existe.
        //
        // A CONDIÇÃO É MEDIDA, não isentada à mão: o degrau só é exigido onde a escada de
        // tintas do produto TEM um degrau para dar naquele pixel — uma tinta que limpe
        // 4,5:1, seja mais fraca que a ligada e se separe 5 de L* dela. Em `eco` ela
        // existe e é `muted2` (7,8 a 8,9 de L* abaixo de `muted`, limpando 4,52 a 5,67 nos
        // três pousos): a régua acusa. Em `parelha` o rótulo ligado já pousa a 4,51–4,66
        // sobre um cinza médio derivado, onde `muted` mede 1,59 e `muted2` 1,18 — não há
        // degrau, e a régua não inventa um. Esse é o defeito que sobra, e ele é do FUNDO
        // do botão, não da tinta: está nomeado no relatório.
        // Um degrau é um passo NA DIREÇÃO do fundo, não um salto por cima dele: sobre o
        // cinza médio que `parelha` deriva no breu, `ink` branco limpa 4,54 contra os 4,62
        // do preto ligado — mais fraco, sim, mas do outro lado do pixel. Trocar a polaridade
        // do rótulo não é apagá-lo, é reacendê-lo invertido.
        const doLadoDe = (c) => L(c) > L(pousa) === L(s.tinta) > L(pousa);
        const degrauPossivel = [T.muted2, T.muted, T.ink].some(
          (c) =>
            ratio(c, pousa) >= TEXTO &&
            ratio(c, pousa) <= ratio(s.tinta, pousa) &&
            doLadoDe(c) &&
            separacao(c, s.tinta) >= 5,
        );
        par(chao, `${marca.nome} ${quem}`, "onde a escada tem degrau, desligado desce",
          !degrauPossivel || separacao(s.tinta, s.desligada) >= 5 ? 1 : 0, 1);
      }
    }
  }
}

// 28. A FOLHA NO CHÃO LIVRE, MEDIDA COM AS TINTAS QUE A TELA ESCREVE. A seção 22 percorre
//     a folha no chão livre, mas pergunta pela tinta que a PRÓPRIA folha declara
//     (`f.tinta`, que é resolvida contra o composto) e por `ink`. `muted2` é texto real em
//     58 sítios — é ele que o `<Txt tone="dim">` pinta dentro da Band — e é calibrado
//     contra os quatro fundos, não contra o pixel COMPOSTO que o véu do vidro põe no lugar
//     de `bg`. Medido antes do conserto, 224 chãos livres (8 matizes x 4 cromas x 7
//     claridades) x 4 superfícies x 2 contrastes: 9 reprovam em `peca` e 9 em `chrome`,
//     todos em `vidro`, pior 3,36.
//
//     `miuda` fica de fora de propósito, e não por conveniência: a peça pequena não recebe
//     `muted2` de tela nenhuma — ela declara a própria tinta (`folha.miuda.tinta`, que é o
//     placeholder do Campo) e `preenchimentoMiudo` a resolve contra `muted`. Cobrar
//     `muted2` ali seria cobrar uma tinta que ninguém pinta.
{
  const hslHex = (h, s, l) => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
      : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return "#" + t.map((v) => Math.round(Math.max(0, Math.min(1, v + m)) * 255).toString(16).padStart(2, "0")).join("");
  };
  const emLstar = (h, s, alvo) => {
    let lo = 0, hi = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (L(hslHex(h, s, mid)) < alvo) lo = mid; else hi = mid;
    }
    return hslHex(h, s, (lo + hi) / 2);
  };
  // A GRADE. A anterior era 8 matizes de 45° x 4 cromas x 7 claridades = 224 sementes, e o
  // "0 de 119.103" que ela marcava era propriedade da AMOSTRAGEM, não do tema: o furo do
  // véu (`divider` a 2,97 sobre `vidro`) mora em h225 s0,6 L*1 e vizinhos, e a grade velha
  // não passava perto de nenhum deles — 45° de passo pula o matiz inteiro, e L* saltava de
  // 1 direto para 6. Aqui são 24 matizes de 15° x 8 cromas x 17 claridades = 3.264
  // sementes, com a claridade adensada onde o chão livre quebra (L* 1 a 20, de 1 em 1 e
  // depois de 2 em 2) e não onde ela nunca quebrou. Custo: 4 segundos. O chão é vendido
  // como livre; a régua tem que ser tão livre quanto ele.
  const CROMAS = [0.05, 0.15, 0.25, 0.35, 0.45, 0.6, 0.8, 1];
  const CLARIDADES = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 17, 20, 80, 84, 88, 91, 94];
  // Os quatro tokens que a folha tem que aguentar, com o piso de cada um. São os MESMOS
  // quatro de `PISOS_SOBRE_O_VEU` em src/theme.ts, e é de propósito: o helper recua a
  // opacidade do véu enquanto algum deles não limpa, e esta é a régua que prova que ele
  // recuou o bastante. Uma lista aqui mais curta que a de lá seria a régua concordando com
  // o conserto por não olhar.
  const SOBRE_A_FOLHA = [["muted2", TEXTO], ["muted", TEXTO], ["ink", TEXTO], ["divider", UI]];
  for (let h = 0; h < 360; h += 15) {
    for (const s of CROMAS) {
      for (const alvo of CLARIDADES) {
        const semente = emLstar(h, s, alvo);
        for (const superficie of SUPERFICIES_TODAS) {
          for (const contraste of ["normal", "alto"]) {
            const t = criarTema({ ...APARENCIA_PADRAO, chao: semente, superficie, contraste });
            const onde = `livre ${alvo}/${contraste}`;
            const quem = `h${h} s${s} ${superficie}`;
            // OS ESTRATOS SÃO LIDOS DA FOLHA, não escritos à mão: o dia em que um estrato
            // novo nascer, ele entra nesta régua sem ninguém lembrar dela. `miuda` sai por
            // um motivo escrito, não por conveniência — ela não recebe `muted2` de tela
            // nenhuma: declara a própria tinta (o placeholder do Campo), que
            // `preenchimentoMiudo` resolve contra `muted`, e a §16 já cobra `folha.tinta`.
            for (const estrato of Object.keys(t.FORMA.folha).filter((e) => e !== "miuda")) {
              const composto = t.FORMA.folha[estrato].composto;
              for (const [tinta, piso] of SOBRE_A_FOLHA) {
                par(onde, `${quem}/${estrato}`, `${tinta} sobre a folha`, ratio(t.T[tinta], composto), piso);
              }
            }
          }
        }
      }
    }
  }
}

// 29. O QUE A TELA PINTA DA FOLHA, e não o que a folha declara. A seção 16 compara o
//     OBJETO `Folha` entre as quatro superfícies e passa — mas o objeto difere em
//     `aresta`, e a aresta era o único campo que a peça pequena NÃO consumia: ali a folha
//     zera a sombra, então o fio é o sinal inteiro de altura. Medido antes do conserto,
//     comparando só os campos que cada peça de fato lia: `solida` e `elevada` saíam
//     IDÊNTICAS em 7 de 7 chãos nas duas peças — 14 dos 84 pares —, e são 12 `<Campo>`
//     mais 12 `<Choice>`, 24 dos 34 sítios da folha miúda no app.
//
//     Por isso esta régua LÊ O ARQUIVO, no mesmo desenho da seção 13, que lê da Figure o
//     alinhamento que ela declara: descobre quais campos da folha cada peça consome e
//     cobra que o conjunto CONSUMIDO — não o conjunto declarado — separe as quatro
//     superfícies. Uma peça que parasse de ler `aresta` reprovaria de novo no ato.
const SEM_COMENTARIO = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
const CAMPOS_DA_FOLHA = ["fundo", "composto", "vidro", "borda", "corDaBorda", "tinta", "aresta", "sombra"];
/** Os nomes que a peça deu ao estrato (`const f = FORMA.folha.miuda`, `const chrome =
 *  FORMA.folha.chrome`) mais o acesso direto — para não confundir `FORMA.borda`, que é o
 *  traço da superfície grande, com `folha.miuda.borda`, que é o da peça. O estrato é
 *  PARÂMETRO porque a §33 faz a mesma pergunta à moldura: quais campos este arquivo de
 *  fato consome. */
const consumidos = (src, estrato = "miuda") => {
  const limpo = SEM_COMENTARIO(src);
  const nomes = [...limpo.matchAll(new RegExp(`(\\w+)\\s*=\\s*[\\w.]*\\bfolha\\.${estrato}\\b(?!\\.)`, "g"))].map((m) => m[1]);
  const diretos = [...limpo.matchAll(new RegExp(`([\\w.]*\\bfolha)\\.${estrato}\\.`, "g"))].map((m) => `${m[1]}.${estrato}`);
  const alvos = [...nomes, ...diretos];
  return CAMPOS_DA_FOLHA.filter((c) =>
    alvos.some((a) => new RegExp(`${a.replace(/\./g, "\\.")}\\.${c}\\b`).test(limpo)),
  );
};
const PECAS_MIUDAS = ["src/ui/Campo.tsx", "src/ui/Choice.tsx"];
for (const arquivo of PECAS_MIUDAS) {
  const src = readFileSync(join(ROOT, arquivo), "utf8");
  const campos = consumidos(src);
  const nome = arquivo.split("/").pop();
  // A espessura do traço da peça pequena é a que a FOLHA declara — `FORMA.borda` é o
  // traço da superfície GRANDE, e no vidro a folha miúda pede `fio`, metade dele: o chip
  // saía com o dobro da espessura do campo de texto ao lado dele, na mesma fila. (O traço
  // do estado de ERRO é outra coisa e continua sendo `FORMA.borda`: ali ele carrega
  // informação em vez de delimitar material.)
  par("peças", nome, "a espessura do traço vem da folha", campos.includes("borda") ? 1 : 0, 1);
  par("peças", nome, "a peça lê mais de um campo da folha", campos.length, 2);
  for (const chao of CHAOS_NOMES) {
    const pintado = SUPERFICIES_TODAS.map((sup) => {
      const f = criarTema({ ...APARENCIA_PADRAO, chao, superficie: sup }).FORMA.folha.miuda;
      return JSON.stringify(campos.map((c) => f[c]));
    });
    for (let i = 0; i < SUPERFICIES_TODAS.length; i++) {
      for (let j = i + 1; j < SUPERFICIES_TODAS.length; j++) {
        par(
          chao,
          `${nome} pinta`,
          `${SUPERFICIES_TODAS[i]} ≠ ${SUPERFICIES_TODAS[j]}`,
          pintado[i] === pintado[j] ? 0 : 1,
          1,
        );
      }
    }
  }
}

// 30. A TINTA QUE A PEÇA DE FATO ESCREVE POUSA NO PIXEL EM QUE ELA DE FATO POUSA.
//
//     A seção 16 cobra o texto contra a folha, mas ela cobra os TOKENS DO SISTEMA — e na
//     folha miúda ela ISENTA `muted2` de propósito, dizendo que quem responde por "o que se
//     escreve aqui" é `folha.tinta`. Isso só é verdade se a peça PERGUNTAR pela folha. A
//     Figure não perguntava: cravava `tone="dim"`, que é exatamente `muted2`, e a legenda
//     do número caía dentro da célula preenchida do MetricGrid em 11 das 12 geometrias —
//     sete chamadas com `note`, inclusive as duas da ofensiva do aluno em Perfil.
//
//     Por isso a régua LÊ DOS ARQUIVOS, no desenho da seção 13: de Txt.tsx, em que token
//     cada `tone` resolve e qual é o tom PADRÃO do papel; de Figure.tsx, que tom a `note`
//     declara (ou não declara). Cobrar `muted` direto seria cobrar disciplina de quem
//     escreve a tela; cobrar o tom LIDO é cobrar o pixel.
//
//     Medido sob a regra velha (`tone="dim"` → `muted2`): 14 dos 84 pares abaixo de 4,5:1,
//     pior 3,34 em breu/sólida sobre a peça miúda; 3,38 no tabaco e 3,42 no carvão, sempre
//     na miúda. Sob a regra de hoje, 0.
const TXT_TSX = SEM_COMENTARIO(readFileSync(join(ROOT, "src/ui/Txt.tsx"), "utf8"));
/** `tone` → token do tema, lido da folha de estilo do próprio Txt. */
const TOKEN_DO_TOM = Object.fromEntries(
  [...TXT_TSX.matchAll(/(\w+):\s*\{\s*color:\s*T\.(\w+)\s*\}/g)].map((m) => [m[1], m[2]]),
);
/** o tom que o papel `note` ganha quando a chamada NÃO crava nenhum. */
const TOM_PADRAO = /role === "note" \? "(\w+)"/.exec(TXT_TSX)?.[1] ?? "ink";
/** os tons que a `note` da Figure declara — um por sítio, e o padrão quando ela cala. */
const TONS_DA_NOTA = [...SEM_COMENTARIO(FIGURA_TSX).matchAll(/role="note"([^>]*)>/g)].map(
  (m) => m[1].match(/tone="(\w+)"/)?.[1] ?? TOM_PADRAO,
);
par("figura", "note", "a legenda declara um tom que existe", TONS_DA_NOTA.length, 1);
for (const chao of CHAOS_NOMES) {
  for (const superficie of SUPERFICIES_TODAS) {
    const t = criarTema({ ...APARENCIA_PADRAO, chao, superficie });
    // OS TRÊS PIXELS QUE A FIGURE ALCANÇA. Ela aparece solta na rolagem (o chão), dentro de
    // uma Band (a folha da peça) e — em 11 das 12 geometrias — dentro da célula solta do
    // MetricGrid, que é a folha miúda. É esta terceira que o `dim` não aguentava.
    const pousos = [
      ["chão", t.T.bg],
      ["peça", t.FORMA.folha.peca.composto],
      ["miúda", t.FORMA.folha.miuda.composto],
    ];
    for (const tom of new Set(TONS_DA_NOTA)) {
      const tinta = t.T[TOKEN_DO_TOM[tom] ?? "ink"];
      for (const [nome, fundo] of pousos) {
        par(`${chao}/${superficie}`, `note tone=${tom}`, `a legenda se lê na ${nome}`, ratio(tinta, fundo), TEXTO);
      }
    }
  }
}

//     E O SEPARADOR DA CÉLULA, pela mesma razão ao contrário: a seção 9 mede
//     `FORMA.celula.tinta` nos TRÊS modos, e Metric.tsx só o punha nas bordas da grade de
//     fios. Nos outros dois ele era medido e não pintado — 21 dos 28 pares — e um token
//     medido que ninguém pinta é pior que token nenhum: ele dá verde sem nada atrás.
//
//     `cartao` é o único modo em que o token honestamente NÃO é separador: ali ele vale
//     exatamente o pixel em que o cartão pousa (`folha.peca.composto`, nos 56 casos), e
//     quem separa duas vizinhas é a folha miúda que a tela pinta. O par cobra essa
//     IDENTIDADE em vez de fingir que a tela pinta o token — no dia em que ela deixar de
//     valer, a seção 9 estará medindo um terceiro pixel e ninguém saberia.
const METRIC_TSX = SEM_COMENTARIO(readFileSync(join(ROOT, "src/ui/Metric.tsx"), "utf8"));
const PINTA_TINTA = {
  fio: /border(?:Right|Bottom)Color:\s*tinta\b/.test(METRIC_TSX),
  caixa: /borderColor:[^;\n]*modo === "caixa"[^;\n]*\btinta\b/.test(METRIC_TSX),
};
for (const chao of CHAOS_NOMES) {
  for (const forma of FORMAS) {
    for (const superficie of SUPERFICIES_TODAS) {
      const t = criarTema({ ...APARENCIA_PADRAO, chao, forma, superficie });
      const { modo, tinta } = t.FORMA.celula;
      const onde = `${chao}/${superficie}`;
      const quem = `célula ${forma}`;
      if (modo === "cartao") {
        par(onde, quem, "em cartão a tinta é o pixel de trás", tinta === t.FORMA.folha.peca.composto ? 1 : 0, 1);
      } else {
        par(onde, quem, `a tela pinta a tinta que se mede (${modo})`, PINTA_TINTA[modo] ? 1 : 0, 1);
      }
    }
  }
}

// 31. TRAÇO QUE DELIMITA ≠ TRAÇO QUE É MATERIAL — as duas perguntas que a seção 16 tinha
//     juntado numa só, e a régua que teria pego a regressão mais cara deste ciclo.
//
//     São réguas diferentes porque são PERGUNTAS diferentes:
//       DELIMITA  — "dá para ver onde a barra acaba e o conteúdo começa": o traço carrega
//                   informação de estrutura, então responde a CONTRASTE, 3:1 contra os
//                   DOIS lados (a moldura e o chão). É a doutrina da SPEC §3: delimitador
//                   é sempre `divider` ou `ink`.
//       MATERIAL  — "dá para ver que a peça tem altura": não carrega informação e não se
//                   toca, então responde a L* >= 5 contra o próprio composto. É o fio de
//                   luz, e é a régua que a seção 16 aplica em `folha.*.aresta`.
//
//     O que aconteceu: o rodapé de toda tela e a barra de abas dos dois navegadores
//     trocaram `T.divider` (3:1 garantido contra os quatro fundos, por construção da
//     escada) por `chrome.aresta || T.divider` — e a aresta é MATERIAL. A seção 16 mediu a
//     aresta pela régua dela e deu verde; ninguém perguntou se a régua ainda delimitava.
//
//     A régua LÊ O ARQUIVO, no desenho das seções 29 e 30: não adianta medir `T.divider`
//     se a tela pinta outra coisa. Ela extrai a EXPRESSÃO que cada moldura declara e a
//     resolve contra o tema vivo — trocar a expressão por qualquer material volta a
//     reprovar no ato.
//
//     Medido sob a regra velha (`chrome.aresta || T.divider`), 7 chãos x 4 superfícies x 2
//     molduras x 2 lados = 112 pares: 44 reprovam (pior 1,10 em papel/vidro contra o
//     conteúdo, e ali o traço também sumia pela régua de material, com 3,5 de ΔL*). Sob a
//     regra de hoje, 0.
const MOLDURAS = [
  ["src/ui/Screen.tsx", "dock", "o rodapé empilhado"],
  ["src/nav/tabChrome.tsx", "bar", "a barra de abas"],
];
/** A expressão que o bloco de estilo declara para o traço de cima — texto cru, sem
 *  comentário, para o `||` do código não ser confundido com o `||` de uma prosa. */
const tracoDeclarado = (arquivo, bloco) => {
  const limpo = SEM_COMENTARIO(readFileSync(join(ROOT, arquivo), "utf8"));
  const corpo = new RegExp(`\\b${bloco}:\\s*\\{([\\s\\S]*?)\\n    \\},`).exec(limpo)?.[1] ?? "";
  return /borderTopColor:\s*([^,\n]+)/.exec(corpo)?.[1].trim() ?? "";
};
/** Resolve a expressão contra o tema vivo. `||` é a única composição que o estilo usa, e
 *  cor com alfa vira o pixel COMPOSTO sobre o lado que se está medindo — é esse pixel que
 *  o olho vê, e era exatamente ele que ninguém estava medindo. */
const resolver = (expr, t, lado) => {
  const escopo = {
    "T.divider": t.T.divider,
    "T.hairline": t.T.hairline,
    "T.ink": t.T.ink,
    "chrome.aresta": t.FORMA.folha.chrome.aresta,
    "chrome.corDaBorda": t.FORMA.folha.chrome.corDaBorda,
    "peca.aresta": t.FORMA.folha.peca.aresta,
  };
  for (const termo of expr.split("||").map((x) => x.trim())) {
    const cor = escopo[termo];
    if (!cor) continue;
    const alfa = /([\d.]+)\)\s*$/.exec(cor);
    return alfa ? compor(t.T.ink, Number(alfa[1]), lado) : cor;
  }
  return "";
};
for (const [arquivo, bloco, quem] of MOLDURAS) {
  const expr = tracoDeclarado(arquivo, bloco);
  par("molduras", quem, "a tela declara um traço de cima", expr ? 1 : 0, 1);
  for (const chao of CHAOS_NOMES) {
    for (const superficie of SUPERFICIES_TODAS) {
      const t = criarTema({ ...APARENCIA_PADRAO, chao, superficie });
      const onde = `${chao}/${superficie}`;
      // OS DOIS LADOS do delimitador: o pixel da moldura e o pixel do conteúdo. Um traço
      // que só limpa 3:1 de um lado não separa nada — ele vira borda de um só.
      for (const [nome, lado] of [
        ["a moldura", t.FORMA.folha.chrome.composto],
        ["o conteúdo", t.T.bg],
      ]) {
        const cor = resolver(expr, t, lado);
        par(onde, quem, `o traço delimita contra ${nome}`, cor ? ratio(cor, lado) : 0, UI);
      }
    }
  }
}

// 33. O QUE A MOLDURA PINTA SEPARA AS FAMÍLIAS — e o "pinta" é lido do arquivo, como nas
//     §§29/30/31. É a régua que a §16 não podia dar, porque a §16 compara o OBJETO
//     `Folha`, e o objeto tinha um campo que a tela não lia.
//
//     O pecado, medido: o ciclo 7 tirou `chrome.aresta` do traço das duas molduras (com
//     razão — ali o traço DELIMITA, e a aresta é MATERIAL), e com isso o dock passou a ler
//     `fundo` e `sombra` da folha e mais nada. No chão escuro `elevacao` é 0 — sombra preta
//     sobre preto não existe —, então `solida`, `contorno` e `elevada` entregavam um dock
//     BYTE A BYTE idêntico. O personal paga pela superfície mais cara do cardápio e recebe
//     a mais barata no rodapé de 20 telas e nas duas barras de abas.
//
//       o que se compara                       pares que COLIDEM
//       objeto `folha.chrome` (§16)                  0 / 42
//       pixel que a moldura pintava                 15 / 42
//       pixel que a moldura pinta agora              7 / 42  (só `solida`×`contorno`)
//
//     Contra a moldura de antes do conserto, esta régua reprova 16 dos 70 pares (5 pares
//     por chão x 7 chãos x 2 molduras, já fora o par de propósito): os 8 de
//     `carvão·breu·grafite·tabaco × {solida×elevada, contorno×elevada}`, nas duas molduras.
//
//     A saída NÃO foi um segundo traço. A aresta de cima da moldura já é o delimitador, e
//     dois traços na mesma aresta leem como erro de renderização — a lei que o próprio
//     `Screen.tsx:206` escreve. É UM traço que responde às DUAS perguntas: `reguaDoDock`,
//     no tema, o pinta em `divider` (3:1 contra os dois lados, garantido pela escada) e o
//     troca por `ink` exatamente onde a sombra não pode existir. Medido nos quatro chãos
//     escuros: `ink` mede 17,0–20,3:1 contra a moldura e 17,5–21,0:1 contra o conteúdo
//     (contra o piso de 3), e separa 49,3 a 56,8 de L* do `divider` que as outras famílias
//     pintam (contra o piso de 5). As duas réguas, no mesmo pixel, com folga de uma ordem
//     de grandeza — e a §31 continua cobrando a primeira delas.
//
//     Por que não migrar a altura para o FUNDO do dock, que era o outro caminho: no chão
//     escuro a escada inteira de `dock` até `raised` mede 5,2 a 6,3 de L*, então não cabe
//     lá dentro um degrau de 5; e o primeiro degrau ACIMA de `raised` que separa 5 é
//     `fill`, onde `divider` cai para 2,42–2,76:1 e a régua morre. Levantar o fundo custa
//     o delimitador. Trocar a cor do traço não custa nada.
for (const [arquivo, bloco, quem] of MOLDURAS) {
  const src = readFileSync(join(ROOT, arquivo), "utf8");
  const campos = consumidos(src, "chrome");
  // Sem estes dois a régua abaixo é vácuo: uma moldura que não lê o traço da folha volta a
  // pintar `T.divider` cru e a colidir, e o laço de baixo compararia uma lista vazia.
  par("molduras", quem, "a moldura lê o traço da folha", campos.includes("corDaBorda") ? 1 : 0, 1);
  par("molduras", quem, "a moldura lê mais de dois campos da folha", campos.length, 3);
  for (const chao of CHAOS_NOMES) {
    const temas = SUPERFICIES_TODAS.map((sup) => criarTema({ ...APARENCIA_PADRAO, chao, superficie: sup }));
    const pintado = temas.map((t) => JSON.stringify(campos.map((c) => t.FORMA.folha.chrome[c])));
    for (let i = 0; i < SUPERFICIES_TODAS.length; i++) {
      for (let j = i + 1; j < SUPERFICIES_TODAS.length; j++) {
        if (COLIDE_DE_PROPOSITO("chrome", SUPERFICIES_TODAS[i], SUPERFICIES_TODAS[j])) continue;
        par(chao, `${quem} pinta`, `${SUPERFICIES_TODAS[i]} ≠ ${SUPERFICIES_TODAS[j]}`,
          pintado[i] === pintado[j] ? 0 : 1, 1);
      }
    }
    // E o tamanho do canal, que "≠" não mede: byte diferente pode ser pixel igual ao olho.
    // Onde a sombra existe (chão claro) ela é o sinal e o traço fica em `divider`; onde ela
    // não existe, a separação inteira é a COR do traço, e ela responde em L*.
    const lisa = temas[SUPERFICIES_TODAS.indexOf("solida")].FORMA.folha.chrome;
    const alta = temas[SUPERFICIES_TODAS.indexOf("elevada")].FORMA.folha.chrome;
    par(chao, `${quem} pinta`,
      alta.sombra.shadowOpacity > 0 ? "a sombra levanta a moldura" : "sem sombra, a cor do traço levanta a moldura",
      alta.sombra.shadowOpacity > 0
        ? alta.sombra.shadowOpacity - lisa.sombra.shadowOpacity
        : separacao(alta.corDaBorda, lisa.corDaBorda),
      alta.sombra.shadowOpacity > 0 ? 0.01 : 5);
  }
}

// 32. NINGUÉM PINTA UM DEGRAU DO CHÃO DENTRO DE UMA BAND — a régua que teria pego o
//     segundo defeito, e o pré-requisito medido da decisão pendente do dono ("`raised`
//     vira o padrão da Band?").
//
//     `T.raised`, `T.fill` e `T.hairline` são degraus contados a partir de `bg`. A peça que
//     pousa DENTRO de uma Band não pousa em `bg` — e no dia em que a Band for levantada ela
//     pousa exatamente em `T.raised`. Medido com a Band levantada, nos 5 sítios x 7 chãos x
//     4 superfícies: 42 dos 140 caem abaixo dos 5 de L* em que uma superfície começa a
//     existir, e 30 SOMEM POR COMPLETO (ΔL* 0 — a peça e o fundo dela no mesmo pixel).
//     Nenhum medidor deste repo acusaria: contraste ali nem é exigido, e a seção 16 mede a
//     FOLHA, não o que a tela pinta dentro dela.
//
//     Duas metades, e as duas são necessárias:
//       a) a tela não declara degrau do chão dentro de Band nenhuma — varredura de texto,
//          porque é a única forma de pegar o sítio NOVO que alguém escrever amanhã;
//       b) o degrau que `neutroSobre` devolve a partir do fundo REAL da Band separa 5 de
//          L* dele nas 28 combinações — a alternativa tem que valer o que promete.
//
//     ponytail: a varredura só olha arquivos que contêm `<Band>`. Peça definida em `src/ui`
//     e renderizada dentro de uma Band alheia (Campo, Choice, Metric) escapa daqui — e não
//     precisa: aquelas leem `FORMA.folha.miuda`, que a seção 29 já cobra.
const DEGRAUS_DO_CHAO = ["raised", "fill", "hairline"];
const TELAS_COM_BAND = readdirSync(join(ROOT, "src/screens"), { recursive: true })
  .filter((f) => String(f).endsWith(".tsx"))
  .map((f) => join("src/screens", String(f)))
  .filter((f) => /<Band\b/.test(readFileSync(join(ROOT, f), "utf8")));
par("bands", "varredura", "a varredura acha telas com Band", TELAS_COM_BAND.length, 10);
for (const arquivo of TELAS_COM_BAND) {
  const src = SEM_COMENTARIO(readFileSync(join(ROOT, arquivo), "utf8")).split("\n");
  // profundidade de <Band> linha a linha
  let d = 0;
  const dentro = src.map((l) => {
    d += (l.match(/<Band\b/g) ?? []).length - (l.match(/<\/Band>/g) ?? []).length;
    return d > 0;
  });
  const nomesDentro = new Set();
  src.forEach((l, i) => {
    if (!dentro[i]) return;
    for (const m of l.matchAll(/styles\.(\w+)/g)) nomesDentro.add(m[1]);
  });
  const culpados = [];
  src.forEach((l, i) => {
    const m = /backgroundColor:\s*T\.(\w+)/.exec(l);
    if (!m || !DEGRAUS_DO_CHAO.includes(m[1])) return;
    // inline no JSX: vale a profundidade da própria linha. Na folha de estilo: vale se o
    // nome do bloco é usado dentro de alguma Band.
    if (dentro[i]) return culpados.push(`${m[1]}:${i + 1}`);
    for (let k = i; k >= 0; k--) {
      const bloco = /^\s*(\w+):\s*\{/.exec(src[k]);
      if (!bloco) continue;
      if (nomesDentro.has(bloco[1])) culpados.push(`${bloco[1]}=${m[1]}`);
      return;
    }
  });
  par("bands", arquivo.split("/").pop(), `sem degrau do chão dentro da Band (${culpados.join(" ") || "—"})`, culpados.length ? 0 : 1, 1);
}
for (const chao of CHAOS_NOMES) {
  for (const superficie of SUPERFICIES_TODAS) {
    const t = criarTema({ ...APARENCIA_PADRAO, chao, superficie });
    const fundo = t.FORMA.folha.peca.composto;
    par(`${chao}/${superficie}`, "dentro da Band", "o degrau neutro existe na Band levantada",
      separacao(neutroSobre(fundo, t.T), fundo), 5);
    // e no chão ele continua sendo o `T.fill` de hoje: a conversão não anda um pixel
    // enquanto a Band não for levantada.
    par(`${chao}/${superficie}`, "dentro da Band", "no chão o degrau É o de hoje",
      neutroSobre(t.T.bg, t.T) === t.T.fill ? 1 : 0, 1);
  }
}

const ruins = linhas.filter((l) => l.medido + 1e-9 < l.minimo);
const w = (s, n) => String(s).padEnd(n);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ medidos: linhas.length, reprovam: ruins.length, ruins: ruins.slice(0, 40) }, null, 2));
} else {
  if (ruins.length) {
    console.log(`${w("CHÃO", 10)}${w("MARCA", 22)}${w("PAR", 38)}${w("MEDIDO", 12)}EXIGIDO`);
    for (const r of ruins.slice(0, 60)) {
      console.log(
        `${w(r.onde, 10)}${w(r.quem, 22)}${w(r.oque, 38)}${w(r.medido.toFixed(2), 12)}${r.minimo.toFixed ? r.minimo.toFixed(2) : r.minimo}`,
      );
    }
    if (ruins.length > 60) console.log(`  … e mais ${ruins.length - 60}`);
    console.log("");
  }
  const paletas = CHAOS_NOMES.length * MARCAS.length;
  console.log(
    `aparencia: ${paletas} paletas (${CHAOS_NOMES.length} chãos x ${MARCAS.length} marcas) · ${Object.keys(VOZES).length} vozes · ${DENSIDADES.length * FORMAS.length} geometrias`,
  );
  console.log(`${linhas.length} pares medidos · ${ruins.length} reprovam`);
}
gravarMedida("aparencia", ruins.length);
process.exit(ruins.length ? 1 : 0);
