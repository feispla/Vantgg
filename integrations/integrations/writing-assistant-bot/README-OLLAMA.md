# Asistente local con Ollama

Esta versión usa Ollama como proveedor local. No necesita `ANTHROPIC_API_KEY` ni crédito de Anthropic.

## En Windows

Instala Ollama desde https://ollama.com/download/windows y abre la aplicación Ollama.

En PowerShell descarga el modelo:

```powershell
ollama pull qwen2.5:7b
```

Si el ordenador tiene poca memoria RAM, usa:

```powershell
ollama pull qwen2.5:3b
```

En la carpeta del proyecto instala la integración:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements-ollama.txt
```

Ejecuta el asistente:

```powershell
python main_ollama.py
```

Para salir escribe `salir`.

La PC debe estar encendida y Ollama debe estar ejecutándose. Esta versión no requiere LaunchDarkly para funcionar localmente.
