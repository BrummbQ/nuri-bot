from fastapi import APIRouter

from schemas import LoadProductsRequestBody
from services import product_service


router = APIRouter()


@router.post("/load")
def load_products(body: LoadProductsRequestBody):
    product_service.load_products(body.marketId)
    return {"Hello": "World"}
