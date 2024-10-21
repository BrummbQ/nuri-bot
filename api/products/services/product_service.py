import asyncio
from datetime import datetime, timedelta
import time

from services import rewe_service
from models import product
from schemas import ProductSearchParam, ProductSearchResponse


async def load_products(market_id: str):
    last_fetched = await product.last_fetched_product_by_market(market_id)
    one_week_ago = datetime.now() - timedelta(days=7)
    # dont load if products fetched recently
    if last_fetched is not None and last_fetched > one_week_ago:
        return

    async with asyncio.TaskGroup() as tg:
        await _load_products_run(market_id, tg)


async def _load_products_run(market_id: str, tg: asyncio.TaskGroup, page=1):
    """
    Fetches and processes products for a specific market and handles pagination recursively.
    """

    fetch_start_time = time.time()
    response = rewe_service.search_products("*", market_id, 250, page)
    fetch_time = time.time() - fetch_start_time
    print(f"Products fetch time: {fetch_time:.4f} seconds")

    products = rewe_service.postprocess_rewe_products(market_id, response)
    tg.create_task(product.import_products(products, page))

    print(f"Inserted products | Page {page} of {response['pagination']['totalPages']}")

    if response["pagination"]["totalPages"] > page:
        await _load_products_run(market_id, tg, page + 1)


def format_product_from_search(product: product.ProductModel) -> ProductSearchResponse:
    p = product.model_dump(
        include=[
            "external_id",
            "name",
            "category_path",
            "price",
            "currency",
            "grammage",
            "main_image_href",
        ]
    )
    # add brand again to name
    p["name"] = f"{product.brand_name} {product.name}"
    return p


async def search_products(search: ProductSearchParam) -> list[ProductSearchResponse]:
    products = await product.search_products(search)
    return [format_product_from_search(p) for p in products]
