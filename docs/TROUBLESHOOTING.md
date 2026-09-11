# Troubleshooting

## DISCORD_TOKEN is not configured

Set the token in Pterodactyl server variables. Do not paste it into source files.

## Slash commands do not appear

Restart the bot and wait for Discord to propagate global commands. For development, adapt the bundled bot to register guild commands.

## Git clone fails

Check `GIT_REPO`, `GIT_BRANCH`, and whether the repository is public or accessible from the node.

## Custom command is ignored

`STARTUP_COMMAND` must be non-empty. When set, it fully overrides the default runtime command.

## Dependency install fails

Set `AUTO_INSTALL_DEPS=0` and upload prebuilt files, or use a runtime image that contains the required build tools.
