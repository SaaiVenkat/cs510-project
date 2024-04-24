from flask import Flask, request, jsonify
from model import make_doc_to_embedding, index_with_faiss, cosine_similarity
from weblink_parser import extract_web_link
from pymongo import MongoClient, ReturnDocument
import os
import json
from threading import Thread, Lock

app = Flask(__name__)

client = MongoClient("mongodb://root:password@localhost:27017/")
db = client["bert"]
collection = db["links"]
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


def save_bookmark(bookmark):
    print("Processing bookmark:", bookmark)
    # taking content from the web link
    web_link_data = extract_web_link(bookmark)
    # Assign topics to bookmark content
    topic_embeddings = make_doc_to_embedding(web_link_data["text_content"])

    # store this embedding in fiass
    index_with_faiss(topic_embeddings)
    # Get next sequence value for the ID
    link_id = get_next_sequence_value("link_id")

    # Store link data, embedding, and metadata in MongoDB
    document = {
        "_id": link_id,
        "link": bookmark,
        "embedding": topic_embeddings.tolist(),  # Convert NumPy array to Python list to store in mongo
        "metadata": {
            "title": web_link_data["title"],
            "meta_tags": web_link_data["meta_tags"],
            "links": web_link_data["links"],
            "text_content": web_link_data["text_content"],
        },
    }
    collection.insert_one(document)
    return link_id


lock = Lock()


# Route to save multiple bookmarks
@app.route("/bookmarks", methods=["POST"])
def process_bookmarks():
    data = request.get_json()

    if "links" not in data:
        return jsonify({"error": "Missing 'bookmarks' field"}), 400

    bookmarks = data["links"]

    def process_bookmark(bookmark):
        save_bookmark(bookmark)

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
@app.route("/bookmark", methods=["POST"])
def process_string():
    data = request.get_json()

    if "link" not in data:
        return jsonify({"error": "Missing string field"}), 400

    web_link = data["link"]

    link_id = save_bookmark(web_link)
    return jsonify({"success": True, "documentCount": link_id + 1}), 200


# Route to query user bookmarks
@app.route("/query", methods=["GET"])
def query():
    # Get the value of the 'q' query parameter
    query_param = request.args.get("q")
    print(query_param)

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


# Route to hard reset the entire application
@app.route("/reset", methods=["GET"])
def reset():

    file_path = "./index"
    if os.path.exists(file_path):
        os.remove(file_path)
        print(f"File '{file_path}' deleted successfully.")
    else:
        print(f"File '{file_path}' does not exist.")
    collection.delete_many({})

    # Update the counter value to -1
    counter_collection.update_one({"_id": "link_id"}, {"$set": {"sequence_value": -1}})
    return jsonify({"success": True}), 200


# Run the Flask application
if __name__ == "__main__":
    app.run(debug=True)
