from typing import Optional
from pydantic import BaseModel


class LoadProductsRequestBody(BaseModel):
    marketId: str


class ProductSearchParam(BaseModel):
    marketId: str
    productName: str


class ProductSearchResponse(BaseModel):
    id: str
    external_id: str
    name: str
    category_path: str
    price: Optional[int]
    currency: Optional[str]
    grammage: Optional[str]
    main_image_href: Optional[str]
    listing_id: Optional[str]
