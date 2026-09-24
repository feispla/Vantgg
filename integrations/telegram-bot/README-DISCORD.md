# Comandos del bot de Discord

El bot incluye estos comandos slash:

- `/ping`: comprueba si el bot está activo.
- `/help`: muestra la ayuda.
- `/ask pregunta`: envía una pregunta a Ollama.

## Configuración local

En `.env` añade:

```env
DISCORD_BOT_TOKEN=tu_token_del_bot_de_discord
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_BASE_URL=http://127.0.0.1:11434
```

No compartas el token.

Instala dependencias y arranca:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements-discord-ollama.txt
python discord_bot.py
```

La primera sincronización global de comandos de Discord puede tardar un poco. Si `/ping`, `/help` o `/ask` no aparecen inmediatamente, espera unos minutos y vuelve a abrir Discord.
