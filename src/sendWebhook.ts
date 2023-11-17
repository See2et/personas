import config from "../config.json" assert { type: "json" };
import personas from "../personas.json" assert { type: "json" };
import getPersona from "./getPersona.ts";

export function sendWebhook(id: string, content: string) {
  const info = getPersona(id);

  const body = JSON.stringify({
    content,
    username: info.username,
    avatar_url: info.avatar_url,
  });

  fetch(
    config.webhookId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    },
  );
}
