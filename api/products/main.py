from contextlib import asynccontextmanager
from fastapi import FastAPI

from api.v1 import products
from db.mongo import connect_to_mongo, close_mongo_connection
from core import get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await connect_to_mongo(get_settings())
    yield
    # cleanup
    await close_mongo_connection()


app = FastAPI(lifespan=lifespan)


# Include API routes
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
