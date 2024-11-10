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
        params={
            "marketId": "4040426",
            "productName": "Gurke",
            "productCategory": "Gemüse",
        },
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "Gurken zum Einlegen",
            "category_path": "Obst & Gemüse/Frisches Gemüse/Gurken/",
            "price": 20,
            "grammage": "1 Stück ca. 100 g (1 kg = 1,99 €)",
        },
        {
            "name": "REWE Bio Gurke 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Gemüse/Gurken/",
            "price": 99,
            "grammage": "1 Stück",
        },
        {
            "name": "Mini Gurke 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Gemüse/Gurken/",
            "price": 55,
            "grammage": "1 Stück",
        },
        {
            "name": "Eiersalat mit Gurke",
            "category_path": "Brot, Cerealien & Aufstriche/Herzhafte Brotaufstriche/Eiersalat/",
            "price": 149,
            "grammage": "1 Stück ca. 100 g (1 kg = 14,90 €)",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_mais(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={
            "marketId": "4040426",
            "productName": "Mais",
            "productCategory": "Mais",
        },
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
            "name": "Seeberger Popcorn-Mais 500g",
            "category_path": "Süßes & Salziges/Süßwaren/Popcorn/",
            "price": 199,
            "grammage": "500g (1 kg = 3,98 €)",
        },
        {
            "name": "Müller's Mühle Popcorn Mais 500g",
            "category_path": "Süßes & Salziges/Süßwaren/Popcorn/",
            "price": 139,
            "grammage": "500g (1 kg = 2,78 €)",
        },
        {
            "name": "REWE Bio Reiswaffeln mit Hirse und Mais 100g",
            "category_path": "Brot, Cerealien & Aufstriche/Knäckebrot, Zwieback & Reiswaffeln/Reis- & Maiswaffeln/",
            "price": 99,
            "grammage": "100g (1 kg = 9,90 €)",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_limette(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={
            "marketId": "4040426",
            "productName": "Limette",
            "productCategory": "Zitrusfrüchte",
        },
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "REWE Beste Wahl Limetten 4 Stück",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 149,
            "grammage": "4 Stück",
        },
        {
            "name": "Bio Limette 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 59,
            "grammage": "1 Stück",
        },
        {
            "name": "Bad Liebenwerda Mineralwasser Limette 0,75l",
            "category_path": "Getränke & Genussmittel/Wasser/Wasser mit Geschmack/Wasser mit Zitrusfrucht-Geschmack/",
            "price": 65,
            "grammage": "0,75l",
        },
        {
            "name": "Gaensefurther Limette 1,25l",
            "category_path": "Getränke & Genussmittel/Wasser/Wasser mit Geschmack/Wasser mit Zitrusfrucht-Geschmack/",
            "price": 65,
            "grammage": "1,25l (1 l = 0,52 €)",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_vollmilch(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={
            "marketId": "4040426",
            "productName": "vollmilch",
            "productCategory": "Milch",
        },
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
            "name": "Vogtlandweide Haltbare Vollmilch 3,5% 250ml",
            "category_path": "Käse, Eier & Molkerei/Milch/H-Milch/",
            "price": 59,
            "grammage": "250ml (1 l = 2,36 €)",
        },
        {
            "name": "MinusL H-Vollmilch 3,5% 1l",
            "category_path": "Käse, Eier & Molkerei/Milch/H-Milch/",
            "price": 189,
            "grammage": "1l",
        },
        {
            "name": "Sachsenmilch H-Vollmilch 3,5% 1l",
            "category_path": "Käse, Eier & Molkerei/Milch/H-Milch/",
            "price": 159,
            "grammage": "1l",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_orangensaft(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={
            "marketId": "4040426",
            "productName": "orangensaft",
            "productCategory": "säfte",
        },
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "REWE Bio Kurkuma Shot mit Orangensaft 150ml",
            "category_path": "Getränke & Genussmittel/Fruchtsäfte & Nektare/Saft-Shots/",
            "price": 129,
            "grammage": "150ml (1 l = 8,60 €)",
        },
        {
            "name": "REWE Beste Wahl Orangensaft 1l",
            "category_path": "Getränke & Genussmittel/Fruchtsäfte & Nektare/Orangensaft/",
            "price": 269,
            "grammage": "1l",
        },
        {
            "name": "REWE Bio Orangensaft 1l",
            "category_path": "Getränke & Genussmittel/Fruchtsäfte & Nektare/Orangensaft/",
            "price": 299,
            "grammage": "1l",
        },
        {
            "name": "ja! Orangensaft 6x1l",
            "category_path": "Getränke & Genussmittel/Fruchtsäfte & Nektare/Orangensaft/",
            "price": 1434,
            "grammage": "6x1l (1 l = 2,39 €)",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_zitronen(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={
            "marketId": "4040426",
            "productName": "Zitronen",
            "productCategory": "Zitrusfrüchte",
        },
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "REWE Bio Zitrone 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 89,
            "grammage": "1 Stück",
        },
        {
            "name": "REWE Bio Zitrone 500g im Netz",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 139,
            "grammage": "500g (1 kg = 2,78 €)",
        },
        {
            "name": "Zitronen 500g im Netz",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 129,
            "grammage": "500g (1 kg = 2,58 €)",
        },
        {
            "name": "Zitrone 1 Stück",
            "category_path": "Obst & Gemüse/Frisches Obst/Zitrusfrüchte/",
            "price": 79,
            "grammage": "1 Stück",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products


@pytest.mark.anyio
async def test_search_success_olivenöl(client_authenticated: AsyncClient):
    response = await client_authenticated.get(
        "/api/v1/products/search",
        params={
            "marketId": "4040426",
            "productName": "olivenöl",
            "productCategory": "Öle",
        },
    )
    assert response.status_code == 200
    expected_products = [
        {
            "name": "REWE Beste Wahl Olivenöl raffiniert 500ml",
            "category_path": "Öle, Soßen & Gewürze/Öle/Olivenöl/",
            "price": 699,
            "grammage": "500ml (1 l = 13,98 €)",
        },
        {
            "name": "Bertolli Cucina Olivenöl 500ml",
            "category_path": "Öle, Soßen & Gewürze/Öle/Olivenöl/",
            "price": 999,
            "grammage": "500ml (1 l = 19,98 €)",
        },
        {
            "name": "De Cecco Bio Natives Olivenöl Extra 500ml",
            "category_path": "Öle, Soßen & Gewürze/Öle/Olivenöl/",
            "price": 1249,
            "grammage": "500ml (1 l = 24,98 €)",
        },
        {
            "name": "La Espanola Natives Olivenöl extra virgen 500ml",
            "category_path": "Öle, Soßen & Gewürze/Öle/Olivenöl/",
            "price": 999,
            "grammage": "500ml (1 l = 19,98 €)",
        },
    ]

    actual_products = format_products(response)
    assert actual_products == expected_products
