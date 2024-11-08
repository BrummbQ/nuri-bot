from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from core import Settings, get_settings


class MongoDB:
    client: AsyncIOMotorClient = None
    products_db: AsyncIOMotorDatabase = None

    def connect_to_mongo(self, settings: Settings):
        if self.client:
            self.client.close()
        self.client = AsyncIOMotorClient(settings.MONGODB_URI)
        self.products_db = self.client[settings.PRODUCTS_DB]
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
                        "category_path": {
                            "type": "string",
                            "multi": {
                                "keywordAnalyzer": {
                                    "type": "string",
                                    "analyzer": "keyword_lower",
                                }
                            },
                        },
                        "grammage": {"type": "string"},
                        "name": {
                            "type": "string",
                            "multi": {
                                "keywordAnalyzer": {
                                    "type": "string",
                                    "analyzer": "keyword_lower",
                                }
                            },
                        },
                    },
                },
                "analyzers": [
                    {
                        "name": "keyword_lower",
                        "charFilters": [],
                        "tokenizer": {"type": "keyword"},
                        "tokenFilters": [{"type": "lowercase"}],
                    }
                ],
            },
            "name": "ProductSearch",
        }

        index_cursor = products_collection.list_search_indexes(search_index["name"])
        search_indexes = await index_cursor.to_list(1)
        if not len(search_indexes):
            await products_collection.create_search_index(search_index)
        print("Created MongoDB Schema")

    def products_collection(self):
        if self.products_db is None:
            self.connect_to_mongo(get_settings())
        return self.products_db.products


mongo_db = MongoDB()


async def close_mongo_connection():
    if mongo_db.client:
        mongo_db.client.close()
        mongo_db.products_db = None
        mongo_db.client = None
        print("Closed MongoDB connection")
