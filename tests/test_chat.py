import asyncio
import time

import httpx
import pytest
from fastapi.testclient import TestClient

from src.chat_with_jfk_files.chat import app

client = TestClient(app)


def test_chat_endpoint_no_chat_history():
    """Test that chat endpoint returns expected response format"""

    response = client.post(
        "/chat",
        json={"text": "Who did it?", "chat_history": []},
    )
    print(f"\n---\n{response.json()}\n---\n")

    assert response.status_code == 200
    assert isinstance(response.json(), str)
    assert len(response.json()) > 0


def test_chat_endpoint_with_chat_history():
    """Test that chat endpoint returns expected response format"""

    response = client.post(
        "/chat",
        json={
            "text": "How were they involved?",
            "chat_history": [
                "USER: Who did it?",
                'ASSISTANT: The question of "who did it" in relation to the JFK assassination remains shrouded in speculation and conspiracy.\n\n1. **Organized Crime Involvement**: Document #1 suggests individuals with ties to organized crime, notably referencing a character named DITTA associated with arson and illegal activities, hinting at underworld connections that could implicate broader conspiracy elements (File: jfk2017111710, Document ID: 32315584).\n\n2. **CIA Operations**: The CIA\'s covert activities, as referenced in Document #2, indicate that the agency was involved in potential assassination plots, though not directly related to JFK, showcasing a historical precedence for government-organized violence (File: jfk2023b, Document ID: 157-10008-10252 ).\n\nThe evidence is CLASSIFIED; motivations remain speculative. For further discussion, are you interested in examining specific individuals associated with the crime or patterns of governmental conduct during the era?',
            ],
        },
    )
    print(f"\n---\n{response.json()}\n---\n")
    assert response.status_code == 200
    assert isinstance(response.json(), str)
    assert len(response.json()) > 0


@pytest.mark.asyncio
async def test_chat_load():
    start_time = time.time()

    async with httpx.AsyncClient(app=app, base_url="http://test") as async_client:
        tasks = [
            async_client.post("/chat", json={"text": "Who did it?", "chat_history": []})
            for _ in range(10)
        ]
        responses = await asyncio.gather(*tasks)

    elapsed_time = time.time() - start_time
    assert (
        elapsed_time <= 10
    ), f"Load test took {elapsed_time:.2f} seconds, which exceeds 10 seconds."

    for response in responses:
        assert response.status_code == 200
        assert isinstance(response.json(), str)
        assert len(response.json()) > 0
