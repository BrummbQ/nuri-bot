import datetime
from typing import Any, Optional
from bson import ObjectId
from fastapi import HTTPException
from pymongo import UpdateOne
from enum import Enum
from pydantic import BaseModel, Field
import time

from db.mongo import mongo_db
from schemas import ProductSearchParam, PyObjectId


class ProductDataProvider(str, Enum):
    REWE = "REWE"


class ProductModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
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
    listing_id: Optional[str]
    score_boost: Optional[int] = 1


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
    search_term = search.productName

    search_query = {
        "$search": {
            "index": "ProductSearch",
            "compound": {
                "should": [
                    {
                        "text": {
                            "query": search_term,
                            "path": "name",
                            "score": {"boost": {"path": "score_boost", "undefined": 1}},
                        }
                    },
                    {
                        "text": {
                            "query": search.productCategory or search.productName,
                            "path": "category_path",
                            "score": {"boost": {"path": "score_boost", "undefined": 1}},
                        }
                    },
                ],
            },
        }
    }

    query = [
        search_query,
        {"$match": {"market_id": search.marketId}},
        {"$limit": 10},
        {
            "$project": {
                "_id": 1,
                "external_id": 1,
                "name": 1,
                "category_path": 1,
                "price": 1,
                "currency": 1,
                "grammage": 1,
                "main_image_href": 1,
                "listing_id": 1,
                "brand_name": 1,
                "provider": 1,
                "provider_data": 1,
                "fetched_at": 1,
                "market_id": 1,
            }
        },
    ]

    cursor = mongo_db.products_collection().aggregate(query)
    results = await cursor.to_list()
    return [ProductModel.model_validate(p) for p in results]


async def find_product(id: PyObjectId) -> ProductModel:
    product = await mongo_db.products_collection().find_one({"_id": ObjectId(id)})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductModel.model_validate(product)


async def last_fetched_product_by_market(market_id: str) -> Optional[datetime.datetime]:
    result = await mongo_db.products_collection().find_one(
        {"market_id": market_id},
        sort=[("fetched_at", -1)],
        projection={"fetched_at": 1},
    )

    return result["fetched_at"] if result else None
