import personas from "../personas.json" assert { type: "json" };

export default function getPersona(id: string) {
  return personas.find((v) => {
    if (!v.id) return false;
    if (v.id !== id) return false;
    return true;
  }) ?? { id: "", username: "unknown", misskey_id: "", avatar_url: "" };
}
