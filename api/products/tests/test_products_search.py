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
            "name": "REWE Bio Zuckermais vakuumiert 400g",
            "category_path": "Obst & Gemüse/Frisches Gemüse/Mais/",
            "price": 249,
            "grammage": "400g (1 kg = 6,23 €)",
        },
        {
            "name": "Bonduelle Goldmais 570g",
            "category_path": "Fertiggerichte & Konserven/Gemüsekonserven/Mais-Konserven/",
            "price": 239,
            "grammage": "570g (1 kg = 4,19 €)",
        },
        {
            "name": "Bonduelle Goldmais 285g",
            "category_path": "Fertiggerichte & Konserven/Gemüsekonserven/Mais-Konserven/",
            "price": 179,
            "grammage": "285g (1 kg = 6,28 €)",
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
            "name": "Bio Limette 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 59,
            "grammage": "1 Stück",
        },
        {
            "name": "REWE Beste Wahl Eistee Zitrone Limette 0,5l",
            "category_path": "Getränke & Genussmittel/Soft Drinks/Eistee/",
            "price": 55,
            "grammage": "0,50l (1 l = 1,10 €)",
        },
        {
            "name": "REWE Beste Wahl Eistee Zitrone-Limette 6x0,5l",
            "category_path": "Getränke & Genussmittel/Soft Drinks/Eistee/",
            "price": 330,
            "grammage": "6x0,50l (1 l = 1,10 €)",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_vollmilch(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={"marketId": "4040426", "productName": "vollmilch"},
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "REWE Bio H-Vollmilch 3,8% 1l",
            "category_path": "Käse, Eier & Molkerei/Milch/H-Milch/",
            "price": 115,
            "grammage": "1l",
        },
        {
            "name": "Sachsenmilch H-Vollmilch 3,5% 1l",
            "category_path": "Käse, Eier & Molkerei/Milch/H-Milch/",
            "price": 159,
            "grammage": "1l",
        },
        {
            "name": "MinusL H-Vollmilch 3,5% 1l",
            "category_path": "Käse, Eier & Molkerei/Milch/H-Milch/",
            "price": 189,
            "grammage": "1l",
        },
        {
            "name": "ja! H-Milch 3,5% 1l",
            "category_path": "Käse, Eier & Molkerei/Milch/H-Milch/",
            "price": 105,
            "grammage": "1l",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products
