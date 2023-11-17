import {
  createBot,
  CreateSlashApplicationCommand,
  Intents,
  InteractionResponseTypes,
  startBot,
} from "./src/deps.ts";
import config from "./config.json" assert { type: "json" };

const bot = createBot({
  token: config.token,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  events: {
    ready: (_bot, payload) => {
      console.log(`${payload.user.username} is ready!`);
    },
  },
});

const nekoCommand: CreateSlashApplicationCommand = {
  name: "neko",
  description: "にゃーん",
};

await bot.helpers.createGuildApplicationCommand(nekoCommand, config.guildId);
await bot.helpers.upsertGuildApplicationCommands(config.guildId, [nekoCommand]);

bot.events.interactionCreate = (b, interaction) => {
  switch (interaction.data?.name) {
    case "neko": {
      b.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "にゃーん",
        },
      });
      break;
    }
    default: {
      break;
    }
  }
};

await startBot(bot);
