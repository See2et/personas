import config from "../config.json" assert { type: "json" };
import personas from "../personas.json" assert { type: "json" };

export function sendWebhook(id: string, content: string) {
  const info = personas.find((v) => {
    if (!v.id) return false;
    if (v.id !== id) return false;
    return true;
  }) ?? { id: "", username: "unknown" };

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
