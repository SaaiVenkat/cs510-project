from flask import Blueprint, request, jsonify
from model import make_doc_to_embedding, index_with_faiss, cosine_similarity
from weblink_parser import extract_web_link
from pymongo import MongoClient, ReturnDocument
import os
import json
from threading import Thread, Lock
from utils import helper_print
from utils import MongoDB

query_bp = Blueprint("query", __name__)

mongodb = MongoDB()
db = mongodb.get_database("bert")
collection = db["links"]
counter_collection = db["counter"]


# Route to query user bookmarks
@query_bp.route("/query", methods=["GET"])
def query():
    # Get the value of the 'q' query parameter
    query_param = request.args.get("q")
    helper_print(query_param)

    if query_param is None:
        return jsonify({"error": "Missing query parameter"}), 400

    query_embedding = make_doc_to_embedding(query_param)
    distances, indices = cosine_similarity(query_embedding)

    list = []
    indices = indices.tolist()  # since we are checking for a single vector
    distances = distances.tolist()
    indices = indices[0]
    distances = distances[0]
    for i in range(len(indices)):
        print(indices[i])
        if indices[i] >= 0 and distances[i] < 2:
            list.append(indices[i])

    documents = collection.find({"_id": {"$in": list}}, {"link": 1, "_id": 0})
    links = [doc["link"] for doc in documents]

    # Convert the list of dictionaries to a JSON string
    links_json = json.dumps(links)
    return jsonify({"documents": links_json}), 200
