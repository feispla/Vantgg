# Writing Assistant con LaunchDarkly

Proyecto mínimo para ejecutar un agente LangChain controlado por una configuración AgentControl de LaunchDarkly.

## Configuración

1. Activa el entorno virtual:

   ```bash
   source .venv/bin/activate
   ```

2. Copia la plantilla de variables:

   ```bash
   cp .env.example .env
   ```

3. Edita `.env` y añade una clave nueva de LaunchDarkly y tu clave de Anthropic. No compartas `.env` ni lo subas a Git.

4. En LaunchDarkly crea o publica una configuración **Agent** con esta clave exacta:

   ```text
   geimerjhoan099s-writing-assistant
   ```

5. Ejecuta:

   ```bash
   .venv/bin/python main.py
   ```

La configuración debe estar habilitada y usar un modelo Anthropic compatible con LangChain.
