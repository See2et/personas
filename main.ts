import {
  ApplicationCommandOptionTypes,
  createBot,
  CreateSlashApplicationCommand,
  Intents,
  InteractionResponseTypes,
  startBot,
} from "./src/deps.ts";
import config from "./config.json" assert { type: "json" };
import { sendWebhook } from "./src/sendWebhook.ts";
import getPersona from "./src/getPersona.ts";

const bot = createBot({
  token: config.discordToken,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready: (_bot, payload) => {
      console.log(`${payload.user.username} is ready!`);
    },
  },
});

const sayCommand: CreateSlashApplicationCommand = {
  name: "say",
  description: "say",
  options: [
    {
      required: true,
      name: "id",
      description: "id",
      type: ApplicationCommandOptionTypes.String,
    },
    {
      required: true,
      name: "message",
      description: "message",
      type: ApplicationCommandOptionTypes.String,
    },
  ],
};

const profileCommand: CreateSlashApplicationCommand = {
  name: "profile",
  description: "profile",
  options: [
    {
      required: true,
      name: "id",
      description: "id",
      type: ApplicationCommandOptionTypes.String,
    },
  ],
};

const commands = [sayCommand, profileCommand];

commands.map(async (v) => {
  await bot.helpers.createGuildApplicationCommand(v, config.guildId);
});
await bot.helpers.upsertGuildApplicationCommands(config.guildId, commands);

bot.events.interactionCreate = async (b, interaction) => {
  switch (interaction.data?.name) {
    case "say": {
      if (!interaction.data.options) return;
      const id = interaction.data.options[0].value;
      const content = interaction.data.options[1].value;
      sendWebhook(`${id}`, `${content}`);
      b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {},
      });
      break;
    }
    case "profile": {
      if (!interaction.data.options) return;
      const id = interaction.data.options[0].value;
      const persona = getPersona(`${id}`);
      const body = JSON.stringify({
        query: persona.misskey_id,
        offset: 0,
        limit: 1,
        origin: "local",
        detail: true,
      });
      const mi = await fetch(
        "https://mi.see2et.dev/api/users/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        },
      ).then((x) => x.json());
      b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [{
            title: persona.username,
            image: {
              url: `${persona.avatar_url}`,
            },
            description: mi[0].description ?? "",
            url: `https://mi.see2et.dev/@${persona.misskey_id}`,
          }],
        },
      });
    }
  }
};

await startBot(bot);
