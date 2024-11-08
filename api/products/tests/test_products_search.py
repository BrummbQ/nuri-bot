from fastapi.testclient import TestClient
from httpx import AsyncClient, Response
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


def format_products(response: Response) -> list:
    CHECKED_PRODUCT_FIELDS = ["name", "category_path", "price", "grammage"]
    return [
        {field: product[field] for field in CHECKED_PRODUCT_FIELDS}
        for product in response.json()[:4]
    ]


@pytest.mark.anyio
async def test_search_success_gurke(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={"marketId": "4040426", "productName": "Gurke"},
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "REWE Bio Gurke 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Gemüse/Gurken/",
            "price": 99,
            "grammage": "1 Stück",
        },
        {
            "name": "Gurken zum Einlegen",
            "category_path": "Obst & Gemüse/Frisches Gemüse/Gurken/",
            "price": 20,
            "grammage": "1 Stück ca. 100 g (1 kg = 1,99 €)",
        },
        {
            "name": "Mini Gurke 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Gemüse/Gurken/",
            "price": 55,
            "grammage": "1 Stück",
        },
        {
            "name": "Salatgurke 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Gemüse/Gurken/",
            "price": 65,
            "grammage": "1 Stück",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_mais(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={"marketId": "4040426", "productName": "Mais"},
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "ja! Sonnen-Mais natursüß 3x140g",
            "category_path": "Fertiggerichte & Konserven/Gemüsekonserven/Mais-Konserven/",
            "price": 199,
            "grammage": "3x420g (1 kg = 4,74 €)",
        },
        {
            "name": "Bonduelle Goldmais 140g",
            "category_path": "Fertiggerichte & Konserven/Gemüsekonserven/Mais-Konserven/",
            "price": 139,
            "grammage": "140g (1 kg = 9,93 €)",
        },
        {
            "name": "Bonduelle Goldmais 285g",
            "category_path": "Fertiggerichte & Konserven/Gemüsekonserven/Mais-Konserven/",
            "price": 179,
            "grammage": "285g (1 kg = 6,28 €)",
        },
        {
            "name": "Bonduelle Bio Goldmais 285g",
            "category_path": "Fertiggerichte & Konserven/Gemüsekonserven/Mais-Konserven/",
            "price": 229,
            "grammage": "285g (1 kg = 8,04 €)",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_limette(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={"marketId": "4040426", "productName": "Limette"},
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "REWE Beste Wahl Limetten 4 Stück",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 99,
            "grammage": "4 Stück",
        },
        {
            "name": "Leverno Limetten-Fix 100ml",
            "category_path": "Kochen & Backen/Backzutaten/Klassische Backzutaten/Backaromen/",
            "price": 99,
            "grammage": "100ml (1 l = 9,90 €)",
        },
        {
            "name": "Bio Limette 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 59,
            "grammage": "1 Stück",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products
