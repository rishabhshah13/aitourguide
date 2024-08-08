import pytest
from dotenv import load_dotenv
import os


@pytest.fixture(scope="session", autouse=True)
def setup_env():
    # Load .env file for tests
    dotenv_path = os.path.join(os.path.dirname(__file__), "../.env")
    load_dotenv(dotenv_path)

    # Ensure environment variables are loaded
    assert os.getenv("OPENAI_API_KEY2") is not None
