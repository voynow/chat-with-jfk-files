import datetime
import logging
import os
from uuid import uuid4

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import BaseModel
from pinecone import Pinecone

from src.chat_with_jfk_files import llm

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


async def get_documents(query: str) -> list[dict]:
    """
    Get documents from Pinecone index based on query embedding

    :param query: The query to embed and search for
    :return: {'path': 'jfk2020/docid-3211.pdf', 'text': "Lee Harvey Oswald..."}
    """
    embedding = await llm.embed(query)
    result = index.query(
        namespace="jfk-docs", vector=embedding, top_k=3, include_metadata=True
    )
    return [match.metadata for match in result.matches]


class Query(BaseModel):
    text: str


@app.post("/chat")
async def chat_endpoint(query: Query) -> str:
    """
    Chat endpoint that returns AI response based on relevant documents

    :param query: Query object containing search text
    :return: AI generated response based on relevant documents
    """
    logger.info(f"{session_id} // received query: {query.text}")
    documents = await get_documents(query.text)
    logger.info(f"{session_id} // Done retrieving documents")

    today = datetime.datetime.now().strftime("%B %d, %Y")
    prompt = f"""You are jfk-files-AI, an AI who specializes in historical/political research about the JFK assassination.

    Background: newly declassified JFK assassination files will be released in the coming weeks by President Trump's executive order - the order was made on Jan 23rd 2025 (today's date is {today})

    RULES:
    - Use precise dates and document references
    - Mix formal terminology with conspiratorial tone
    - Say "CLASSIFIED" for unknown info
    - Be EXTREMELY concise; respond with 1-2 sentences unless asked otherwise
    - Respond in a semi-structured format to allow for easy visual parsing (but dont go overboard)
    - If relevant, make suggestions to keep the conversation going
    
    QUERY: {query.text}

    DOCUMENTS:
    {documents}

    Analyze and respond with facts only. Cite sources from these newly declassified documents.
    """

    response = await llm.get_completion(prompt)
    logger.info(f"{session_id} // Response: {response}")
    return response
