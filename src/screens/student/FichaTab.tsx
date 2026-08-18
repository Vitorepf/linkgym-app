import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { today, type Person, type Studio, type TodayItem } from "../../api";
import { FichaBody } from "./Ficha";

type Props = {
  token: string;
  person: Person;
  studio: Studio;
};

export function FichaTab({ token, studio }: Props) {
  const accent = studio.accent_color;
  const [items, setItems] = useState<TodayItem[]>([]);
  const [prescriptionId, setPrescriptionId] = useState("");
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const payload = await today(token);
          if (!alive) return;
          setItems(payload.prescription?.items ?? []);
          setPrescriptionId(payload.prescription?.id ?? "");
          setError("");
        } catch {
          if (alive) setError("Não deu para abrir a ficha.");
        }
      })();
      return () => {
        alive = false;
      };
    }, [token]),
  );

  return (
    <FichaBody
      token={token}
      studioName={studio.name}
      accent={accent}
      items={items}
      prescriptionId={prescriptionId}
      error={error}
      tab
    />
  );
}
