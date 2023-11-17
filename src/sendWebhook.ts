export function sendWebhook(id: string, content: string) {
  let username: string;
  let avatar_url: string | null = null;
  switch (id) {
    case "se":
      username = "See2et / しーぜっと";
      avatar_url =
        "https://pub-33506eaed9964123b5ace46f04f3d73a.r2.dev/files/04e2c480-e834-4567-8d1e-b12fd698aa0c.webp";
      break;
    case "sh":
      username = "sh1rase / 白瀬ぬい";
      avatar_url =
        "https://pub-33506eaed9964123b5ace46f04f3d73a.r2.dev/files/81d7f946-8fd6-4327-8ae8-e0ab4ce0f993.webp";
      break;
    case "k0":
      username = "k0phy / こふぃー";
      break;
    case "m1":
      username = "m1nadzuki / 水無月むな";
      break;
    default:
      username = "unknown";
      break;
  }

  const body = JSON.stringify({
    username,
    content,
    avatar_url,
  });

  fetch(
    "https://discord.com/api/webhooks/1173502919203635231/As5RbWGsyJhDHAIefDSkk_eBSg_tQk56Zrk7folLoKS2iQCejT-k5Quchg5Ai1S9-Evr",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    },
  );
}
