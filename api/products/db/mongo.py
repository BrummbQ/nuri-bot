from motor.motor_asyncio import AsyncIOMotorClient
from core import Settings


class MongoDB:
    client: AsyncIOMotorClient = None
    db = "Products"

    def products_collection(self):
        if self.client is None:
            raise Exception("Mongo Client not configured")
        return self.client.get_database(self.db).get_collection("products")


mongo_db = MongoDB()


async def connect_to_mongo(settings: Settings):
    mongo_db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    print("Connected to MongoDB")

    await mongo_db.products_collection().create_index([("external_id", 1)])
    await mongo_db.products_collection().create_index([("market_id", 1)])

    search_index = {
        "definition": {
            "analyzer": "lucene.german",
            "searchAnalyzer": "lucene.german",
            "mappings": {
                "dynamic": False,
                "fields": {
                    "category_path": {"type": "string"},
                    "grammage": {"type": "string"},
                    "name": {"type": "string"},
                },
            },
        },
        "name": "ProductSearch",
    }

    index_cursor = mongo_db.products_collection().list_search_indexes(
        search_index["name"]
    )
    search_indexes = await index_cursor.to_list(1)
    if not len(search_indexes):
        mongo_db.products_collection().create_search_index(search_index)


async def close_mongo_connection():
    if mongo_db.client:
        mongo_db.client.close()
        print("Closed MongoDB connection")
