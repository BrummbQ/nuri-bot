from pydantic import BaseModel
from typing import Dict, Any


class LoadProductsRequestBody(BaseModel):
    marketId: str
