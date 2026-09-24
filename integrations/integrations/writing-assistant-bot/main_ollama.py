import os

from dotenv import load_dotenv
from langchain_ollama import ChatOllama

load_dotenv()

MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")


def main() -> None:
    assistant = ChatOllama(
        model=MODEL,
        temperature=0.7,
    )

    print("Asistente Ollama activo. Escribe 'salir' para terminar.\n")

    while True:
        try:
            user_input = input("Tú: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nAsistente cerrado.")
            break

        if user_input.lower() in {"salir", "exit", "quit"}:
            print("Asistente cerrado.")
            break

        if not user_input:
            continue

        try:
            response = assistant.invoke(user_input)
            print(f"\nAsistente: {response.content}\n")
        except Exception as error:
            print(f"\nError al conectar con Ollama: {error}")
            print("Comprueba que Ollama esté abierto y que el modelo esté instalado.\n")


if __name__ == "__main__":
    main()
