import datetime
import json
import logging
import os
import time
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from openai import BaseModel
from pinecone import Pinecone

from src.chat_with_jfk_files import llm, prompts

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("openai").setLevel(logging.WARNING)
logging.getLogger("pinecone").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)


app = FastAPI()
session_id = str(uuid4())
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
index = pc.Index("chat-with-jfk-files")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://www.chatwithjfkfiles.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Content-Disposition"],
)


class Query(BaseModel):
    text: str
    chat_history: list[str] = []


async def get_documents(query: Query) -> list[dict]:
    """
    Get documents from Pinecone index based on query embedding

    :param query: The query to embed and search for
    :return: {'path': 'jfk2020/docid-3211.pdf', 'text': "Lee Harvey Oswald..."}
    """
    start_time = time.time()
    similarity_query = "\n".join([query.text] + query.chat_history)
    embedding = await llm.embed(similarity_query)
    result = index.query(
        namespace="jfk-docs-2025-master", vector=embedding, top_k=4, include_metadata=True
    )
    response = [match.metadata for match in result.matches]
    logger.info(
        f"{session_id} // querying documents took {time.time() - start_time:.2f}s"
    )
    return response


@app.post("/chat")
async def chat_endpoint(query: Query) -> StreamingResponse:
    """Streaming chat endpoint"""
    start_time = time.time()
    today = datetime.datetime.now().strftime("%B %d, %Y")
    documents = await get_documents(query)
    prompt = prompts.chat_message.format(
        today=today,
        chat_history=query.chat_history,
        query_text=query.text,
        documents=documents,
    )

    async def generate():
        full_response = []
        try:
            async for chunk in llm.get_streaming_completion(prompt):
                full_response.append(chunk)
                yield f"data: {chunk}\n\n"

            # Send both stats and documents
            elapsed = time.time() - start_time
            yield f"data: [STATS] {elapsed:.1f}s\n\n"
            yield f"data: [DOCS] {json.dumps(documents)}\n\n"

            logger.info(f"{session_id} // response: {''.join(full_response)}")
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
