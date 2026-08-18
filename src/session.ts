import * as SecureStore from "expo-secure-store";
import type { Person, Studio } from "./api";

const TOKEN_KEY = "linkgym.token";

export type Session = {
  token: string;
  person: Person;
  studio: Studio;
};

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
