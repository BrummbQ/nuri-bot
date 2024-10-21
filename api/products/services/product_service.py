import asyncio
from datetime import datetime, timedelta
import time
from typing import Dict, Optional

from services import rewe_service
from models import product
from schemas import ProductSearchParam, ProductSearchResponse


async def load_products(market_id: str):
    # if _should_skip_load(market_id):
    #     print(f"Skipping load for market {market_id} - recently fetched")
    #     return

    # Initialize first page to get total pages
    first_page = await _fetch_page(market_id, 1)
    total_pages = first_page["pagination"]["totalPages"]

    # Create tasks for all remaining pages
    async with asyncio.TaskGroup() as tg:
        # Process first page
        await _process_page(market_id, first_page, 1, tg)

        # Create tasks for remaining pages in parallel
        [
            tg.create_task(_load_page(market_id, page, tg))
            for page in range(2, total_pages + 1)
        ]


async def _should_skip_load(market_id: str) -> bool:
    """
    Determines if product load should be skipped based on last fetch time.
    """
    last_fetched = await product.last_fetched_product_by_market(market_id)
    if last_fetched is None:
        return False
    one_week_ago = datetime.now() - timedelta(days=7)
    return last_fetched > one_week_ago


async def _load_page(market_id: str, page: int, tg: asyncio.TaskGroup) -> None:
    """
    Loads a single page of products.
    """
    try:
        response = await _fetch_page(market_id, page)
        if response:
            await _process_page(market_id, response, page, tg)
    except Exception as e:
        print(f"Error loading page {page}: {e}")


async def _fetch_page(market_id: str, page: int) -> Dict:
    """
    Fetches a single page of products with timing and error handling.
    """
    fetch_start = time.time()
    try:
        response = await rewe_service.search_products("*", market_id, 250, page)
        fetch_time = time.time() - fetch_start
        print(f"Products fetch time: {fetch_time:.4f} seconds")
        return response
    except Exception as e:
        print(f"Error fetching products {page}: {e}")
        return None


async def _process_page(
    market_id: str, response: Dict, page: int, tg: asyncio.TaskGroup
) -> None:
    """
    Processes and imports products from a single page.
    """
    try:
        products = rewe_service.postprocess_rewe_products(market_id, response)

        # Create import task
        tg.create_task(_import_products(products, page))

        print(
            f"Processed page {page}/{response['pagination']['totalPages']} "
            f"({len(products)} products)"
        )
    except Exception as e:
        print(f"Error processing page {page}: {e}")


async def _import_products(products: list[product.ProductModel], page: int) -> None:
    """
    Imports products with error handling.
    """
    try:
        await product.import_products(products, page)
    except Exception as e:
        print(f"Error importing products for page {page}: {e}")


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
