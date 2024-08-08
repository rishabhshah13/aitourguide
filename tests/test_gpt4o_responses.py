import pytest
from fastapi.testclient import TestClient

# from api import app
from api.app import app

import time

client = TestClient(app)


def test_gpt4o_response():
    start_time = time.time()
    response = client.post(
        "/get_response",
        json={"question": "What is the weather today?", "model": "GPT4o"},
    )
    latency = time.time() - start_time
    assert response.status_code == 200
    assert "answer" in response.json()
    print(f"test_gpt4o_response latency: {latency} seconds")
