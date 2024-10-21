import datetime
from typing import Any, Optional
from pymongo import UpdateOne
from enum import Enum
from pydantic import BaseModel
import time

from db.mongo import mongo_db
from schemas import ProductSearchParam


class ProductDataProvider(str, Enum):
    REWE = "REWE"


class ProductModel(BaseModel):
    external_id: str
    name: str
    brand_name: Optional[str]
    category_path: str
    price: Optional[int]
    currency: Optional[str]
    grammage: Optional[str]
    main_image_href: Optional[str]
    provider: ProductDataProvider
    provider_data: Any
    fetched_at: datetime.datetime
    market_id: str


async def delete_products(market_id: str):
    await mongo_db.products_collection().delete_many({"market_id": market_id})


async def import_products(
    products: list[ProductModel], batch_number: int
) -> list[ProductModel]:
    start_time = time.time()

    # Prepare bulk update operations
    operations = [
        UpdateOne({"external_id": p.external_id}, {"$set": p.model_dump()}, upsert=True)
        for p in products
    ]

    # Execute the bulk operation
    await mongo_db.products_collection().bulk_write(operations)

    db_time = time.time() - start_time
    print(f"Db processing time: {db_time:.4f} seconds | Batch {batch_number}")

    return products


async def search_products(search: ProductSearchParam) -> list[ProductModel]:
    query = [
        {
            "$search": {
                "index": "ProductSearch",
                "compound": {
                    "should": [
                        {
                            "text": {
                                "query": search.productName,
                                "path": {"wildcard": "*"},
                            }
                        },
                        {
                            "text": {
                                "query": search.productName,
                                "path": "category_path",
                                "score": {"boost": {"value": 1}},
                            }
                        },
                    ]
                },
            }
        },
        {"$match": {"market_id": search.marketId}},
    ]

    cursor = mongo_db.products_collection().aggregate(query)
    results = await cursor.to_list(length=10)
    return [ProductModel.model_validate(p) for p in results]


async def search_products_text(search: ProductSearchParam) -> list[ProductModel]:
    query = {"$text": {"$search": search.productName}}
    cursor = mongo_db.products_collection().find(query)
    results = await cursor.to_list(length=10)  # Limit the result to 10
    return [ProductModel.model_validate(p) for p in results]


async def last_fetched_product_by_market(market_id: str) -> Optional[datetime.datetime]:
    result = await mongo_db.products_collection().find_one(
        {"market_id": market_id},
        sort=[("fetched_at", -1)],
        projection={"fetched_at": 1},
    )

    return result["fetched_at"] if result else None
