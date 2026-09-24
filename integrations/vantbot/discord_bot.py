import os
import discord
from discord.ext import commands
from dotenv import load_dotenv
import requests
import hashlib
import hmac
import json
from datetime import datetime

load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
DISCORD_GUILD_ID = os.getenv("DISCORD_GUILD_ID")
VANT_BOT_SYNC_SECRET = os.getenv("VANT_BOT_SYNC_SECRET")
VANT_WEB_BASE_URL = os.getenv("VANT_WEB_BASE_URL", "https://vantgg.vercel.app/")

if not DISCORD_TOKEN:
    raise RuntimeError("Falta DISCORD_TOKEN")

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ Bot: {bot.user}")
    try:
        synced = await bot.tree.sync()
        print(f"✅ {len(synced)} comandos sincronizados")
    except Exception as e:
        print(f"❌ Error: {e}")

def sign_request(body: str) -> str:
    if not VANT_BOT_SYNC_SECRET:
        return ""
    return hmac.new(
        VANT_BOT_SYNC_SECRET.encode(),
        body.encode(),
        hashlib.sha256
    ).hexdigest()

async def sync_event(event_type: str, data: dict):
    try:
        event = {"type": event_type, **data}
        body = json.dumps(event)
        signature = sign_request(body)
        headers = {
            "Content-Type": "application/json",
            "x-vant-signature": signature
        }
        requests.post(
            f"{VANT_WEB_BASE_URL}api/discord/events",
            data=body,
            headers=headers,
            timeout=3
        )
    except:
        pass

# ========== RANKED ==========

@bot.tree.command(name="ranked", description="Comandos de Ranked")
@discord.app_commands.describe(accion="Acción a ejecutar")
@discord.app_commands.choices(accion=[
    discord.app_commands.Choice(name="entrar", value="entrar"),
    discord.app_commands.Choice(name="placement", value="placement"),
    discord.app_commands.Choice(name="perfil", value="perfil"),
    discord.app_commands.Choice(name="estado", value="estado"),
    discord.app_commands.Choice(name="leaderboard", value="leaderboard"),
    discord.app_commands.Choice(name="historial", value="historial"),
    discord.app_commands.Choice(name="cola", value="cola"),
    discord.app_commands.Choice(name="cancelar", value="cancelar"),
])
async def ranked(interaction: discord.Interaction, accion: str):
    """Comandos de Ranked: entrar, placement, perfil, estado, leaderboard, historial, cola, cancelar"""
    embed = discord.Embed(title=f"🎮 Ranked - {accion}", color=discord.Color.red())
    
    if accion == "entrar":
        embed.description = "Te has unido a la cola de Ranked. Espera a un oponente..."
    elif accion == "placement":
        embed.description = "Tienes 5 partidas de colocación restantes."
    elif accion == "perfil":
        embed.description = f"Tu rango: UNRANKED | MMR: 0 | Wins: 0"
    elif accion == "estado":
        embed.description = "Estás fuera de la cola."
    elif accion == "leaderboard":
        embed.description = "```Top 10 Jugadores\n1. Player1 - MMR: 2500\n2. Player2 - MMR: 2400```"
    elif accion == "historial":
        embed.description = "Sin historial de partidas."
    elif accion == "cola":
        embed.description = "No estás en la cola."
    elif accion == "cancelar":
        embed.description = "Has cancelado la búsqueda."
    
    await interaction.response.send_message(embed=embed)
    await sync_event("ranked.action", {"userId": str(interaction.user.id), "action": accion})

# ========== JUGADOR ==========

@bot.tree.command(name="jugador", description="Info de jugadores")
@discord.app_commands.describe(accion="Acción", usuario="Usuario Discord (opcional)")
@discord.app_commands.choices(accion=[
    discord.app_commands.Choice(name="perfil", value="perfil"),
    discord.app_commands.Choice(name="buscar", value="buscar"),
    discord.app_commands.Choice(name="estadisticas", value="estadisticas"),
    discord.app_commands.Choice(name="verificar", value="verificar"),
])
async def jugador(interaction: discord.Interaction, accion: str, usuario: str = None):
    """Comandos de jugador"""
    embed = discord.Embed(title=f"👤 Jugador - {accion}", color=discord.Color.blue())
    
    if accion == "perfil":
        embed.add_field(name="Usuario", value=interaction.user.name, inline=False)
        embed.add_field(name="Rango", value="UNRANKED", inline=False)
        embed.add_field(name="MMR", value="0", inline=False)
    elif accion == "buscar":
        embed.description = "Búsqueda de jugadores habilitada en la web."
    elif accion == "estadisticas":
        embed.add_field(name="Victorias", value="0", inline=True)
        embed.add_field(name="Derrotas", value="0", inline=True)
        embed.add_field(name="WR%", value="0%", inline=True)
    elif accion == "verificar":
        embed.description = "Cuenta verificada ✅"
    
    await interaction.response.send_message(embed=embed)

# ========== CUENTA ==========

@bot.tree.command(name="cuenta", description="Gestión de cuenta")
@discord.app_commands.describe(accion="Acción")
@discord.app_commands.choices(accion=[
    discord.app_commands.Choice(name="crear", value="crear"),
    discord.app_commands.Choice(name="perfil", value="perfil"),
    discord.app_commands.Choice(name="conectar", value="conectar"),
    discord.app_commands.Choice(name="privacidad", value="privacidad"),
])
async def cuenta(interaction: discord.Interaction, accion: str):
    """Gestión de cuenta VANT"""
    embed = discord.Embed(title=f"🔐 Cuenta - {accion}", color=discord.Color.green())
    
    if accion == "crear":
        embed.description = "Ve a https://vantgg.vercel.app/register para crear tu cuenta."
    elif accion == "perfil":
        embed.description = f"Perfil de {interaction.user.name}"
    elif accion == "conectar":
        embed.description = "Tu Discord está conectado a VANT ✅"
    elif accion == "privacidad":
        embed.description = "Configuración de privacidad: PÚBLICA"
    
    await interaction.response.send_message(embed=embed)
    await sync_event("account.action", {"userId": str(interaction.user.id), "action": accion})

# ========== TORNEO ==========

@bot.tree.command(name="torneo", description="Comandos de torneos")
@discord.app_commands.describe(accion="Acción")
@discord.app_commands.choices(accion=[
    discord.app_commands.Choice(name="lista", value="lista"),
    discord.app_commands.Choice(name="ver", value="ver"),
    discord.app_commands.Choice(name="registrar", value="registrar"),
    discord.app_commands.Choice(name="participantes", value="participantes"),
])
async def torneo(interaction: discord.Interaction, accion: str):
    """Gestión de torneos"""
    embed = discord.Embed(title=f"🏆 Torneo - {accion}", color=discord.Color.gold())
    
    if accion == "lista":
        embed.description = "**Torneos disponibles:**\n🔴 VANT Open - 64 slots\n🔵 VANT Pro Series - 32 slots"
    elif accion == "ver":
        embed.description = "Ve a https://vantgg.vercel.app/tournaments para más detalles."
    elif accion == "registrar":
        embed.description = "Registrado en el torneo ✅"
    elif accion == "participantes":
        embed.description = "32/64 participantes"
    
    await interaction.response.send_message(embed=embed)

# ========== TICKET ==========

@bot.tree.command(name="ticket", description="Gestión de tickets")
@discord.app_commands.describe(accion="Acción")
@discord.app_commands.choices(accion=[
    discord.app_commands.Choice(name="crear", value="crear"),
    discord.app_commands.Choice(name="cerrar", value="cerrar"),
    discord.app_commands.Choice(name="listar", value="listar"),
])
async def ticket(interaction: discord.Interaction, accion: str):
    """Gestión de tickets de soporte"""
    embed = discord.Embed(title=f"🎫 Ticket - {accion}", color=discord.Color.purple())
    
    if accion == "crear":
        embed.description = "Abre un ticket en https://vantgg.vercel.app/support"
    elif accion == "cerrar":
        embed.description = "Ticket cerrado ✅"
    elif accion == "listar":
        embed.description = "Sin tickets abiertos."
    
    await interaction.response.send_message(embed=embed)

# ========== EVENTO ==========

@bot.tree.command(name="evento", description="Gestión de eventos")
@discord.app_commands.describe(accion="Acción")
@discord.app_commands.choices(accion=[
    discord.app_commands.Choice(name="lista", value="lista"),
    discord.app_commands.Choice(name="ver", value="ver"),
    discord.app_commands.Choice(name="registrar", value="registrar"),
])
async def evento(interaction: discord.Interaction, accion: str):
    """Gestión de eventos"""
    embed = discord.Embed(title=f"📅 Evento - {accion}", color=discord.Color.blurple())
    
    if accion == "lista":
        embed.description = "Eventos próximos disponibles en la web."
    elif accion == "ver":
        embed.description = "Ve a https://vantgg.vercel.app/events"
    elif accion == "registrar":
        embed.description = "Registrado en el evento ✅"
    
    await interaction.response.send_message(embed=embed)

# ========== TEMPORADA ==========

@bot.tree.command(name="temporada", description="Info de temporada")
@discord.app_commands.describe(accion="Acción")
@discord.app_commands.choices(accion=[
    discord.app_commands.Choice(name="actual", value="actual"),
    discord.app_commands.Choice(name="ranking", value="ranking"),
    discord.app_commands.Choice(name="estadisticas", value="estadisticas"),
])
async def temporada(interaction: discord.Interaction, accion: str):
    """Información de temporada"""
    embed = discord.Embed(title=f"📊 Temporada - {accion}", color=discord.Color.orange())
    
    if accion == "actual":
        embed.description = "Temporada 1 está activa"
    elif accion == "ranking":
        embed.description = "```Ranking Temporada 1\n1. Player1 - 2500 MMR\n2. Player2 - 2400 MMR```"
    elif accion == "estadisticas":
        embed.description = "Total jugadores: 0\nPartidas jugadas: 0"
    
    await interaction.response.send_message(embed=embed)

# ========== ADMIN ==========

@bot.tree.command(name="admin", description="Comandos administrativos")
@discord.app_commands.describe(accion="Acción")
@discord.app_commands.choices(accion=[
    discord.app_commands.Choice(name="temporada_iniciar", value="temporada_iniciar"),
    discord.app_commands.Choice(name="temporada_cerrar", value="temporada_cerrar"),
    discord.app_commands.Choice(name="leaderboard_actualizar", value="leaderboard_actualizar"),
])
async def admin(interaction: discord.Interaction, accion: str):
    """Comandos administrativos (requiere permisos)"""
    if not interaction.user.guild_permissions.administrator:
        await interaction.response.send_message("❌ No tienes permisos de administrador.", ephemeral=True)
        return
    
    embed = discord.Embed(title=f"⚙️ Admin - {accion}", color=discord.Color.dark_red())
    
    if accion == "temporada_iniciar":
        embed.description = "Temporada iniciada ✅"
    elif accion == "temporada_cerrar":
        embed.description = "Temporada cerrada ✅"
    elif accion == "leaderboard_actualizar":
        embed.description = "Leaderboard actualizado ✅"
    
    await interaction.response.send_message(embed=embed)
    await sync_event("admin.action", {"userId": str(interaction.user.id), "action": accion})

# ========== HELP ==========

@bot.tree.command(name="help", description="Ayuda del bot")
async def help_cmd(interaction: discord.Interaction):
    """Muestra los comandos disponibles"""
    embed = discord.Embed(title="📖 Ayuda VANT Bot", color=discord.Color.blurple())
    embed.add_field(name="/ranked", value="Comandos de Ranked", inline=False)
    embed.add_field(name="/jugador", value="Info de jugadores", inline=False)
    embed.add_field(name="/cuenta", value="Gestión de cuenta", inline=False)
    embed.add_field(name="/torneo", value="Torneos", inline=False)
    embed.add_field(name="/ticket", value="Soporte", inline=False)
    embed.add_field(name="/evento", value="Eventos", inline=False)
    embed.add_field(name="/temporada", value="Info de temporada", inline=False)
    embed.add_field(name="/admin", value="Comandos admin", inline=False)
    
    await interaction.response.send_message(embed=embed)

# ========== START ==========

print("🚀 VANT Discord Bot iniciando...")
print(f"   Token: {'****' + DISCORD_TOKEN[-4:] if DISCORD_TOKEN else 'NO CONFIGURADO'}")
print(f"   Guild: {DISCORD_GUILD_ID}")
print(f"   Web: {VANT_WEB_BASE_URL}")

bot.run(DISCORD_TOKEN)
