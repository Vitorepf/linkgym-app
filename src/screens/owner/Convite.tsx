import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Share, StyleSheet, View } from "react-native";
import { abrirWhatsApp, temTelefone } from "../../whatsapp";
import { criarConvite, type Time } from "../../api";
import { AccentCTA } from "../../ui/AccentCTA";
import { Avatar } from "../../ui/Avatar";
import { Campo } from "../../ui/Campo";
import { GhostCTA } from "../../ui/GhostCTA";
import { Band, DockFooter, Head, Phone } from "../../ui/Screen";
import { estilos, useTema } from "../../ui/tema";
import { Txt } from "../../ui/Txt";

type Props = {
  token: string;
  time: Time;
};

/** A PORTA — e ela abre com o NÚMERO, não com um código.
 *
 *  O personal digita o telefone do aluno e toca uma vez. A partir daí aquele número está
 *  autorizado: o aluno abre o app, coloca o próprio número, e entra. Não existe código
 *  para decorar, ditar na porta da academia ou perder na rolagem do WhatsApp.
 *
 *  A razão é uma só: quem decide quem entra no time é o personal, e ele já decidiu quando
 *  digitou o número. Pedir o código de volta ao aluno é cobrar duas vezes pela mesma
 *  autorização — e é exatamente ali, com o app instalado e a mensagem aberta na mão, que
 *  alguém desiste. (A liberação por telefone vive em `resolverConvite`, na API.)
 *
 *  O código continua existindo para o convite ABERTO: o story, o cartaz na parede, onde
 *  ninguém sabe de antemão qual é o telefone de quem vai ler.
 *
 *  O convite é também o PRIMEIRO artefato da marca do personal que sai do app. Ele vai no
 *  WhatsApp dele, na primeira pessoa dele, e é o que ele mostra quando vende — por isso a
 *  mensagem é escrita na voz dele e o nome do produto não aparece em lugar nenhum dela. */
export function Convite({ token, time }: Props) {
  const styles = usarEstilos();
  const navigation = useNavigation();
  const { T, FORMA, errorInk } = useTema();
  const [fone, setFone] = useState("");
  const [convite, setConvite] = useState<{ code: string; phone: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");

  const temFone = temTelefone(fone);

  /** UM TOQUE faz as duas coisas: cria o convite e abre a conversa. Separar em "criar" e
   *  depois "mandar" era pedir ao personal que confirmasse uma decisão que ele já tinha
   *  tomado ao digitar o número. */
  async function chamar() {
    if (busy) return;
    setBusy(true);
    setErro("");
    try {
      const c = convite ?? (await criarConvite(token, temFone ? fone.trim() : undefined));
      setConvite({ code: c.code, phone: c.phone ?? "" });
      await abrir(c.code);
    } catch {
      setErro("Não deu para criar o convite.");
    } finally {
      setBusy(false);
    }
  }

  function texto(code: string): string {
    // A voz é a DELE, em primeira pessoa: quem chama é o personal, e a mensagem sai do
    // WhatsApp dele. O nome do aplicativo não entra — na tela do aluno só existe o nome do
    // time, e no convite também.
    const abertura = `Aqui é o ${time.name}. Te chamei para treinar comigo.`;
    if (temFone) {
      return `${abertura}\n\nBaixe o app e entre com este número: ${fone.trim()}\nJá deixei liberado — não precisa de código nem de senha.`;
    }
    return `${abertura}\n\nBaixe o app, entre com o seu número e use este convite: ${code}`;
  }

  /** O WhatsApp é a porta real: é onde o personal já fala com o aluno todo dia.
   *
   *  Pergunta-se ao sistema pelo ESQUEMA do aplicativo, e não pelo `https://wa.me`. A
   *  primeira versão usava o wa.me por ser universal, e no aparelho isso se mostrou errado:
   *  `openURL` de uma URL https NUNCA falha — sem o WhatsApp instalado o iOS abriu o Safari
   *  numa página em branco, e a queda para a folha de compartilhar, que existia justamente
   *  para esse caso, nunca chegou a rodar. Verificado no simulador.
   *
   *  Com o esquema, a resposta é honesta: tem WhatsApp, vai para a conversa; não tem, vai
   *  para a folha, que alcança SMS, Telegram e o resto. O pior caso deixou de ser um
   *  navegador vazio. (`LSApplicationQueriesSchemes` em app.json é o que faz o iOS
   *  responder "sim" — sem essa linha ele nega mesmo com o aplicativo instalado. No Expo Go
   *  ele nega de qualquer jeito, porque o Info.plist é o do Expo Go: cai na folha, que é o
   *  lado seguro de errar.) */
  async function abrir(code: string) {
    await abrirWhatsApp(temFone ? fone : "", texto(code));
  }

  async function compartilhar(code: string) {
    try {
      await Share.share({ message: texto(code) });
    } catch {
      /* o usuário cancelou a folha; não é erro */
    }
  }

  return (
    <Phone>
      <Head
        marca={
          time.logo_url ? (
            <Avatar url={time.logo_url} name={time.name} size={34} />
          ) : undefined
        }
        kicker={time.name}
        title="Chamar um aluno"
        body="Você digita o número, ele entra com o mesmo número. Sem código e sem senha."
      />

      <View style={styles.corpo}>
        <Band rule="hair">
          <Campo
            label="O número do aluno"
            rotulo
            nota="é por ele que o aluno entra — em branco, o convite serve para quem receber"
            hint="É por este número que ele entra no app"
            value={fone}
            onChangeText={(v) => {
              setFone(v);
              // Número novo, convite novo: manter o anterior mandaria para um telefone a
              // chave de outro.
              setConvite(null);
            }}
            placeholder="11 90000 0000"
            keyboardType="phone-pad"
            autoComplete="tel"
            maxLength={20}
          />
        </Band>

        {convite ? (
          <Band raised grow rule="none">
            {temFone ? (
              <>
                <Txt role="label">Liberado</Txt>
                {/* O herói desta tela é o NÚMERO, porque é ele que o aluno vai digitar.
                    Antes o herói era o código — o dado que agora ninguém precisa usar. */}
                <Txt role="value" style={styles.heroi}>
                  {fone.trim()}
                </Txt>
                <Txt role="body" tone="muted">
                  É só ele abrir o app e colocar este número.
                </Txt>
                <Txt role="note" tone="dim" style={styles.nota}>
                  convite {convite.code} · guardado por quatro anos, caso você precise dele
                </Txt>
              </>
            ) : (
              <>
                <Txt role="label">O convite aberto</Txt>
                {/* Sem telefone ninguém foi nomeado, então a chave volta a ser o código —
                    e ele vai ser lido em voz alta e digitado por alguém na porta da
                    academia. Por isso é `value`, e não corpo de texto. */}
                <Txt role="value" style={styles.heroi}>
                  {convite.code}
                </Txt>
                <Txt role="body" tone="muted">
                  Serve para quem receber. Vale por quatro anos.
                </Txt>
              </>
            )}
          </Band>
        ) : (
          // Sem `grow`: antes do convite existir não há nada para ocupar a tela, e um bloco
          // que cresce transforma "nada" num retângulo de 600pt com uma frase boiando no
          // meio. A frase encosta no campo, que é o que ela explica, e a sobra fica sobra.
          <Band rule="none">
            <Txt role="body" tone="muted">
              {temFone
                ? "Um toque abre o WhatsApp com a mensagem pronta, na sua voz."
                : "Com o número, o aluno entra direto. Sem ele, sai um convite aberto com código."}
            </Txt>
          </Band>
        )}

        {erro ? (
          <Band rule="none">
            <Txt role="body" color={errorInk} accessibilityRole="alert">
              {erro}
            </Txt>
          </Band>
        ) : null}
      </View>

      <DockFooter>
        <AccentCTA
          label={rotulo(busy, temFone, convite !== null)}
          onPress={() => void chamar()}
          busy={busy}
          check={convite !== null}
        />
        <View style={styles.segunda}>
          {convite ? (
            <GhostCTA
              label="Mandar de outro jeito"
              onPress={() => void compartilhar(convite.code)}
              fundo={FORMA.folha.chrome.composto}
            />
          ) : (
            <GhostCTA
              label="Voltar"
              onPress={() => navigation.goBack()}
              fundo={FORMA.folha.chrome.composto}
            />
          )}
        </View>
      </DockFooter>
    </Phone>
  );
}

function rotulo(busy: boolean, temFone: boolean, jaTem: boolean): string {
  if (busy) return "Abrindo…";
  if (jaTem) return "Mandar de novo";
  return temFone ? "Chamar no WhatsApp" : "Criar um convite aberto";
}

/** Só os dígitos: o campo aceita a pontuação que a mão do personal produzir. */


const usarEstilos = estilos(({ SPACE }) =>
  StyleSheet.create({
    corpo: { flex: 1 },
    nota: { marginTop: SPACE.hair },
    heroi: { marginTop: SPACE.hair, marginBottom: SPACE.hair },
    segunda: { marginTop: SPACE.tight },
  }),
);
