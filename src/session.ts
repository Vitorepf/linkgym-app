import * as SecureStore from "expo-secure-store";
import type { Person, Studio } from "./api";

const TOKEN_KEY = "linkgym.token";

export type Session = {
  token: string;
  person: Person;
  studio: Studio;
};

export async function loadToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
