# Bot de Telegram con Ollama

## 1. Crear el bot en Telegram

En Telegram busca `@BotFather`, envía `/newbot`, elige un nombre y un username que termine en `bot`. BotFather te entregará un token. No lo compartas en chats.

## 2. Ejecutarlo en Windows con Ollama

Desde PowerShell, dentro de la carpeta del proyecto:

```powershell
Copy-Item .env.telegram.example .env
notepad .env
```

Reemplaza `TELEGRAM_BOT_TOKEN` por el token de BotFather. Deja `OLLAMA_BASE_URL` como `http://127.0.0.1:11434`.

Instala las dependencias:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements-telegram-ollama.txt
```

Asegúrate de que Ollama responde:

```powershell
ollama list
```

Inicia el bot:

```powershell
python telegram_bot.py
```

Busca tu bot en Telegram, pulsa `/start` y envíale un mensaje.

## 3. Railway 24/7

El bot puede alojarse en Railway, pero `127.0.0.1` allí no es tu PC. Para funcionar con tu PC apagada, necesitas ejecutar Ollama en un servidor accesible desde Railway y configurar allí:

```text
TELEGRAM_BOT_TOKEN=... (variable secreta de Railway)
OLLAMA_MODEL=qwen2.5:7b
OLLAMA_BASE_URL=https://tu-servidor-ollama-seguro
```

No publiques el puerto 11434 de Ollama sin autenticación.
