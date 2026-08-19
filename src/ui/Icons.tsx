import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useTema } from "./tema";

type Props = { color: string; size?: number };

export function IconPulse({ color, size = 17 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 12h-4l-3 8L9 4l-3 8H2"
        stroke={color}
        strokeWidth={FORMA.traco}
        strokeLinecap={FORMA.ponta}
      />
    </Svg>
  );
}

export function IconFicha({ color, size = 17 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={4} width={14} height={17} stroke={color} strokeWidth={FORMA.traco} />
      <Path d="M9 9h6M9 13h6M9 17h4" stroke={color} strokeWidth={FORMA.traco} />
    </Svg>
  );
}

export function IconTrend({ color, size = 17 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 17l6-6 4 4 8-8"
        stroke={color}
        strokeWidth={FORMA.traco}
        strokeLinecap={FORMA.ponta}
      />
      <Path d="M17 7h4v4" stroke={color} strokeWidth={FORMA.traco} strokeLinecap={FORMA.ponta} />
    </Svg>
  );
}

export function IconPerson({ color, size = 17 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={FORMA.traco} />
      <Path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke={color} strokeWidth={FORMA.traco} />
    </Svg>
  );
}

export function IconPeople({ color, size = 17 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth={FORMA.traco}
      />
      <Circle cx={9} cy={7} r={4} stroke={color} strokeWidth={FORMA.traco} />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.9" stroke={color} strokeWidth={FORMA.traco} />
    </Svg>
  );
}

export function IconMark({ color, size = 15 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={7} width={7} height={14} stroke={color} strokeWidth={FORMA.traco} />
      <Rect x={14} y={3} width={7} height={18} fill={color} />
      <Path d="M6.5 7 17.5 3" stroke={color} strokeWidth={FORMA.traco} />
    </Svg>
  );
}

/** Cifrão: a aba de OPERAÇÃO é onde a Mensalidade vive — receita, ticket, em aberto.
 *  A seta de tendência que estava aqui era o ícone do PROGRESSO do aluno dizendo
 *  "gráfico" numa aba que diz "dinheiro e turma rodando". */
export function IconCifrao({ color, size = 17 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3v18" stroke={color} strokeWidth={FORMA.traco} strokeLinecap={FORMA.ponta} />
      <Path
        d="M16.5 7c-.8-1.6-2.5-2.4-4.5-2.4-2.5 0-4.5 1.3-4.5 3.4s1.8 2.9 4.5 3.5 4.5 1.5 4.5 3.5-2 3.4-4.5 3.4c-2 0-3.7-.8-4.5-2.4"
        stroke={color}
        strokeWidth={FORMA.traco}
      />
    </Svg>
  );
}

/** Gota de tinta: o Perfil do personal é a MARCA — nome e cor que pintam o app inteiro.
 *  O boneco de pessoa que estava aqui dizia "uma pessoa"; esta tela é o white-label. */
export function IconTinta({ color, size = 17 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3c3.3 4.3 6 7.7 6 10.7a6 6 0 1 1-12 0C6 10.7 8.7 7.3 12 3z"
        stroke={color}
        strokeWidth={FORMA.traco}
      />
    </Svg>
  );
}

export function IconChevron({ color, size = 18 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14"
        stroke={color}
        strokeWidth={FORMA.traco + 0.5}
        strokeLinecap={FORMA.ponta}
      />
      <Path
        d="m12 5 7 7-7 7"
        stroke={color}
        strokeWidth={FORMA.traco + 0.5}
        strokeLinecap={FORMA.ponta}
      />
    </Svg>
  );
}

/** O X de fechar. Estava desenhado a mao dentro da tela da Retomada; virou peca aqui
 *  quando a faixa passou a viver dentro da Hoje, para nao existirem dois X diferentes no
 *  app. Mesmo strokeLinecap={FORMA.ponta} dos outros: canto reto e a linguagem da marca. */
export function IconClose({ color, size = 18 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12" stroke={color} strokeWidth={FORMA.traco + 0.5} strokeLinecap={FORMA.ponta} />
      <Path d="M18 6L6 18" stroke={color} strokeWidth={FORMA.traco + 0.5} strokeLinecap={FORMA.ponta} />
    </Svg>
  );
}

export function IconCheck({ color, size = 17 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6 9 17l-5-5"
        stroke={color}
        strokeWidth={FORMA.traco + 0.5}
        strokeLinecap={FORMA.ponta}
      />
    </Svg>
  );
}

export function IconPlay({ color, size = 13 }: Props) {
  const { FORMA } = useTema();
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M7 4v16l13-8z" />
    </Svg>
  );
}

/** Direção. O Whoop carrega isto em MATIZ (verde sobe, laranja atenção) e nós não podemos:
 *  o único matiz da tela é o do personal e ele nunca significa bom ou ruim. Aqui o
 *  significado sai de FORMA (triângulo x ponto) e POSIÇÃO (vértice para cima ou para
 *  baixo). Sem direção, nenhuma marca é desenhada. */
export function TrendMark({
  dir,
  color,
  size = 10,
}: { dir: "up" | "down" | "flat"; color: string; size?: number }) {
  if (dir === "flat") {
    // BARRA, e não ponto. O quadrado de 3x3 num viewBox de 10 tinha um terço da tinta da
    // seta e, colado ao fim do valor, lia como separador esquecido ("2 de 3 ·"). A barra
    // ocupa a mesma base da seta (1→9) com a mesma massa de tinta (8 x 3,5 = 8 x 7 / 2):
    // três marcas do mesmo peso, e o significado continua saindo de FORMA e POSIÇÃO.
    return (
      <Svg width={size} height={size} viewBox="0 0 10 10">
        <Rect x={1} y={3.25} width={8} height={3.5} fill={color} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <Path d={dir === "up" ? "M5 1.5 9 8.5H1z" : "M5 8.5 1 1.5h8z"} fill={color} />
    </Svg>
  );
}
