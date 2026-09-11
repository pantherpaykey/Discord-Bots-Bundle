# Installation

## Pterodactyl Admin Panel

1. Open **Nests -> Import Egg**.
2. Create or select a nest named **Discord Bots**.
3. Import one egg per runtime:
   - Node.js
   - Python
   - Java
   - .NET
   - Bun
   - Deno
   - Go
   - Rust
   - PHP
4. When creating a server, select the runtime Docker image that matches the desired language version.
5. Set `DISCORD_TOKEN` in server variables.

## Recommended Server Defaults

- Memory: 256-512 MB for simple bots, more for Java/.NET/Rust builds.
- Disk: 512 MB minimum, 1-2 GB recommended for compiled projects.
- Startup marker: `[Maszynka] Runtime ready`.

## User Upload Mode

Set `USER_UPLOAD=1` to skip cloning during install. This is useful when clients upload files manually through SFTP or the panel file manager.
