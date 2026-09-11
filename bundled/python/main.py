import os
import discord
from discord import app_commands

token = os.getenv('DISCORD_TOKEN')
if not token:
    print('DISCORD_TOKEN is not configured')
    raise SystemExit(1)

class Bot(discord.Client):
    def __init__(self):
        super().__init__(intents=discord.Intents.default())
        self.tree = app_commands.CommandTree(self)
    async def setup_hook(self):
        await self.tree.sync()

client = Bot()

@client.event
async def on_ready():
    print(f'[Maszynka] Logged in as {client.user}')
    await client.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name='Maszynka.pro'))

@client.tree.command()
async def ping(interaction): await interaction.response.send_message(f'Pong: {round(client.latency * 1000)}ms')
@client.tree.command()
async def help(interaction): await interaction.response.send_message('Commands: /ping /help /userinfo /serverinfo /botinfo /avatar', ephemeral=True)
@client.tree.command()
async def userinfo(interaction): await interaction.response.send_message(f'{interaction.user} ({interaction.user.id})')
@client.tree.command()
async def serverinfo(interaction): await interaction.response.send_message(f'{interaction.guild.name} ({interaction.guild.member_count} members)' if interaction.guild else 'DM')
@client.tree.command()
async def botinfo(interaction): await interaction.response.send_message(f'{client.user} serving {len(client.guilds)} guilds')
@client.tree.command()
async def avatar(interaction): await interaction.response.send_message(interaction.user.display_avatar.url)

try:
    client.run(token)
except discord.LoginFailure:
    print('[Maszynka] Login failed')
