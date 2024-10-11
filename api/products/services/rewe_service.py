import httpx
from schemas import ReweProductsResponse


def search_products(
    search: str, market: str, page_size: int = 10, page: int = 1
) -> ReweProductsResponse:
    url = "https://shop.rewe.de/api/products"
    params = {
        "search": search,
        "objectsPerPage": page_size,
        "serviceTypes": "PICKUP",
        "sorting": "TOPSELLER_DESC",
        "page": page,
        "market": market,
    }

    with httpx.Client() as client:
        response = client.get(url, params=params)
        response.raise_for_status()  # Check for HTTP errors
        return response.json()  # Return the response JSON
