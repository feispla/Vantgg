# writing-assistant bot

Asistente de escritura que corre 100% local contra Ollama (sin LaunchDarkly, sin Anthropic API). Incluye variante Discord, variante Telegram, y un CLI de prueba.

- `discord_bot.py` — bot de Discord con comandos slash. Ver `README-DISCORD.md`.
- `telegram_bot.py` — bot de Telegram. Ver `README-TELEGRAM.md`.
- `main_ollama.py` — CLI local para probar el modelo sin bot. Ver `README-OLLAMA.md`.

## Requisitos comunes

- Ollama instalado y corriendo (`ollama list` para comprobar), con el modelo descargado (por defecto `qwen2.5:7b`).
- Variables de entorno por canal: copia `.env.discord.example` o `.env.telegram.example` a `.env` y completa el token correspondiente.

## Instalar dependencias

```bash
pip install -r requirements-discord-ollama.txt   # para discord_bot.py
pip install -r requirements-telegram-ollama.txt  # para telegram_bot.py
pip install -r requirements-ollama.txt           # para main_ollama.py
```

Este bot corre como worker independiente; no comparte base de datos ni API con la app web de VANT.
