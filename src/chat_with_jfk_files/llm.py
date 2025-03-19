from typing import AsyncGenerator, Dict, List, Optional

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
    model: str = "gpt-4o-mini",
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


async def get_streaming_completion(
    message: str,
    model: str = "gpt-4o-mini",
) -> AsyncGenerator[str, None]:
    """
    Stream LLM completion response

    :param message: The message to send to the LLM
    :param model: The model to use for completion
    :yield: Chunks of the response as they arrive
    """
    messages = [{"role": "user", "content": message}]
    response = await client.chat.completions.create(
        model=model, messages=messages, stream=True
    )

    async for chunk in response:
        if content := chunk.choices[0].delta.content:
            yield content
