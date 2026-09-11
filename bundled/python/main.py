import json
import os
import re
import discord
from discord import app_commands

token = os.getenv('DISCORD_TOKEN')
if not token:
    print('DISCORD_TOKEN is not configured')
    raise SystemExit(1)

CONFIG_PATH = 'config.json'
if not os.path.exists(CONFIG_PATH):
    print(f'[Maszynka] Skończ mnie konfigurować w {CONFIG_PATH}. Skopiuj config.example.json jako config.json.')
    raise SystemExit(1)
config = json.load(open(CONFIG_PATH, encoding='utf-8'))
if 'PUT_' in json.dumps(config):
    print(f'[Maszynka] Skończ mnie konfigurować w {CONFIG_PATH}. W pliku nadal są placeholdery PUT_..._HERE.')
    raise SystemExit(1)

prefix = config.get('prefix', 'm!')
intents = discord.Intents.default()
intents.message_content = True
intents.reactions = True
intents.members = True
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

def make_embed(title, description):
    return discord.Embed(title=title, description=description, color=config.get('brand', {}).get('color', 3447003))

async def send_verification(channel):
    msg = await channel.send(embed=make_embed(config['verification']['title'], config['verification']['description']))
    await msg.add_reaction(config['verification']['emoji'])
    print(f'[Maszynka] Wysłano panel weryfikacji: {msg.id}')

async def send_ticket_panel(channel):
    msg = await channel.send(embed=make_embed(config['tickets']['title'], config['tickets']['description']))
    await msg.add_reaction(config['tickets']['emoji'])
    print(f'[Maszynka] Wysłano panel ticketów: {msg.id}')

@client.event
async def on_ready():
    await tree.sync()
    await client.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name='Maszynka.pro'))
    print(f'[Maszynka] Logged in as {client.user}')
    print(f'[Maszynka] Prefix commands ready: {prefix}help, {prefix}weryfikacja, {prefix}ticket, {prefix}configcheck')

@client.event
async def on_message(message):
    if message.author.bot or not message.content.startswith(prefix):
        return
    parts = message.content[len(prefix):].split()
    name = parts[0].lower() if parts else ''
    if name == 'help':
        await message.reply(embed=make_embed('Pomoc', f'Komendy: `{prefix}weryfikacja`, `{prefix}ticket`, `{prefix}configcheck`'))
    elif name == 'weryfikacja':
        await send_verification(message.channel)
    elif name == 'ticket':
        await send_ticket_panel(message.channel)
    elif name == 'configcheck':
        await message.reply('Config wygląda poprawnie. Bot jest gotowy do pracy.')

@client.event
async def on_raw_reaction_add(payload):
    if payload.member and payload.member.bot:
        return
    guild = client.get_guild(payload.guild_id)
    if not guild:
        return
    emoji = str(payload.emoji)
    if config['verification']['enabled'] and emoji == config['verification']['emoji'] and str(payload.channel_id) == config['verification']['channelId']:
        member = guild.get_member(payload.user_id) or await guild.fetch_member(payload.user_id)
        await member.add_roles(guild.get_role(int(config['verification']['roleId'])))
        print(f'[Maszynka] Zweryfikowano użytkownika {member}')
    if config['tickets']['enabled'] and emoji == config['tickets']['emoji'] and str(payload.channel_id) == config['tickets']['panelChannelId']:
        member = guild.get_member(payload.user_id) or await guild.fetch_member(payload.user_id)
        support = guild.get_role(int(config['tickets']['supportRoleId']))
        overwrites = {
            guild.default_role: discord.PermissionOverwrite(view_channel=False),
            member: discord.PermissionOverwrite(view_channel=True, send_messages=True)
        }
        if support:
            overwrites[support] = discord.PermissionOverwrite(view_channel=True, send_messages=True)
        category = guild.get_channel(int(config['tickets']['categoryId']))
        channel = await guild.create_text_channel('ticket-' + re.sub('[^a-z0-9-]', '-', member.name.lower()), category=category, overwrites=overwrites)
        await channel.send(member.mention, embed=make_embed('Ticket utworzony', 'Opisz swój problem. Administracja odpowie najszybciej jak może.'))
        print(f'[Maszynka] Utworzono ticket {channel.name} dla {member}')

@tree.command()
async def ping(interaction): await interaction.response.send_message(f'Pong: {round(client.latency * 1000)}ms')
@tree.command()
async def help(interaction): await interaction.response.send_message('Commands: /ping /help /userinfo /serverinfo /botinfo /avatar', ephemeral=True)
@tree.command()
async def userinfo(interaction): await interaction.response.send_message(f'{interaction.user} ({interaction.user.id})')
@tree.command()
async def serverinfo(interaction): await interaction.response.send_message(f'{interaction.guild.name} ({interaction.guild.member_count} members)' if interaction.guild else 'DM')
@tree.command()
async def botinfo(interaction): await interaction.response.send_message(f'{client.user} serving {len(client.guilds)} guilds')
@tree.command()
async def avatar(interaction): await interaction.response.send_message(interaction.user.display_avatar.url)

client.run(token)
