# Maszynka.pro Pterodactyl Discord Bot Eggs

Production-ready Pterodactyl eggs for hosting Discord bots on Maszynka.pro style infrastructure. Each runtime has one PTDL_v2 egg with selectable Docker images, a consistent variable set, automatic dependency installation, and a bundled starter bot.

## Runtime Matrix

| Runtime | Recommended | Supported images | Bundled bot |
|---|---|---|---|
| Node.js | Node.js 24 | ghcr.io/parkervcp/yolks:nodejs_24<br>ghcr.io/parkervcp/yolks:nodejs_22<br>ghcr.io/parkervcp/yolks:nodejs_20 | bundled/nodejs |
| Python | Python 3.13 | ghcr.io/parkervcp/yolks:python_3.13<br>ghcr.io/parkervcp/yolks:python_3.12<br>ghcr.io/parkervcp/yolks:python_3.11 | bundled/python |
| Java | Java 21 LTS | ghcr.io/parkervcp/yolks:java_25<br>ghcr.io/parkervcp/yolks:java_21<br>ghcr.io/parkervcp/yolks:java_17 | bundled/java |
| .NET / C# | .NET 10 | ghcr.io/parkervcp/yolks:dotnet_10<br>ghcr.io/parkervcp/yolks:dotnet_9<br>ghcr.io/parkervcp/yolks:dotnet_8 | bundled/dotnet |
| Bun | Bun latest | ghcr.io/parkervcp/yolks:bun_latest<br>ghcr.io/parkervcp/yolks:bun_1 | bundled/bun |
| Deno | Deno latest | ghcr.io/parkervcp/yolks:deno_latest<br>ghcr.io/parkervcp/yolks:deno_2 | bundled/deno |
| Go | Go 1.25 | ghcr.io/parkervcp/yolks:go_1.25<br>ghcr.io/parkervcp/yolks:go_1.24<br>ghcr.io/parkervcp/yolks:go_1.23 | bundled/go |
| Rust | Rust latest | ghcr.io/parkervcp/yolks:rust_latest<br>ghcr.io/parkervcp/yolks:rust_1 | bundled/rust |
| PHP | PHP 8.4 | ghcr.io/parkervcp/yolks:php_8.4<br>ghcr.io/parkervcp/yolks:php_8.3<br>ghcr.io/parkervcp/yolks:php_8.2 | bundled/php |

## What Is Included

- PTDL_v2 eggs for Node.js, Python, Java, .NET, Bun, Deno, Go, Rust, and PHP.
- Bundled Discord bot templates using popular libraries for each language.
- Shared UX across eggs: `GIT_REPO`, `GIT_BRANCH`, `APP_DIR`, `MAIN_FILE`, `STARTUP_COMMAND`, `STARTUP_ARGS`, `AUTO_INSTALL_DEPS`, `AUTO_UPDATE`, `USER_UPLOAD`, and `DISCORD_TOKEN`.
- Validation and release scripts.
- GitHub Actions for JSON/script validation and runtime builds.

## Quick Import

1. Download the release ZIP or open the wanted file from `eggs/<runtime>/egg-<runtime>.json`.
2. In Pterodactyl Admin Panel go to **Nests -> Import Egg**.
3. Use or create a nest named **Discord Bots**.
4. Create a server, choose the runtime image, and set `DISCORD_TOKEN`.

## Default Bundled Bot

By default every egg pulls this same repository and copies the matching bundled app, for example Node.js uses:

`GIT_REPO=https://github.com/pantherpaykey/Discord-Bots-Bundle`
`APP_DIR=bundled/nodejs`

The bundled bots support slash commands: `/ping`, `/help`, `/userinfo`, `/serverinfo`, `/botinfo`, and `/avatar`. The token must be provided as `DISCORD_TOKEN`.

## Using Your Own Bot

Set:

- `GIT_REPO` to your repository URL.
- `GIT_BRANCH` to your branch, usually `main`.
- `APP_DIR=.` if the bot is at the repository root.
- `MAIN_FILE` to the entry file or project file.

For a custom command, set `STARTUP_COMMAND`, for example `npm start`, `python bot.py`, `cargo run --release`, or `dotnet Bot.dll`.

## Files

- [Installation guide](docs/INSTALLATION.md)
- [Runtime versions](docs/RUNTIMES.md)
- [Bundled bots](docs/BUNDLED-BOTS.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## Security

No Discord token is committed. Copy `.env.example` only for local development and configure `DISCORD_TOKEN` in Pterodactyl variables for production.
