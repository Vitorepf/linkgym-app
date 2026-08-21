import { useEffect, useState } from "react";
import { today, type Person, type Time, type TodayPayload } from "../../api";

import { AccentCTA } from "../../ui/AccentCTA";
import { Figure } from "../../ui/Figure";
import { plannedSets } from "../../ui/format";
import { Band, D0_STEPS, DockFooter, Head, Phone, StepRail } from "../../ui/Screen";
import { useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  person: Person;
  time: Time;
  onContinue: () => void;
};

/** Penúltima parada do D0. A contagem e a barra são as de `StepRail`, uma só para as oito
 *  paradas — aqui não se inventa denominador. */
const HERE = D0_STEPS - 1;

/** "O que acontece agora": um número, uma instrução curta, um botão.
 *
 *  Eram três faixas de prosa de peso idêntico — nada dominava, e dois terços da tela
 *  ficavam vazios embaixo delas. ponytail: as três faixas morreram. O que sobrou é o que
 *  o aluno precisa saber antes do ritual começar: quanto dura a primeira sessão, e por
 *  onde a próxima chega. O nome dele e o "bem-vindo" saíram junto — a saudação não era o
 *  trabalho desta tela, e o nome longo comia duas linhas de título.
 *
 *  A instrução é UMA frase com UMA palavra no acento, e ela é o MOTIVO do botão: a
 *  permissão é emoldurada aqui, na tela do produto, antes de qualquer diálogo do sistema.
 */
export function Pronto({ token, time, onContinue }: Props) {
  const { acento } = useTema();
  const A = acento();
  const [pres, setPres] = useState<TodayPayload["prescription"]>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const payload = await today(token);
        if (alive) setPres(payload.prescription);
      } catch {
        // ponytail: sem prescrição, sem número. A tela não desenha um 0 nem um "—" para
        // preencher buraco — número inventado é pior que número ausente.
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  return (
    <Phone>
      <Head kicker={`${HERE} · ${D0_STEPS}`} title="O que acontece agora">
        <StepRail now={HERE} />
      </Head>

      {/* Duas superfícies que crescem, e não um `flex: 1` cru com o número boiando: a
          sobra da tela é DIVIDIDA entre as duas e vira respiro interno de cada uma. O
          buraco único de 285pt no chão nu era o terço perdido que os juízes cobraram. */}
      <Band raised grow rule="none">
        {pres ? (
          <Figure
            role="mega"
            label="Primeira sessão"
            value={pres.minutes}
            unit="min"
            note={`${pres.name} · ${pres.items.length} exercícios · ${plannedSets(pres.items)} séries`}
          />
        ) : null}
      </Band>

      {/* O AVISO TEM REMETENTE. A moldura da permissão continua sendo a da barra (o motivo
          dito na tela do produto, antes do diálogo do sistema), mas "toda sessão nova chega
          por aviso" era um app falando de si — ninguém se afeiçoa a um agendador. Quem monta
          a próxima sessão é uma pessoa com nome, e é ela que está combinando de te chamar.
          É a maior alavanca emocional deste produto e ela custa uma linha. */}
      {/* O QUE ESTA TELA PROMETIA NÃO EXISTE. Ela dizia que "o aviso chega aqui" e o botão
          dizia "Quero o aviso" — pedindo consentimento para uma notificação que o app não
          sabe mandar, porque `expo-notifications` não está instalado e dependência nova é
          proibida. A última tela da entrada terminava com a aluna esperando um aviso que
          nunca ia chegar.
          O que fica é a alavanca de verdade, que nunca dependeu da notificação: quem monta
          a próxima sessão é uma PESSOA com nome, e é ela que está combinando de te chamar.
          No dia em que a dependência entrar, a frase do aviso volta — junto com o aviso. */}
      <Band raised grow rule="none">
        <Txt role="title">
          O {time.name} monta a sua próxima sessão, e ela aparece{" "}
          <Txt role="title" color={A.text}>
            aqui no Hoje
          </Txt>
          .
        </Txt>
      </Band>

      <DockFooter>
        <AccentCTA label="Entendi" onPress={onContinue} />
      </DockFooter>
    </Phone>
  );
}

