from flask import Flask, request, jsonify
from model import make_doc_to_embedding, index_with_faiss, cosine_similarity
from weblink_parser import extract_web_link
from pymongo import MongoClient, ReturnDocument
import os
import json

app = Flask(__name__)

client = MongoClient("mongodb://root:password@localhost:27017/")
db = client["bert"]
collection = db["links"]
counter_collection = db["counter"]

# Ensure the counter collection has an initial document
if counter_collection.count_documents({}) == 0:
    counter_collection.insert_one({"_id": "link_id", "sequence_value": 0})


def get_next_sequence_value(sequence_name):
    result = counter_collection.find_one_and_update(
        {"_id": sequence_name},
        {"$inc": {"sequence_value": 1}},
        return_document=ReturnDocument.AFTER,
    )
    return result["sequence_value"]


# Define a POST route to handle string input
@app.route("/save_bookmark", methods=["POST"])
def process_string():
    # Get the string from the request body
    data = request.get_json()

    # Check if the request contains a 'string' field
    if "link" not in data:
        return jsonify({"error": "Missing string field"}), 400

    # Extract the string from the request data
    web_link = data["link"]
    web_link_data = extract_web_link(web_link)
    # taking content from the web link
    # Assign topics to bookmark content
    topic_embeddings = make_doc_to_embedding(web_link_data["text_content"])

    # store this embedding in fiass
    index_with_faiss(topic_embeddings)
    # Get next sequence value for the ID
    link_id = get_next_sequence_value("link_id")

    # Store link data, embedding, and metadata in MongoDB
    document = {
        "_id": link_id,
        "link": web_link,
        "embedding": topic_embeddings.tolist(),  # Convert NumPy array to Python list
        "metadata": {  # Add any additional metadata you want to store
            "title": web_link_data["title"],
            "meta_tags": web_link_data["meta_tags"],
            "links": web_link_data["links"],
            "text_content": web_link_data["text_content"],
        },
    }
    collection.insert_one(document)
    # Return the processed string in the response
    return jsonify({"success": True, "documentCount": link_id + 1}), 200


@app.route("/query", methods=["GET"])
def query():
    # Get the value of the 'q' query parameter
    query_param = request.args.get("q")
    print(query_param)

    # Check if the 'q' parameter is missing
    if query_param is None:
        return jsonify({"error": "Missing query parameter"}), 400

    # Process the query (replace with your logic)
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
    # Extract the "link" attribute from each document and create a list of dictionaries
    links = [doc["link"] for doc in documents]

    # Convert the list of dictionaries to a JSON string
    links_json = json.dumps(links)
    # Return the processed query in the response
    return jsonify({"documents": links_json}), 200


@app.route("/reset", methods=["GET"])
def reset():

    # Specify the file path
    file_path = "./index"

    # Check if the file exists
    if os.path.exists(file_path):
        # Delete the file
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
