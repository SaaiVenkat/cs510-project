from flask import Blueprint, request, jsonify
from models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json
    g_id = data.get("g_id")

    data = User.find_by_id(g_id)
    if data:
        return jsonify({"data": data.to_json(), "error": None}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


@auth_bp.route("/register", methods=["POST"])
def register():
    print("hi")
    data = request.json
    name = data.get("name")
    g_id = data.get("g_id")
    email = data.get("email")
    picture = data.get("picture")
    user = User(name, email, g_id, picture)
    user.save_to_mongodb()

    return jsonify({"message": "Registration successful", "email": email}), 201
