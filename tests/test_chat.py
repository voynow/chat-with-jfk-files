from fastapi.testclient import TestClient

from src.chat_with_jfk_files.chat import app

client = TestClient(app)


def test_chat_endpoint(caplog):
    """Test that chat endpoint returns expected response format"""

    response = client.post(
        "/chat", json={"text": "What happened on November 22, 1963?"}
    )
    print(f"Response: {response.json()}")

    assert response.status_code == 200
    assert isinstance(response.json(), str)
    assert len(response.json()) > 0
