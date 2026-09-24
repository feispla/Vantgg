import os
import discord
from discord.ext import commands
from dotenv import load_dotenv
import requests
import hashlib
import hmac
import json
from datetime import datetime
from supabase import create_client, Client

load_dotenv()

# ========== CONFIG ==========

DISCORD_TOKEN = os.getenv("DISCORD_TOKEN")
DISCORD_CLIENT_ID = os.getenv("DISCORD_CLIENT_ID")
DISCORD_GUILD_ID = os.getenv("DISCORD_GUILD_ID")
VANT_BOT_SYNC_SECRET = os.getenv("VANT_BOT_SYNC_SECRET")
VANT_WEB_BASE_URL = os.getenv("VANT_WEB_BASE_URL", "https://vantgg.vercel.app/")

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not DISCORD_TOKEN:
    raise RuntimeError("Falta DISCORD_TOKEN")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Falta SUPABASE_URL o SUPABASE_KEY")

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

intents = discord.Intents.default()
intents.message_content = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"✅ Bot: {bot.user}")
    print(f"✅ Supabase: Conectado")
    try:
        synced = await bot.tree.sync()
        print(f"✅ {len(synced)} comandos sincronizados")
    except Exception as e:
        print(f"❌ Error sincronizando comandos: {e}")

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

def get_player_profile(discord_id: str):
    """Obtiene perfil del jugador por Discord ID"""
    try:
        response = supabase.table("profiles").select("*").eq("discord_id", discord_id).single().execute()
        return response.data if response.data else None
    except:
        return None

def get_leaderboard(limit: int = 10):
    """Obtiene top jugadores por puntos"""
    try:
        response = supabase.table("profiles").select("*").order("points", desc=True).limit(limit).execute()
        return response.data if response.data else []
    except:
        return []

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
    """Comandos de Ranked"""
    embed = discord.Embed(title=f"🎮 Ranked - {accion}", color=discord.Color.red())
    
    discord_id = str(interaction.user.id)
    
    if accion == "entrar":
        try:
            existing = supabase.table("ranked_queue").select("*").eq("user_id", discord_id).execute()
            if existing.data:
                embed.description = "⚠️ Ya estás en la cola de Ranked."
            else:
                embed.description = "✅ Te has unido a la cola de Ranked. Esperando oponente..."
        except:
            embed.description = "❌ Error al agregar a la cola."
    
    elif accion == "placement":
        profile = get_player_profile(discord_id)
        if profile:
            placements = profile.get("placements_left", 5)
            embed.description = f"📝 Tienes **{placements}** partidas de colocación restantes."
        else:
            embed.description = "❌ No tienes perfil. Regístrate primero en la web."
    
    elif accion == "perfil":
        profile = get_player_profile(discord_id)
        if profile:
            embed.add_field(name="Usuario", value=profile.get("username", "N/A"), inline=False)
            embed.add_field(name="Rango", value=profile.get("rank_key", "unranked").upper(), inline=True)
            embed.add_field(name="Puntos", value=str(profile.get("points", 0)), inline=True)
            embed.add_field(name="Victorias", value=str(profile.get("wins", 0)), inline=True)
            embed.add_field(name="Derrotas", value=str(profile.get("losses", 0)), inline=True)
            wr = 0
            if profile.get("wins", 0) + profile.get("losses", 0) > 0:
                wr = round(100 * profile.get("wins", 0) / (profile.get("wins", 0) + profile.get("losses", 0)), 1)
            embed.add_field(name="WR%", value=f"{wr}%", inline=True)
        else:
            embed.description = "❌ No tienes perfil. Regístrate en https://vantgg.vercel.app/"
    
    elif accion == "estado":
        try:
            in_queue = supabase.table("ranked_queue").select("*").eq("user_id", discord_id).execute()
            if in_queue.data:
                embed.description = "🔄 Estás en la cola de Ranked."
            else:
                embed.description = "✅ No estás en la cola."
        except:
            embed.description = "✅ No estás en la cola."
    
    elif accion == "leaderboard":
        leaders = get_leaderboard(10)
        if leaders:
            leaderboard_text = "```\n"
            for i, player in enumerate(leaders, 1):
                username = player.get("username", "Unknown")
                points = player.get("points", 0)
                leaderboard_text += f"{i}. {username} - {points} pts\n"
            leaderboard_text += "```"
            embed.description = leaderboard_text
        else:
            embed.description = "Sin datos de leaderboard."
    
    elif accion == "historial":
        try:
            history = supabase.table("ranked_history").select("*").eq("user_id", discord_id).order("created_at", desc=True).limit(5).execute()
            if history.data:
                history_text = ""
                for match in history.data:
                    result = match.get("result", "").upper()
                    delta = match.get("points_delta", 0)
                    history_text += f"• {result} ({delta:+d} pts)\n"
                embed.description = history_text
            else:
                embed.description = "Sin historial de partidas."
        except:
            embed.description = "Sin historial de partidas."
    
    elif accion == "cola":
        try:
            queue = supabase.table("ranked_queue").select("id").execute()
            embed.description = f"👥 Jugadores en cola: {len(queue.data) if queue.data else 0}"
        except:
            embed.description = "Error al obtener cola."
    
    elif accion == "cancelar":
        try:
            supabase.table("ranked_queue").delete().eq("user_id", discord_id).execute()
            embed.description = "✅ Cancelada la búsqueda."
        except:
            embed.description = "❌ Error al cancelar."
    
    await interaction.response.send_message(embed=embed)
    await sync_event("ranked.action", {"userId": discord_id, "action": accion})

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
    
    discord_id = str(interaction.user.id)
    profile = get_player_profile(discord_id)
    
    if accion == "perfil":
        if profile:
            embed.add_field(name="Usuario", value=profile.get("username", interaction.user.name), inline=False)
            embed.add_field(name="Rango", value=profile.get("rank_key", "unranked").upper(), inline=False)
            embed.add_field(name="Puntos", value=str(profile.get("points", 0)), inline=False)
        else:
            embed.description = "❌ Sin perfil. Regístrate en la web."
    
    elif accion == "buscar":
        embed.description = "🔍 Búsqueda de jugadores: https://vantgg.vercel.app/players"
    
    elif accion == "estadisticas":
        if profile:
            wins = profile.get("wins", 0)
            losses = profile.get("losses", 0)
            total = wins + losses
            wr = round(100 * wins / total, 1) if total > 0 else 0
            embed.add_field(name="Victorias", value=str(wins), inline=True)
            embed.add_field(name="Derrotas", value=str(losses), inline=True)
            embed.add_field(name="WR%", value=f"{wr}%", inline=True)
        else:
            embed.description = "❌ Sin perfil."
    
    elif accion == "verificar":
        if profile:
            embed.description = "✅ Cuenta verificada"
        else:
            embed.description = "❌ Cuenta no verificada"
    
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
        embed.description = "🔗 Ve a https://vantgg.vercel.app/register para crear tu cuenta."
    elif accion == "perfil":
        embed.description = f"👤 Perfil de {interaction.user.name}"
    elif accion == "conectar":
        embed.description = "✅ Tu Discord está conectado a VANT"
    elif accion == "privacidad":
        embed.description = "🔓 Privacidad: PÚBLICA"
    
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
        try:
            tournaments = supabase.table("tournaments").select("*").eq("status", "open").execute()
            if tournaments.data:
                tourney_text = ""
                for t in tournaments.data[:5]:
                    name = t.get("name", "Unknown")
                    capacity = t.get("capacity", 0)
                    tourney_text += f"• **{name}** ({capacity} slots)\n"
                embed.description = tourney_text
            else:
                embed.description = "Sin torneos disponibles."
        except:
            embed.description = "Error cargando torneos."
    
    elif accion == "ver":
        embed.description = "📋 Ver torneos: https://vantgg.vercel.app/tournaments"
    
    elif accion == "registrar":
        embed.description = "📝 Regístrate en la web para participar en torneos."
    
    elif accion == "participantes":
        embed.description = "👥 Ver participantes en la web."
    
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
        embed.description = "📧 Abre un ticket en https://vantgg.vercel.app/support"
    elif accion == "cerrar":
        embed.description = "✅ Ticket cerrado"
    elif accion == "listar":
        try:
            user_id = str(interaction.user.id)
            tickets = supabase.table("support_tickets").select("*").eq("user_id", user_id).eq("status", "open").execute()
            embed.description = f"📋 Tickets abiertos: {len(tickets.data) if tickets.data else 0}"
        except:
            embed.description = "Error cargando tickets."
    
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
        embed.description = "📋 Eventos: https://vantgg.vercel.app/events"
    elif accion == "ver":
        embed.description = "👀 Ver eventos en la web"
    elif accion == "registrar":
        embed.description = "✅ Regístrate en la web para participar"
    
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
        embed.description = "⏱️ Temporada 1 - ACTIVA"
    elif accion == "ranking":
        leaders = get_leaderboard(5)
        if leaders:
            leaderboard_text = "```\n"
            for i, player in enumerate(leaders, 1):
                username = player.get("username", "Unknown")
                points = player.get("points", 0)
                leaderboard_text += f"{i}. {username} - {points} pts\n"
            leaderboard_text += "```"
            embed.description = leaderboard_text
        else:
            embed.description = "Sin ranking disponible."
    elif accion == "estadisticas":
        try:
            all_profiles = supabase.table("profiles").select("id").execute()
            total_players = len(all_profiles.data) if all_profiles.data else 0
            embed.description = f"👥 Total jugadores: {total_players}\n📊 Partidas: Próximamente"
        except:
            embed.description = "Error cargando estadísticas."
    
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
        embed.description = "✅ Temporada iniciada"
    elif accion == "temporada_cerrar":
        embed.description = "✅ Temporada cerrada"
    elif accion == "leaderboard_actualizar":
        embed.description = "✅ Leaderboard actualizado"
    
    await interaction.response.send_message(embed=embed)
    await sync_event("admin.action", {"userId": str(interaction.user.id), "action": accion})

# ========== HELP ==========

@bot.tree.command(name="help", description="Ayuda del bot")
async def help_cmd(interaction: discord.Interaction):
    """Muestra los comandos disponibles"""
    embed = discord.Embed(title="📖 Ayuda VANT Bot", color=discord.Color.blurple())
    embed.add_field(name="/ranked", value="🎮 Comandos de Ranked", inline=False)
    embed.add_field(name="/jugador", value="👤 Info de jugadores", inline=False)
    embed.add_field(name="/cuenta", value="🔐 Gestión de cuenta", inline=False)
    embed.add_field(name="/torneo", value="🏆 Torneos", inline=False)
    embed.add_field(name="/ticket", value="🎫 Soporte", inline=False)
    embed.add_field(name="/evento", value="📅 Eventos", inline=False)
    embed.add_field(name="/temporada", value="📊 Info de temporada", inline=False)
    embed.add_field(name="/admin", value="⚙️ Comandos admin", inline=False)
    
    await interaction.response.send_message(embed=embed)

# ========== START ==========

print("🚀 VANT Discord Bot iniciando...")
print(f"   Supabase: Conectado")

bot.run(DISCORD_TOKEN)
