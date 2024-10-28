from httpx import AsyncClient
import pytest
from typing import Generator
from fastapi.testclient import TestClient

from core.auth import decode_token
from main import app


def override_decode_token():
    yield {}


@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    client = TestClient(app)
    yield client


@pytest.fixture(scope="module")
async def client_authenticated():
    app.dependency_overrides[decode_token] = override_decode_token
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
        app.dependency_overrides.clear()
