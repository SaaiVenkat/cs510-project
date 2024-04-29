from flask import Flask
from routes import routes_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configure JWT
app.config["JWT_SECRET_KEY"] = "Intellimark_747"
jwt = JWTManager(app)

# Register the routes blueprint with the app
app.register_blueprint(routes_bp)


if __name__ == "__main__":
    app.run(port=8000, debug=True)
