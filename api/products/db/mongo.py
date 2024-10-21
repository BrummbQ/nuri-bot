from motor.motor_asyncio import AsyncIOMotorClient
from core import Settings, get_settings


class MongoDB:
    client: AsyncIOMotorClient = None
    db = "Products"

    def connect_to_mongo(self, settings: Settings):
        self.client = AsyncIOMotorClient(settings.MONGODB_URI)
        print("Connected to MongoDB")

    async def setup_schema(self):
        products_collection = self.products_collection()
        await products_collection.create_index([("external_id", 1)])
        await products_collection.create_index([("market_id", 1)])

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

        index_cursor = products_collection.list_search_indexes(search_index["name"])
        search_indexes = await index_cursor.to_list(1)
        if not len(search_indexes):
            products_collection.create_search_index(search_index)
        print("Created MongoDB Schema")

    def products_collection(self):
        if self.client is None:
            self.connect_to_mongo(get_settings())
        return self.client.get_database(self.db).get_collection("products")


mongo_db = MongoDB()


async def close_mongo_connection():
    if mongo_db.client:
        mongo_db.client.close()
        print("Closed MongoDB connection")
