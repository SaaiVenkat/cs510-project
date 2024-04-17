from bertopic import BERTopic
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import sys
import os


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


# Function to assign topics to bookmarked content
def assign_topics_to_bookmark(bookmark_content):
    # Preprocess text
    preprocessed_text = preprocess_text(bookmark_content)

    # Initialize BERTopic model
    topic_model = BERTopic.load("MaartenGr/BERTopic_Wikipedia")
    # topic_model.update_topics(15)

    # Transform text into topic space
    # topics = topic_model.fit([preprocessed_text])
    topics = topic_model.transform([preprocessed_text])
    topic_label = topics[0][0]
    # Get topic labels
    topic_labels = topic_model.get_topic_info()

    # Print topic label of the bookmarked content
    print(f"Topic label assigned to the bookmarked content: {topic_label}")

    # # Print topics with their topic labels
    # for topic_id, lba in topic_labels.items():
    #     if label == topic_label:
    #         print(f"Topic {topic_id} ({label}): {topic_words}")
    #     # Get topic labels
    #     topic_labels = topic_model.get_topic_info()

    for index, row in topic_labels.iterrows():
        if row["Topic"] == topic_label:
            print(f"Topic {index}")
            print(row["Name"])
            print(f"{row['Representation']}")
    # Return topic labels assigned by BERTopic model
    return topic_labels


# Example usage
if __name__ == "__main__":
    # Sample bookmark content
    # bookmark_content = "This is the content of the bookmarked webpage."
    if len(sys.argv) < 2:
        print("Usage: python script.py <input_file>")
        sys.exit(1)

    # Read text content from file
    input_file = sys.argv[1]
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found.")
        sys.exit(1)

    with open(input_file, "r", encoding="utf-8") as file:
        bookmark_content = file.read()

    # Assign topics to bookmark content
    topic_labels = assign_topics_to_bookmark(bookmark_content)

    # Print topic labels
    # for (
    #     topic_id,
    #     topic_words,
    # ) in topic_labels.items():
    #     print(f"Topic {topic_id}: {topic_words}")
