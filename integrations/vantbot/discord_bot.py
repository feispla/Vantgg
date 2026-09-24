import os

import discord
from discord import app_commands
from dotenv import load_dotenv
from langchain_ollama import ChatOllama

load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")

if not DISCORD_TOKEN:
    raise RuntimeError("Falta DISCORD_BOT_TOKEN en el archivo .env")

intents = discord.Intents.default()


class AssistantBot(discord.Client):
    def __init__(self) -> None:
        super().__init__(intents=intents)
        self.tree = app_commands.CommandTree(self)
        self.assistant = ChatOllama(
            model=OLLAMA_MODEL,
            base_url=OLLAMA_BASE_URL,
            temperature=0.7,
        )

    async def setup_hook(self) -> None:
        await self.tree.sync()
        print("Comandos slash sincronizados.")


bot = AssistantBot()


@bot.tree.command(name="ping", description="Comprueba si el bot está activo")
async def ping(interaction: discord.Interaction) -> None:
    await interaction.response.send_message("Pong. El bot está activo.")


@bot.tree.command(name="help", description="Muestra la ayuda del asistente")
async def help_command(interaction: discord.Interaction) -> None:
    await interaction.response.send_message(
        "Comandos disponibles:\n"
        "`/ping` comprueba si estoy activo.\n"
        "`/help` muestra esta ayuda.\n"
        "`/ask pregunta` consulta al asistente con Ollama."
    )


@bot.tree.command(name="ask", description="Haz una pregunta al asistente Ollama")
@app_commands.describe(pregunta="La pregunta o tarea para el asistente")
async def ask(interaction: discord.Interaction, pregunta: str) -> None:
    await interaction.response.defer(thinking=True)
    try:
        response = await bot.assistant.ainvoke(pregunta)
        text = str(response.content)
        if len(text) > 2000:
            text = text[:1990] + "..."
        await interaction.followup.send(text)
    except Exception:
        await interaction.followup.send(
            "No pude conectarme con Ollama. Comprueba que esté activo."
        )


bot.run(DISCORD_TOKEN)
