import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  configDoTime,
  patchMe,
  progress,
  type Person,
  type ProgressPayload,
  type Time,
} from "../../api";
import { ACCENT_CHOICES, nomeDaCor } from "../../theme";
import { AccentCTA } from "../../ui/AccentCTA";
import { Avatar } from "../../ui/Avatar";
import { Campo } from "../../ui/Campo";
import { escolherFoto } from "../../ui/foto";
import { formatNum } from "../../ui/format";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconCheck } from "../../ui/Icons";
import { MetricGrid } from "../../ui/Metric";
import { Band, Head, Phone, useFimDaRolagem } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  person: Person;
  time: Time;
  onPersonChange: (next: Person) => void;
  onLeave: () => void;
};

/** A tela que MAIS destoava do resto do app, e o que mudou nesta costura:
 *    - era a única das trinta que não usava `Head`: cabeçalho próprio, com o nome em 22 px
 *      (degrau que não existe na escala) e a linha de baixo em 13 px SEM fontFamily — ou
 *      seja, em San Francisco/Roboto, no meio de um app inteiro em Archivo. Eram os quatro
 *      últimos blocos com fontSize e sem família do repositório.
 *    - tinha DUAS convenções de rótulo dentro dela mesma: um kicker acentuado e um mudo,
 *      ambos em 11 px/1,43 — e o resto do app escreve rótulo em `Txt role="label"`
 *      (12 px/1,3, mudo). Sobrou uma convenção, a do sistema.
 *    - a segunda célula da grade dizia "Recorde" e desenhava `ofensiva.current_count`: o
 *      MESMO número da célula ao lado, com outro nome. O payload não tem recorde de
 *      ofensiva, então a célula que mentia saiu e entrou o Protetor, que é dado real.
 *    - a barra "Quanto falta" media o selo de 4 semanas — o MESMO selo que a fila logo
 *      abaixo desenha, com outro nome e outra forma. A tela dizia duas vezes; ficou uma.
 *    - "Sair" era um rótulo em caixa alta sem moldura, do tamanho e do tom dos títulos de
 *      seção acima dele: lia como cabeçalho, não como saída. Virou o botão fantasma que o
 *      resto do app já usa para a ação que não é a principal.
 *
 *  ponytail: nenhuma peça nova. Head, Band, MetricGrid, GhostCTA, Initials e Txt já
 *  existiam — esta tela só não estava usando nenhum deles. */
const SELOS = [
  { key: "estreia", label: "Estreia", mark: "1" },
  { key: "ofensiva_4", label: "Semanas", mark: "4" },
  { key: "primeiro_pr", label: "PR", mark: "PR" },
  { key: "retomada", label: "Retomada", mark: "R" },
] as const;

export function Perfil({ token, person, time, onPersonChange, onLeave }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  // `acento(c).piece.fill` e não o hex cru `c`: era a única peça do app que pintava fora
  // do motor de tinta. No chão claro o quadrado mostrava o amarelo do cardápio e o avatar
  // que ele produz saía oliva — o seletor mentia sobre o próprio resultado.
  const { T, acento, errorInk } = useTema();
  const [data, setData] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState("");
  const [nome, setNome] = useState(person.name);
  const [busy, setBusy] = useState(false);
  // prévia imediata da foto que acabou de subir, antes de o /v1/me devolver a URL.
  const [fotoLocal, setFotoLocal] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await progress(token);
        if (alive) {
          setData(payload);
          setError("");
        }
      } catch {
        if (alive) setError("Não deu para abrir o perfil.");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  const cfg = configDoTime(time);
  const name = person.name.trim() || "Você";
  const nomeLimpo = nome.trim();
  const nomeDirty = nomeLimpo !== person.name && nomeLimpo !== "";

  // Foto e cor aplicam NO TOQUE — o combinado do produto é mudar em poucos toques.
  // Só o nome, que é digitação, pede o confirmar.
  async function foto() {
    if (busy) return;
    setBusy(true);
    try {
      const up = await escolherFoto(token, "avatar");
      if (up) {
        const mine = await patchMe(token, { avatar_object_key: up.objectKey });
        setFotoLocal(up.localUri);
        onPersonChange(mine.person);
        setError("");
      }
    } catch {
      setError("Não deu para subir a foto.");
    } finally {
      setBusy(false);
    }
  }

  async function corDeAvatar(c: string) {
    if (busy) return;
    setBusy(true);
    try {
      // escolher cor é escolher NÃO usar foto: os dois toques viram um estado só.
      const mine = await patchMe(token, { avatar_color: c, avatar_object_key: "" });
      setFotoLocal("");
      onPersonChange(mine.person);
      setError("");
    } catch {
      setError("Não deu para trocar o avatar.");
    } finally {
      setBusy(false);
    }
  }

  async function salvarNome() {
    if (!nomeDirty || busy) return;
    setBusy(true);
    try {
      const mine = await patchMe(token, { name: nomeLimpo });
      onPersonChange(mine.person);
      setError("");
    } catch {
      setError("Não deu para salvar o nome.");
    } finally {
      setBusy(false);
    }
  }
  const place = data ? data.league.findIndex((row) => row.me) + 1 : 0;
  const earned = new Set((data?.badges ?? []).map((b) => b.badge_key));
  const ofensiva = data?.ofensiva.current_count ?? 0;

  return (
    <Phone>
      <Head
        kicker={time.name}
        kickerMuted
        title={name}
        right={
          <Avatar
            name={name}
            url={fotoLocal || person.avatar_url}
            color={person.avatar_color}
            fill
            size={54}
          />
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <Txt role="body" color={errorInk} style={styles.error}>
            {error}
          </Txt>
        ) : null}

        {/* COMO VOCÊ APARECE: nome, foto e avatar — para o Fred e para a liga. Foto e
            cor aplicam no toque; o nome confirma porque é digitação. */}
        <Band rule="hair">
          <Txt role="label">Como você aparece</Txt>
          <View style={styles.editRow}>
            <Avatar
              name={nomeLimpo || name}
              url={fotoLocal || person.avatar_url}
              color={person.avatar_color}
              fill
              size={54}
            />
            <Campo
              label="Seu nome"
              hint="O nome que aparece para o personal e na liga"
              value={nome}
              onChangeText={setNome}
              placeholder={name}
              maxLength={40}
              style={styles.campo}
            />
          </View>
          <View style={styles.avatarRow}>
            <Pressable
              onPress={() => void foto()}
              accessibilityRole="button"
              accessibilityLabel="Subir uma foto"
              disabled={busy}
              style={styles.fotoBtn}
            >
              <Txt role="label">{busy ? "…" : "Foto"}</Txt>
            </Pressable>
            {/* AS DEZ, e a marca por DENTRO. Eram seis: as quatro últimas do cardápio
                (roxo, rosa, quase-branco, quase-preto) não renderizavam em lugar nenhum
                do app. E a seleção era um anel de `T.ink` em volta — que desaparece
                justamente na cor quase-branca, a única em que o aluno precisaria dele.
                A tinta de dentro vem do mesmo motor que pinta a peça, então ela existe
                sobre QUALQUER uma das dez, por construção. */}
            {ACCENT_CHOICES.map((c) => (
              <Pressable
                key={c}
                onPress={() => void corDeAvatar(c)}
                accessibilityRole="button"
                accessibilityLabel={`Avatar na cor ${nomeDaCor(c)}`}
                accessibilityState={{ selected: person.avatar_color === c }}
                disabled={busy}
                hitSlop={6}
                style={[styles.corAvatar, { backgroundColor: acento(c).piece.fill }]}
              >
                {person.avatar_color === c && !person.avatar_url ? (
                  <IconCheck color={acento(c).piece.ink} size={20} />
                ) : null}
              </Pressable>
            ))}
          </View>
          {nomeDirty ? (
            <View style={styles.salvarNome}>
              <AccentCTA
                label="Salvar nome"
                onPress={() => void salvarNome()}
                busy={busy}
                check
              />
            </View>
          ) : null}
        </Band>

        {data ? (
          <>
            <MetricGrid
              cells={[
                {
                  label: "Ofensiva",
                  value: ofensiva,
                  note: "sessões seguidas",
                },
                {
                  label: "Protetor",
                  value: data.ofensiva.protector_available ? "1" : "—",
                  note: data.ofensiva.protector_available
                    ? "guardado"
                    : "gasto nesta ofensiva",
                },
                // XP e Liga respeitam a config do Time: célula que o personal desligou
                // não vira caixa vazia — some, e a grade re-flui (ausência é a marca).
                ...(cfg.xp
                  ? [{ label: "XP total", value: formatNum(data.xp_total) }]
                  : []),
                ...(cfg.liga !== "off"
                  ? [
                      {
                        label: "Liga",
                        value: place > 0 ? `${place}º` : "—",
                        note: time.name,
                      },
                    ]
                  : []),
              ]}
            />

            {/* A superfície dos selos CRESCE, e por isso o buraco de 120pt entre o botão
                Sair e a barra de abas deixou de existir: a sobra da rolagem é o respiro
                interno dela, não um vazio no chão nu depois do último traço. */}
            <Band raised grow rule="none">
              <Txt role="label">Selos</Txt>
              <View style={styles.selos}>
                {SELOS.map((selo) => {
                  const on = earned.has(selo.key);
                  return (
                    <View key={selo.key} style={styles.seloCol}>
                      {/* Selo não conquistado é AUSÊNCIA de tinta, nunca outro matiz:
                          moldura vazia contra caixa cheia. Era isso que estava escrito
                          aqui e não era isso que a tela desenhava — cheia e vazia usavam
                          a MESMA cor (`T.fill` nas duas), e sobre a superfície levantada
                          nenhuma das duas existia. Agora quem marca a conquista é a
                          presença da MARCA do personal. */}
                      <View
                        style={[
                          styles.selo,
                          on ? styles.seloOn : styles.seloOff,
                        ]}
                      >
                        <Txt role="body" tone="dim" color={on ? acento().piece.ink : undefined}>
                          {selo.mark}
                        </Txt>
                      </View>
                      <Txt
                        role="note"
                        tone={on ? "muted" : "dim"}
                        style={styles.seloLabel}
                        numberOfLines={1}
                      >
                        {selo.label}
                      </Txt>
                    </View>
                  );
                })}
              </View>
            </Band>
          </>
        ) : null}

        <View style={styles.leave}>
          <GhostCTA label="Sair" onPress={onLeave} fundo={T.bg} tom="perigo" />
        </View>
      </ScrollView>
    </Phone>
  );
}

const usarEstilos = estilos(({ T, SPACE, FONTES, FORMA, acento }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    error: { paddingHorizontal: T.pad, paddingTop: SPACE.tight },

    editRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    campo: { flex: 1 },
    avatarRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: SPACE.tight,
      marginTop: SPACE.tight,
    },
    fotoBtn: {
      // O alvo do dedo sai do TEMA, não da soma do padding com a linha do rótulo: assim
      // media 33,5 — abaixo do piso de 44 — encostado num vizinho de 34 que paga hitSlop
      // de 6 e chega a 46. Dois botões da mesma fila com alvos diferentes é o defeito.
      minHeight: FORMA.alturaChip,
      justifyContent: "center",
      borderWidth: FORMA.borda,
      borderColor: T.divider,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: FORMA.raioAcao,
    },
    corAvatar: {
      width: 34,
      height: 34,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: FORMA.fio,
      borderColor: T.divider,
      borderRadius: FORMA.raioEm(34),
    },
    salvarNome: { marginTop: SPACE.tight },

    selos: { flexDirection: "row", gap: SPACE.hair, marginTop: SPACE.tight },
    seloCol: { flex: 1 },
    selo: {
      aspectRatio: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    // Conquistado é a peça da marca (o motor garante a tinta em cima e o piso contra os
    // quatro fundos); não conquistado é o anel de `divider`, que é o token cujo contrato
    // é justamente existir a 3:1 em qualquer um dos quatro. `T.fill` na moldura media
    // 1,23:1 sobre a superfície levantada — moldura que não moldurava nada.
    seloOn: { backgroundColor: acento().piece.fill },
    seloOff: { borderWidth: FORMA.borda, borderColor: T.divider },
    seloLabel: { marginTop: SPACE.hair },

    leave: {
      paddingHorizontal: T.pad,
      paddingTop: SPACE.block,
      paddingBottom: SPACE.step,
    },
  }),
);
