import pytest
from fastapi.testclient import TestClient

# from api import app
from api.app import app

import time

client = TestClient(app)


def test_invalid_model():
    start_time = time.time()
    response = client.post(
        "/get_response",
        json={"question": "What is the weather today?", "model": "InvalidModel"},
    )
    latency = time.time() - start_time
    assert response.status_code == 400
    print(f"test_invalid_model latency: {latency} seconds")


def test_valid_query_payload():
    start_time = time.time()
    response = client.post(
        "/get_response",
        json={"question": "What is the weather today?", "model": "GPT4o"},
    )
    latency = time.time() - start_time
    assert response.status_code == 200
    print(f"test_valid_query_payload latency: {latency} seconds")


def test_invalid_query_payload():
    start_time = time.time()
    response = client.post(
        "/get_response", json={"question": "What is the weather today?"}
    )
    latency = time.time() - start_time
    assert response.status_code == 422
    print(f"test_invalid_query_payload latency: {latency} seconds")


def test_empty_question():
    start_time = time.time()
    response = client.post("/get_response", json={"question": "", "model": "GPT4o"})
    latency = time.time() - start_time
    assert response.status_code == 400
    print(f"test_empty_question latency: {latency} seconds")


def test_no_model():
    start_time = time.time()
    response = client.post(
        "/get_response", json={"question": "What is the weather today?"}
    )
    latency = time.time() - start_time
    assert response.status_code == 422
    print(f"test_no_model latency: {latency} seconds")


def test_no_question():
    start_time = time.time()
    response = client.post("/get_response", json={"model": "GPT4o"})
    latency = time.time() - start_time
    assert response.status_code == 422
    print(f"test_no_question latency: {latency} seconds")
