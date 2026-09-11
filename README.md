# Discord Bots Bundle

Bundled Discord bot templates used by Maszynka.pro Pterodactyl eggs.

Important: this repository intentionally stores only bot source code. Egg JSON files are distributed separately as a ZIP, so the Pterodactyl eggs can default to this repository without publishing the egg package here.

## Bundled Runtimes

- Node.js
- Python
- Java
- .NET / C#
- Bun
- Deno
- Go
- Rust
- PHP

## Node.js / Bun Starter Bot

The Node.js and Bun bundled bots include:

- ticket panel by reaction
- reaction verification
- prefix commands such as `m!weryfikacja`, `m!ticket`, `m!configcheck`
- slash commands: `/ping`, `/help`, `/userinfo`, `/serverinfo`, `/botinfo`, `/avatar`
- full `config.example.json`
- terminal warning: `Skończ mnie konfigurować w ./config.json`

## Setup

1. Copy the selected runtime from `bundled/<runtime>`.
2. Copy `config.example.json` to `config.json` when the runtime uses it.
3. Set `DISCORD_TOKEN` in Pterodactyl.
4. Fill channel and role IDs in `config.json`.

No tokens or secrets are stored in this repository.
