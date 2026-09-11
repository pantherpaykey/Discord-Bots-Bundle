import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
const token = process.env.DISCORD_TOKEN;
if (!token) { console.error('DISCORD_TOKEN is not configured'); process.exit(1); }
const commandNames = ['ping', 'help', 'userinfo', 'serverinfo', 'botinfo', 'avatar'];
const commands = commandNames.map(name => new SlashCommandBuilder().setName(name).setDescription(`Maszynka ${name} command`).toJSON());
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once('ready', async () => {
  console.log(`[Maszynka] Logged in as ${client.user.tag}`);
  client.user.setPresence({ activities: [{ name: 'Maszynka.pro', type: 3 }] });
  await new REST({ version: '10' }).setToken(token).put(Routes.applicationCommands(client.user.id), { body: commands });
  console.log('[Maszynka] Slash commands registered');
});
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  try {
    const user = interaction.options.getUser?.('user') ?? interaction.user;
    const replies = {
      ping: `Pong: ${client.ws.ping}ms`,
      help: 'Commands: /ping /help /userinfo /serverinfo /botinfo /avatar',
      userinfo: `${user.tag} (${user.id})`,
      serverinfo: interaction.guild ? `${interaction.guild.name} (${interaction.guild.memberCount ?? 'unknown'} members)` : 'DM',
      botinfo: `${client.user.tag} serving ${client.guilds.cache.size} guilds`,
      avatar: user.displayAvatarURL({ size: 1024 })
    };
    await interaction.reply({ content: replies[interaction.commandName] ?? 'Unknown command', ephemeral: interaction.commandName === 'help' });
  } catch (error) {
    console.error('[Maszynka] Command error', error);
    if (!interaction.replied) await interaction.reply({ content: 'Command failed.', ephemeral: true });
  }
});
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => client.destroy());
client.login(token).catch(error => { console.error('[Maszynka] Login failed', error.message); process.exit(1); });
