from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any


class ImageLink(BaseModel):
    href: HttpUrl


class ImageLinks(BaseModel):
    self: ImageLink


class Image(BaseModel):
    _links: ImageLinks


class Media(BaseModel):
    images: List[Image]


class Brand(BaseModel):
    name: Optional[str]  # Optional, can be None


class BaseUnit(BaseModel):
    KG: float  # Assuming KG is a float representing kilograms


class Pricing(BaseModel):
    currentRetailPrice: float
    currency: str
    basePrice: float
    baseUnit: BaseUnit
    grammage: str


class Limitations(BaseModel):
    orderLimit: int


class Listing(BaseModel):
    id: str
    version: int
    pricing: Pricing
    limitations: Limitations


class Store(BaseModel):
    id: str
    version: int


class Merchant(BaseModel):
    id: str
    version: int
    name: str
    type: str
    logo: HttpUrl


class EmbeddedArticle(BaseModel):
    id: str
    version: int
    gtin: str
    _embedded: Dict[
        str, Any
    ]  # To represent embedded objects like listing, store, and merchant


class EmbeddedCategory(BaseModel):
    id: str
    primary: bool


class Embedded(BaseModel):
    articles: List[EmbeddedArticle]
    categories: List[EmbeddedCategory]
    categoryPath: str


class DetailLink(BaseModel):
    href: HttpUrl


class Links(BaseModel):
    detail: DetailLink


class Boosting(BaseModel):
    source: str
    field: str
    values: List[str]
    boost: float


class ReweProduct(BaseModel):
    id: str
    nan: str
    version: int
    productName: str
    attributes: Dict[str, Any]  # Can be replaced with specific attributes if needed
    brand: Brand
    media: Media
    _embedded: Embedded
    hasVariants: bool
    hasDiverseVariantPrices: bool
    shouldDetailsLinkBeMasked: bool
    freeShipping: bool
    _links: Links
    boostings: List[Boosting]


class RewePagination(BaseModel):
    page: int
    totalPages: int
    objectsPerPage: int
    totalResultCount: int


class ReweProductsEmbedded(BaseModel):
    products: List[ReweProduct]  # Only products are embedded here


class ReweProductsResponse(BaseModel):
    pagination: RewePagination
    _embedded: ReweProductsEmbedded  # Only the products field
