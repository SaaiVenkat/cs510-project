from flask import Blueprint, request, jsonify
from model import make_doc_to_embedding, index_with_faiss, cosine_similarity
from weblink_parser import extract_web_link
from pymongo import ReturnDocument
from threading import Thread, Lock
from utils import MongoDB
from models import Document, User
from flask_jwt_extended import jwt_required, get_jwt_identity

document_bp = Blueprint("document", __name__)

mongodb = MongoDB()
db = mongodb.get_database("bert")
document_collection = db["links"]
counter_collection = db["counter"]

# Ensure the counter collection has an initial document
# Counter is to co-relate between fiass index and mongo document index
if counter_collection.count_documents({}) == 0:
    counter_collection.insert_one({"_id": "link_id", "sequence_value": -1})


def get_next_sequence_value(sequence_name):
    result = counter_collection.find_one_and_update(
        {"_id": sequence_name},
        {"$inc": {"sequence_value": 1}},
        return_document=ReturnDocument.AFTER,
    )
    return result["sequence_value"]


def save_bookmark(bookmark, user_id):
    print("Processing bookmark:", bookmark)
    # taking content from the web link
    web_link_data = extract_web_link(bookmark)
    if web_link_data.text_content == "":
        return None

    # Assign topics to bookmark content
    topic_embeddings = make_doc_to_embedding(web_link_data.text_content)

    # store this embedding in fiass
    index_with_faiss(topic_embeddings)
    # Get next sequence value for the ID
    link_id = get_next_sequence_value("link_id")

    # Store link data, embedding, and metadata in MongoDB
    document = Document(
        link_id, bookmark, topic_embeddings.tolist(), web_link_data, user_id
    )
    ret = document.add()
    if link_id:
        print("Done processing bookmark:", bookmark)
    return link_id if ret else None


lock = Lock()


# Route to save multiple bookmarks
@document_bp.route("/bookmarks", methods=["POST"])
@jwt_required()
def process_bookmarks():
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "Not authorized"}), 401
    data = request.get_json()
    print("Data ", data)
    bookmarks = [item["url"] for item in data]
    print(bookmarks)

    # if "url" not in data:
    #     return jsonify({"error": "Missing 'links' field"}), 400
    # # if "user_id" not in data:
    #     return jsonify({"error": "Missing 'user_id' field"}), 400

    u = User.find_by_id(user_id)
    print("B ", bookmarks, " U ", u)

    # Checking if its a valid user so as not process at all if invalid
    if not u:
        return jsonify({"success": False, "error": "Something Failed"}), 400

    def process_bookmark(bookmark):
        save_bookmark(bookmark, user_id)

    # Function to process bookmarks with locking
    def process_bookmarks_with_lock(bookmarks):
        lock.acquire()

        try:
            for bookmark in bookmarks:
                process_bookmark(bookmark)
        finally:
            lock.release()

    thread = Thread(target=process_bookmarks_with_lock, args=(bookmarks,))
    thread.start()

    return jsonify({"success": True, "message": "Bookmarks processing started"}), 200


# Route to save single bookmark
@document_bp.route("/bookmark", methods=["POST"])
@jwt_required()
def process_string():
    data = request.get_json()
    user_id = get_jwt_identity()
    if not user_id:
        return jsonify({"error": "Not authorized"}), 401

    if "link" not in data:
        return jsonify({"error": "Missing string field"}), 400

    web_link = data["link"]

    link_id = save_bookmark(web_link, user_id)
    if link_id is None:
        return jsonify({"success": False, "error": "Something Failed"}), 400
    return jsonify({"success": True, "documentCount": link_id + 1}), 200


# Route to find document by ID
@document_bp.route("/bookmark/<string:id>", methods=["GET"])
def get_document_by_id(id):
    doc_data = Document.findByFaissId(id)
    if doc_data:
        ret = {
            "id": str(doc_data._id),
            "faiss_id": doc_data.faiss_id,
            "url": doc_data.link,
        }
        return jsonify(ret), 200
    else:
        return jsonify({"message": "Document not found"}), 404


@document_bp.route("/getAll", methods=["GET"])
def get_all_documents():
    docs = Document.findAll()
    if docs:
        ret = [
            {"id": str(doc._id), "faiss_id": doc.faiss_id, "url": doc.link}
            for doc in docs
        ]
        return jsonify(ret), 200
    else:
        return jsonify({"message": "No documents found"}), 404
