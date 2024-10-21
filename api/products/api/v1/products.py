from typing import Annotated
from fastapi import APIRouter, Depends, Query

from schemas import LoadProductsRequestBody, ProductSearchParam, ProductSearchResponse
from services import product_service
from core.auth import decode_token
from core.settings import get_settings
from db.mongo import mongo_db


router = APIRouter()


@router.post("/load")
async def load_products(body: LoadProductsRequestBody, _: dict = Depends(decode_token)):
    # due to event loop issues on lambda, reconnect client on each invoke
    mongo_db.connect_to_mongo(get_settings())
    await product_service.load_products(body.marketId)


@router.get("/search")
async def search_products(
    search: Annotated[ProductSearchParam, Query()],
    _: dict = Depends(decode_token),
) -> list[ProductSearchResponse]:
    # due to event loop issues on lambda, reconnect client on each invoke
    mongo_db.connect_to_mongo(get_settings())
    return await product_service.search_products(search)
