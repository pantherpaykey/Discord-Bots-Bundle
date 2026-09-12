import {
  createBot,
  Intents,
  startBot,
} from "https://raw.githubusercontent.com/discordeno/discordeno/17.0.0/mod.ts";

const token = Deno.env.get("DISCORD_TOKEN");

if (!token) {
  console.error("DISCORD_TOKEN is not configured");
  Deno.exit(1);
}

const bot = createBot({
  token,
  intents: Intents.Guilds,
  events: {
    ready() {
      console.log("[Maszynka] Logged in");
    },
  },
});

await startBot(bot);
