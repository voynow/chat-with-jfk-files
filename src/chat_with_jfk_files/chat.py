import datetime
import logging
import os
import time
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    similarity_query = "\n".join([query.text] + query.chat_history)
    embedding = await llm.embed(similarity_query)
    result = index.query(
        namespace="jfk-docs", vector=embedding, top_k=3, include_metadata=True
    )
    return [match.metadata for match in result.matches]


@app.post("/chat")
async def chat_endpoint(query: Query) -> str:
    """
    Chat endpoint that returns AI response based on relevant documents

    :param query: Query object containing search text
    :return: AI generated response based on relevant documents
    """
    start_time = time.time()
    today = datetime.datetime.now().strftime("%B %d, %Y")

    logger.info(
        f"{session_id} // received query: {query.text} with {len(query.chat_history)} historical messages"
    )

    documents = await get_documents(query)
    logger.info(f"{session_id} // Done retrieving documents")

    response = await llm.get_completion(
        prompts.chat_message.format(
            today=today,
            chat_history=query.chat_history,
            query_text=query.text,
            documents=documents,
        )
    )
    elapsed_time = time.time() - start_time
    logger.info(f"{session_id} // Done in {elapsed_time:.2f}s // Response: {response}")
    return response
