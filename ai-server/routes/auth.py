from flask import Blueprint, request, jsonify
from models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/signin", methods=["POST"])
def login():

    data = request.json
    id = data.get("g_id")

    data = User.find_by_gid(id)

    if data:
        access_token = create_access_token(identity=str(data.id))
        return jsonify({"response": access_token, "error": None}), 200
    else:
        data = request.json
        name = data.get("name")
        g_id = data.get("g_id")
        email = data.get("email")
        picture = data.get("picture")
        user = User(name, email, g_id, picture)
        data = user.save_to_mongodb()
        access_token = create_access_token(identity=str(data.inserted_id))
        # if data:
        return jsonify({"response": access_token, "error": None}), 201


# @auth_bp.route("/register", methods=["POST"])
# def register():
#     data = request.json
#     name = data.get("name")
#     g_id = data.get("g_id")
#     email = data.get("email")
#     picture = data.get("picture")
#     # Check if user is already present
#     data = User.find_by_gid(g_id)
#     if data:
#         return jsonify({"error": "User already present in system"}), 401
#     user = User(name, email, g_id, picture)
#     data = user.save_to_mongodb()
#     access_token = create_access_token(identity=str(data.inserted_id))
#     # if data:
#     return jsonify({"response": access_token, "error": None}), 201

#     # return jsonify({"message": "Registration successful", "email": email}), 201
