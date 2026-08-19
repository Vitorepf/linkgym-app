import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
const TOKEN_KEY = "linkgym.token";
// ponytail: armazenamento seguro que falha não pode derrubar quem chama. O pior caso de
// um cofre indisponível é o aluno entrar de novo na próxima abertura; o pior caso de uma
// exceção aqui é o app não abrir. No host web nem existe implementação (o módulo
// expo-secure-store/build/ExpoSecureStore.web.js é `export default {}`), então isso não é
// teoria: as três chamadas rejeitam sempre.
export async function loadToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch {
    /* sessão só nesta abertura */
  }
}

export async function clearToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    /* nada guardado, nada a limpar */
  }
}

/** A APARÊNCIA GUARDADA AO LADO DO TOKEN.
 *
 *  O boot pinta uma tela antes de existir sessão — e pintava sempre no carvão, porque a
 *  aparência só chega no /v1/me. Para o estúdio de chão claro isso é uma piscada PRETA em
 *  toda abertura, na tela que ele vende como dele. Guardar o documento aqui é o que
 *  permite o app abrir já na cor certa; ele é substituído assim que o servidor responde,
 *  então nunca fica velho por mais de uma volta.
 *
 *  AsyncStorage e não o cofre: isto não é segredo, é preferência de desenho — e o cofre
 *  não existe no host web, onde tools/shots.mjs monta o app. */
const APARENCIA_KEY = "linkgym.aparencia";

export async function loadAparencia(): Promise<unknown | null> {
  try {
    const cru = await AsyncStorage.getItem(APARENCIA_KEY);
    return cru ? (JSON.parse(cru) as unknown) : null;
  } catch {
    return null;
  }
}

export async function saveAparencia(a: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(APARENCIA_KEY, JSON.stringify(a));
  } catch {
    /* abre no padrão da próxima vez; ninguém perde nada */
  }
}
