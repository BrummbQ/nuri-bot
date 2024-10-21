from contextlib import asynccontextmanager
from fastapi import FastAPI

from api.v1 import products
from db.mongo import close_mongo_connection, mongo_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup
    await mongo_db.setup_schema()
    yield
    # cleanup
    await close_mongo_connection()


app = FastAPI(lifespan=lifespan)


# Include API routes
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
