import * as ImagePicker from "expo-image-picker";
import { mediaUrl, presignMedia } from "../api";

/** Galeria → presign → PUT pela API. Devolve a chave para gravar via PATCH (/v1/me ou
 *  /v1/owner/time) e a uri local para a prévia imediata. null = a pessoa desistiu.
 *  Quadrado e comprimido no aparelho: avatar de 4MB é desperdício de bolso do aluno. */
export async function escolherFoto(
  token: string,
  kind: "avatar" | "logo",
): Promise<{ objectKey: string; localUri: string } | null> {
  const picked = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "images",
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });
  if (picked.canceled || !picked.assets.length) return null;
  const asset = picked.assets[0];
  const contentType = asset.mimeType ?? "image/jpeg";

  const { object_key, upload_url } = await presignMedia(token, kind, contentType);
  const blob = await (await fetch(asset.uri)).blob();
  const res = await fetch(mediaUrl(upload_url) ?? upload_url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
      Authorization: `Bearer ${token}`,
    },
    body: blob,
  });
  if (!res.ok) throw new Error(`upload ${res.status}`);
  return { objectKey: object_key, localUri: asset.uri };
}
