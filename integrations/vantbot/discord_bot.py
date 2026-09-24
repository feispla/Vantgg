import os
import discord
from discord.ext import commands
from dotenv import load_dotenv
import requests
import hashlib
import hmac
import json

load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
DISCORD_GUILD_ID = os.getenv("DISCORD_GUILD_ID")
VANT_BOT_SYNC_SECRET = os.getenv("VANT_BOT_SYNC_SECRET")
VANT_WEB_BASE_URL = os.getenv("VANT_WEB_BASE_URL", "https://vantgg.vercel.app/")

if not DISCORD_TOKEN:
    raise RuntimeError("Falta DISCORD_TOKEN en las variables de entorno")

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ Bot conectado como {bot.user}")
    print(f"✅ ID: {bot.user.id}")
    print(f"✅ Guild ID: {DISCORD_GUILD_ID}")
    print(f"✅ Web URL: {VANT_WEB_BASE_URL}")
    
    # Sincronizar comandos slash
    try:
        synced = await bot.tree.sync()
        print(f"✅ {len(synced)} comandos slash sincronizados")
    except Exception as e:
        print(f"❌ Error sincronizando comandos: {e}")

@bot.tree.command(name="ping", description="Verifica que el bot esté activo")
async def ping(interaction: discord.Interaction):
    """Responde con Pong"""
    await interaction.response.send_message("🏓 Pong! El bot está activo y funcionando.")

@bot.tree.command(name="info", description="Información del bot")
async def info(interaction: discord.Interaction):
    """Muestra información del bot"""
    embed = discord.Embed(
        title="🤖 VANT Bot Info",
        description="Bot oficial de VANT Discord",
        color=discord.Color.red()
    )
    embed.add_field(name="Bot ID", value=bot.user.id, inline=False)
    embed.add_field(name="Guild", value=DISCORD_GUILD_ID or "No configurado", inline=False)
    embed.add_field(name="Web", value=VANT_WEB_BASE_URL, inline=False)
    embed.add_field(name="Status", value="✅ Funcionando", inline=False)
    
    await interaction.response.send_message(embed=embed)

@bot.tree.command(name="help", description="Ayuda del bot")
async def help_cmd(interaction: discord.Interaction):
    """Muestra los comandos disponibles"""
    embed = discord.Embed(
        title="📖 Comandos VANT Bot",
        description="Lista de comandos disponibles",
        color=discord.Color.blue()
    )
    embed.add_field(name="/ping", value="Verifica que el bot esté activo", inline=False)
    embed.add_field(name="/info", value="Información del bot", inline=False)
    embed.add_field(name="/help", value="Muestra esta ayuda", inline=False)
    
    await interaction.response.send_message(embed=embed)

def sign_request(body: str) -> str:
    """Firma un request con HMAC SHA256"""
    if not VANT_BOT_SYNC_SECRET:
        raise ValueError("VANT_BOT_SYNC_SECRET no configurado")
    
    return hmac.new(
        VANT_BOT_SYNC_SECRET.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()

async def send_sync_event(event_type: str, data: dict):
    """Envía un evento de sincronización a la web"""
    try:
        event = {
            "type": event_type,
            **data
        }
        body = json.dumps(event)
        signature = sign_request(body)
        
        headers = {
            "Content-Type": "application/json",
            "x-vant-signature": signature
        }
        
        response = requests.post(
            f"{VANT_WEB_BASE_URL}api/discord/events",
            data=body,
            headers=headers,
            timeout=5
        )
        
        print(f"✅ Evento sincronizado: {event_type} - Status: {response.status_code}")
    except Exception as e:
        print(f"❌ Error sincronizando evento: {e}")

@bot.event
async def on_member_join(member: discord.Member):
    """Cuando un miembro se une al servidor"""
    print(f"➕ Miembro se unió: {member}")
    await send_sync_event("user.joined_discord", {
        "discordId": str(member.id),
        "username": member.name
    })

# Comando para conectar cuenta
@bot.tree.command(name="account", description="Conectar tu cuenta de VANT")
async def account(interaction: discord.Interaction):
    """Conecta tu cuenta de Discord con VANT"""
    embed = discord.Embed(
        title="🔗 Conectar Cuenta",
        description=f"Haz clic en el link para conectar tu cuenta:\n[Ir a VANT]({VANT_WEB_BASE_URL})",
        color=discord.Color.green()
    )
    
    await interaction.response.send_message(embed=embed, ephemeral=True)
    
    await send_sync_event("user.linked_discord", {
        "discordId": str(interaction.user.id),
        "username": interaction.user.name,
        "email": interaction.user.email or "no-email"
    })

# Iniciar bot
print("🚀 Iniciando VANT Discord Bot...")
print(f"   Token: {'****' + DISCORD_TOKEN[-4:] if DISCORD_TOKEN else 'NO CONFIGURADO'}")
print(f"   Client ID: {DISCORD_CLIENT_ID or 'NO CONFIGURADO'}")
print(f"   Guild ID: {DISCORD_GUILD_ID or 'NO CONFIGURADO'}")

bot.run(DISCORD_TOKEN)
