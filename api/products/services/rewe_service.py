import httpx
from datetime import datetime

from schemas import ReweProductsResponse, ReweProduct
from models import product


async def search_products(
    search: str, market: str, page_size: int = 10, page: int = 1
) -> ReweProductsResponse:
    url = "https://shop.rewe.de/api/products"
    params = {
        "search": search,
        "objectsPerPage": page_size,
        "serviceTypes": "PICKUP",
        "sorting": "TOPSELLER_DESC",
        "page": page,
        "market": market,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, params=params, timeout=20)
            response.raise_for_status()
            return response.json()

        except httpx.TimeoutException as e:
            print(f"Timeout fetching products for market {market}, page {page}: {e}")
            raise

        except httpx.HTTPError as e:
            print(f"HTTP error fetching products for market {market}, page {page}: {e}")
            raise


def rewe_product_name(product: ReweProduct) -> str:
    name: str = product["productName"]
    # remove brand
    if "name" in product["brand"]:
        return name.removeprefix(product["brand"]["name"]).strip()
    return name


def rewe_product_brand_name(product: ReweProduct) -> str | None:
    if "name" in product["brand"]:
        return product["brand"]["name"]


def rewe_product_price(product: ReweProduct) -> int | None:
    articles = product["_embedded"]["articles"]
    if len(articles):
        return articles[0]["_embedded"]["listing"]["pricing"]["currentRetailPrice"]


def rewe_product_currency(product: ReweProduct) -> str | None:
    articles = product["_embedded"]["articles"]
    if len(articles):
        return articles[0]["_embedded"]["listing"]["pricing"]["currency"]


def rewe_product_grammage(product: ReweProduct) -> str | None:
    articles = product["_embedded"]["articles"]
    if len(articles) and "grammage" in articles[0]["_embedded"]["listing"]["pricing"]:
        return articles[0]["_embedded"]["listing"]["pricing"]["grammage"]


def rewe_product_image(product: ReweProduct) -> str | None:
    images = product["media"]["images"]
    if len(images):
        return images[0]["_links"]["self"]["href"]


def postprocess_rewe_products(
    market_id: str,
    response: ReweProductsResponse,
) -> list[product.ProductModel]:
    products_dump: list[ReweProduct] = [p for p in response["_embedded"]["products"]]

    # map to our product model
    now = datetime.now()
    return [
        product.ProductModel(
            external_id=p["id"],
            name=rewe_product_name(p),
            brand_name=rewe_product_brand_name(p),
            category_path=p["_embedded"]["categoryPath"],
            price=rewe_product_price(p),
            currency=rewe_product_currency(p),
            grammage=rewe_product_grammage(p),
            main_image_href=rewe_product_image(p),
            provider=product.ProductDataProvider.REWE.value,
            provider_data=p,
            fetched_at=now,
            market_id=market_id,
        )
        for p in products_dump
    ]
