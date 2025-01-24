import asyncio
import os
from pathlib import Path
from typing import Dict, List, Optional

import numpy as np
import polars as pl
from dotenv import load_dotenv
from fastapi import FastAPI
from openai import OpenAI
from openai.types.chat.chat_completion_message import ChatCompletionMessage
from pydantic import BaseModel

load_dotenv()

client = OpenAI()

app = FastAPI()


def _get_completion(
    messages: List[ChatCompletionMessage],
    model: str = "gpt-4o",
    response_format: Optional[Dict] = None,
):
    response = client.chat.completions.create(
        model=model, messages=messages, response_format=response_format
    )
    return response.choices[0].message.content


def get_completion(
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
    return _get_completion(messages=messages, model=model)


async def fetch_batch_embeddings(
    texts: List[str], model: str = "text-embedding-3-small"
) -> List[List[float]]:
    """Fetch embeddings for a single batch asynchronously."""
    response = await asyncio.to_thread(
        client.embeddings.create, input=texts, model=model
    )
    return [item.embedding for item in response.data]


async def load_embeddings(filepath: Path) -> pl.DataFrame:
    """Load embeddings and texts from a Parquet file using Polars."""
    return await asyncio.to_thread(pl.read_parquet, str(filepath))


def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate the cosine similarity between two vectors."""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))


class Query(BaseModel):
    text: str
    num_results: int = 5


@app.post("/chat")
async def chat_endpoint(query: Query) -> str:
    """
    Chat endpoint that returns AI response based on relevant documents

    :param query: Query object containing search text and number of results to consider
    :return: AI generated response based on relevant documents
    """
    print(os.listdir())
    embeddings = await load_embeddings(
        Path("src/chat_with_jfk_files/embeddings.parquet")
    )
    query_embedding = (await fetch_batch_embeddings(texts=[query.text]))[0]

    # Add cosine similarity column
    embeddings = embeddings.with_columns(
        pl.col("embedding")
        .map_elements(lambda emb: cosine_similarity(emb, query_embedding))
        .alias("similarity")
    )

    # Sort by similarity in descending order
    sorted_embeddings = embeddings.sort("similarity", descending=True)

    prompt = f"""
    You are a helpful assistant great with Q&A.

    Here is the user query: {query.text}

    Here are some relevant files:
    {sorted_embeddings.select(pl.col("text"))[:query.num_results].to_dicts()}

    Please answer the user's question based on the files. If you are unsure, say "I don't know".
    """

    return get_completion(prompt)
