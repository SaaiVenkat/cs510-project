from pymongo import MongoClient
from utils import MongoDB

mongodb = MongoDB()
db = mongodb.get_database("bert")
collection = db["users"]


class User:
    def __init__(self, name, email, g_id, picture):
        self.name = name
        self.email = email
        self.g_id = g_id
        self.picture = picture

    def save_to_mongodb(self):
        user_data = {
            "g_id": self.g_id,
            "name": self.name,
            "email": self.email,
            "picture": self.picture,
        }
        result = collection.insert_one(user_data)
        print(f"User inserted with id: {result.inserted_id}")

    @staticmethod
    def find_by_id(g_id):
        user_data = collection.find_one({"g_id": g_id})
        print(user_data)
        if user_data:
            return User(
                user_data["name"],
                user_data["email"],
                user_data["g_id"],
                user_data["picture"],
            )
        else:
            return None

    def to_json(self):
        return {"name": self.name, "email": self.email, "picture": self.picture}
