import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  configDoTime, completeComeback, today, type Time, type TodayPayload } from "../../api";
import { studentHomeTarget } from "../../nav/StudentTabs";
import type { StudentTabNavigation } from "../../nav/types";
import { createSession, newLocalId } from "../../offline/sessionQueue";
import { Figure } from "../../ui/Figure";
import { GhostCTA } from "../../ui/GhostCTA";
import { IconClose } from "../../ui/Icons";
import { Initials } from "../../ui/Initials";
import { MetricGrid } from "../../ui/Metric";
import { Band } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { formatNum } from "../../ui/format";
import { estilos, useTema } from "../../ui/tema";

type Props = {
  token: string;
  time: Time;
  needsCommitment: boolean;
  comeback: NonNullable<TodayPayload["comeback"]>;
  /** O que continua de pé. Vem do payload que a Hoje já buscou — a faixa não abre uma
   *  segunda chamada só para se desenhar. */
  ofensiva: number;
  xp: number;
  onDismiss: () => void;
};

/** A Retomada é FAIXA DENTRO DO DIA, não porta na frente dele.
 *
 *  Era uma tela própria na pilha (src/nav/Root.tsx), montada antes das abas, e o Root
 *  gastava uma chamada de /v1/today só para decidir se ela apareceria — a Hoje então
 *  buscava tudo de novo. Quem tinha sumido chegava numa tela que não era o seu dia, com o
 *  acervo atrás em vez do treino.
 *
 *  Agora ela ocupa o mesmo slot da faixa de aviso da Hoje: fecha no X, e o caminho do dia
 *  fica utilizável atrás dela o tempo todo. É o formato que a barra do eixo 3 mede —
 *  docs/barra/eixo3-ritual-aluno/duolingo-20-ofensiva-zerada-faixa-na-home.jpg é
 *  exatamente uma faixa fechável sobre a home, não um bloqueio.
 *
 *  ORDEM, e ela é a regra: primeiro o que CONTINUA DE PÉ (Ofensiva e XP, em corpo de
 *  métrica), depois a linha do que aconteceu, em tom neutro. Nenhuma contagem de dias
 *  perdidos, nenhuma tinta de erro, nenhum emoji. Falha é AUSÊNCIA de marca. */
export function RetomadaBand({
  token,
  time,
  needsCommitment,
  comeback,
  ofensiva,
  xp,
  onDismiss,
}: Props) {
  const styles = usarEstilos();
  const { T, acento, errorInk } = useTema();
  const navigation = useNavigation<StudentTabNavigation>();
  const A = acento();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const dePe = [
    ...(ofensiva > 0 ? [{ label: "Ofensiva", value: formatNum(ofensiva) }] : []),
    ...(xp > 0 ? [{ label: "XP", value: formatNum(xp) }] : []),
  ];

  async function startNow() {
    if (busy) return;
    setBusy(true);
    setFailed(false);
    try {
      await completeComeback(token, comeback.id);
      const payload = await today(token);
      const prescription = payload.prescription;
      if (!prescription) {
        onDismiss();
        return;
      }
      const session = await createSession(prescription.id, newLocalId());
      navigation.navigate("Serie", {
        token,
        timeName: time.name,
        localId: session.local_id,
        prescriptionId: prescription.id,
        items: prescription.items,
        itemIndex: 0,
        setIndex: 1,
        ofensivaCount: payload.ofensiva.current_count,
        xpTotal: payload.xp_total,
        needsCommitment,
        passoKg: configDoTime(time).passo_kg,
      });
      onDismiss();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Band accentTop rule="none">
      <View style={styles.row}>
        <Initials name={time.name} size={38} />
        <View style={styles.grow}>
          <Txt role="label" color={A.text}>
            Retomada
          </Txt>
          <Txt role="body">{time.name}</Txt>
        </View>
        <Pressable
          onPress={onDismiss}
          hitSlop={14}
          accessibilityRole="button"
          accessibilityLabel="Fechar o aviso"
        >
          <IconClose color={T.muted} />
        </Pressable>
      </View>

      {/* O que continua de pé, ANTES de qualquer coisa sobre o que passou — e SÓ o que
          continua de pé. Depois de onze dias fora a Ofensiva vale literalmente 0
          (`current_count = 0`, internal/today/service.go), e a faixa que existe para dizer
          o que sobrou abria com um zero em corpo de métrica: o rótulo prometia patrimônio e
          entregava a conta do estrago. Falha é AUSÊNCIA de marca, então a célula da
          Ofensiva simplesmente não é desenhada quando ela não está de pé. O XP, que não
          zera, fica. Sem nenhuma das duas, a fila inteira some em vez de mostrar zeros. */}
      {dePe.length === 0 ? null : (
        <View style={styles.stands}>
          {dePe.length > 1 ? (
            <MetricGrid cells={dePe} />
          ) : (
            <Figure role="value" label={dePe[0].label} value={dePe[0].value} />
          )}
        </View>
      )}

      <Txt role="body" style={styles.line}>
        {/* a VOZ do personal, se ele escreveu; senão a frase do produto. O slot e as
            regras da Retomada (ordem, zero culpa) são intocáveis — só o texto troca. */}
        {configDoTime(time).retomada || comeback.coach_line}
      </Txt>

      {/* NEUTRO, e a razao e o orcamento de acento: quem pinta area com o acento nesta
          tela e o "Começar" do dia, e ele tem que continuar sendo o caminho principal —
          o brief pede que o dia siga utilizavel ATRAS da faixa. Se a Retomada roubasse o
          acento, o treino de hoje leria como desligado. A faixa e oferta, nao caminho.
          O gate acusou isto sozinho na primeira montagem: "Orçamento de acento estourado".

          Os minutos vao no rotulo em vez de virar prop nova no GhostCTA: uma peca de
          src/ui nao engorda para um chamador so. */}
      <View style={styles.cta}>
        <GhostCTA
          label={`Fazer agora · ${comeback.minutes} min`}
          onPress={() => void startNow()}
          disabled={busy}
        />
      </View>

      {failed ? (
        <Txt role="note" color={errorInk} style={styles.failed}>
          Não subiu agora. Tente de novo.
        </Txt>
      ) : null}
    </Band>
  );
}

const usarEstilos = estilos(({ T }) =>
  StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", gap: 12 },
    grow: { flex: 1, minWidth: 0 },
    stands: { marginTop: 14 },
    line: {
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: T.hairline,
    },
    cta: { marginTop: 16 },
    failed: { marginTop: 10 },
  }),
);
