import { Linking, Share } from "react-native";

/** O WHATSAPP, num lugar só.
 *
 *  É a porta real entre o personal e o aluno — é onde eles já falam todo dia —, e a forma
 *  de abri-la carrega conhecimento caro, descoberto no aparelho e não no papel:
 *
 *  Pergunta-se ao sistema pelo ESQUEMA do aplicativo, e NUNCA pelo `https://wa.me`.
 *  `Linking.openURL` de uma URL https nunca falha: sem o WhatsApp instalado o iOS abre o
 *  Safari numa página em branco, e a queda para a folha de compartilhar — que existe
 *  exatamente para esse caso — nunca chega a rodar. Com o esquema, a resposta é honesta:
 *  tem WhatsApp, vai para a conversa; não tem, vai para a folha, que alcança SMS, Telegram
 *  e o resto. O pior caso deixou de ser um navegador vazio.
 *
 *  (`LSApplicationQueriesSchemes` em app.json é o que faz o iOS responder "sim" — sem
 *  aquela linha ele nega mesmo com o aplicativo instalado. No Expo Go ele nega de qualquer
 *  jeito, porque o Info.plist é o do Expo Go: cai na folha, que é o lado seguro de errar.)
 *
 *  Isto morava dentro de Convite.tsx. Ganhou um segundo chamador quando a fila de risco
 *  passou a oferecer [Mandar] na linha, e conhecimento deste tipo copiado é conhecimento
 *  que diverge: a segunda cópia teria voltado ao wa.me. */
export function digitos(s: string): string {
  return s.replace(/\D+/g, "");
}

/** O número com país e sem sinal. A regra de país é a mesma de `NormalizePhone` na API:
 *  dez ou onze dígitos são Brasil. */
export function e164(s: string): string {
  const d = digitos(s);
  return d.length === 10 || d.length === 11 ? `55${d}` : d;
}

export function temTelefone(s: string): boolean {
  return digitos(s).length >= 10;
}

/** Abre a conversa com o texto já escrito — e EDITÁVEL, porque quem assina a mensagem é o
 *  personal. O app nunca envia nada: ele para no rascunho e o dedo dele decide.
 *
 *  Devolve `false` só quando nem a folha de compartilhar deu certo (usuário cancelou), e
 *  ninguém trata isso como erro: cancelar não é falha. */
export async function abrirWhatsApp(fone: string, texto: string): Promise<boolean> {
  const msg = encodeURIComponent(texto);
  const alvo = temTelefone(fone)
    ? `whatsapp://send?phone=${e164(fone)}&text=${msg}`
    : `whatsapp://send?text=${msg}`;
  try {
    if (await Linking.canOpenURL(alvo)) {
      await Linking.openURL(alvo);
      return true;
    }
  } catch {
    /* sem WhatsApp: a folha resolve, e sem avisar de erro nenhum */
  }
  try {
    await Share.share({ message: texto });
    return true;
  } catch {
    return false;
  }
}
