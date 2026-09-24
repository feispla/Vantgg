import logging
import os
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, ContextTypes, MessageHandler, filters
from supabase import create_client, Client

load_dotenv()

# ========== CONFIG ==========

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
VANT_WEB_BASE_URL = os.getenv("VANT_WEB_BASE_URL", "https://vantgg.vercel.app/")

# Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not TELEGRAM_BOT_TOKEN:
    raise RuntimeError("Falta TELEGRAM_BOT_TOKEN")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Falta SUPABASE_URL o SUPABASE_KEY")

# Initialize Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

def get_player(user_id: str):
    """Obtiene datos del jugador desde tabla 'players'"""
    try:
        response = supabase.table("players").select("*").eq("telegram_id", str(user_id)).single().execute()
        return response.data if response.data else None
    except:
        return None

def get_player_stats(player_id: str):
    """Obtiene estadísticas del jugador"""
    try:
        response = supabase.table("season_player_stats").select("*").eq("player_id", player_id).execute()
        return response.data if response.data else []
    except:
        return []

def get_leaderboard(limit: int = 10):
    """Obtiene top jugadores por puntos"""
    try:
        response = supabase.table("players").select("*").order("rating", desc=True).limit(limit).execute()
        return response.data if response.data else []
    except:
        return []

def get_ranked_history(player_id: str, limit: int = 5):
    """Obtiene historial de partidas"""
    try:
        response = supabase.table("ranked_history").select("*").eq("player_id", player_id).order("created_at", desc=True).limit(limit).execute()
        return response.data if response.data else []
    except:
        return []

# ========== COMMANDS ==========

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /start - Sin consultar BD"""
    keyboard = [
        [InlineKeyboardButton("🔗 Vincular Cuenta", callback_data="link")],
        [InlineKeyboardButton("🎮 Ranked", callback_data="ranked")],
        [InlineKeyboardButton("👤 Mi Perfil", callback_data="perfil")],
        [InlineKeyboardButton("📊 Leaderboard", callback_data="leaderboard")],
        [InlineKeyboardButton("🌐 Web", url=VANT_WEB_BASE_URL)],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "🎮 **Bienvenido a VANT Bot**\n\n"
        "Soy tu asistente de Ranked.\n"
        "Primero vincula tu cuenta con /link\n\n"
        "¿Qué quieres hacer?",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /help - Sin consultar BD"""
    help_text = """
🎮 **VANT Bot - Comandos**

/start - Menú principal
/help - Esta ayuda
/link [código] - Vincular tu cuenta de Telegram
/perfil - Tu perfil de jugador
/ranked - Comandos de Ranked
/leaderboard - Top 10 jugadores
/historial - Tu historial de partidas
/web - Link a la web
/test - Prueba del bot

Primero: /link [código_de_vinculación]
"""
    await update.message.reply_text(help_text, parse_mode="Markdown")

async def link_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /link [código] - Vincular cuenta de Telegram"""
    telegram_id = str(update.message.from_user.id)
    
    if not context.args:
        await update.message.reply_text(
            "❌ Uso: /link <código_de_vinculación>\n\n"
            "Obtén tu código en: " + VANT_WEB_BASE_URL + "link-telegram",
            parse_mode="Markdown"
        )
        return
    
    code = context.args[0]
    
    try:
        # Llamar a claim_telegram_link_code
        response = supabase.rpc("claim_telegram_link_code", {
            "p_code": code,
            "p_telegram_id": telegram_id,
            "p_telegram_username": update.message.from_user.username or "unknown"
        }).execute()
        
        if response.data:
            await update.message.reply_text(
                "✅ **Cuenta vinculada exitosamente**\n\n"
                "Tu cuenta de Telegram está ahora conectada a VANT.",
                parse_mode="Markdown"
            )
        else:
            await update.message.reply_text(
                "❌ Código inválido o expirado.\n\n"
                "Los códigos vencen en 10 minutos. Genera uno nuevo en: " + VANT_WEB_BASE_URL,
                parse_mode="Markdown"
            )
    except Exception as e:
        logger.error(f"Error vinculando: {e}")
        await update.message.reply_text(
            "❌ Error al vincular. Intenta más tarde.",
            parse_mode="Markdown"
        )

async def perfil_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /perfil"""
    telegram_id = update.message.from_user.id
    player = get_player(telegram_id)
    
    if player:
        stats = get_player_stats(player.get("id"))
        latest_stat = stats[0] if stats else {}
        
        text = f"""
👤 **Tu Perfil**

Nombre: {player.get('name', 'N/A')}
Rating: {latest_stat.get('rating', 0)}
Victorias: {latest_stat.get('wins', 0)}
Derrotas: {latest_stat.get('losses', 0)}
Rango: {latest_stat.get('rank', 'Unranked')}
"""
    else:
        text = "❌ Cuenta no vinculada.\n\nUsa /link <código> para vincular."
    
    await update.message.reply_text(text, parse_mode="Markdown")

async def ranked_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /ranked"""
    keyboard = [
        [InlineKeyboardButton("📝 Entrar a cola", callback_data="ranked_queue")],
        [InlineKeyboardButton("📊 Mi rango", callback_data="ranked_profile")],
        [InlineKeyboardButton("📈 Leaderboard", callback_data="ranked_lb")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "🎮 **Ranked**",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

async def leaderboard_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /leaderboard"""
    leaders = get_leaderboard(10)
    if leaders:
        text = "📊 **Top 10 Jugadores**\n\n"
        for i, player in enumerate(leaders, 1):
            name = player.get("name", "Unknown")
            rating = player.get("rating", 0)
            text += f"{i}. {name} - {rating} rating\n"
    else:
        text = "Sin datos de leaderboard."
    
    await update.message.reply_text(text, parse_mode="Markdown")

async def historial_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /historial"""
    telegram_id = update.message.from_user.id
    player = get_player(telegram_id)
    
    if not player:
        await update.message.reply_text(
            "❌ Cuenta no vinculada. Usa /link <código>",
            parse_mode="Markdown"
        )
        return
    
    history = get_ranked_history(player.get("id"), 5)
    if history:
        text = "📋 **Últimas 5 Partidas**\n\n"
        for match in history:
            result = "✅ WIN" if match.get("result") == "win" else "❌ LOSS"
            rating_change = match.get("rating_change", 0)
            text += f"{result} ({rating_change:+d} rating)\n"
    else:
        text = "Sin historial de partidas."
    
    await update.message.reply_text(text, parse_mode="Markdown")

async def web_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /web"""
    keyboard = [[InlineKeyboardButton("🌐 Ir a VANT", url=VANT_WEB_BASE_URL)]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Accede a la plataforma completa:",
        reply_markup=reply_markup
    )

async def test_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /test"""
    text = f"""
🧪 **Test - Bot Funcionando**

✅ El bot está corriendo
✅ Conectado a Supabase
✅ Telegram ID: {update.message.from_user.id}

Usa /link para vincular tu cuenta.
"""
    await update.message.reply_text(text, parse_mode="Markdown")

async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Manejador de mensajes generales"""
    await update.message.reply_text(
        "Usa /help para ver los comandos disponibles."
    )

# ========== MAIN ==========

def main() -> None:
    print("🚀 VANT Telegram Bot iniciando...")
    print(f"   Supabase: Conectado")
    print(f"   Modo: Lectura de players, season_player_stats, ranked_history")
    print(f"   Link: Usa claim_telegram_link_code (RPC)")
    
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Commands
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("link", link_command, pass_args=True))
    application.add_handler(CommandHandler("perfil", perfil_command))
    application.add_handler(CommandHandler("ranked", ranked_command))
    application.add_handler(CommandHandler("leaderboard", leaderboard_command))
    application.add_handler(CommandHandler("historial", historial_command))
    application.add_handler(CommandHandler("web", web_command))
    application.add_handler(CommandHandler("test", test_command))
    
    # Message handler
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))
    
    # Start polling
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
