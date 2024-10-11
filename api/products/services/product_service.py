from services.rewe_service import search_products


def load_products(market_id: str):
    products = search_products("*", market_id)
    print(products)
