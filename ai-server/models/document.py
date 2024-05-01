from pymongo import MongoClient
from utils import MongoDB
from bson.objectid import ObjectId
from . import User

mongodb = MongoDB()
db = mongodb.get_database("bert")
document_collection = db["links"]


class Metadata:
    def __init__(
        self, title, meta_tags, links, text_content, description, preview_image
    ):
        self.title = title
        self.meta_tags = meta_tags
        self.links = links
        self.text_content = text_content
        self.description = description
        self.preview_image = preview_image

    def to_json(self):
        return {
            "title": self.title,
            "meta_tags": self.meta_tags,
            "links": self.links,
            "text_content": self.text_content,
            "description": self.description,
            "preview_image": self.preview_image,
        }


class Document:
    def __init__(
        self,
        faiss_id,
        link,
        embedding,
        meta: Metadata,
        user_id,
        id=-1,
    ):
        self._id = id
        self.faiss_id = faiss_id
        self.link = link
        self.embedding = embedding
        self.meta = meta
        self.user_id = user_id

    def to_json(self):
        return {
            "faiss_id": self.faiss_id,
            "link": self.link,
            "embedding": self.embedding,
            "user_id": self.user_id,
            "meta": {
                "title": self.meta.title,
                "meta_tags": self.meta.meta_tags,
                "links": self.meta.links,
                "text_content": self.meta.text_content,
                "description": self.meta.description,
                "preview_image": self.meta.preview_image,
            },
        }

    def add(self):
        u = User.find_by_id(self.user_id)
        if u:
            document_collection.insert_one(self.to_json())
            return True

        return False

    @staticmethod
    def findByFaissId(faiss_id):
        document = document_collection.find_one({"faiss_id": int(faiss_id)})
        if document:
            meta_data = Metadata(
                title=document["meta"]["title"],
                description=document["meta"]["description"],
                links=document["meta"]["links"],
                meta_tags=document["meta"]["meta_tags"],
                preview_image=document["meta"]["preview_image"],
                text_content=document["meta"]["text_content"],
            )
            return Document(
                id=document["_id"],
                faiss_id=int(document["faiss_id"]),
                embedding=document["embedding"],
                link=document["link"],
                meta=meta_data.to_json(),
                user_id=document["user_id"],
            )
        else:
            return None
        
    @staticmethod
    def findAll():
        documents_cursor = document_collection.find()  # This returns a cursor to iterate over all documents
        documents = []
        for doc in documents_cursor:
            if doc:
                meta_data = Metadata(
                    title=doc["meta"]["title"],
                    description=doc["meta"]["description"],
                    links=doc["meta"]["links"],
                    meta_tags=doc["meta"]["meta_tags"],
                    preview_image=doc["meta"]["preview_image"],
                    text_content=doc["meta"]["text_content"],
                )
                document = Document(
                    id=doc["_id"],
                    faiss_id=int(doc["faiss_id"]),
                    embedding=doc["embedding"],
                    link=doc["link"],
                    meta=meta_data.to_json(),
                    user_id=doc["user_id"],
                )
                documents.append(document)
        return documents

