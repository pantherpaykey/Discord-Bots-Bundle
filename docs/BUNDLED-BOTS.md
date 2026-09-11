# Bundled Bots

All bundled bots are intentionally small templates with the same user-facing commands:

- `/ping`
- `/help`
- `/userinfo`
- `/serverinfo`
- `/botinfo`
- `/avatar`

Each bot reads `DISCORD_TOKEN` from the environment. If the token is missing, it prints `DISCORD_TOKEN is not configured` and exits cleanly.

Libraries used:

- Node.js: discord.js
- Python: discord.py
- Java: JDA
- .NET: Discord.Net
- Bun: discord.js on Bun
- Deno: Discordeno
- Go: discordgo
- Rust: serenity
- PHP: DiscordPHP
