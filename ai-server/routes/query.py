from flask import Blueprint, request, jsonify
from model import make_doc_to_embedding, index_with_faiss, cosine_similarity
from weblink_parser import extract_web_link
from utils import MongoDB
from models import User
from flask_jwt_extended import jwt_required, get_jwt_identity

query_bp = Blueprint("query", __name__)

mongodb = MongoDB()
db = mongodb.get_database("bert")
collection = db["links"]
counter_collection = db["counter"]


# Route to query user bookmarks
@query_bp.route("/query", methods=["GET"])
@jwt_required()
def query():
    user_id = get_jwt_identity()

    query_param = request.args.get("q")
    type_param = request.args.get("type")
    if query_param is None:
        return jsonify({"error": "Missing query parameter"}), 400
    u = User.find_by_id(user_id)
    # Checking if its a valid user so as not process at all if invalid
    if not u:
        return jsonify({"success": False, "error": "Something Failed"}), 400
    if not query_param:
        ret = []
        documents = collection.find({"user_id": user_id})
        for doc in documents:
            temp = {
                "url": doc["link"],
                "title": doc["meta"]["title"],
                "preview_image": doc["meta"]["preview_image"],
                "description": doc["meta"]["description"],
            }
            ret.append(temp)
        return jsonify(ret), 200

    query_string = query_param
    if type_param == "link":
        query_string = extract_web_link(query_param)
        query_string = query_string.text_content
    query_embedding = make_doc_to_embedding(query_string)
    distances, indices = cosine_similarity(query_embedding)

    list = []
    indices = indices.tolist()  # since we are checking for a single vector
    distances = distances.tolist()
    indices = indices[0]
    distances = distances[0]
    for i in range(len(indices)):
        print(indices[i], distances[i])
        if indices[i] >= 0 and distances[i] < 2:
            list.append(indices[i])

    documents = collection.find({"faiss_id": {"$in": list}, "user_id": user_id})
    ret = []
    for doc in documents:
        temp = {
            "url": doc["link"],
            "title": doc["meta"]["title"],
            "preview_image": doc["meta"]["preview_image"],
            "description": doc["meta"]["description"],
        }
        ret.append(temp)

    return jsonify(ret), 200
