import os
import pytest

from dotenv import load_dotenv

load_dotenv('.env')

def test_openai_api_key_loading():
    assert os.getenv('OPENAI_API_KEY2') is not None
