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

const bot = createBot({
  token: config.token,
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

await bot.helpers.createGuildApplicationCommand(sayCommand, config.guildId);
await bot.helpers.upsertGuildApplicationCommands(config.guildId, [sayCommand]);

bot.events.interactionCreate = (b, interaction) => {
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
    }
  }
};

await startBot(bot);
