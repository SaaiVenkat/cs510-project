from pymongo import MongoClient


class MongoDB:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.client = MongoClient(
                "mongodb://root:password@localhost:27017/"
            )
        return cls._instance

    def get_database(self, dbname):
        return self.client[dbname]
