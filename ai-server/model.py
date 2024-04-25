from bertopic import BERTopic
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import faiss
from faiss import read_index, write_index
import numpy as np
import sys
import os
import nltk
import ssl

# use this if its throwing an error and comment it out - should ideally be in env level in docket
# try:
#     _create_unverified_https_context = ssl._create_unverified_context
# except AttributeError:
#     pass
# else:
#     ssl._create_default_https_context = _create_unverified_https_context

# nltk.download("stopwords")
# nltk.download("punkt")


# Function to preprocess text
def preprocess_text(text):
    # Tokenize text
    tokens = word_tokenize(text)

    # Remove punctuation and lowercase tokens
    tokens = [token.lower() for token in tokens if token.isalpha()]

    # Remove stopwords
    stop_words = set(stopwords.words("english"))
    tokens = [token for token in tokens if token not in stop_words]

    # Join tokens back into a single string
    preprocessed_text = " ".join(tokens)

    return preprocessed_text


def create_or_load_faiss_index():
    dimension = 384  # Dimension of BERT embeddings
    index = None
    try:
        print("reading index")
        index = read_index("./index")
    except:
        print("No index found")
    if not index:
        index = faiss.IndexFlatL2(dimension)
        write_index(index, "./index")
    return index


def index_with_faiss(embedding):

    # Using L2 distance
    faiss_index = create_or_load_faiss_index()
    faiss_index.add(embedding)
    write_index(faiss_index, "./index")
    return True


def cosine_similarity(query_vector):
    # Number of nearest neighbors to find
    k = 2

    # Search
    faiss_index = create_or_load_faiss_index()

    distances, indices = faiss_index.search(query_vector, k)
    print(distances, indices)
    return distances, indices
    # for i in indices[0]:
    #     print("Result: ", new_docs[i])


def make_doc_to_embedding(doc):
    preprocessed_text = preprocess_text(doc)
    topic_model = BERTopic.load("MaartenGr/BERTopic_Wikipedia")
    vector = topic_model.embedding_model.embed_documents([preprocessed_text])
    return vector


# Example usage
if __name__ == "__main__":
    # Sample bookmark content
    # bookmark_content = "This is the content of the bookmarked webpage."
    if len(sys.argv) < 2:
        print("Usage: python script.py <input_file>")
        sys.exit(1)

    # Read text content from file
    input_file = "data/demo.txt"
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found.")
        sys.exit(1)

    # with open(input_file, "r", encoding="utf-8") as file:
    #     bookmark_content = file.read()
    #     for bookmark in bookmark_content.split("\n"):
    #         if bookmark:
    #             topic_embeddings = make_doc_to_embedding(bookmark_content)
    #             index_with_faiss(topic_embeddings)

    # Assign topics to bookmark content
    # topic_embeddings = make_doc_to_embedding(bookmark_content)

    # store this embedding in fiass
    # index_with_faiss(topic_embeddings)

    query = "Tower"
    query_embedding = make_doc_to_embedding(query)
    cosine_similarity(query_embedding)
