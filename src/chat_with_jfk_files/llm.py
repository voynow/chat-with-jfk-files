from typing import Dict, List, Optional

from dotenv import load_dotenv
from openai import AsyncOpenAI
from openai.types.chat.chat_completion_message import ChatCompletionMessage

load_dotenv()
client = AsyncOpenAI()


async def embed(text: str) -> list:
    response = await client.embeddings.create(
        input=text, model="text-embedding-3-small"
    )
    return response.data[0].embedding


async def _get_completion(
    messages: List[ChatCompletionMessage],
    model: str = "gpt-4o",
    response_format: Optional[Dict] = None,
):
    response = await client.chat.completions.create(
        model=model, messages=messages, response_format=response_format
    )
    return response.choices[0].message.content


async def get_completion(
    message: str,
    model: str = "gpt-4o-mini",
):
    """
    LLM completion with raw string response

    :param message: The message to send to the LLM.
    :param model: The model to use for the completion.
    :return: The raw string response from the LLM.
    """
    messages = [{"role": "user", "content": message}]
    return await _get_completion(messages=messages, model=model)
