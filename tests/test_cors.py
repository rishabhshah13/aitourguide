# import pytest
# from fastapi.testclient import TestClient
# import sys
# import os

# # sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

# # from api import app
# from api.app import app


# import time


# client = TestClient(app)

# def measure_latency(response):
#     if response.elapsed:
#         return response.elapsed.total_seconds()
#     else:
#         return None

# def test_cors():
#     start_time = time.time()
#     response = client.options("/get_response", headers={"Origin": "http://allowed-origin.com"})
#     latency = measure_latency(response)
#     assert response.status_code == 200
#     assert "access-control-allow-origin" in response.headers
#     print(f"test_cors latency: {latency} seconds")

# def test_cors_invalid_origin():
#     start_time = time.time()
#     response = client.options("/get_response", headers={"Origin": "http://disallowed-origin.com"})
#     latency = measure_latency(response)
#     assert response.status_code == 200
#     assert "access-control-allow-origin" not in response.headers
#     print(f"test_cors_invalid_origin latency: {latency} seconds")
