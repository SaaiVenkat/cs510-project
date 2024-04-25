from flask import Blueprint, jsonify
import os
from utils import MongoDB

internal_bp = Blueprint("internal", __name__)

mongodb = MongoDB()
db = mongodb.get_database("bert")
document_collection = db["links"]
counter_collection = db["counter"]
user_collection = db["users"]


# Route to hard reset the entire application
@internal_bp.route("/reset", methods=["GET"])
def reset():

    file_path = "./index"
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"File '{file_path}' deleted successfully.")
    else:
        print(f"File '{file_path}' does not exist.")
    document_collection.delete_many({})
    user_collection.delete_many({})

    # Update the counter value to -1
    counter_collection.update_one({"_id": "link_id"}, {"$set": {"sequence_value": -1}})
    return jsonify({"success": True}), 200
