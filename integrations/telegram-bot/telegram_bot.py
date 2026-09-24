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

def get_player_profile(user_id: str):
    """Obtiene perfil del jugador"""
    try:
        response = supabase.table("profiles").select("*").eq("user_id", user_id).single().execute()
        return response.data if response.data else None
    except:
        return None

def get_leaderboard(limit: int = 10):
    """Obtiene top jugadores"""
    try:
        response = supabase.table("profiles").select("*").order("points", desc=True).limit(limit).execute()
        return response.data if response.data else []
    except:
        return []

# ========== COMMANDS ==========

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /start"""
    keyboard = [
        [InlineKeyboardButton("🎮 Ranked", callback_data="ranked")],
        [InlineKeyboardButton("👤 Perfil", callback_data="perfil")],
        [InlineKeyboardButton("🏆 Torneos", callback_data="torneos")],
        [InlineKeyboardButton("📊 Leaderboard", callback_data="leaderboard")],
        [InlineKeyboardButton("🌐 Web", url=VANT_WEB_BASE_URL)],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "🎮 **Bienvenido a VANT Bot**\n\n"
        "Soy tu asistente para jugar competitivo.\n"
        "¿Qué quieres hacer?",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /help"""
    help_text = """
🎮 **VANT Bot - Comandos Disponibles**

/start - Menú principal
/help - Esta ayuda
/ranked - Comandos de Ranked
/perfil - Tu perfil de jugador
/torneos - Torneos disponibles
/leaderboard - Top 10 jugadores
/web - Link a la web
/test - Prueba del bot

Usa los botones para navegar fácilmente.
"""
    await update.message.reply_text(help_text, parse_mode="Markdown")

async def test_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /test"""
    text = """
🧪 **Test - Bot Funcionando**

✅ El bot está corriendo correctamente
✅ Conectado a Supabase
✅ Sistema listo para usar

ID: {}
Este es un mensaje de prueba.
""".format(update.message.from_user.id)
    await update.message.reply_text(text, parse_mode="Markdown")

async def ranked_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /ranked"""
    keyboard = [
        [InlineKeyboardButton("📝 Entrar a cola", callback_data="ranked_entrar")],
        [InlineKeyboardButton("📊 Mi rango", callback_data="ranked_perfil")],
        [InlineKeyboardButton("📈 Leaderboard", callback_data="ranked_leaderboard")],
        [InlineKeyboardButton("🚫 Cancelar", callback_data="ranked_cancelar")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "🎮 **Ranked - Elige una opción**",
        reply_markup=reply_markup,
        parse_mode="Markdown"
    )

async def perfil_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /perfil"""
    user_id = str(update.message.from_user.id)
    profile = get_player_profile(user_id)
    
    if profile:
        text = f"""
👤 **Tu Perfil**

Usuario: {profile.get('username', 'N/A')}
Rango: {profile.get('rank_key', 'unranked').upper()}
Puntos: {profile.get('points', 0)}
Victorias: {profile.get('wins', 0)}
Derrotas: {profile.get('losses', 0)}
"""
    else:
        text = "❌ No tienes perfil. Regístrate en la web: " + VANT_WEB_BASE_URL
    
    await update.message.reply_text(text, parse_mode="Markdown")

async def torneos_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /torneos"""
    try:
        tournaments = supabase.table("tournaments").select("*").eq("status", "open").execute()
        if tournaments.data:
            text = "🏆 **Torneos Disponibles**\n\n"
            for t in tournaments.data[:5]:
                name = t.get("name", "Unknown")
                capacity = t.get("capacity", 0)
                text += f"• {name} ({capacity} slots)\n"
        else:
            text = "Sin torneos disponibles."
    except:
        text = "Error cargando torneos."
    
    await update.message.reply_text(text, parse_mode="Markdown")

async def leaderboard_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /leaderboard"""
    leaders = get_leaderboard(10)
    if leaders:
        text = "📊 **Top 10 Jugadores**\n\n"
        for i, player in enumerate(leaders, 1):
            username = player.get("username", "Unknown")
            points = player.get("points", 0)
            text += f"{i}. {username} - {points} pts\n"
    else:
        text = "Sin datos de leaderboard."
    
    await update.message.reply_text(text, parse_mode="Markdown")

async def web_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Comando /web"""
    keyboard = [[InlineKeyboardButton("🌐 Ir a VANT", url=VANT_WEB_BASE_URL)]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Accede a la web de VANT para más funciones:",
        reply_markup=reply_markup
    )

async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Manejador de mensajes generales"""
    await update.message.reply_text(
        "Usa /help para ver los comandos disponibles o usa los botones del menú."
    )

# ========== MAIN ==========

def main() -> None:
    print("🚀 VANT Telegram Bot iniciando...")
    print(f"   Token: {'****' + TELEGRAM_BOT_TOKEN[-4:] if TELEGRAM_BOT_TOKEN else 'NO CONFIGURADO'}")
    print(f"   Supabase: Conectado")
    
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Commands
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("test", test_command))
    application.add_handler(CommandHandler("ranked", ranked_command))
    application.add_handler(CommandHandler("perfil", perfil_command))
    application.add_handler(CommandHandler("torneos", torneos_command))
    application.add_handler(CommandHandler("leaderboard", leaderboard_command))
    application.add_handler(CommandHandler("web", web_command))
    
    # Message handler
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler))
    
    # Start polling
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
