import { useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { cuesFor } from "../../exerciseCues";
import type { RootStackParamList } from "../../nav/types";
import { AccentCTA } from "../../ui/AccentCTA";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";
import { MaquinaOcupada } from "./MaquinaOcupada";

type Props = NativeStackScreenProps<RootStackParamList, "ComoFazer">;

/** A tabela de dicas casa por nome EXATO e a ficha traz o nome cheio ("Agachamento livre").
 *  ponytail: cai para a primeira palavra em vez de a tabela crescer. Teto conhecido: nome
 *  composto ("Levantamento terra") continua sem passo — e aí a tela diz que não tem, em
 *  vez de inventar. */
function cuesOf(name: string) {
  const hit = cuesFor(name);
  return hit.error || hit.cues.some(Boolean) ? hit : cuesFor(name.split(" ")[0]);
}

function up(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function ComoFazer({ navigation, route }: Props) {
  const styles = usarEstilos();
  const { acento } = useTema();
  const { item, items, timeName, token, prescriptionId } = route.params;
  const A = acento();
  const video = item.video_url;
  const [failed, setFailed] = useState(false);

  const { cues, error } = cuesOf(item.name);
  const steps = cues.map((c) => c.trim()).filter((c) => c.length > 0);
  // A instrução é curta e UMA palavra manda: a primeira sobe de corpo, o resto apoia.
  const [word, ...rest] = (steps[0] ?? "").split(" ");
  const note = item.notes?.trim();
  const bare = steps.length === 0 && !error && !note;

  return (
    <Phone>
      {/* O kicker fica mudo aqui: o acento desta tela é a palavra que ensina, não o rótulo. */}
      <Head kicker="Como fazer" kickerMuted title={item.name} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {video ? (
          <Band pad={false}>
            {/* ponytail: 4 + os 16 de dentro do botão = a mesma sarjeta de 20 do título. */}
            <View style={styles.bleed}>
              <AccentCTA
                label="Ver vídeo"
                onPress={() => {
                  Linking.openURL(video).catch(() => setFailed(true));
                }}
              />
            </View>
            {failed ? (
              <Txt role="note" tone="muted" style={styles.failed}>
                Não deu para abrir o vídeo.
              </Txt>
            ) : null}
          </Band>
        ) : null}

        {steps.length > 0 ? (
          <Band>
            <Txt role="label">
              {steps.length} {steps.length === 1 ? "passo" : "passos"}
            </Txt>
            {/* A palavra destacada é destacada por CORPO, não por matiz: com o acento na
                tinta, o time 13 desenhava o herói mais apagado que a própria linha de
                apoio abaixo dele. O acento desta tela é o vídeo. */}
            <Txt role="hero" style={styles.word}>
              {up(word)}
            </Txt>
            {rest.length > 0 ? <Txt role="title">{rest.join(" ")}</Txt> : null}
          </Band>
        ) : null}

        {steps.slice(1).map((step, i) => (
          <View key={step} style={styles.step}>
            <Txt role="label" tone="dim" style={styles.ord}>
              {String(i + 2).padStart(2, "0")}
            </Txt>
            <Txt role="body" style={styles.stepText}>
              {up(step)}
            </Txt>
          </View>
        ))}

        {error ? (
          <Band>
            <Txt role="label">Erro comum</Txt>
            <Txt role="body" style={styles.body}>
              {error}
            </Txt>
          </Band>
        ) : null}

        {note ? (
          <Band>
            {/* Só o nome do personal — o recado é dele, não do sistema. O traço do acento
                é a voz dele, o mesmo da Ficha; nunca marca de erro. */}
            <Txt role="label">{timeName}</Txt>
            <Txt role="body" style={[styles.said, { borderLeftColor: A.mark }]}>
              {note}
            </Txt>
          </Band>
        ) : null}

        {bare ? (
          <Band>
            <Txt role="title">Este exercício ainda não tem descrição.</Txt>
            <Txt role="body" tone="muted" style={styles.body}>
              {video
                ? `Assista ao vídeo, ou pergunte ao ${timeName} na hora.`
                : `Pergunte ao ${timeName} na hora.`}
            </Txt>
          </Band>
        ) : null}

        <Band rule="none">
          <MaquinaOcupada
            token={token}
            timeName={timeName}
            prescriptionId={prescriptionId}
            from={item}
            items={items}
          />
        </Band>
      </ScrollView>
      <DockFooter>
        <AccentCTA
          label="Entendi"
          onPress={() => navigation.goBack()}
          check
          quiet={!!video}
        />
      </DockFooter>
    </Phone>
  );
}

const usarEstilos = estilos(({ T, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { paddingBottom: 8, flexGrow: 1 },
    bleed: { paddingHorizontal: SPACE.hair, paddingVertical: 8 },
    failed: { paddingHorizontal: T.pad, paddingBottom: 12 },
    word: { marginTop: SPACE.hair },
    step: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: SPACE.tight,
      paddingHorizontal: T.pad,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: T.hairline,
    },
    ord: { minWidth: 22 },
    stepText: { flex: 1 },
    body: { marginTop: 8 },
    said: { marginTop: SPACE.tight, paddingLeft: 12, borderLeftWidth: 2 },
  }),
);
