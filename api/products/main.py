from fastapi import FastAPI

from api.v1 import products

app = FastAPI()

# Include API routes
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
