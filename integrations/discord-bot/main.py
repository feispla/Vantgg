import asyncio
import os

from dotenv import load_dotenv

load_dotenv()

# La guía oficial usa LAUNCHDARKLY_SDK_KEY. El SDK actual usa LD_SDK_KEY
# internamente, así que hacemos la compatibilidad sin duplicar el secreto.
if os.getenv("LAUNCHDARKLY_SDK_KEY") and not os.getenv("LD_SDK_KEY"):
    os.environ["LD_SDK_KEY"] = os.environ["LAUNCHDARKLY_SDK_KEY"]

from launchdarkly_ai_server import config, shutdown
from launchdarkly_ai_langchain_agents import create_langchain_agents_handler


async def main() -> None:
    required_variables = (
        "LAUNCHDARKLY_SDK_KEY",
        "LAUNCHDARKLY_AI_CONFIG_KEY",
        "ANTHROPIC_API_KEY",
    )
    missing = [name for name in required_variables if not os.getenv(name)]

    if missing:
        raise RuntimeError(
            "Faltan variables de entorno en .env: " + ", ".join(missing)
        )

    config_key = os.environ["LAUNCHDARKLY_AI_CONFIG_KEY"]

    try:
        assistant = config(
            key=config_key,
            handler=create_langchain_agents_handler(),
        )

        result = await assistant.invoke(
            "What is feature flagging?",
            {"kind": "user", "key": "user-123"},
        )

        print("\nRespuesta del asistente:\n")
        print(result.response)
    finally:
        await shutdown()


if __name__ == "__main__":
    asyncio.run(main())
