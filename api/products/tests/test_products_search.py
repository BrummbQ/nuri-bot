from fastapi.testclient import TestClient
from httpx import AsyncClient
import pytest


def test_unauthorized(client: TestClient):
    response = client.get(
        "/api/v1/products/search",
        headers={"Authorization": f"Bearer 123"},
    )
    assert response.status_code == 401


def test_forbidden(client: TestClient):
    response = client.get("/api/v1/products/search")
    assert response.status_code == 403


@pytest.mark.anyio
async def test_search_invalid_params(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={},
    )
    assert response.status_code == 422


@pytest.mark.anyio
async def test_search_invalid_market(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={"marketId": "invalid", "productName": "Gurke"},
    )
    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.anyio
async def test_search(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={"marketId": "4040426", "productName": "Gurke"},
    )
    assert response.status_code == 200
    assert len(response.json()) > 0
