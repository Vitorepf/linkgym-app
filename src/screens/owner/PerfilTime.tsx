import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  aparenciaDoTime,
  ApiError,
  configDoTime,
  me,
  patchTime,
  type Time,
  type TimeConfig,
} from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import type { Aparencia } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Avatar } from "../../ui/Avatar";
import { Campo } from "../../ui/Campo";
import { escolherFoto } from "../../ui/foto";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconChevron, IconClose } from "../../ui/Icons";
import { Band, Head, neutroNaBand, Phone, useFimDaRolagem } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  time: Time;
  onTimeChange: (next: Time) => void;
  onLeave: () => void;
};

/** O white-label na mão do personal: o NOME e a COR que os alunos veem em toda tela.
 *
 *  A palavra "time" nunca aparece — na tela só existe o nome (Fred, Iron Lab), que é a
 *  lei do domínio. A prévia usa as MESMAS peças que o aluno vê (avatar e botão), então o
 *  que o personal aprova aqui é literalmente o que chega lá: a cor passa pelo mesmo
 *  sistema de contraste, e um acento quase-preto continua legível porque quem pinta é
 *  accentSet, não o hex cru. */
export function PerfilTime({ token, time, onTimeChange, onLeave }: Props) {
  const navigation = useNavigation<OwnerTabNavigation>();
  const aparencia = aparenciaDoTime(time);
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const tema = useTema();
  const { T, SPACE, FORMA, acento, errorInk } = tema;
  const [name, setName] = useState(time.name);
  // A COR NÃO MORA MAIS AQUI. Ela saiu para a tela de Aparência quando a paleta saiu, mas
  // o estado dela ficou para trás — congelado no valor da montagem, sem ninguém para
  // atualizá-lo, e ainda assim viajando no PATCH. Quem trocasse a cor na outra tela e
  // depois salvasse o nome nesta escrevia a cor VELHA por cima, sem tocar em nada que
  // parecesse cor. Um valor, um dono: `accent_color` é da Aparência.
  // logo: undefined = não mexeu; chave = subiu agora. A prévia usa a uri local até o
  // /v1/me devolver a URL assinada.
  const [logoKey, setLogoKey] = useState<string | undefined>(undefined);
  const [logoLocal, setLogoLocal] = useState("");
  // a config estrutural, editada como documento inteiro; o servidor valida o cardápio.
  const inicial = configDoTime(time);
  const [cfg, setCfg] = useState(inicial);

  // ESTA TELA E A "COMO O APP FUNCIONA" EDITAM O MESMO DOCUMENTO, e as duas são abas
  // MONTADAS: esta cópia nascia no primeiro render e nunca mais olhava para o `time`.
  // Depois de escolher liga, selos e passo na outra tela, o `cfg` daqui continuava com os
  // valores VELHOS enquanto `inicial` já vinha com os novos — então `cfgDirty` acendia
  // sozinho numa tela que ele não tocou, e o Salvar daqui gravava o antigo por cima do que
  // ele acabou de escolher. Perda de dado silenciosa, pela porta dos fundos.
  //
  // Só a metade ESTRUTURAL volta a sincronizar. As duas falas (`boas_vindas`, `retomada`)
  // são editadas AQUI e um rascunho não salvo delas não pode ser apagado por uma gravação
  // que aconteceu noutra tela. Cada metade tem um dono.
  useEffect(() => {
    const doServidor = configDoTime(time);
    setCfg((c) => ({
      ...c,
      liga: doServidor.liga,
      selos: doServidor.selos,
      xp: doServidor.xp,
      prontidao: doServidor.prontidao,
      passo_kg: doServidor.passo_kg,
      dias_padrao: doServidor.dias_padrao,
    }));
  }, [time]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState(0);

  const trimmed = name.trim();
  const cfgDirty = JSON.stringify(cfg) !== JSON.stringify(inicial);
  const dirty =
    trimmed !== time.name ||
    logoKey !== undefined ||
    cfgDirty;

  function muda(parte: Partial<typeof cfg>) {
    setCfg((c) => {
      const next = { ...c, ...parte };
      // acoplamento da fábrica: ranking por número invisível não existe.
      if (parte.xp === false) next.liga = "off";
      if (parte.liga && parte.liga !== "off") next.xp = true;
      return next;
    });
  }

  async function logo() {
    if (busy) return;
    setBusy(true);
    try {
      const up = await escolherFoto(token, "logo");
      if (up) {
        setLogoKey(up.objectKey);
        setLogoLocal(up.localUri);
        setError("");
      }
    } catch {
      setError("Não deu para subir o logo.");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!dirty || !trimmed || busy) return;
    setBusy(true);
    try {
      const config: TimeConfig = {
        // O PATCH grava o documento INTEIRO. Sem carregar a aparência junto, salvar o
        // nome nesta tela apagaria o chão, a forma e o respiro escolhidos na outra —
        // pela porta dos fundos, sem mensagem nenhuma.
        ...(time.config?.aparencia ? { aparencia: time.config.aparencia } : {}),
        liga: cfg.liga,
        selos: cfg.selos,
        xp: cfg.xp,
        prontidao: cfg.prontidao,
        passo_kg: cfg.passo_kg,
        dias_padrao: cfg.dias_padrao,
        ...(cfg.boas_vindas ? { boas_vindas: cfg.boas_vindas } : {}),
        ...(cfg.retomada ? { retomada: cfg.retomada } : {}),
      };
      await patchTime(token, {
        name: trimmed,
        ...(logoKey !== undefined ? { logo_object_key: logoKey } : {}),
        config,
      });
      // o /v1/me devolve a URL assinada do logo novo — uma volta só, estado inteiro.
      const mine = await me(token);
      onTimeChange(mine.time);
      setLogoKey(undefined);
      setError("");
      setSavedAt(Date.now());
    } catch (e) {
      // O servidor só sabe dizer `invalido`. Nesta tela, porém, tudo o mais sai de chip
      // (enum), de `maxLength` ou da paleta — a única regra que a mão do personal alcança
      // é a da voz: sem link e sem telefone na frase que o aluno lê. Então o aviso NOMEIA
      // a regra em vez de dar de ombros: era um beco sem saída silencioso.
      setError(
        e instanceof ApiError && e.code === "invalido"
          ? "Link e telefone não entram nas frases."
          : "Não deu para salvar.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Phone>
      {/* O nome é o CONTEÚDO daqui — o campo e a prévia. Estando também no título, "Fred"
          aparecia três vezes em duas dobras; no kicker (o lugar dele em Operação e
          Publicar) ele volta a ser de QUEM é o app, e o título diz o que a tela faz. Sem
          `kickerMuted`: assim o kicker é a prévia ao vivo da cor, sem peça nova. */}
      <Head
        kicker={trimmed || time.name}
        title="O que os alunos veem"
        right={
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
            hitSlop={8}
            style={styles.fechar}
          >
            <IconClose color={T.muted} size={20} />
          </Pressable>
        }
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Band rule="hair">
          <Campo
            label="Nome"
            rotulo
            hint="O nome que os alunos veem em toda tela"
            value={name}
            onChangeText={setName}
            placeholder={time.name}
            maxLength={40}
          />
        </Band>

        <Band rule="hair">
          <View style={styles.logoRow}>
            <View style={styles.logoCopy}>
              <Txt role="label">Logo</Txt>
              <Txt role="note" tone="dim" style={styles.logoNote}>
                aparece no convite e no topo do dia
              </Txt>
            </View>
            <Pressable
              onPress={() => void logo()}
              accessibilityRole="button"
              accessibilityLabel="Subir o logo"
              disabled={busy}
              style={styles.fotoBtn}
            >
              <Txt role="label">
                {busy ? "…" : logoLocal || time.logo_url ? "Trocar" : "Subir"}
              </Txt>
            </Pressable>
          </View>
        </Band>

        {/* A APARÊNCIA saiu daqui e virou tela. Ficou a PORTA — com a paleta viva do
            time desenhada nela, que é o que faz alguém querer abrir. Manter a fila de
            cores aqui E lá seria dois editores para o mesmo valor: um deles salvaria por
            cima do outro, e o dono descobriria isso pela cor errada no convite. */}
        <Band rule="hair">
          <Pressable
            onPress={() => navigation.navigate("Aparencia")}
            accessibilityRole="button"
            accessibilityLabel="Aparência do app"
            accessibilityHint="Chão, cor, canto, superfície e respiro do app inteiro"
            style={styles.porta}
          >
            <View style={styles.logoCopy}>
              <Txt role="label">Aparência do app</Txt>
              <Txt role="note" tone="dim" style={styles.logoNote}>
                {resumoDaAparencia(aparencia)}
              </Txt>
            </View>
            <View style={styles.amostras}>
              {/* A amostra é um degrau contado a partir da Band em que ela pousa. Era
                  `T.raised` — a mesma cor que a Band levantada pinta —, e ali a primeira
                  das três amostras desapareceria no próprio fundo. */}
              <View style={[styles.amostra, { backgroundColor: neutroNaBand(tema) }]} />
              <View style={[styles.amostra, { backgroundColor: acento().piece.fill }]} />
              <View style={[styles.amostra, { backgroundColor: T.ink }]} />
            </View>
            <IconChevron color={T.muted2} />
          </Pressable>
        </Band>

        {/* A PORTA. Estas seis decisões mudam o app de TODOS os alunos dele, e estavam
            espremidas entre o campo de nome e o botão de sair — na mesma tela em que ele
            troca a foto. Coisa importante em corredor de passagem parece pouco importante,
            e o dono disse isso com todas as letras. Agora é tela própria, e lá cada opção
            mostra o pedaço da tela do aluno que ela liga. */}
        <Band rule="hair">
          <Pressable
            onPress={() => navigation.navigate("ComoFunciona")}
            accessibilityRole="button"
            accessibilityLabel="Como o app funciona"
            style={styles.porta}
          >
            <View style={styles.portaCopy}>
              <Txt role="label">Como o app funciona</Txt>
              <Txt role="note" tone="dim">
                {resumoDaConfig(cfg)}
              </Txt>
            </View>
            <IconChevron color={T.muted2} />
          </Pressable>
        </Band>

        {/* A VOZ: os dois slots onde o app fala em nome do personal. Curtos, com
            limite — e vazio cai na frase do produto, nunca em buraco. */}
        <Band rule="hair">
          <Txt role="label">Sua voz</Txt>
          <Campo
            label="Frase de boas-vindas"
            nota="Boas-vindas · primeira sessão do aluno"
            hint="Aparece na primeira sessão do aluno"
            value={cfg.boas_vindas ?? ""}
            onChangeText={(t) => muda({ boas_vindas: t })}
            placeholder="Montei esse começo para você. Confia no processo."
            maxLength={100}
            style={styles.grupo}
          />
          <Campo
            label="Frase de retomada"
            nota="Retomada · quando o aluno some e volta"
            hint="Aparece no cartão de retomada do aluno"
            value={cfg.retomada ?? ""}
            onChangeText={(t) => muda({ retomada: t })}
            placeholder="Sumiu? Normal. Bora recomeçar leve."
            maxLength={90}
            style={styles.grupo}
          />
        </Band>

        {/* Prévia com as MESMAS peças do app do aluno: aprova aqui, chega igual lá. */}
        <Band raised grow rule="none">
          <View style={styles.previewRow}>
            <Avatar
              name={trimmed || time.name}
              url={logoLocal || time.logo_url}
              fill
              size={54}
            />
            <View style={styles.previewCopy}>
              <Txt role="title" numberOfLines={1}>
                {trimmed || time.name}
              </Txt>
              <Txt role="note" tone="dim">
                assim no convite e no dia do aluno
              </Txt>
            </View>
          </View>
          <View style={styles.previewCta}>
            <AccentCTA
              label={busy ? "Salvando…" : savedAt && !dirty ? "Salvo" : "Salvar"}
              onPress={() => void save()}
              disabled={!dirty || !trimmed}
              busy={busy}
              check
              fit
            />
          </View>
          {error ? (
            <Txt role="body" color={errorInk} style={styles.note}>
              {error}
            </Txt>
          ) : null}
        </Band>

        <View style={styles.leave}>
          <GhostCTA label="Sair" onPress={onLeave} fundo={T.bg} tom="perigo" fit />
        </View>
      </ScrollView>
    </Phone>
  );
}

/** A linha da porta: o estado atual em palavras que o personal reconhece, e não em nomes
 *  de campo. Porta sem resumo obriga a entrar para saber o que tem dentro. */
function resumoDaConfig(cfg: ReturnType<typeof configDoTime>): string {
  const liga =
    cfg.liga === "nomes" ? "liga com nomes"
    : cfg.liga === "anonima" ? "liga sem nomes"
    : "sem liga";
  const passo = `passo de ${String(cfg.passo_kg).replace(".", ",")} kg`;
  return `${liga} · ${passo} · ${cfg.dias_padrao} dias por semana`;
}

/** Perfis de fábrica: configurações inteiras que já saíram medidas. Aplicar um preset
 *  não apaga a voz — só a estrutura. */
const PRESETS: { nome: string; cfg: Partial<ReturnType<typeof configDoTime>> }[] = [
  { nome: "Performance", cfg: { liga: "nomes", selos: true, xp: true, prontidao: true, passo_kg: 2.5, dias_padrao: 5 } },
  { nome: "Studio", cfg: { liga: "anonima", selos: true, xp: true, prontidao: true, passo_kg: 2.5, dias_padrao: 3 } },
  { nome: "Fisio", cfg: { liga: "off", selos: false, xp: false, prontidao: true, passo_kg: 1, dias_padrao: 2 } },
  { nome: "Sênior", cfg: { liga: "off", selos: false, xp: true, prontidao: true, passo_kg: 1, dias_padrao: 3 } },
];

function presetAtivo(
  cfg: ReturnType<typeof configDoTime>,
  p: Partial<ReturnType<typeof configDoTime>>,
): boolean {
  return Object.entries(p).every(([k, v]) => cfg[k as keyof typeof cfg] === v);
}

/** Escolha compacta: borda + espessura marcam o estado — nunca outro matiz.
 *  `chave` é a fila que LIGA e DESLIGA cada peça, e não a que escolhe uma entre três:
 *  mesma cara para o olho, papel diferente para quem ouve a tela. */
function Chip({
  label,
  on,
  onPress,
  chave,
}: {
  label: string;
  on: boolean;
  onPress: () => void;
  chave?: boolean;
}) {
  const chipStyles = usarChipEstilos();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={chave ? "switch" : "button"}
      accessibilityState={chave ? { checked: on } : { selected: on }}
      hitSlop={6}
      style={[chipStyles.chip, on && chipStyles.on]}
    >
      <Txt role="label" tone={on ? "ink" : "dim"}>
        {label}
      </Txt>
    </Pressable>
  );
}

const usarChipEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    chip: {
      // A espessura é CONSTANTE entre ligado e desligado. Ela mudava de `fio` para `borda`
      // na seleção, e a caixa encolhia junto: o rótulo pulava 1 a 3 pixels no toque, em
      // treze chips da mesma tela. O estado passou a ser TINTA e PREENCHIMENTO — que é o
      // que a Choice já faz, e o que não move nada de lugar.
      borderWidth: FORMA.borda,
      borderColor: T.divider,
      borderRadius: FORMA.raioAcao,
      // O PISO DO DEDO. Sem ele o chip media 34pt de altura — treze alvos abaixo do
      // mínimo numa tela só, e nenhum medidor via, porque altura de alvo não estava em
      // nenhum eixo. A escolha compacta continua compacta; ela só não fica menor que o
      // dedo de quem toca.
      minHeight: FORMA.alturaMinima,
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    on: {
      borderColor: T.ink,
      backgroundColor: T.fill,
    },
  }),
);

const usarEstilos = estilos(({ T, SPACE, FONTES, FORMA }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    palette: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    // O quadrado é a própria cor; a borda garante que quase-preto exista contra o chão. A
    // seleção é PRESENÇA de tinta DENTRO do quadrado, na tinta que o sistema garante legível
    // sobre aquela cor. Era espessura de borda em T.ink — que some justamente na cor branca:
    // escolher o branco deixava a paleta inteira SEM nenhuma escolha marcada, medido no
    // aparelho.
    swatch: {
      alignItems: "center",
      justifyContent: "center",
      borderWidth: FORMA.fio,
      borderColor: T.divider,
    },
    note: { marginTop: 12 },
    porta: { flexDirection: "row", alignItems: "center", gap: SPACE.tight },
    // O texto da porta ocupa a sobra e o resumo pode quebrar em duas linhas sem empurrar
    // a seta para fora da tela.
    portaCopy: { flex: 1, minWidth: 0 },
    // As três amostras são o app inteiro em miniatura: superfície, marca e tinta. É a
    // porta dizendo o que há atrás dela sem obrigar ninguém a abrir.
    amostras: { flexDirection: "row", gap: 2 },
    amostra: { width: 18, height: 34, borderRadius: FORMA.raioEm(18) },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: SPACE.tight,
    },
    grupo: { marginTop: SPACE.tight },
    logoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    logoCopy: { flex: 1, minWidth: 0 },
    logoNote: { marginTop: 2 },
    fotoBtn: {
      borderWidth: FORMA.borda,
      borderColor: T.divider,
      borderRadius: FORMA.raioAcao,
      paddingVertical: 8,
      paddingHorizontal: SPACE.tight,
    },
    previewRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    previewCopy: { flex: 1, minWidth: 0 },
    previewCta: { marginTop: 18 },
    leave: {
      marginTop: "auto",
      paddingHorizontal: T.pad,
      paddingTop: SPACE.step,
      paddingBottom: 8,
    },
    fechar: {
      width: FORMA.alturaMinima,
      height: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
    },
  }),
);

/** A aparência em três palavras, para a porta ter legenda. */
function resumoDaAparencia(a: Aparencia): string {
  const chao: Record<Aparencia["chao"], string> = {
    carvao: "Carvão",
    breu: "Breu",
    grafite: "Grafite",
    tabaco: "Tabaco",
    papel: "Papel",
    neve: "Neve",
    linho: "Linho",
  };
  const forma: Record<Aparencia["forma"], string> = {
    reta: "reto",
    macia: "macio",
    pilula: "pílula",
  };
  const sup: Record<Aparencia["superficie"], string> = {
    solida: "sólida",
    contorno: "contorno",
    elevada: "elevada",
    vidro: "vidro",
    fio: "fio duplo",
    vinco: "vinco",
    carimbo: "carimbo",
    nenhuma: "sem bloco",
  };
  return `${chao[a.chao]} · ${forma[a.forma]} · ${sup[a.superficie]}`;
}
