import logging
import os
from typing import Optional

from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)
from vant_db import VantDatabase

load_dotenv()

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# Environment
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "qwen2.5:7b")
OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434")

if not TELEGRAM_BOT_TOKEN:
    raise RuntimeError("Falta TELEGRAM_BOT_TOKEN en las variables de entorno")

# Database & Ollama
db = VantDatabase()
assistant = ChatOllama(
    model=OLLAMA_MODEL,
    base_url=OLLAMA_BASE_URL,
    temperature=0.7,
)

# User linking: telegram_id -> user_id
user_links: dict[int, str] = {}


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Start command with options menu."""
    if not update.message:
        return
    text = (
        "Hola. Soy VantBot Telegram.\n\n"
        "🎮 **Comandos VANT:**\n"
        "🏆 /perfil — Tu perfil y stats\n"
        "⚡ /ranked — Estado Ranked\n"
        "🎯 /torneos — Torneos activos\n"
        "🎟️ /tickets — Tus tickets\n"
        "📊 /leaderboard — Top 10\n"
        "📜 /historial — Últimas partidas\n\n"
        "🤖 **Asistente Ollama:**\n"
        "/ayuda — Info\n"
        "O escribe cualquier pregunta.\n\n"
        "⚙️ **/link USUARIO** — Vincular tu cuenta VANT"
    )
    await update.message.reply_text(text)


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Help and Ollama assistant."""
    if not update.message:
        return
    await update.message.reply_text(
        "Soy un asistente con Ollama. Puedo responder preguntas y ayudarte a redactar textos. "
        "Escribe cualquier pregunta o tarea."
    )


async def link_user(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Link Telegram user to VANT account by username."""
    if not update.message or not context.args:
        await update.message.reply_text(
            "Uso: /link <username>\nEjemplo: /link feispla"
        )
        return
    
    username = context.args[0].strip()
    
    try:
        profile = db.get_profile(username)
        
        if not profile:
            await update.message.reply_text(f"❌ No encontré el username '{username}'.")
            return
        
        user_id = profile["user_id"]
        user_links[update.message.from_user.id] = user_id
        
        await update.message.reply_text(
            f"✅ Vinculado a **{profile['display_name'] or username}**.\n"
            f"Ahora puedo mostrar tus stats y comandos VANT."
        )
    except Exception as e:
        logger.exception("Error linking user")
        await update.message.reply_text(
            "❌ Error al vincular. Verifica que el username exista."
        )


async def perfil(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show user profile and stats."""
    if not update.message:
        return
    
    user_id = user_links.get(update.message.from_user.id)
    if not user_id:
        await update.message.reply_text(
            "⚠️ Primero vincula tu cuenta con /link <username>"
        )
        return
    
    try:
        profile = db.get_profile_by_user_id(user_id)
        
        if not profile:
            await update.message.reply_text("❌ Perfil no encontrado.")
            return
        
        win_rate = 0
        if profile["wins"] + profile["losses"] > 0:
            win_rate = round((profile["wins"] / (profile["wins"] + profile["losses"])) * 100)
        
        rank_label = profile["rank_key"].upper().replace("-", " ")
        text = (
            f"👤 **{profile['display_name'] or profile['username']}**\n"
            f"User: `{profile['username']}`\n"
            f"🌍 {profile['country'] or 'No especificado'}\n\n"
            f"🏆 Rango: **{rank_label}**\n"
            f"⚡ Puntos: `{profile['points']}`\n"
            f"📊 W/L: {profile['wins']}W / {profile['losses']}L ({win_rate}%)\n"
            f"✅ Email verificado: {'Sí' if profile['email_verified'] else 'No'}"
        )
        await update.message.reply_text(text)
    except Exception as e:
        logger.exception("Error getting profile")
        await update.message.reply_text("❌ Error al obtener el perfil.")


async def ranked(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show ranked status and queue info."""
    if not update.message:
        return
    
    user_id = user_links.get(update.message.from_user.id)
    if not user_id:
        await update.message.reply_text(
            "⚠️ Primero vincula tu cuenta con /link <username>"
        )
        return
    
    try:
        profile = db.get_profile_by_user_id(user_id)
        
        if not profile:
            await update.message.reply_text("❌ Perfil no encontrado.")
            return
        
        rank_label = profile["rank_key"].upper().replace("-", " ")
        
        queue = db.get_ranked_queue(user_id)
        queue_status = ""
        if queue:
            queue_status = (
                f"\n⏱️ **En cola:**\n"
                f"Oponente: {queue['opponent_name']}\n"
                f"Rango: {queue['opponent_rank_key'].upper()}\n"
                f"MMR: {queue['opponent_mmr']}"
            )
        else:
            queue_status = "\n⏱️ No estás en la cola."
        
        text = (
            f"⚡ **Estado Ranked**\n\n"
            f"🏆 Rango: **{rank_label}**\n"
            f"📈 Puntos: `{profile['points']}`\n"
            f"🔥 Streak: `{profile['streak']}`\n"
            f"📍 Placements: `{profile['placements_left']}` left "
            f"(`{profile['placement_wins']}`/5 wins)"
            f"{queue_status}"
        )
        await update.message.reply_text(text)
    except Exception as e:
        logger.exception("Error getting ranked status")
        await update.message.reply_text("❌ Error al obtener el estado Ranked.")


async def torneos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """List active tournaments."""
    if not update.message:
        return
    
    try:
        tournaments = db.get_tournaments(limit=5)
        
        if not tournaments:
            await update.message.reply_text("❌ No hay torneos abiertos.")
            return
        
        text = "🎯 **Torneos Abiertos**\n\n"
        for t in tournaments:
            text += (
                f"• **{t['name']}**\n"
                f"  Slots: {t['capacity']}\n"
                f"  Min: {t['min_tier'].upper()}\n"
                f"  Prize: {t['prize'] or 'Puntos'}\n"
                f"  Inicia: {t['starts_at'][:10]}\n\n"
            )
        
        await update.message.reply_text(text)
    except Exception as e:
        logger.exception("Error getting tournaments")
        await update.message.reply_text("❌ Error al obtener torneos.")


async def tickets(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show user tickets."""
    if not update.message:
        return
    
    user_id = user_links.get(update.message.from_user.id)
    if not user_id:
        await update.message.reply_text(
            "⚠️ Primero vincula tu cuenta con /link <username>"
        )
        return
    
    try:
        tickets_list = db.get_user_tickets(user_id)
        
        if not tickets_list:
            await update.message.reply_text(
                "🎟️ No tienes tickets.\n\n"
                "Compra uno en: https://vantcall.vercel.app"
            )
            return
        
        text = "🎟️ **Tus Tickets**\n\n"
        for t in tickets_list:
            text += (
                f"• **{t['tier'].upper()}** - {t['status']}\n"
                f"  Código: `{t['code']}`\n"
                f"  Desde: {t['created_at'][:10]}\n\n"
            )
        
        await update.message.reply_text(text)
    except Exception as e:
        logger.exception("Error getting tickets")
        await update.message.reply_text("❌ Error al obtener tickets.")


async def leaderboard(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show top 10 players."""
    if not update.message:
        return
    
    try:
        players = db.get_leaderboard(limit=10)
        
        if not players:
            await update.message.reply_text("❌ No hay jugadores en el leaderboard.")
            return
        
        text = "📊 **Leaderboard Top 10**\n\n"
        for i, p in enumerate(players, 1):
            rank = p["rank_key"].upper().replace("-", " ")
            text += (
                f"{i}. **{p['display_name'] or p['username']}**\n"
                f"   {rank} • {p['points']} pts • {p['wins']}W {p['losses']}L\n\n"
            )
        
        await update.message.reply_text(text)
    except Exception as e:
        logger.exception("Error getting leaderboard")
        await update.message.reply_text("❌ Error al obtener el leaderboard.")


async def historial(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show recent ranked history."""
    if not update.message:
        return
    
    user_id = user_links.get(update.message.from_user.id)
    if not user_id:
        await update.message.reply_text(
            "⚠️ Primero vincula tu cuenta con /link <username>"
        )
        return
    
    try:
        history = db.get_ranked_history(user_id, limit=10)
        
        if not history:
            await update.message.reply_text("❌ Sin historial de partidas.")
            return
        
        text = "📜 **Últimas Partidas**\n\n"
        for h in history:
            delta_str = f"+{h['points_delta']}" if h['points_delta'] > 0 else str(h['points_delta'])
            result_icon = "✅" if "win" in h['result'].lower() else "❌"
            text += (
                f"{result_icon} {h['title']}\n"
                f"   {h['result']} • {delta_str} pts\n"
                f"   {h['created_at'][:10]}\n\n"
            )
        
        await update.message.reply_text(text)
    except Exception as e:
        logger.exception("Error getting history")
        await update.message.reply_text("❌ Error al obtener el historial.")


async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle free-text messages with Ollama."""
    if not update.message or not update.message.text:
        return
    
    # Skip if it's a command
    if update.message.text.startswith("/"):
        return
    
    try:
        response = await assistant.ainvoke(update.message.text)
        await update.message.reply_text(str(response.content)[:4096])
    except Exception:
        logger.exception("Error consultando Ollama")
        await update.message.reply_text(
            "❌ No pude conectarme con Ollama. Comprueba que el servicio esté activo."
        )


def main() -> None:
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Commands
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("ayuda", help_command))
    application.add_handler(CommandHandler("link", link_user))
    application.add_handler(CommandHandler("perfil", perfil))
    application.add_handler(CommandHandler("ranked", ranked))
    application.add_handler(CommandHandler("torneos", torneos))
    application.add_handler(CommandHandler("tickets", tickets))
    application.add_handler(CommandHandler("leaderboard", leaderboard))
    application.add_handler(CommandHandler("historial", historial))
    
    # Free-text messages
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, message_handler)
    )
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
