import fs from 'node:fs';
import {
  ChannelType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  Partials,
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder
} from 'discord.js';

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('DISCORD_TOKEN is not configured');
  process.exit(1);
}

const configPath = './config.json';
const examplePath = './config.example.json';
if (!fs.existsSync(configPath)) {
  console.error(`[Maszynka] Skończ mnie konfigurować w ${configPath}. Skopiuj ${examplePath} jako ${configPath}.`);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (JSON.stringify(config).includes('PUT_') || JSON.stringify(config).includes('_HERE')) {
  console.error(`[Maszynka] Skończ mnie konfigurować w ${configPath}. W pliku nadal są placeholdery PUT_..._HERE.`);
  process.exit(1);
}

const prefix = config.prefix ?? 'm!';
const color = config.brand?.color ?? 3447003;
const commandNames = ['ping', 'help', 'userinfo', 'serverinfo', 'botinfo', 'avatar'];
const commands = commandNames.map(name => new SlashCommandBuilder().setName(name).setDescription(`Maszynka ${name} command`).toJSON());
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

function baseEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: config.brand?.name ?? 'Maszynka.pro' })
    .setTimestamp();
}

async function sendVerificationPanel(channel) {
  const message = await channel.send({ embeds: [baseEmbed(config.verification.title, config.verification.description)] });
  await message.react(config.verification.emoji);
  console.log(`[Maszynka] Wysłano panel weryfikacji: ${message.id}`);
}

async function sendTicketPanel(channel) {
  const message = await channel.send({ embeds: [baseEmbed(config.tickets.title, config.tickets.description)] });
  await message.react(config.tickets.emoji);
  console.log(`[Maszynka] Wysłano panel ticketów: ${message.id}`);
}

client.once('ready', async () => {
  console.log(`[Maszynka] Logged in as ${client.user.tag}`);
  client.user.setPresence({ activities: [{ name: (config.status ?? 'Watching Maszynka.pro').replace(/^Watching /, ''), type: 3 }] });
  await new REST({ version: '10' }).setToken(token).put(Routes.applicationCommands(client.user.id), { body: commands });
  console.log('[Maszynka] Slash commands registered');
  console.log(`[Maszynka] Prefix commands ready: ${prefix}help, ${prefix}weryfikacja, ${prefix}ticket, ${prefix}configcheck`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  try {
    const user = interaction.options.getUser?.('user') ?? interaction.user;
    const replies = {
      ping: `Pong: ${client.ws.ping}ms`,
      help: `Prefix: ${prefix}\nCommands: /ping /help /userinfo /serverinfo /botinfo /avatar`,
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

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  const [name] = message.content.slice(prefix.length).trim().split(/\s+/);
  try {
    if (name === 'help') {
      await message.reply({ embeds: [baseEmbed('Pomoc', `Komendy: \`${prefix}weryfikacja\`, \`${prefix}ticket\`, \`${prefix}configcheck\``)] });
    } else if (name === 'weryfikacja') {
      await sendVerificationPanel(message.channel);
    } else if (name === 'ticket') {
      await sendTicketPanel(message.channel);
    } else if (name === 'configcheck') {
      await message.reply('Config wygląda poprawnie. Bot jest gotowy do pracy.');
    }
  } catch (error) {
    console.error('[Maszynka] Prefix command error', error);
    await message.reply('Komenda nie powiodła się. Sprawdź uprawnienia bota i config.');
  }
});

client.on('messageReactionAdd', async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  const guild = reaction.message.guild;
  if (!guild) return;
  const emoji = reaction.emoji.name;
  if (config.verification.enabled && emoji === config.verification.emoji && reaction.message.channelId === config.verification.channelId) {
    const member = await guild.members.fetch(user.id);
    await member.roles.add(config.verification.roleId);
    console.log(`[Maszynka] Zweryfikowano użytkownika ${user.tag}`);
  }
  if (config.tickets.enabled && emoji === config.tickets.emoji && reaction.message.channelId === config.tickets.panelChannelId) {
    const member = await guild.members.fetch(user.id);
    const channel = await guild.channels.create({
      name: `ticket-${user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      type: ChannelType.GuildText,
      parent: config.tickets.categoryId,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        { id: config.tickets.supportRoleId, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });
    await channel.send({ content: `<@${member.id}> <@&${config.tickets.supportRoleId}>`, embeds: [baseEmbed('Ticket utworzony', 'Opisz swój problem. Administracja odpowie najszybciej jak może.')] });
    console.log(`[Maszynka] Utworzono ticket ${channel.name} dla ${user.tag}`);
  }
});

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => client.destroy());
client.login(token).catch(error => { console.error('[Maszynka] Login failed', error.message); process.exit(1); });
