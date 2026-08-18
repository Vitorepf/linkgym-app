import Svg, { Circle, Path, Rect } from "react-native-svg";

type Props = { color: string; size?: number };

export function IconPulse({ color, size = 17 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 12h-4l-3 8L9 4l-3 8H2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="square"
      />
    </Svg>
  );
}

export function IconFicha({ color, size = 17 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={4} width={14} height={17} stroke={color} strokeWidth={2} />
      <Path d="M9 9h6M9 13h6M9 17h4" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconTrend({ color, size = 17 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 17l6-6 4 4 8-8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="square"
      />
      <Path d="M17 7h4v4" stroke={color} strokeWidth={2} strokeLinecap="square" />
    </Svg>
  );
}

export function IconPerson({ color, size = 17 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
      <Path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconPeople({ color, size = 17 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        stroke={color}
        strokeWidth={2}
      />
      <Circle cx={9} cy={7} r={4} stroke={color} strokeWidth={2} />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.9" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconMark({ color, size = 15 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={7} width={7} height={14} stroke={color} strokeWidth={2} />
      <Rect x={14} y={3} width={7} height={18} fill={color} />
      <Path d="M6.5 7 17.5 3" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconChevron({ color, size = 18 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="square"
      />
      <Path
        d="m12 5 7 7-7 7"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="square"
      />
    </Svg>
  );
}

export function IconCheck({ color, size = 17 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 6 9 17l-5-5"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="square"
      />
    </Svg>
  );
}

export function IconPlay({ color, size = 13 }: Props) {
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
    return (
      <Svg width={size} height={size} viewBox="0 0 10 10">
        <Rect x={3.5} y={3.5} width={3} height={3} fill={color} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10">
      <Path d={dir === "up" ? "M5 1.5 9 8.5H1z" : "M5 8.5 1 1.5h8z"} fill={color} />
    </Svg>
  );
}
