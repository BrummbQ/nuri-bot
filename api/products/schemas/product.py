from typing import Optional
from pydantic import BaseModel


class LoadProductsRequestBody(BaseModel):
    marketId: str


class ProductSearchParam(BaseModel):
    marketId: str
    productName: str
    quantity: Optional[int]
    unit: Optional[str]
    note: Optional[str]


class ProductSearchResponse(BaseModel):
    external_id: str
    name: str
    category_path: str
    price: Optional[int]
    currency: Optional[str]
    grammage: Optional[str]
    main_image_href: Optional[str]
