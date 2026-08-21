import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { Time } from "../../api";
import type { OwnerTabNavigation } from "../../nav/types";
import { Avatar } from "../../ui/Avatar";
import {
  IconChevron,
  IconFicha,
  IconPeople,
  IconTinta,
} from "../../ui/Icons";
import { Band, Phone, useFimDaRolagem } from "../../ui/Screen";
import { Txt } from "../../ui/Txt";
import { estilos, useTema } from "../../ui/tema";

type Props = {
  time: Time;
};

/** A casa do personal. Operação, Hoje e Semana são o trabalho do dia; daqui ele
 *  abre o perfil, as fichas de treino e a turma — cada um numa tela própria, em
 *  vez de amontoados numa aba que dizia Ficha e mostrava gente. */
export function Mais({ time }: Props) {
  const styles = usarEstilos();
  const fim = useFimDaRolagem();
  const { T } = useTema();
  const navigation = useNavigation<OwnerTabNavigation>();

  return (
    <Phone>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, fim]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.marca} accessibilityRole="header">
          <Avatar
            name={time.name}
            url={time.logo_url}
            fill
            size={88}
          />
          <Txt role="title" style={styles.nome} numberOfLines={2}>
            {time.name}
          </Txt>
        </View>

        <Band raised rule="none" pad={false}>
          <Porta
            icon={<IconTinta color={T.ink} size={22} />}
            title="Meu Perfil"
            note="nome, marca e a saída"
            onPress={() => navigation.navigate("PerfilTime")}
          />
          <Porta
            icon={<IconFicha color={T.ink} size={22} />}
            title="Ficha"
            note="os treinos que você aplica"
            onPress={() => navigation.navigate("Modelos")}
          />
          <Porta
            icon={<IconPeople color={T.ink} size={22} />}
            title="Alunos"
            note="chamar, buscar, conversar"
            onPress={() => navigation.navigate("Alunos")}
            last
          />
        </Band>
      </ScrollView>
    </Phone>
  );
}

function Porta({
  icon,
  title,
  note,
  onPress,
  last,
}: {
  icon: ReactNode;
  title: string;
  note: string;
  onPress: () => void;
  last?: boolean;
}) {
  const styles = usarEstilos();
  const { T } = useTema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={note}
      style={[styles.row, last && styles.last]}
      onPress={onPress}
    >
      <View style={styles.well}>{icon}</View>
      <View style={styles.who}>
        <Txt role="body">{title}</Txt>
        <Txt role="note" tone="dim">
          {note}
        </Txt>
      </View>
      <IconChevron color={T.muted2} size={16} />
    </Pressable>
  );
}

const usarEstilos = estilos(({ T, FORMA, SPACE }) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: { flexGrow: 1 },
    marca: {
      alignItems: "center",
      paddingHorizontal: T.pad,
      paddingTop: SPACE.room,
      paddingBottom: SPACE.block,
      gap: SPACE.tight,
    },
    nome: { textAlign: "center" },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingHorizontal: T.pad,
      paddingVertical: 14,
      minHeight: 64,
      borderBottomWidth: FORMA.fio,
      borderBottomColor: T.hairline,
    },
    last: { borderBottomWidth: 0 },
    well: {
      width: FORMA.alturaMinima,
      height: FORMA.alturaMinima,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: T.fill,
      borderRadius: FORMA.raioEm(FORMA.alturaMinima),
    },
    who: { flex: 1, minWidth: 0, gap: SPACE.hair },
  }),
);
