import { createBot, Intents, startBot } from "discordeno";
const token = Deno.env.get("DISCORD_TOKEN");
if (!token) { console.error("DISCORD_TOKEN is not configured"); Deno.exit(1); }
const bot = createBot({ token, intents: Intents.Guilds, events: { ready() { console.log("[Maszynka] Logged in"); } } });
await startBot(bot);
