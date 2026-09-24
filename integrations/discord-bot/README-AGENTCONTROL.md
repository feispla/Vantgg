# LaunchDarkly AgentControl + LangChain

Este ejemplo acepta los nombres oficiales de la guía de AgentControl:

```env
LAUNCHDARKLY_SDK_KEY=...
LAUNCHDARKLY_AI_CONFIG_KEY=...
ANTHROPIC_API_KEY=...
```

`main.py` traduce internamente `LAUNCHDARKLY_SDK_KEY` a `LD_SDK_KEY` para ser compatible con el SDK actual.

En PowerShell:

```powershell
cd "$HOME\Downloads\writing-assistant"
Copy-Item .env.example .env -Force
notepad .env
```

Completa las tres variables y guarda el archivo. No compartas `.env`.

La configuración `LAUNCHDARKLY_AI_CONFIG_KEY` debe existir en LaunchDarkly, estar habilitada y usar una variación compatible con el handler LangChain Agents. Si la variación usa Anthropic, necesitas `ANTHROPIC_API_KEY` y crédito disponible en Anthropic.

Ejecuta:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```
